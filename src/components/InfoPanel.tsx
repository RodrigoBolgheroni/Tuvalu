"use client";

import type { Island } from "@/data/islands";
import { dataSources } from "@/data/islands";
import type { Moment } from "@/data/timeline";

const sections = [
  ["WATER", "water"], ["FOOD", "food"], ["DAILY LIFE", "dailyLife"], ["RESPONSE", "response"], ["EVIDENCE", "evidence"],
] as const;

export default function InfoPanel({ island, yearLabel, moment, expanded, onToggle }: {
  island: Island | null; yearLabel: string; moment: Moment; expanded: boolean; onToggle: () => void;
}) {
  return (
    <aside className="info-panel" aria-label="Island and climate information">
      <div className="panel-scroll">
        <div className={`event-kicker ${moment.scenario ? "is-future" : ""}`}>
          <i />{moment.category}
        </div>
        {moment.scenario && <div className="scenario-note"><b>SCENARIO NOTE</b><p>This is a scenario, not an exact prediction.</p></div>}
        <div className="panel-year">{yearLabel}</div>
        <div className="panel-location">{island ? <>{island.name}<span> · </span>{island.type}</> : "Tuvalu · Pacific Islands"}</div>
        <h2>{moment.title}</h2>
        <p className="panel-summary">{moment.summary}</p>

        {island && <div className="island-stats">
          <div><strong>{island.population2022.toLocaleString("en-US")}</strong><span>home-island population<br />2022 census</span></div>
          <div><strong>{island.areaKm2 ? `${island.areaKm2.toFixed(2)} km²` : "Not reported"}</strong><span>land area</span></div>
        </div>}

        <button className="learn-more" onClick={onToggle} aria-expanded={expanded}>
          <span>{expanded ? "Learn less" : "Learn more"}</span><i aria-hidden="true">{expanded ? "−" : "+"}</i>
        </button>

        {expanded && <div className="expanded-copy">
          {island && <div className="on-island">
            <div className="eyebrow">ON THIS ISLAND</div>
            <p>{island.geography}</p>
            <p>{island.freshwater}</p>
            <p>{island.vulnerability}</p>
            <p className="settlement-note"><b>SETTLEMENTS & INFRASTRUCTURE</b><br />{island.settlement}. {island.infrastructure}</p>
          </div>}
          {sections.map(([label, key]) => <section className="detail-section" key={key}>
            <div className="eyebrow">{label}</div><p>{moment[key]}</p>
          </section>)}
          <section className="detail-section"><div className="eyebrow">SEA LEVEL</div><p>{moment.seaLevel}</p></section>
          <section className="detail-section"><div className="eyebrow">SOURCE TYPE</div><p>{moment.sourceType}. Trees are representative; vertical scale and water movement are exaggerated for legibility.</p></section>
          <section className="detail-section source-list"><div className="eyebrow">SOURCES & REFERENCES</div>
            {dataSources.map((source) => <a key={source.label} href={source.url} target="_blank" rel="noreferrer">{source.label}<span>↗</span></a>)}
          </section>
        </div>}
        <div className="panel-footnote">{island ? "Island-specific figures are marked with their source and year." : "Select an island, then move through time without leaving it."}</div>
      </div>
    </aside>
  );
}
