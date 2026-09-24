export type YearKey = "2007" | "2011" | "2022" | "now" | "2030" | "2050" | "2090";

export const years: { key: YearKey; label: string }[] = [
  { key: "2007", label: "2007" }, { key: "2011", label: "2011" },
  { key: "2022", label: "2022" }, { key: "now", label: "Now" },
  { key: "2030", label: "2030" }, { key: "2050", label: "2050" }, { key: "2090", label: "2090" },
];

export type Moment = {
  category: string;
  title: string;
  summary: string;
  water: string;
  food: string;
  dailyLife: string;
  response: string;
  evidence: string;
  seaLevel: string;
  sourceType: string;
  scenario: boolean;
  sea: number;
  drought: number;
};

export const moments: Record<YearKey, Moment> = {
  "2007": {
    category: "HISTORICAL CONTEXT", title: "Water is held in the landscape.",
    summary: "On low coral islands, rainwater tanks, wells and taro pits carry different roles from island to island.",
    water: "Rain is collected from roofs. Thin freshwater lenses and wells vary by island and can be affected by drought, salt spray and overwash.",
    food: "Coconut, pandanus, breadfruit and pulaka are part of local food systems; access to reef and lagoon fishing differs among islands.",
    dailyLife: "A single village or a chain of islets shapes how people reach water, gardens and the lagoon.",
    response: "Community water storage and customary care for land and reefs help manage limited resources.",
    evidence: "Island geography and water practices documented by UNESCO; this year is a context marker, not a dated island event.",
    seaLevel: "Historical reference · no island-specific 2007 elevation layer", sourceType: "Historical context", scenario: false, sea: 0.04, drought: 0.1,
  },
  "2011": {
    category: "HISTORICAL EVENT", title: "A severe drought strains stored water.",
    summary: "Tuvalu declared a national emergency in September 2011 after the 2010–2013 drought caused water shortages and crop losses.",
    water: "At Funafuti, May–October rainfall was 515 mm, 36% of its long-term average. The national report describes rationing; island-by-island rainfall totals were not found.",
    food: "The drought damaged crops used for food security. Local crop losses for each outer island are not quantified in the sources reviewed.",
    dailyLife: "The emergency affected the whole population. Effects on each island’s households were not reported separately in the cited national account.",
    response: "The government declared a state of emergency on 28 September 2011; communal water was rationed nationally.",
    evidence: "Tuvalu Climate Hazards report (2024), citing government records; ADB project report.",
    seaLevel: "Historical context · drought conditions highlighted", sourceType: "National observation with local context", scenario: false, sea: 0.06, drought: 1,
  },
  "2022": {
    category: "HISTORICAL EVENT", title: "Drought returns; the census records each home island.",
    summary: "A second emergency drought was declared in November. The 2022 census later counted residents by home island.",
    water: "ADB reports Funafuti had reserves for about seven days at 30 litres per person per day. Comparable island-specific reserve figures were not located.",
    food: "National reporting describes renewed shortages; this view does not imply the same measured impact on every island.",
    dailyLife: "The census counted 10,632 residents by home island. The figure beside this island is the home-island population, not everyone currently living there.",
    response: "Emergency support and water supply measures accompanied the national drought response.",
    evidence: "Tuvalu Central Statistics Division 2022 Census; ADB project report on the November 2022 drought.",
    seaLevel: "Historical reference · recent census population shown", sourceType: "Observed national event + census", scenario: false, sea: 0.1, drought: 0.82,
  },
  now: {
    category: "LATEST SOURCED CONTEXT", title: "Local conditions are not measured uniformly.",
    summary: "The available records combine the 2022 census, national hazard reporting and project studies focused on Funafuti.",
    water: "Rainwater remains the primary drinking-water source nationally. Current household tank and freshwater-lens data for this island were not found.",
    food: "Island-specific food and vegetation inventories are incomplete; customary gardening and fishing remain place-dependent.",
    dailyLife: "Population figures use 2022 home-island census counts, not a live estimate of current residents.",
    response: "Tuvalu’s national climate and water programmes combine local planning with infrastructure investment.",
    evidence: "Latest sources currently used: 2022 Census, Tuvalu Climate Hazards 2024 and the ADB water project report.",
    seaLevel: "Observed and projected sea level vary by location and scenario", sourceType: "Latest available published sources", scenario: false, sea: 0.14, drought: 0.32,
  },
  "2030": {
    category: "FUTURE SCENARIO", title: "Planning for a hotter, higher-water future.",
    summary: "The 2030 point marks a planning horizon. Local impacts depend on rainfall, reef conditions, infrastructure and adaptation.",
    water: "A scenario layer illustrates sensitivity of low land and water stores; it does not forecast a specific island’s freshwater supply.",
    food: "Saltwater, heat and drought can affect gardens, but outcomes depend on local conditions and adaptation choices.",
    dailyLife: "Changes are not uniform. This scene keeps the selected island in view while the scenario shifts.",
    response: "National Climate Change Policy and Te Kete cover the 2021–2030 planning period.",
    evidence: "Planning horizon, not an observed event. No 2030 island-specific projection is stated here.",
    seaLevel: "Scenario context · model layer is illustrative", sourceType: "Future scenario", scenario: true, sea: 0.2, drought: 0.38,
  },
  "2050": {
    category: "FUTURE SCENARIO", title: "Higher tides reach farther across low ground.",
    summary: "NASA’s regional assessment projects at least 20 cm of relative sea-level rise by 2050 in Tuvalu’s coastal areas.",
    water: "The projection is regional. It is not a parcel-level flood map and does not measure local freshwater availability.",
    food: "Saltwater exposure may affect gardens and pulaka pits; this scene does not calculate crop loss on this island.",
    dailyLife: "NASA estimates areas of Tuvalu with fewer than five high-tide flood days today could average 25 days a year by the 2050s.",
    response: "Coastal adaptation works and reliable water storage can reduce some risks; this is a scenario, not an exact prediction.",
    evidence: "NASA Sea Level Change Team regional assessment using IPCC AR6 projections.",
    seaLevel: "At least +20 cm by 2050 · regional projection", sourceType: "Future scenario · regional projection", scenario: true, sea: 0.58, drought: 0.42,
  },
  "2090": {
    category: "FUTURE SCENARIO", title: "A wider range of late-century outcomes.",
    summary: "NASA describes roughly 0.5–1 m of relative sea-level rise by the end of the century across the region, depending on the projection.",
    water: "The range is regional and scenario-dependent; it should not be read as an exact 2090 value for this island.",
    food: "Exposure of gardens and freshwater lenses varies with elevation, reef form, storm overwash and adaptation.",
    dailyLife: "The model raises a broad water surface to help show vulnerability. It is not a local inundation calculation.",
    response: "Long-term outcomes depend on emissions and locally chosen adaptation; this scenario is not a confirmed future event.",
    evidence: "NASA Sea Level Change Team assessment and IPCC AR6 projection range, summarized for Tuvalu.",
    seaLevel: "+0.5 to +1 m by end-century · regional range", sourceType: "Future scenario · regional range", scenario: true, sea: 1, drought: 0.48,
  },
};
