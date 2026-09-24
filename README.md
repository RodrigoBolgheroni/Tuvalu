# Tuvalu Time Machine

An editorial atlas for exploring Tuvalu's nine islands through climate history and future scenarios. The overview, island scenes, timeline and information panel live in one full-screen experience.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The model view works without an API key. Optional satellite imagery is configured with `NEXT_PUBLIC_MAP_STYLE=SATELLITE` and `NEXT_PUBLIC_SATELLITE_IMAGE_TEMPLATE` in `.env.local`. The template must return a georeferenced image for the selected island when `{island}` is replaced with its id. Only use browser-safe, domain-restricted public tokens.

## Geography and evidence

- Nine local GeoJSON files under `public/data/geojson/` contain coastline polygons reconstructed from OpenStreetMap `natural=coastline` ways, plus named OSM island outlines where coast segments are incomplete. Each island has its own coastline and mapped building footprints.
- `public/data/geojson/sources.json` records source, license, attribution and retrieval date. Geometries are processed locally; the application makes no map-data requests when it opens.
- Tree markers are deterministic, representative instances placed over land. They are not a measured tree inventory. Vertical scale and the changing water surface are illustrative, not parcel-level inundation.
- Island population uses the Government of Tuvalu Central Statistics Division 2022 Census, as population by home island. Land area and geomorphology follow the Tuvalu nomination on UNESCO's Tentative List; Vaitupu is described as a composite reef island/former atoll to preserve its distinct classification across sources.
- National drought evidence and regional sea-level scenarios are labeled as national or regional evidence. The interface does not present them as measurements for each island.

## Refresh the OSM geometry

Download the Tuvalu Geofabrik shapefile extract and query OSM `natural=coastline` ways for the nine bounding boxes in `scripts/import-openstreetmap.mjs`. Then run:

```bash
node scripts/import-openstreetmap.mjs <geofabrik-shapefile-directory> <overpass-response.json>
```

The script joins coastline ways by shared OSM endpoints, uses named island-area outlines for uncovered land, assigns mapped building footprints to each island and writes the nine local GeoJSON files.
