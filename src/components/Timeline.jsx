"use client";

import { years } from "@/data/timeline";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Timeline({
  selectedYear,
  onSelect
}) {
  const index = years.findIndex(({
    key
  }) => key === selectedYear);
  return /*#__PURE__*/_jsxs("footer", {
    className: "timeline-bar",
    "aria-label": "Climate timeline",
    children: [/*#__PURE__*/_jsxs("button", {
      className: "timeline-nav previous",
      onClick: () => onSelect(years[Math.max(0, index - 1)].key),
      disabled: index === 0,
      children: [/*#__PURE__*/_jsx("span", {
        "aria-hidden": "true",
        children: "\u2190"
      }), " Previous"]
    }), /*#__PURE__*/_jsxs("div", {
      className: "timeline-track",
      children: [/*#__PURE__*/_jsx("div", {
        className: "timeline-line",
        "aria-hidden": "true",
        children: /*#__PURE__*/_jsx("span", {
          style: {
            width: `${index / (years.length - 1) * 100}%`
          }
        })
      }), years.map(year => /*#__PURE__*/_jsxs("button", {
        className: `year-point ${year.key === selectedYear ? "active" : ""} ${year.key === "2030" || year.key === "2050" || year.key === "2090" ? "future" : ""}`,
        onClick: () => onSelect(year.key),
        "aria-current": year.key === selectedYear ? "date" : undefined,
        "aria-label": `Show ${year.label}`,
        children: [/*#__PURE__*/_jsx("i", {
          "aria-hidden": "true"
        }), /*#__PURE__*/_jsx("span", {
          children: year.label
        })]
      }, year.key))]
    }), /*#__PURE__*/_jsxs("button", {
      className: "timeline-nav next",
      onClick: () => onSelect(years[Math.min(years.length - 1, index + 1)].key),
      disabled: index === years.length - 1,
      children: ["Next ", /*#__PURE__*/_jsx("span", {
        "aria-hidden": "true",
        children: "\u2192"
      })]
    })]
  });
}
