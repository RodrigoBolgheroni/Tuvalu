import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.argv[2];
if (!root) throw new Error("Pass the extracted Geofabrik shapefile directory.");

async function dbfRows(file) {
  const bytes = await readFile(file);
  const count = bytes.readUInt32LE(4);
  const headerLength = bytes.readUInt16LE(8);
  const rowLength = bytes.readUInt16LE(10);
  const fields = [];
  for (let cursor = 32; cursor < headerLength - 1 && bytes[cursor] !== 0x0d; cursor += 32) {
    const name = bytes.subarray(cursor, cursor + 11).toString("ascii").split("\0")[0].trim();
    fields.push({ name, size: bytes[cursor + 16] });
  }
  const rows = [];
  for (let row = 0; row < count; row++) {
    let cursor = headerLength + row * rowLength + 1;
    if (bytes[headerLength + row * rowLength] === 0x2a) continue;
    const value = {};
    for (const field of fields) {
      value[field.name] = bytes.subarray(cursor, cursor + field.size).toString("utf8").trim();
      cursor += field.size;
    }
    rows.push(value);
  }
  return rows;
}

async function shapeSummaries(file) {
  const bytes = await readFile(file);
  const summaries = [];
  let offset = 100;
  while (offset + 8 <= bytes.length) {
    const length = bytes.readUInt32BE(offset + 4) * 2;
    const start = offset + 8;
    if (length < 4 || start + length > bytes.length) break;
    const type = bytes.readInt32LE(start);
    let bounds = null;
    if ([3, 5, 13, 15, 23, 25].includes(type) && length >= 36) {
      bounds = [0, 1, 2, 3].map((index) => bytes.readDoubleLE(start + 4 + index * 8));
    } else if (type === 1 && length >= 20) {
      const x = bytes.readDoubleLE(start + 4), y = bytes.readDoubleLE(start + 12);
      bounds = [x, y, x, y];
    }
    summaries.push({ type, bounds });
    offset = start + length;
  }
  return summaries;
}

const files = (await readdir(root)).filter((file) => file.endsWith(".dbf"));
for (const dbf of files) {
  if (!/(places_a|places_free|natural_a|natural_free|buildings_a|water_a|landuse_a)/.test(dbf)) continue;
  const rows = await dbfRows(path.join(root, dbf));
  const shapes = await shapeSummaries(path.join(root, dbf.replace(".dbf", ".shp")));
  console.log(`\n${dbf}: ${rows.length} records`);
  if (dbf.includes("places")) console.log(JSON.stringify(rows.map((row, index) => ({ ...row, shape: shapes[index] })), null, 2));
  else console.log(JSON.stringify(rows.slice(0, 6), null, 2));
  console.log("shape types:", [...new Set(shapes.map(({ type }) => type))].map((type) => `${type}: ${shapes.filter((shape) => shape.type === type).length}`).join(", "));
}
