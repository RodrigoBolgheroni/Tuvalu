"use client";

import { years, type YearKey } from "@/data/timeline";

export default function Timeline({ selectedYear, onSelect }: { selectedYear: YearKey; onSelect: (year: YearKey) => void }) {
  const index = years.findIndex(({ key }) => key === selectedYear);
  return (
    <footer className="timeline-bar" aria-label="Climate timeline">
      <button className="timeline-nav previous" onClick={() => onSelect(years[Math.max(0, index - 1)].key)} disabled={index === 0}>
        <span aria-hidden="true">←</span> Previous
      </button>
      <div className="timeline-track">
        <div className="timeline-line" aria-hidden="true"><span style={{ width: `${(index / (years.length - 1)) * 100}%` }} /></div>
        {years.map((year) => <button
          key={year.key}
          className={`year-point ${year.key === selectedYear ? "active" : ""} ${year.key === "2030" || year.key === "2050" || year.key === "2090" ? "future" : ""}`}
          onClick={() => onSelect(year.key)}
          aria-current={year.key === selectedYear ? "date" : undefined}
          aria-label={`Show ${year.label}`}
        ><i aria-hidden="true" /><span>{year.label}</span></button>)}
      </div>
      <button className="timeline-nav next" onClick={() => onSelect(years[Math.min(years.length - 1, index + 1)].key)} disabled={index === years.length - 1}>
        Next <span aria-hidden="true">→</span>
      </button>
    </footer>
  );
}
