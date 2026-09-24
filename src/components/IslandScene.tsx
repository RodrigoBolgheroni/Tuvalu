"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Island } from "@/data/islands";

type Position = [number, number];
type PolygonCoords = Position[][];
type GeoGeometry = { type: string; coordinates: unknown };
type GeoFeature = { type: "Feature"; geometry: GeoGeometry; properties?: Record<string, unknown> };
type GeoCollection = { type: "FeatureCollection"; features: GeoFeature[] };
type ProjectedPoly = { rings: [number, number][][] };
type GeoModel = { land: ProjectedPoly[]; buildings: ProjectedPoly[]; bounds: [number, number, number, number]; vegetation: [number, number][] };

const targetRef: [number, number, number] = [0, 0.04, 0];

function coordinatesToPolygons(geometry: GeoGeometry): PolygonCoords[] {
  if (geometry.type === "Polygon") return [geometry.coordinates as PolygonCoords];
  if (geometry.type === "MultiPolygon") return geometry.coordinates as PolygonCoords[];
  return [];
}

function prepareCollection(collection: GeoCollection, island: Island): GeoModel | null {
  const parsed: { rings: Position[][]; building: boolean }[] = [];
  const referenceLon = island.lon;
  const cosLat = Math.cos(island.lat * Math.PI / 180);
  for (const feature of collection.features) {
    if (!feature.geometry) continue;
    const isBuilding = feature.properties?.kind === "building" || feature.properties?.building === true;
    for (const polygonCoords of coordinatesToPolygons(feature.geometry)) {
      const rings = polygonCoords.map((ring) => ring.map(([lon, lat]) => {
        const adjustedLon = lon < 0 && referenceLon > 170 ? lon + 360 : lon;
        return [(adjustedLon - referenceLon) * 111.32 * cosLat, (lat - island.lat) * 111.32] as Position;
      }));
      parsed.push({ rings, building: isBuilding });
    }
  }
  if (!parsed.length) return null;
  const outerPoints = parsed.flatMap(({ rings }) => rings[0] ?? []);
  const xs = outerPoints.map(([x]) => x); const zs = outerPoints.map(([, z]) => z);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minZ = Math.min(...zs), maxZ = Math.max(...zs);
  const span = Math.max(maxX - minX, maxZ - minZ);
  if (!Number.isFinite(span) || span <= 0) return null;
  const scale = 4.5 / span;
  const project = (rings: Position[][]) => rings.map((ring) => ring.map(([x, z]) => [x * scale, z * scale] as [number, number]));
  const land = parsed.filter(({ building }) => !building).map(({ rings }) => ({ rings: project(rings) }));
  const buildings = parsed.filter(({ building }) => building).map(({ rings }) => ({ rings: project(rings) }));
  const bounds: GeoModel["bounds"] = [minX * scale, maxX * scale, minZ * scale, maxZ * scale];
  return { land, buildings, bounds, vegetation: makeVegetationPositions(land, bounds) };
}

function makeShape(poly: ProjectedPoly) {
  const [outer, ...holes] = poly.rings;
  if (!outer || outer.length < 3) return null;
  const shape = new THREE.Shape();
  shape.moveTo(outer[0][0], outer[0][1]);
  for (let i = 1; i < outer.length; i++) shape.lineTo(outer[i][0], outer[i][1]);
  shape.closePath();
  for (const ring of holes) {
    if (ring.length < 3) continue;
    const hole = new THREE.Path();
    hole.moveTo(ring[0][0], ring[0][1]);
    for (let i = 1; i < ring.length; i++) hole.lineTo(ring[i][0], ring[i][1]);
    hole.closePath(); shape.holes.push(hole);
  }
  return shape;
}

function polygonContains(poly: ProjectedPoly, x: number, z: number) {
  const [outer, ...holes] = poly.rings;
  const ray = (ring: [number, number][]) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > z) !== (yj > z) && x < ((xj - xi) * (z - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  return !!outer && ray(outer) && !holes.some(ray);
}

function LandShape({ poly, bounds, imageUrl }: { poly: ProjectedPoly; bounds: GeoModel["bounds"]; imageUrl: string | null }) {
  const geometry = useMemo(() => {
    const shape = makeShape(poly);
    if (!shape) return null;
    const result = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false, curveSegments: 1 });
    result.rotateX(-Math.PI / 2);
    if (imageUrl) {
      const positions = result.getAttribute("position");
      const uv = new Float32Array(positions.count * 2);
      const [minX, maxX, minZ, maxZ] = bounds;
      for (let index = 0; index < positions.count; index++) {
        uv[index * 2] = (positions.getX(index) - minX) / Math.max(0.001, maxX - minX);
        uv[index * 2 + 1] = (-positions.getZ(index) - minZ) / Math.max(0.001, maxZ - minZ);
      }
      result.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    }
    return result;
  }, [poly, bounds, imageUrl]);
  useEffect(() => {
    if (!geometry) return;
    return () => geometry.dispose();
  }, [geometry]);
  if (!geometry) return null;
  return <mesh geometry={geometry} castShadow receiveShadow>
    {imageUrl ? <SatelliteMaterial url={imageUrl} /> : <meshStandardMaterial color="#d9d0aa" roughness={0.9} />}
  </mesh>;
}

function SatelliteMaterial({ url }: { url: string }) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  return <meshStandardMaterial map={texture} color="#fff" roughness={0.95} />;
}

function BuildingsLayer({ polygons }: { polygons: ProjectedPoly[] }) {
  const geometry = useMemo(() => {
    const pieces = polygons.flatMap((poly) => {
      const shape = makeShape(poly);
      if (!shape) return [];
      const piece = new THREE.ExtrudeGeometry(shape, { depth: 0.055, bevelEnabled: false, curveSegments: 1 });
      piece.rotateX(-Math.PI / 2);
      piece.translate(0, 0.08, 0);
      return [piece];
    });
    if (!pieces.length) return null;
    const merged = mergeGeometries(pieces, false);
    pieces.forEach((piece) => piece.dispose());
    return merged;
  }, [polygons]);
  useEffect(() => () => geometry?.dispose(), [geometry]);
  if (!geometry) return null;
  return <mesh geometry={geometry} castShadow receiveShadow>
    <meshStandardMaterial color="#9e8365" roughness={0.9} />
  </mesh>;
}

function makeVegetationPositions(polygons: ProjectedPoly[], bounds: GeoModel["bounds"]): [number, number][] {
  const candidates: [number, number][] = [];
  const [minX, maxX, minZ, maxZ] = bounds;
  const divisions = 180;
  for (let row = 0; row < divisions; row++) {
    for (let col = 0; col < divisions; col++) {
      const x = minX + (col + 0.37 + ((row * 7 + col * 3) % 11) / 15) / divisions * (maxX - minX);
      const z = minZ + (row + 0.31 + ((row * 5 + col * 2) % 9) / 13) / divisions * (maxZ - minZ);
      if (polygons.some((poly) => polygonContains(poly, x, z)) && (row * 13 + col * 7) % 2 === 0) candidates.push([x, z]);
    }
  }
  if (candidates.length <= 120) return candidates;
  const stride = Math.ceil(candidates.length / 120);
  return candidates.filter((_, index) => index % stride === 0).slice(0, 120);
}

function Vegetation({ positions }: { positions: [number, number][] }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!mesh.current) return;
    const object = new THREE.Object3D();
    positions.forEach(([x, z], index) => {
      const height = 0.08 + ((index * 17) % 7) / 130;
      object.position.set(x, 0.075 + height / 2, -z);
      object.scale.set(0.025, height, 0.025);
      object.rotation.y = (index * 1.71) % (Math.PI * 2);
      object.updateMatrix(); mesh.current!.setMatrixAt(index, object.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [positions]);
  if (!positions.length) return null;
  return <instancedMesh ref={mesh} args={[undefined, undefined, positions.length]} castShadow>
    <coneGeometry args={[1, 1, 5]} /><meshStandardMaterial color="#71835c" roughness={1} />
  </instancedMesh>;
}

function Water({ amount }: { amount: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const targetY = -0.06 + amount * 0.19;
  useFrame((_, delta) => {
    if (ref.current) ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 1.4, delta);
  });
  return <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
    <planeGeometry args={[30, 30]} /><meshStandardMaterial color="#2c8285" transparent opacity={0.62} roughness={0.28} metalness={0.04} depthWrite={false} />
  </mesh>;
}

function SceneModel({ model, amount, imageUrl }: { model: GeoModel; amount: number; imageUrl: string | null }) {
  const controls = useRef(null);
  return <>
    <PerspectiveCamera makeDefault position={[0, 4.2, 6.3]} fov={38} />
    <OrbitControls ref={controls} target={targetRef} minDistance={2.7} maxDistance={11} maxPolarAngle={Math.PI * 0.48} enableDamping dampingFactor={0.08} />
    <ambientLight intensity={1.25} />
    <directionalLight position={[-3, 7, 4]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
    <group>
      <mesh position={[0, -0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} /><meshStandardMaterial color="#15535a" roughness={0.82} />
      </mesh>
      {model.land.map((poly, index) => <LandShape poly={poly} bounds={model.bounds} imageUrl={imageUrl} key={`land-${index}`} />)}
      <BuildingsLayer polygons={model.buildings} />
      <Vegetation positions={model.vegetation} />
      <Water amount={amount} />
    </group>
    <gridHelper args={[10, 20, "#49787a", "#2b6266"]} position={[0, -0.155, 0]} />
  </>;
}

function ShapeLegend({ buildingCount, treeCount, seaLevel }: { buildingCount: number; treeCount: number; seaLevel: string }) {
  return <div className="scene-legend">
    <div><i className="legend-square" /><span><b>Buildings</b><small>{buildingCount} mapped footprints</small></span></div>
    <div><i className="legend-tree" /><span><b>Vegetation</b><small>{treeCount} representative trees</small></span></div>
    <div><i className="legend-sea" /><span><b>Sea level</b><small>{seaLevel}</small></span></div>
  </div>;
}

export default function IslandScene({ island, seaAmount, yearLabel, onBack }: {
  island: Island; seaAmount: number; yearLabel: string; onBack: () => void;
}) {
  const [collection, setCollection] = useState<GeoCollection | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const imageTemplate = process.env.NEXT_PUBLIC_SATELLITE_IMAGE_TEMPLATE?.trim();
  const satelliteConfigured = Boolean(imageTemplate);
  const configuredStyle = process.env.NEXT_PUBLIC_MAP_STYLE?.toUpperCase() === "SATELLITE" && satelliteConfigured ? "SATELLITE" : "MODEL";
  const [mapStyle, setMapStyle] = useState<"MODEL" | "SATELLITE">(configuredStyle);
  useEffect(() => {
    let current = true;
    setCollection(null); setLoadError(false);
    setMapStyle(configuredStyle);
    fetch(`/data/geojson/${island.id}.geojson`)
      .then((response) => { if (!response.ok) throw new Error("Local coastline unavailable"); return response.json() as Promise<GeoCollection>; })
      .then((data) => { if (current) setCollection(data); })
      .catch(() => { if (current) setLoadError(true); });
    return () => { current = false; };
  }, [island.id, configuredStyle]);
  const model = useMemo(() => collection ? prepareCollection(collection, island) : null, [collection, island]);
  const buildingsCount = model?.buildings.length ?? 0;
  const reset = useCallback(() => setResetKey((key) => key + 1), []);
  const satelliteUrl = mapStyle === "SATELLITE" && imageTemplate ? imageTemplate.replaceAll("{island}", island.id) : null;
  const seaLabel = yearLabel === "2050" ? "+20 cm or more" : yearLabel === "2090" ? "+0.5–1 m range" : yearLabel === "2030" ? "Future scenario" : yearLabel === "NOW" ? "Latest published context" : "Historical context";
  return <section className={`map-stage island-stage ${model ? "model-ready" : ""}`}>
    {model && <Canvas key={resetKey} shadows="percentage" dpr={[1, 1.7]} gl={{ antialias: true, alpha: false }}>
      <color attach="background" args={["#15535a"]} />
      <SceneModel model={model} amount={seaAmount} imageUrl={satelliteUrl} />
    </Canvas>}
    <div className="scene-overlay scene-top-left">
      <button className="back-button" onClick={onBack}><span>←</span> All islands</button>
      <div className="scene-island-type">{island.type.toUpperCase()}</div>
      <h2>{island.name}</h2>
      {island.areaKm2 && <div className="scene-area">{island.areaKm2.toFixed(2)} km² land area</div>}
    </div>
    {model && <ShapeLegend buildingCount={buildingsCount} treeCount={model.vegetation.length} seaLevel={seaLabel} />}
    {!model && <div className="scene-loading" role="status">
      {!loadError ? <><span className="spinner" /><b>Building {island.name}</b><span>Reading local coastline and building footprints…</span></> : <><b>Coastline data unavailable</b><span>Check the local GeoJSON asset for {island.name}.</span></>}
    </div>}
    <div className="scene-bottom-left"><div className="sea-card"><div className="eyebrow">MEAN SEA-LEVEL LAYER</div><strong>{yearLabel === "2050" ? "+20 cm or more" : yearLabel === "2090" ? "+0.5–1 m range" : yearLabel === "2030" ? "Future scenario" : "Historical context"}</strong><span>{yearLabel === "2050" || yearLabel === "2090" ? "Regional projection · scenario dependent" : "Illustrative water movement"}</span></div></div>
    <div className="scene-controls"><span>Drag to orbit · wheel or pinch to zoom · right-drag to pan</span>
      {satelliteConfigured && <div className="scene-style-toggle" aria-label="Map style">
        <button aria-pressed={mapStyle === "MODEL"} onClick={() => setMapStyle("MODEL")}>Model</button>
        <button aria-pressed={mapStyle === "SATELLITE"} onClick={() => setMapStyle("SATELLITE")}>Satellite</button>
      </div>}
      <button onClick={reset}>Reset view</button></div>
    <p className="cartography-note">© OpenStreetMap contributors. Coastline and buildings are mapped features; vegetation is representative. Vertical scale and water movement are exaggerated for legibility. This is not a parcel-level inundation map.</p>
  </section>;
}
