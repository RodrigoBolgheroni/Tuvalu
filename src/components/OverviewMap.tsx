"use client";

import { islands, type Island } from "@/data/islands";

const layout: Record<string, [number, number]> = {
  nanumea: [13, 17], nanumaga: [34, 24], niutao: [49, 27], nui: [39, 43],
  vaitupu: [63, 41], nukufetau: [54, 57], funafuti: [76, 65],
  nukulaelae: [88, 75], niulakita: [80, 89],
};

const shapes: Record<string, string> = {
  nanumea: "M5 21 C13 11 23 12 32 17 L40 14 52 18 59 16 67 21 60 25 49 23 41 29 31 25 21 28 13 25Z",
  nanumaga: "M37 5 51 10 62 17 56 28 48 39 39 32 31 23 29 13Z",
  niutao: "M40 6 C51 4 61 12 62 22 63 32 53 39 43 36 33 34 28 26 31 17 32 11 35 8 40 6Z",
  nui: "M50 3 C58 9 59 20 55 29 L49 43 43 57 35 69 28 62 34 48 39 34 41 20Z",
  vaitupu: "M15 7 38 5 63 13 76 30 66 48 47 60 28 54 13 39 7 22Z",
  nukufetau: "M15 12 28 6 43 8 54 13 67 10 78 18 75 29 64 31 53 36 44 33 33 38 24 31 12 33 7 23Z",
  funafuti: "M13 48 9 37 15 26 12 17 21 12 25 22 21 31 28 39 26 52 34 61 31 70 24 65 19 56Z M64 8 72 12 70 20 63 16Z M48 20 54 19 57 25 51 29Z",
  nukulaelae: "M16 34 C18 22 29 13 42 12 54 11 67 17 74 26 64 29 59 34 49 35 38 37 28 33 16 34Z",
  niulakita: "M26 15 40 8 56 12 66 23 59 34 43 37 28 31 20 23Z",
};

function IslandMiniature({ island, selected, onSelect }: { island: Island; selected: boolean; onSelect: (id: Island["id"]) => void }) {
  const [x, y] = layout[island.id];
  const path = shapes[island.mapShape];
  return (
    <button
      className={`island-marker ${selected ? "is-selected" : ""}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={() => onSelect(island.id)}
      aria-label={`Open ${island.name}, ${island.type}`}
      aria-pressed={selected}
      key={island.id}
    >
      <svg viewBox="0 0 88 76" aria-hidden="true" className="marker-art">
        <path d={path} fill="rgba(226,207,147,.06)" />
        <path d={path} className="marker-coast" />
        {island.type.includes("Atoll") && island.id !== "vaitupu" && <ellipse className="marker-lagoon" cx="45" cy="39" rx="11" ry="6" />}
      </svg>
      <span className="marker-copy"><strong>{island.name}</strong><small>{island.type.split(" · ")[0]}</small></span>
    </button>
  );
}

export default function OverviewMap({ selectedIsland, onSelect }: { selectedIsland: string | null; onSelect: (id: Island["id"]) => void }) {
  return (
    <section className="map-stage overview-map" aria-label="Map of Tuvalu's nine islands">
      <div className="map-heading">
        <div className="eyebrow">ISLAND OVERVIEW</div>
        <div className="map-subtitle">Tuvalu <span>·</span> Pacific Ocean</div>
      </div>
      <p className="map-note">Miniatures show island type and relative position,<br />not exact coastlines.</p>
      <div className="map-arc" aria-hidden="true"><svg viewBox="0 0 1000 700" preserveAspectRatio="none"><path d="M92 80 C400 105 410 220 600 287 S743 435 887 632" /></svg></div>
      {islands.map((island) => <IslandMiniature key={island.id} island={island} selected={selectedIsland === island.id} onSelect={onSelect} />)}
      <div className="map-footer"><span>5 atolls · 3 reef islands · 1 composite</span><span>about 650 km north to south</span></div>
      <div className="map-scale" aria-hidden="true"><span /> 100 km</div>
    </section>
  );
}
