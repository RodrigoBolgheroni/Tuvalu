"use client";

import { dataSources } from "@/data/islands";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const sections = [["WATER", "water"], ["FOOD", "food"], ["DAILY LIFE", "dailyLife"], ["RESPONSE", "response"], ["EVIDENCE", "evidence"]];
export default function InfoPanel({
  island,
  yearLabel,
  moment,
  expanded,
  onToggle
}) {
  return /*#__PURE__*/_jsx("aside", {
    className: "info-panel",
    "aria-label": "Island and climate information",
    children: /*#__PURE__*/_jsxs("div", {
      className: "panel-scroll",
      children: [/*#__PURE__*/_jsxs("div", {
        className: `event-kicker ${moment.scenario ? "is-future" : ""}`,
        children: [/*#__PURE__*/_jsx("i", {}), moment.category]
      }), moment.scenario && /*#__PURE__*/_jsxs("div", {
        className: "scenario-note",
        children: [/*#__PURE__*/_jsx("b", {
          children: "SCENARIO NOTE"
        }), /*#__PURE__*/_jsx("p", {
          children: "This is a scenario, not an exact prediction."
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "panel-year",
        children: yearLabel
      }), /*#__PURE__*/_jsx("div", {
        className: "panel-location",
        children: island ? /*#__PURE__*/_jsxs(_Fragment, {
          children: [island.name, /*#__PURE__*/_jsx("span", {
            children: " \xB7 "
          }), island.type]
        }) : "Tuvalu · Pacific Islands"
      }), /*#__PURE__*/_jsx("h2", {
        children: moment.title
      }), /*#__PURE__*/_jsx("p", {
        className: "panel-summary",
        children: moment.summary
      }), island && /*#__PURE__*/_jsxs("div", {
        className: "island-stats",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("strong", {
            children: island.population2022.toLocaleString("en-US")
          }), /*#__PURE__*/_jsxs("span", {
            children: ["home-island population", /*#__PURE__*/_jsx("br", {}), "2022 census"]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("strong", {
            children: island.areaKm2 ? `${island.areaKm2.toFixed(2)} km²` : "Not reported"
          }), /*#__PURE__*/_jsx("span", {
            children: "land area"
          })]
        })]
      }), /*#__PURE__*/_jsxs("button", {
        className: "learn-more",
        onClick: onToggle,
        "aria-expanded": expanded,
        children: [/*#__PURE__*/_jsx("span", {
          children: expanded ? "Learn less" : "Learn more"
        }), /*#__PURE__*/_jsx("i", {
          "aria-hidden": "true",
          children: expanded ? "−" : "+"
        })]
      }), expanded && /*#__PURE__*/_jsxs("div", {
        className: "expanded-copy",
        children: [island && /*#__PURE__*/_jsxs("div", {
          className: "on-island",
          children: [/*#__PURE__*/_jsx("div", {
            className: "eyebrow",
            children: "ON THIS ISLAND"
          }), /*#__PURE__*/_jsx("p", {
            children: island.geography
          }), /*#__PURE__*/_jsx("p", {
            children: island.freshwater
          }), /*#__PURE__*/_jsx("p", {
            children: island.vulnerability
          }), /*#__PURE__*/_jsxs("p", {
            className: "settlement-note",
            children: [/*#__PURE__*/_jsx("b", {
              children: "SETTLEMENTS & INFRASTRUCTURE"
            }), /*#__PURE__*/_jsx("br", {}), island.settlement, ". ", island.infrastructure]
          })]
        }), sections.map(([label, key]) => /*#__PURE__*/_jsxs("section", {
          className: "detail-section",
          children: [/*#__PURE__*/_jsx("div", {
            className: "eyebrow",
            children: label
          }), /*#__PURE__*/_jsx("p", {
            children: moment[key]
          })]
        }, key)), /*#__PURE__*/_jsxs("section", {
          className: "detail-section",
          children: [/*#__PURE__*/_jsx("div", {
            className: "eyebrow",
            children: "SEA LEVEL"
          }), /*#__PURE__*/_jsx("p", {
            children: moment.seaLevel
          })]
        }), /*#__PURE__*/_jsxs("section", {
          className: "detail-section",
          children: [/*#__PURE__*/_jsx("div", {
            className: "eyebrow",
            children: "SOURCE TYPE"
          }), /*#__PURE__*/_jsxs("p", {
            children: [moment.sourceType, ". Trees are representative; vertical scale and water movement are exaggerated for legibility."]
          })]
        }), /*#__PURE__*/_jsxs("section", {
          className: "detail-section source-list",
          children: [/*#__PURE__*/_jsx("div", {
            className: "eyebrow",
            children: "SOURCES & REFERENCES"
          }), dataSources.map(source => /*#__PURE__*/_jsxs("a", {
            href: source.url,
            target: "_blank",
            rel: "noreferrer",
            children: [source.label, /*#__PURE__*/_jsx("span", {
              children: "\u2197"
            })]
          }, source.label))]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "panel-footnote",
        children: island ? "Island-specific figures are marked with their source and year." : "Select an island, then move through time without leaving it."
      })]
    })
  });
}
