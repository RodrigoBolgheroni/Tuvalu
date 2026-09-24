"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import ClimateTerms from "@/components/ClimateTerms";
import InfoPanel from "@/components/InfoPanel";
import OverviewMap from "@/components/OverviewMap";
import Timeline from "@/components/Timeline";
import { islandById, type IslandId, islands } from "@/data/islands";
import { moments, years, type YearKey } from "@/data/timeline";

const IslandScene = dynamic(() => import("@/components/IslandScene"), {
  ssr: false,
  loading: () => <div className="scene-lazy-loading"><span className="spinner" />Entering the island…</div>,
});

function validIsland(value: string | null): value is IslandId {
  return value !== null && value in islandById;
}
function validYear(value: string | null): value is YearKey {
  return years.some(({ key }) => key === value);
}

export default function TimeMachine() {
  const [selectedIsland, setSelectedIsland] = useState<IslandId | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearKey>("2022");
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [hasReadUrl, setHasReadUrl] = useState(false);
  const island = selectedIsland ? islandById[selectedIsland] : null;
  const moment = moments[selectedYear];
  const yearLabel = selectedYear === "now" ? "NOW" : selectedYear;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedIsland = params.get("island");
    const requestedYear = params.get("year");
    if (validIsland(requestedIsland)) setSelectedIsland(requestedIsland);
    if (validYear(requestedYear)) setSelectedYear(requestedYear);
    setHasReadUrl(true);
    const onPopState = () => {
      const nextParams = new URLSearchParams(window.location.search);
      const nextIsland = nextParams.get("island");
      const nextYear = nextParams.get("year");
      setSelectedIsland(validIsland(nextIsland) ? nextIsland : null);
      setSelectedYear(validYear(nextYear) ? nextYear : "2022");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!hasReadUrl) return;
    const url = new URL(window.location.href);
    if (selectedIsland) url.searchParams.set("island", selectedIsland);
    else url.searchParams.delete("island");
    url.searchParams.set("year", selectedYear);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [hasReadUrl, selectedIsland, selectedYear]);

  const chooseYear = useCallback((year: YearKey) => setSelectedYear(year), []);
  const openIsland = useCallback((id: IslandId) => {
    setSelectedIsland(id);
    setLearnMoreOpen(false);
  }, []);
  const goOverview = useCallback(() => {
    setSelectedIsland(null);
    setLearnMoreOpen(false);
  }, []);
  const selectedIndex = years.findIndex(({ key }) => key === selectedYear);
  const seaAmount = useMemo(() => moment.sea, [moment]);
  const droughtIntensity = moment.droughtObserved ? moment.droughtVisual : 0;

  return <div className="time-machine">
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-eyebrow">NINE ISLANDS <i>·</i> ONE CHANGING CLIMATE</div>
        <h1>Tuvalu Time Machine</h1>
      </div>
      <div className="header-instruction">
        {island ? "Move through the timeline to see the selected island respond." : "Choose an island to enter the time machine."}
      </div>
      <ClimateTerms />
    </header>

    <main className="main-content">
      {island ? <IslandScene island={island} seaAmount={seaAmount} droughtIntensity={droughtIntensity} yearLabel={yearLabel} onBack={goOverview} />
        : <OverviewMap selectedIsland={selectedIsland} onSelect={openIsland} />}
      <InfoPanel island={island} yearLabel={yearLabel} moment={moment} expanded={learnMoreOpen} onToggle={() => setLearnMoreOpen((open) => !open)} />
    </main>

    <Timeline selectedYear={selectedYear} onSelect={chooseYear} />
    <div className="sr-only" aria-live="polite">{islands.length} islands. {island ? `${island.name} selected.` : "Overview map."} {years[selectedIndex].label}.</div>
  </div>;
}
