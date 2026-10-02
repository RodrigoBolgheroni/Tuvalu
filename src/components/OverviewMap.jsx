"use client";

import { islands } from "@/data/islands";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const layout = {
  nanumea: [13, 17],
  nanumaga: [34, 24],
  niutao: [49, 27],
  nui: [39, 43],
  vaitupu: [63, 41],
  nukufetau: [54, 57],
  funafuti: [76, 65],
  nukulaelae: [88, 75],
  niulakita: [80, 89]
};
const shapes = {
  nanumea: "M5 21 C13 11 23 12 32 17 L40 14 52 18 59 16 67 21 60 25 49 23 41 29 31 25 21 28 13 25Z",
  nanumaga: "M37 5 51 10 62 17 56 28 48 39 39 32 31 23 29 13Z",
  niutao: "M40 6 C51 4 61 12 62 22 63 32 53 39 43 36 33 34 28 26 31 17 32 11 35 8 40 6Z",
  nui: "M50 3 C58 9 59 20 55 29 L49 43 43 57 35 69 28 62 34 48 39 34 41 20Z",
  vaitupu: "M15 7 38 5 63 13 76 30 66 48 47 60 28 54 13 39 7 22Z",
  nukufetau: "M15 12 28 6 43 8 54 13 67 10 78 18 75 29 64 31 53 36 44 33 33 38 24 31 12 33 7 23Z",
  funafuti: "M13 48 9 37 15 26 12 17 21 12 25 22 21 31 28 39 26 52 34 61 31 70 24 65 19 56Z M64 8 72 12 70 20 63 16Z M48 20 54 19 57 25 51 29Z",
  nukulaelae: "M16 34 C18 22 29 13 42 12 54 11 67 17 74 26 64 29 59 34 49 35 38 37 28 33 16 34Z",
  niulakita: "M26 15 40 8 56 12 66 23 59 34 43 37 28 31 20 23Z"
};
function IslandMiniature({
  island,
  selected,
  onSelect
}) {
  const [x, y] = layout[island.id];
  const path = shapes[island.mapShape];
  return /*#__PURE__*/_jsxs("button", {
    className: `island-marker ${selected ? "is-selected" : ""}`,
    style: {
      left: `${x}%`,
      top: `${y}%`
    },
    onClick: () => onSelect(island.id),
    "aria-label": `Open ${island.name}, ${island.type}`,
    "aria-pressed": selected,
    children: [/*#__PURE__*/_jsxs("svg", {
      viewBox: "0 0 88 76",
      "aria-hidden": "true",
      className: "marker-art",
      children: [/*#__PURE__*/_jsx("path", {
        d: path,
        fill: "rgba(226,207,147,.06)"
      }), /*#__PURE__*/_jsx("path", {
        d: path,
        className: "marker-coast"
      }), island.type.includes("Atoll") && island.id !== "vaitupu" && /*#__PURE__*/_jsx("ellipse", {
        className: "marker-lagoon",
        cx: "45",
        cy: "39",
        rx: "11",
        ry: "6"
      })]
    }), /*#__PURE__*/_jsxs("span", {
      className: "marker-copy",
      children: [/*#__PURE__*/_jsx("strong", {
        children: island.name
      }), /*#__PURE__*/_jsx("small", {
        children: island.type.split(" · ")[0]
      })]
    })]
  }, island.id);
}
export default function OverviewMap({
  selectedIsland,
  onSelect
}) {
  return /*#__PURE__*/_jsxs("section", {
    className: "map-stage overview-map",
    "aria-label": "Map of Tuvalu's nine islands",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "map-heading",
      children: [/*#__PURE__*/_jsx("div", {
        className: "eyebrow",
        children: "ISLAND OVERVIEW"
      }), /*#__PURE__*/_jsxs("div", {
        className: "map-subtitle",
        children: ["Tuvalu ", /*#__PURE__*/_jsx("span", {
          children: "\xB7"
        }), " Pacific Ocean"]
      })]
    }), /*#__PURE__*/_jsxs("p", {
      className: "map-note",
      children: ["Miniatures show island type and relative position,", /*#__PURE__*/_jsx("br", {}), "not exact coastlines."]
    }), /*#__PURE__*/_jsx("div", {
      className: "map-arc",
      "aria-hidden": "true",
      children: /*#__PURE__*/_jsx("svg", {
        viewBox: "0 0 1000 700",
        preserveAspectRatio: "none",
        children: /*#__PURE__*/_jsx("path", {
          d: "M92 80 C400 105 410 220 600 287 S743 435 887 632"
        })
      })
    }), islands.map(island => /*#__PURE__*/_jsx(IslandMiniature, {
      island: island,
      selected: selectedIsland === island.id,
      onSelect: onSelect
    }, island.id)), /*#__PURE__*/_jsxs("div", {
      className: "map-footer",
      children: [/*#__PURE__*/_jsx("span", {
        children: "5 atolls \xB7 3 reef islands \xB7 1 composite"
      }), /*#__PURE__*/_jsx("span", {
        children: "about 650 km north to south"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "map-scale",
      "aria-hidden": "true",
      children: [/*#__PURE__*/_jsx("span", {}), " 100 km"]
    })]
  });
}
