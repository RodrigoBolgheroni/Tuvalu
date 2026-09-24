import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const shapesRoot = process.argv[2];
const overpassPath = process.argv[3];
if (!shapesRoot || !overpassPath) {
  throw new Error("Usage: node scripts/import-openstreetmap.mjs <Geofabrik shape directory> <Overpass JSON>");
}

const islands = [
  { id: "nanumea", bbox: [-5.82, 175.96, -5.55, 176.24], lon: 176.1156, lat: -5.675 },
  { id: "nanumaga", bbox: [-6.38, 176.20, -6.20, 176.39], lon: 176.3153, lat: -6.2864 },
  { id: "niutao", bbox: [-6.20, 177.27, -6.01, 177.42], lon: 177.3342, lat: -6.1094 },
  { id: "nui", bbox: [-7.33, 177.07, -7.14, 177.22], lon: 177.1458, lat: -7.2456 },
  { id: "vaitupu", bbox: [-7.58, 178.51, -7.39, 178.79], lon: 178.6797, lat: -7.4892 },
  { id: "nukufetau", bbox: [-8.18, 178.20, -7.87, 178.52], lon: 178.3139, lat: -8.0267 },
  { id: "funafuti", bbox: [-8.67, 178.85, -8.33, 179.48], lon: 179.1944, lat: -8.5244 },
  { id: "nukulaelae", bbox: [-9.49, 179.67, -9.30, 179.96], lon: 179.8086, lat: -9.37 },
  { id: "niulakita", bbox: [-10.86, 179.34, -10.71, 179.59], lon: 179.4711, lat: -10.79 },
];

async function readDbf(file) {
  const bytes = await readFile(file);
  const count = bytes.readUInt32LE(4);
  const headerLength = bytes.readUInt16LE(8);
  const rowLength = bytes.readUInt16LE(10);
  const fields = [];
  for (let cursor = 32; cursor < headerLength - 1 && bytes[cursor] !== 0x0d; cursor += 32) {
    const name = bytes.subarray(cursor, cursor + 11).toString("ascii").split("\0")[0].trim();
    fields.push({ name, size: bytes[cursor + 16] });
  }
  return Array.from({ length: count }, (_, row) => {
    let cursor = headerLength + row * rowLength;
    if (bytes[cursor++] === 0x2a) return null;
    const properties = {};
    for (const field of fields) {
      properties[field.name] = bytes.subarray(cursor, cursor + field.size).toString("utf8").trim();
      cursor += field.size;
    }
    return properties;
  });
}

async function readPolygonShapefile(stem) {
  const [bytes, rows] = await Promise.all([
    readFile(path.join(shapesRoot, `${stem}.shp`)),
    readDbf(path.join(shapesRoot, `${stem}.dbf`)),
  ]);
  const result = [];
  let offset = 100;
  let record = 0;
  while (offset + 8 <= bytes.length) {
    const contentLength = bytes.readUInt32BE(offset + 4) * 2;
    const start = offset + 8;
    if (contentLength < 44 || start + contentLength > bytes.length) break;
    const type = bytes.readInt32LE(start);
    if (type === 5) {
      const partCount = bytes.readUInt32LE(start + 36);
      const pointCount = bytes.readUInt32LE(start + 40);
      const partOffset = start + 44;
      const pointsOffset = partOffset + partCount * 4;
      const partStarts = Array.from({ length: partCount }, (_, index) => bytes.readUInt32LE(partOffset + index * 4));
      partStarts.push(pointCount);
      const rings = partStarts.slice(0, -1).map((partStart, partIndex) => {
        const ring = [];
        for (let index = partStart; index < partStarts[partIndex + 1]; index++) {
          ring.push([bytes.readDoubleLE(pointsOffset + index * 16), bytes.readDoubleLE(pointsOffset + index * 16 + 8)]);
        }
        return ring;
      });
      result.push({ rings, properties: rows[record] ?? {} });
    }
    record++;
    offset = start + contentLength;
  }
  return result;
}

function coordKey([lon, lat]) { return `${lon.toFixed(6)},${lat.toFixed(6)}`; }
function equals(a, b) { return coordKey(a) === coordKey(b); }
function ringContains([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function closeRing(ways) {
  const remaining = ways.map((way) => way.geometry.map(({ lon, lat }) => [lon, lat])).filter((line) => line.length > 3);
  const rings = [];
  const dangling = [];
  while (remaining.length) {
    const chain = remaining.shift();
    if (equals(chain[0], chain.at(-1))) { rings.push(chain); continue; }
    let joined = true;
    while (joined && !equals(chain[0], chain.at(-1))) {
      joined = false;
      for (let index = 0; index < remaining.length; index++) {
        const line = remaining[index];
        if (equals(chain.at(-1), line[0])) {
          chain.push(...line.slice(1)); remaining.splice(index, 1); joined = true; break;
        }
        if (equals(chain.at(-1), line.at(-1))) {
          chain.push(...line.slice(0, -1).reverse()); remaining.splice(index, 1); joined = true; break;
        }
      }
    }
    if (equals(chain[0], chain.at(-1))) rings.push(chain);
    else dangling.push(chain.length);
  }
  return { rings, dangling };
}

const overpass = JSON.parse(await readFile(overpassPath, "utf8"));
const coastlineWays = (overpass.elements ?? []).filter((element) => element.type === "way" && element.geometry?.length > 3);
const buildingPolygons = await readPolygonShapefile("gis_osm_buildings_a_free_1");
const namedIslandPolygons = (await readPolygonShapefile("gis_osm_places_a_free_1"))
  .filter((shape) => shape.properties.fclass === "island");
const outputDirectory = path.join(projectRoot, "public", "data", "geojson");
await mkdir(outputDirectory, { recursive: true });
const summary = [];

for (const island of islands) {
  const [south, west, north, east] = island.bbox;
  const belongs = ([lon, lat]) => lat >= south && lat <= north && lon >= west && lon <= east;
  const ways = coastlineWays.filter((way) => way.geometry.some(({ lon, lat }) => belongs([lon, lat])));
  const { rings, dangling } = closeRing(ways);
  if (!rings.length) throw new Error(`No closed OSM coastline rings could be reconstructed for ${island.id}.`);
  const terrainRings = rings.map((ring) => ({ ring, properties: { osm: "natural=coastline" } }));
  let namedOutlinesAdded = 0;
  for (const shape of namedIslandPolygons) {
    const outer = shape.rings[0] ?? [];
    if (outer.length < 4) continue;
    const xs = outer.map(([lon]) => lon), ys = outer.map(([, lat]) => lat);
    const center = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
    if (!belongs(center) || terrainRings.some(({ ring }) => ringContains(center, ring))) continue;
    terrainRings.push({ ring: outer, properties: { osm: "place=island", name: shape.properties.name } });
    namedOutlinesAdded++;
  }
  const features = terrainRings.map(({ ring, properties }, index) => ({
    type: "Feature", properties: { kind: "land", ...properties, ring: index + 1 },
    geometry: { type: "Polygon", coordinates: [ring] },
  }));
  let buildings = 0;
  for (const building of buildingPolygons) {
    const outer = building.rings[0] ?? [];
    if (outer.length < 4) continue;
    const center = [
      (Math.min(...outer.map(([lon]) => lon)) + Math.max(...outer.map(([lon]) => lon))) / 2,
      (Math.min(...outer.map(([, lat]) => lat)) + Math.max(...outer.map(([, lat]) => lat))) / 2,
    ];
    if (!belongs(center)) continue;
    features.push({
      type: "Feature", properties: { kind: "building", osmId: building.properties.osm_id, name: building.properties.name || "" },
      geometry: { type: "Polygon", coordinates: building.rings },
    });
    buildings++;
  }
  const collection = {
    type: "FeatureCollection",
    name: island.id,
    source: "OpenStreetMap contributors via Geofabrik and Overpass",
    retrieved: "2026-09-24",
    features,
  };
  await writeFile(path.join(outputDirectory, `${island.id}.geojson`), `${JSON.stringify(collection)}\n`);
  summary.push({ island: island.id, coastlineWays: ways.length, landRings: terrainRings.length, namedIslandOutlinesAdded: namedOutlinesAdded, incompleteCoastlineChains: dangling.length, mappedBuildingFootprints: buildings, bytes: Buffer.byteLength(JSON.stringify(collection)) });
}

await writeFile(path.join(outputDirectory, "sources.json"), `${JSON.stringify({
  title: "Tuvalu island and building geometries",
  source: "OpenStreetMap contributors",
  license: "ODbL 1.0",
  coastlineSource: "Overpass API, natural=coastline ways queried in each island bounding box",
  buildingsSource: "Geofabrik daily OpenStreetMap extract, buildings polygon layer",
  retrieved: "2026-09-24",
  attribution: "© OpenStreetMap contributors",
  url: "https://www.openstreetmap.org/copyright",
  note: "Coastline ways were joined by shared OSM endpoints. Unclosed fragments were omitted; named island-area outlines were used where they fill a missing closed coastline. The three-dimensional vertical scale is illustrative.",
}, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
