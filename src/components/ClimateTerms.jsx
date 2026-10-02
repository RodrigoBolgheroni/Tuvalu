"use client";

import { useState } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const terms = [["Drought", "A prolonged period of unusually low rainfall that reduces water stored in tanks, soil and groundwater."], ["Freshwater lens", "A thin body of fresh groundwater that floats above saltwater in porous coral rock."], ["Saltwater intrusion", "Seawater entering a freshwater lens through the ground or after coastal overwash."], ["Sea-level rise", "A long-term rise in average ocean height. Local relative sea level also reflects tides and land movement."], ["Atoll", "A reef rim, often carrying low islets, that partly or fully encloses a lagoon."], ["Reef island", "A low island built on coral reef material; some Tuvalu reef islands formed as former atoll lagoons filled in."], ["Water security", "Reliable access to enough safe water for homes, health, food and daily life."], ["ENSO / El Niño", "A recurring Pacific climate pattern that shifts rainfall and temperature; its effects vary by island and season."]];
export default function ClimateTerms() {
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/_jsxs("div", {
    className: "terms-wrap",
    children: [/*#__PURE__*/_jsxs("button", {
      className: "terms-toggle",
      "aria-expanded": open,
      onClick: () => setOpen(value => !value),
      children: ["Climate terms ", /*#__PURE__*/_jsx("span", {
        "aria-hidden": "true",
        children: open ? "−" : "+"
      })]
    }), open && /*#__PURE__*/_jsxs("div", {
      className: "terms-popover",
      children: [/*#__PURE__*/_jsx("div", {
        className: "eyebrow",
        children: "A SMALL FIELD GLOSSARY"
      }), terms.map(([term, explanation]) => /*#__PURE__*/_jsxs("div", {
        className: "term-row",
        children: [/*#__PURE__*/_jsx("strong", {
          children: term
        }), /*#__PURE__*/_jsx("p", {
          children: explanation
        })]
      }, term))]
    })]
  });
}
