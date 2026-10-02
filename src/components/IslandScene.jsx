"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const targetRef = [0, 0.04, 0];
function createTerrainTexture() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const coarse = Math.sin(x * 0.052 + Math.sin(y * 0.031)) * Math.cos(y * 0.047 - x * 0.019);
      const grain = Math.sin((x * 127.1 + y * 311.7) * 0.754877666) * 0.5;
      const fleck = Math.sin(x * 0.21 + y * 0.17) * Math.sin(y * 0.19 - x * 0.13);
      const variation = coarse * 5 + grain * 4 + fleck * 2;
      const index = (y * size + x) * 4;
      data[index] = THREE.MathUtils.clamp(217 + variation, 0, 255);
      data[index + 1] = THREE.MathUtils.clamp(207 + variation, 0, 255);
      data[index + 2] = THREE.MathUtils.clamp(174 + variation * 0.9, 0, 255);
      data[index + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}
const terrainTexture = createTerrainTexture();
const waterVertexShader = /* glsl */`
  uniform float uTime;
  varying vec3 vWorldPosition;
  void main() {
    vec3 displaced = position;
    float swell = sin(position.x * 1.35 + position.y * 0.72 + uTime * 0.34) * 0.004;
    swell += sin(position.y * 1.9 - position.x * 0.48 - uTime * 0.25) * 0.003;
    displaced.z += swell;
    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;
const waterFragmentShader = /* glsl */`
  uniform float uTime;
  uniform float uRise;
  varying vec3 vWorldPosition;
  void main() {
    vec2 p = vWorldPosition.xz;
    float longSwell = sin(dot(p, vec2(0.84, 0.54)) * 1.45 + uTime * 0.11);
    float crossSwell = sin(dot(p, vec2(-0.42, 0.91)) * 2.25 - uTime * 0.085);
    float fineRipples = sin(dot(p, vec2(0.93, -0.37)) * 5.2 + uTime * 0.13);
    float light = longSwell * 0.035 + crossSwell * 0.025 + fineRipples * 0.012;
    vec3 deep = vec3(0.035, 0.25, 0.28);
    vec3 shallow = vec3(0.075, 0.39, 0.39);
    vec3 color = mix(deep, shallow, clamp(0.3 + uRise * 0.32 + light, 0.0, 0.78));
    float glint = smoothstep(0.91, 0.99, fineRipples + longSwell * 0.08);
    color += vec3(0.07, 0.14, 0.13) * glint * 0.28;
    gl_FragColor = vec4(color, 0.88);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
function coordinatesToPolygons(geometry) {
  if (geometry.type === "Polygon") return [geometry.coordinates];
  if (geometry.type === "MultiPolygon") return geometry.coordinates;
  return [];
}
function emphasizeNarrowLand(rings) {
  const outer = rings[0];
  if (!outer || outer.length < 4) return rings;
  const points = outer.slice(0, outer.length - 1);
  if (points.length < 3) return rings;
  const center = points.reduce(([sumX, sumZ], [x, z]) => [sumX + x / points.length, sumZ + z / points.length], [0, 0]);
  let xx = 0,
    zz = 0,
    xz = 0;
  for (const [x, z] of points) {
    const dx = x - center[0],
      dz = z - center[1];
    xx += dx * dx;
    zz += dz * dz;
    xz += dx * dz;
  }
  xx /= points.length;
  zz /= points.length;
  xz /= points.length;
  const angle = 0.5 * Math.atan2(2 * xz, xx - zz);
  const majorAxis = [Math.cos(angle), Math.sin(angle)];
  const minorAxis = [-majorAxis[1], majorAxis[0]];
  const halfTrace = (xx + zz) / 2;
  const eigenSpread = Math.sqrt(Math.max(0, ((xx - zz) / 2) ** 2 + xz ** 2));
  const majorVariance = halfTrace + eigenSpread;
  const minorVariance = Math.max(0, halfTrace - eigenSpread);
  const aspectRatio = Math.sqrt(majorVariance / Math.max(minorVariance, 1e-10));
  if (aspectRatio < 1.3) return rings;

  // Emphasize the short axis of mapped motus while keeping their outlines and orientation.
  const widthScale = aspectRatio > 3.5 ? 3 : aspectRatio > 2 ? 2.25 : 1.6;
  const lengthScale = 1.04;
  return rings.map(ring => ring.map(([x, z]) => {
    const dx = x - center[0],
      dz = z - center[1];
    const along = dx * majorAxis[0] + dz * majorAxis[1];
    const across = dx * minorAxis[0] + dz * minorAxis[1];
    return [center[0] + majorAxis[0] * along * lengthScale + minorAxis[0] * across * widthScale, center[1] + majorAxis[1] * along * lengthScale + minorAxis[1] * across * widthScale];
  }));
}
function prepareCollection(collection, island) {
  const parsed = [];
  const referenceLon = island.lon;
  const cosLat = Math.cos(island.lat * Math.PI / 180);
  for (const feature of collection.features) {
    if (!feature.geometry) continue;
    const isBuilding = feature.properties?.kind === "building" || feature.properties?.building === true;
    for (const polygonCoords of coordinatesToPolygons(feature.geometry)) {
      const rings = polygonCoords.map(ring => ring.map(([lon, lat]) => {
        const adjustedLon = lon < 0 && referenceLon > 170 ? lon + 360 : lon;
        return [(adjustedLon - referenceLon) * 111.32 * cosLat, (lat - island.lat) * 111.32];
      }));
      parsed.push({
        rings: isBuilding ? rings : emphasizeNarrowLand(rings),
        building: isBuilding
      });
    }
  }
  if (!parsed.length) return null;
  const outerPoints = parsed.flatMap(({
    rings
  }) => rings[0] ?? []);
  const xs = outerPoints.map(([x]) => x);
  const zs = outerPoints.map(([, z]) => z);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minZ = Math.min(...zs),
    maxZ = Math.max(...zs);
  const span = Math.max(maxX - minX, maxZ - minZ);
  if (!Number.isFinite(span) || span <= 0) return null;
  const scale = 5.4 / span;
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const project = rings => rings.map(ring => ring.map(([x, z]) => [(x - centerX) * scale, (z - centerZ) * scale]));
  const land = parsed.filter(({
    building
  }) => !building).map(({
    rings
  }) => ({
    rings: project(rings)
  }));
  const buildings = parsed.filter(({
    building
  }) => building).map(({
    rings
  }) => ({
    rings: project(rings)
  }));
  const bounds = [(minX - centerX) * scale, (maxX - centerX) * scale, (minZ - centerZ) * scale, (maxZ - centerZ) * scale];
  return {
    land,
    buildings,
    bounds,
    vegetation: makeVegetationPositions(land, bounds)
  };
}
function makeShape(poly) {
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
    hole.closePath();
    shape.holes.push(hole);
  }
  return shape;
}
function polygonContains(poly, x, z) {
  const [outer, ...holes] = poly.rings;
  const ray = ring => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i],
        [xj, yj] = ring[j];
      if (yi > z !== yj > z && x < (xj - xi) * (z - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  return !!outer && ray(outer) && !holes.some(ray);
}
function LandShape({
  poly,
  bounds,
  imageUrl,
  terrainMaterial
}) {
  const geometry = useMemo(() => {
    const shape = makeShape(poly);
    if (!shape) return null;
    const result = new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: false,
      curveSegments: 1
    });
    result.rotateX(-Math.PI / 2);
    const positions = result.getAttribute("position");
    const uv = new Float32Array(positions.count * 2);
    const [minX, maxX, minZ, maxZ] = bounds;
    for (let index = 0; index < positions.count; index++) {
      uv[index * 2] = (positions.getX(index) - minX) / Math.max(0.001, maxX - minX);
      uv[index * 2 + 1] = (-positions.getZ(index) - minZ) / Math.max(0.001, maxZ - minZ);
    }
    result.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return result;
  }, [poly, bounds, imageUrl]);
  const coastline = useMemo(() => geometry ? new THREE.EdgesGeometry(geometry, 1) : null, [geometry]);
  useEffect(() => {
    if (!geometry) return;
    return () => geometry.dispose();
  }, [geometry]);
  useEffect(() => () => coastline?.dispose(), [coastline]);
  if (!geometry || !coastline) return null;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("mesh", {
      geometry: geometry,
      material: imageUrl ? undefined : terrainMaterial,
      castShadow: true,
      receiveShadow: true,
      children: imageUrl && /*#__PURE__*/_jsx(SatelliteMaterial, {
        url: imageUrl
      })
    }), /*#__PURE__*/_jsx("lineSegments", {
      geometry: coastline,
      position: [0, 0.003, 0],
      renderOrder: 2,
      children: /*#__PURE__*/_jsx("lineBasicMaterial", {
        color: "#ead9af",
        transparent: true,
        opacity: 0.5,
        depthWrite: false
      })
    })]
  });
}
function SatelliteMaterial({
  url
}) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  return /*#__PURE__*/_jsx("meshStandardMaterial", {
    map: texture,
    color: "#fff",
    roughness: 0.95
  });
}
function BuildingsLayer({
  polygons
}) {
  const geometry = useMemo(() => {
    const pieces = polygons.flatMap(poly => {
      const shape = makeShape(poly);
      if (!shape) return [];
      const piece = new THREE.ExtrudeGeometry(shape, {
        depth: 0.075,
        bevelEnabled: false,
        curveSegments: 1
      });
      piece.rotateX(-Math.PI / 2);
      piece.translate(0, 0.12, 0);
      return [piece];
    });
    if (!pieces.length) return null;
    const merged = mergeGeometries(pieces, false);
    pieces.forEach(piece => piece.dispose());
    return merged;
  }, [polygons]);
  useEffect(() => () => geometry?.dispose(), [geometry]);
  if (!geometry) return null;
  return /*#__PURE__*/_jsx("mesh", {
    geometry: geometry,
    castShadow: true,
    receiveShadow: true,
    children: /*#__PURE__*/_jsx("meshStandardMaterial", {
      color: "#9e8365",
      roughness: 0.9
    })
  });
}
function makeVegetationPositions(polygons, bounds) {
  const candidates = [];
  const [minX, maxX, minZ, maxZ] = bounds;
  const divisions = 180;
  for (let row = 0; row < divisions; row++) {
    for (let col = 0; col < divisions; col++) {
      const x = minX + (col + 0.37 + (row * 7 + col * 3) % 11 / 15) / divisions * (maxX - minX);
      const z = minZ + (row + 0.31 + (row * 5 + col * 2) % 9 / 13) / divisions * (maxZ - minZ);
      if (polygons.some(poly => polygonContains(poly, x, z)) && (row * 13 + col * 7) % 2 === 0) candidates.push([x, z]);
    }
  }
  if (candidates.length <= 120) return candidates;
  const stride = Math.ceil(candidates.length / 120);
  return candidates.filter((_, index) => index % stride === 0).slice(0, 120);
}
function Vegetation({
  positions,
  droughtIntensity
}) {
  const mesh = useRef(null);
  const material = useRef(null);
  const displayedDrought = useRef(0);
  const tree = useMemo(() => new THREE.Object3D(), []);
  const healthyColor = useMemo(() => new THREE.Color("#71835c"), []);
  const dryColor = useMemo(() => new THREE.Color("#a66d4d"), []);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    displayedDrought.current = THREE.MathUtils.damp(displayedDrought.current, droughtIntensity, 1.1, delta);
    const stress = displayedDrought.current;
    positions.forEach(([x, z], index) => {
      const healthyHeight = 0.14 + index * 17 % 7 / 90;
      const height = healthyHeight * (1 - stress * 0.27);
      const width = 0.034 * (1 - stress * 0.1);
      tree.position.set(x, 0.12 + height / 2, -z);
      tree.scale.set(width, height, width);
      tree.rotation.y = index * 1.71 % (Math.PI * 2);
      tree.updateMatrix();
      mesh.current.setMatrixAt(index, tree.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (material.current) material.current.color.lerpColors(healthyColor, dryColor, stress);
  });
  if (!positions.length) return null;
  return /*#__PURE__*/_jsxs("instancedMesh", {
    ref: mesh,
    args: [undefined, undefined, positions.length],
    children: [/*#__PURE__*/_jsx("coneGeometry", {
      args: [1, 1, 5]
    }), /*#__PURE__*/_jsx("meshStandardMaterial", {
      ref: material,
      color: "#71835c",
      roughness: 1
    })]
  });
}
function Water({
  amount
}) {
  const ref = useRef(null);
  const material = useRef(null);
  const uniforms = useMemo(() => ({
    uTime: {
      value: 0
    },
    uRise: {
      value: amount
    }
  }), []);
  const targetY = -0.035 + amount * 0.085;
  useFrame((_, delta) => {
    if (ref.current) ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 1.15, delta);
    if (material.current) {
      material.current.uniforms.uTime.value += delta;
      material.current.uniforms.uRise.value = THREE.MathUtils.damp(material.current.uniforms.uRise.value, amount, 1.1, delta);
    }
  });
  return /*#__PURE__*/_jsxs("mesh", {
    ref: ref,
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.06, 0],
    children: [/*#__PURE__*/_jsx("planeGeometry", {
      args: [30, 30, 72, 72]
    }), /*#__PURE__*/_jsx("shaderMaterial", {
      ref: material,
      uniforms: uniforms,
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      transparent: true,
      depthWrite: false
    })]
  });
}
function SceneModel({
  model,
  amount,
  imageUrl,
  droughtIntensity
}) {
  const controls = useRef(null);
  const terrainMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: terrainTexture,
    color: "#fff",
    roughness: 0.94
  }), []);
  const displayedDrought = useRef(0);
  const healthyLand = useMemo(() => new THREE.Color("#ffffff"), []);
  const dryLand = useMemo(() => new THREE.Color("#dfa562"), []);
  useFrame((_, delta) => {
    displayedDrought.current = THREE.MathUtils.damp(displayedDrought.current, droughtIntensity, 1.1, delta);
    terrainMaterial.color.lerpColors(healthyLand, dryLand, displayedDrought.current);
  });
  useEffect(() => () => terrainMaterial.dispose(), [terrainMaterial]);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(PerspectiveCamera, {
      makeDefault: true,
      position: [0, 3.85, 5.75],
      fov: 38
    }), /*#__PURE__*/_jsx(OrbitControls, {
      ref: controls,
      target: targetRef,
      minDistance: 2.7,
      maxDistance: 11,
      maxPolarAngle: Math.PI * 0.48,
      enableDamping: true,
      dampingFactor: 0.08
    }), /*#__PURE__*/_jsx("ambientLight", {
      intensity: 1.25
    }), /*#__PURE__*/_jsx("directionalLight", {
      position: [-3, 7, 4],
      intensity: 2.1,
      castShadow: true,
      "shadow-mapSize": [1024, 1024]
    }), /*#__PURE__*/_jsxs("group", {
      children: [/*#__PURE__*/_jsxs("mesh", {
        position: [0, -0.16, 0],
        rotation: [-Math.PI / 2, 0, 0],
        receiveShadow: true,
        children: [/*#__PURE__*/_jsx("planeGeometry", {
          args: [30, 30]
        }), /*#__PURE__*/_jsx("meshStandardMaterial", {
          color: "#15535a",
          roughness: 0.82
        })]
      }), model.land.map((poly, index) => /*#__PURE__*/_jsx(LandShape, {
        poly: poly,
        bounds: model.bounds,
        imageUrl: imageUrl,
        terrainMaterial: terrainMaterial
      }, `land-${index}`)), /*#__PURE__*/_jsx(BuildingsLayer, {
        polygons: model.buildings
      }), /*#__PURE__*/_jsx(Vegetation, {
        positions: model.vegetation,
        droughtIntensity: droughtIntensity
      }), /*#__PURE__*/_jsx(Water, {
        amount: amount
      })]
    }), /*#__PURE__*/_jsx("gridHelper", {
      args: [10, 20, "#49787a", "#2b6266"],
      position: [0, -0.155, 0]
    })]
  });
}
function ShapeLegend({
  buildingCount,
  treeCount,
  seaLevel,
  droughtIntensity
}) {
  return /*#__PURE__*/_jsxs("div", {
    className: "scene-legend",
    children: [/*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("i", {
        className: "legend-square"
      }), /*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx("b", {
          children: "Buildings"
        }), /*#__PURE__*/_jsxs("small", {
          children: [buildingCount, " mapped footprints"]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("i", {
        className: "legend-tree"
      }), /*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx("b", {
          children: "Vegetation"
        }), /*#__PURE__*/_jsxs("small", {
          children: [treeCount, " representative trees"]
        })]
      })]
    }), /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("i", {
        className: "legend-sea"
      }), /*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx("b", {
          children: "Sea level"
        }), /*#__PURE__*/_jsx("small", {
          children: seaLevel
        })]
      })]
    }), droughtIntensity > 0 && /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("i", {
        className: "legend-drought"
      }), /*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx("b", {
          children: "National drought"
        }), /*#__PURE__*/_jsx("small", {
          children: "Local severity unmeasured \xB7 tint illustrative"
        })]
      })]
    })]
  });
}
export default function IslandScene({
  island,
  seaAmount,
  droughtIntensity,
  yearLabel,
  onBack
}) {
  const [collection, setCollection] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const imageTemplate = process.env.NEXT_PUBLIC_SATELLITE_IMAGE_TEMPLATE?.trim();
  const satelliteConfigured = Boolean(imageTemplate);
  const configuredStyle = process.env.NEXT_PUBLIC_MAP_STYLE?.toUpperCase() === "SATELLITE" && satelliteConfigured ? "SATELLITE" : "MODEL";
  const [mapStyle, setMapStyle] = useState(configuredStyle);
  useEffect(() => {
    let current = true;
    setCollection(null);
    setLoadError(false);
    setMapStyle(configuredStyle);
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/data/geojson/${island.id}.geojson`).then(response => {
      if (!response.ok) throw new Error("Local coastline unavailable");
      return response.json();
    }).then(data => {
      if (current) setCollection(data);
    }).catch(() => {
      if (current) setLoadError(true);
    });
    return () => {
      current = false;
    };
  }, [island.id, configuredStyle]);
  const model = useMemo(() => collection ? prepareCollection(collection, island) : null, [collection, island]);
  const buildingsCount = model?.buildings.length ?? 0;
  const reset = useCallback(() => setResetKey(key => key + 1), []);
  const satelliteUrl = mapStyle === "SATELLITE" && imageTemplate ? imageTemplate.replaceAll("{island}", island.id) : null;
  const seaLabel = yearLabel === "2050" ? "+20 cm or more" : yearLabel === "2090" ? "+0.5–1 m range" : yearLabel === "2030" ? "Future scenario" : yearLabel === "NOW" ? "Latest published context" : "Historical context";
  return /*#__PURE__*/_jsxs("section", {
    className: `map-stage island-stage ${model ? "model-ready" : ""}`,
    children: [model && /*#__PURE__*/_jsxs(Canvas, {
      shadows: "percentage",
      dpr: [1, 1.7],
      gl: {
        antialias: true,
        alpha: false
      },
      children: [/*#__PURE__*/_jsx("color", {
        attach: "background",
        args: ["#15535a"]
      }), /*#__PURE__*/_jsx(SceneModel, {
        model: model,
        amount: seaAmount,
        imageUrl: satelliteUrl,
        droughtIntensity: droughtIntensity
      })]
    }, resetKey), /*#__PURE__*/_jsxs("div", {
      className: "scene-overlay scene-top-left",
      children: [/*#__PURE__*/_jsxs("button", {
        className: "back-button",
        onClick: onBack,
        children: [/*#__PURE__*/_jsx("span", {
          children: "\u2190"
        }), " All islands"]
      }), /*#__PURE__*/_jsx("div", {
        className: "scene-island-type",
        children: island.type.toUpperCase()
      }), /*#__PURE__*/_jsx("h2", {
        children: island.name
      }), island.areaKm2 && /*#__PURE__*/_jsxs("div", {
        className: "scene-area",
        children: [island.areaKm2.toFixed(2), " km\xB2 land area"]
      })]
    }), model && /*#__PURE__*/_jsx(ShapeLegend, {
      buildingCount: buildingsCount,
      treeCount: model.vegetation.length,
      seaLevel: seaLabel,
      droughtIntensity: droughtIntensity
    }), !model && /*#__PURE__*/_jsx("div", {
      className: "scene-loading",
      role: "status",
      children: !loadError ? /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx("span", {
          className: "spinner"
        }), /*#__PURE__*/_jsxs("b", {
          children: ["Building ", island.name]
        }), /*#__PURE__*/_jsx("span", {
          children: "Reading local coastline and building footprints\u2026"
        })]
      }) : /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx("b", {
          children: "Coastline data unavailable"
        }), /*#__PURE__*/_jsxs("span", {
          children: ["Check the local GeoJSON asset for ", island.name, "."]
        })]
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "scene-bottom-left",
      children: /*#__PURE__*/_jsxs("div", {
        className: "sea-card",
        children: [/*#__PURE__*/_jsx("div", {
          className: "eyebrow",
          children: "MEAN SEA-LEVEL LAYER"
        }), /*#__PURE__*/_jsx("strong", {
          children: yearLabel === "2050" ? "+20 cm or more" : yearLabel === "2090" ? "+0.5–1 m range" : yearLabel === "2030" ? "Future scenario" : "Historical context"
        }), /*#__PURE__*/_jsx("span", {
          children: yearLabel === "2050" || yearLabel === "2090" ? "Regional projection · scenario dependent" : "Illustrative water movement"
        })]
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "scene-controls",
      children: [/*#__PURE__*/_jsx("span", {
        children: "Drag to orbit \xB7 wheel or pinch to zoom \xB7 right-drag to pan"
      }), satelliteConfigured && /*#__PURE__*/_jsxs("div", {
        className: "scene-style-toggle",
        "aria-label": "Map style",
        children: [/*#__PURE__*/_jsx("button", {
          "aria-pressed": mapStyle === "MODEL",
          onClick: () => setMapStyle("MODEL"),
          children: "Model"
        }), /*#__PURE__*/_jsx("button", {
          "aria-pressed": mapStyle === "SATELLITE",
          onClick: () => setMapStyle("SATELLITE"),
          children: "Satellite"
        })]
      }), /*#__PURE__*/_jsx("button", {
        onClick: reset,
        children: "Reset view"
      })]
    }), /*#__PURE__*/_jsx("p", {
      className: "cartography-note",
      children: "\xA9 OpenStreetMap contributors. Coastline and buildings are mapped features; narrow land widths and vertical scale are exaggerated for legibility. Vegetation and water movement are illustrative. This is not a parcel-level inundation map."
    })]
  });
}
