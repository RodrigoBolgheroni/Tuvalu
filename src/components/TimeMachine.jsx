"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import ClimateTerms from "@/components/ClimateTerms";
import InfoPanel from "@/components/InfoPanel";
import OverviewMap from "@/components/OverviewMap";
import Timeline from "@/components/Timeline";
import { islandById, islands } from "@/data/islands";
import { moments, years } from "@/data/timeline";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const IslandScene = dynamic(() => import("@/components/IslandScene"), {
  ssr: false,
  loading: () => /*#__PURE__*/_jsxs("div", {
    className: "scene-lazy-loading",
    children: [/*#__PURE__*/_jsx("span", {
      className: "spinner"
    }), "Entering the island\u2026"]
  })
});
function validIsland(value) {
  return value !== null && value in islandById;
}
function validYear(value) {
  return years.some(({
    key
  }) => key === value);
}
export default function TimeMachine() {
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2022");
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
    if (selectedIsland) url.searchParams.set("island", selectedIsland);else url.searchParams.delete("island");
    url.searchParams.set("year", selectedYear);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [hasReadUrl, selectedIsland, selectedYear]);
  const chooseYear = useCallback(year => setSelectedYear(year), []);
  const openIsland = useCallback(id => {
    setSelectedIsland(id);
    setLearnMoreOpen(false);
  }, []);
  const goOverview = useCallback(() => {
    setSelectedIsland(null);
    setLearnMoreOpen(false);
  }, []);
  const selectedIndex = years.findIndex(({
    key
  }) => key === selectedYear);
  const seaAmount = useMemo(() => moment.sea, [moment]);
  const droughtIntensity = moment.droughtObserved ? moment.droughtVisual : 0;
  return /*#__PURE__*/_jsxs("div", {
    className: "time-machine",
    children: [/*#__PURE__*/_jsxs("header", {
      className: "app-header",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "brand-block",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "brand-eyebrow",
          children: ["NINE ISLANDS ", /*#__PURE__*/_jsx("i", {
            children: "\xB7"
          }), " ONE CHANGING CLIMATE"]
        }), /*#__PURE__*/_jsx("h1", {
          children: "Tuvalu Time Machine"
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "header-instruction",
        children: island ? "Move through the timeline to see the selected island respond." : "Choose an island to enter the time machine."
      }), /*#__PURE__*/_jsx(ClimateTerms, {})]
    }), /*#__PURE__*/_jsxs("main", {
      className: "main-content",
      children: [island ? /*#__PURE__*/_jsx(IslandScene, {
        island: island,
        seaAmount: seaAmount,
        droughtIntensity: droughtIntensity,
        yearLabel: yearLabel,
        onBack: goOverview
      }) : /*#__PURE__*/_jsx(OverviewMap, {
        selectedIsland: selectedIsland,
        onSelect: openIsland
      }), /*#__PURE__*/_jsx(InfoPanel, {
        island: island,
        yearLabel: yearLabel,
        moment: moment,
        expanded: learnMoreOpen,
        onToggle: () => setLearnMoreOpen(open => !open)
      })]
    }), /*#__PURE__*/_jsx(Timeline, {
      selectedYear: selectedYear,
      onSelect: chooseYear
    }), /*#__PURE__*/_jsxs("div", {
      className: "sr-only",
      "aria-live": "polite",
      children: [islands.length, " islands. ", island ? `${island.name} selected.` : "Overview map.", " ", years[selectedIndex].label, "."]
    })]
  });
}
