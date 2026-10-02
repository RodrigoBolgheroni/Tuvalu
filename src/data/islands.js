// Areas and island character come from Tuvalu's UNESCO tentative-list nomination;
// population by home island is from the 2022 census published by the CSD.
export const islands = [{
  id: "nanumea",
  name: "Nanumea",
  type: "Atoll",
  lon: 176.1156,
  lat: -5.675,
  areaKm2: 3.87,
  population2022: 1488,
  settlement: "Nanumea village",
  geography: "The northernmost atoll has a double lagoon linked by a central boat passage and two main islets.",
  freshwater: "The Big Well has served as a drought reserve; Lakena has a small freshwater lake. Rainwater storage remains important.",
  vulnerability: "A narrow village strip beside the southern lagoon is exposed to dry periods, overwash and saltwater reaching groundwater.",
  infrastructure: "Nanumea village, an airstrip on the opposite lagoon shore, community meeting places and traditional pulaka pits.",
  mapShape: "nanumea"
}, {
  id: "nanumaga",
  name: "Nanumaga",
  type: "Reef island · former atoll",
  lon: 176.3153,
  lat: -6.2864,
  areaKm2: 2.78,
  population2022: 1167,
  settlement: "Tonga and Tokelau",
  geography: "A diamond-shaped reef island with the brackish Vaiatoa lagoon, the Ha’apai swamp and a narrow boat channel through the reef.",
  freshwater: "Rainwater is the dependable household source. The brackish lagoon and wetland are not freshwater supplies.",
  vulnerability: "Accretion filled the former atoll lagoons; freshwater storage and the narrow, low settlement areas are sensitive to drought and overwash.",
  infrastructure: "Tonga and Tokelau neighbourhoods, a causeway and community mangrove areas.",
  mapShape: "nanumaga"
}, {
  id: "niutao",
  name: "Niutao",
  type: "Reef island · former atoll",
  lon: 177.3342,
  lat: -6.1094,
  areaKm2: 2.53,
  population2022: 1500,
  settlement: "Kulia",
  geography: "An oval reef island with a landlocked lagoon and remnant wetland basins left by infilling.",
  freshwater: "Three wells have been reported to reach freshwater lenses; other wells were lost to the sea. Rainwater is also collected.",
  vulnerability: "The small freshwater lens and pulaka pits are vulnerable to drought, overwash and saltwater intrusion.",
  infrastructure: "Kulia, a road around the island, church and meeting hall, wells and taro pits.",
  mapShape: "niutao"
}, {
  id: "nui",
  name: "Nui",
  type: "Atoll",
  lon: 177.1458,
  lat: -7.2456,
  areaKm2: null,
  population2022: 1016,
  settlement: "Fenua Tapu",
  geography: "A north–south atoll with a large central lagoon, a southern land strip and an arc of smaller islets.",
  freshwater: "Historic wells and pulaka pits are documented on the southern strip and nearby islets. No current island-wide water inventory was found.",
  vulnerability: "The settlement and food gardens depend on narrow reef islands and groundwater affected by drought and saltwater.",
  infrastructure: "Fenua Tapu village, wells and traditional pulaka pits; the fringing reef has no boat passage.",
  mapShape: "nui"
}, {
  id: "vaitupu",
  name: "Vaitupu",
  type: "Composite reef island · former atoll",
  lon: 178.6797,
  lat: -7.4892,
  areaKm2: 5.6,
  population2022: 1844,
  settlement: "Asau and Tumaseu",
  geography: "Tuvalu’s largest land area forms a broad, sub-triangular island around a nearly landlocked saltwater lagoon, swamps and mangroves.",
  freshwater: "Rainwater collection is essential. Available national sources do not provide a recent Vaitupu-specific freshwater balance.",
  vulnerability: "A large land area does not remove risks to low coastal margins, household stores or groundwater during prolonged drought.",
  infrastructure: "One principal village with Asau and Tumaseu neighbourhoods, a harbour, church and meeting hall.",
  mapShape: "vaitupu"
}, {
  id: "nukufetau",
  name: "Nukufetau",
  type: "Atoll",
  lon: 178.3139,
  lat: -8.0267,
  areaKm2: 2.99,
  population2022: 1348,
  settlement: "Savave",
  geography: "A rectangular central atoll with a large lagoon and inhabited islets on its reef rim.",
  freshwater: "Rainwater storage is the principal household source. No reliable island-level lens inventory was located.",
  vulnerability: "Communities on separated, narrow islets have limited freshwater storage and exposure to ocean overwash.",
  infrastructure: "Savave settlement, lagoon passages and outer islets used for fishing and food gathering.",
  mapShape: "nukufetau"
}, {
  id: "funafuti",
  name: "Funafuti",
  type: "Atoll",
  lon: 179.1944,
  lat: -8.5244,
  areaKm2: 2.79,
  population2022: 1456,
  settlement: "Fongafale · Vaiaku",
  geography: "A 29-islet atoll around Tuvalu’s largest lagoon. Fongafale is a long, narrow land strip; width varies sharply along its length.",
  freshwater: "Rainwater is the main natural drinking-water source. Drought relief also uses reverse-osmosis water delivered to tanks.",
  vulnerability: "Dense development on Fongafale increases pressure on limited stores and groundwater vulnerable to salt and contamination.",
  infrastructure: "Vaiaku, government and port facilities, the airport, water tanks and desalination plant are concentrated on Fongafale.",
  mapShape: "funafuti"
}, {
  id: "nukulaelae",
  name: "Nukulaelae",
  type: "Atoll",
  lon: 179.8086,
  lat: -9.37,
  areaKm2: 1.82,
  population2022: 578,
  settlement: "Fangaua",
  geography: "A southern atoll made up of 15 islets around a lagoon; Fangaua sits on a small arc-shaped islet.",
  freshwater: "Rainwater collection is important. The sources reviewed do not give a current island-specific water inventory.",
  vulnerability: "Settlement on a narrow islet leaves limited room for water storage and makes overwash and drought relevant risks.",
  infrastructure: "Fangaua village, church and meeting hall; reef and lagoon resources support daily life.",
  mapShape: "nukulaelae"
}, {
  id: "niulakita",
  name: "Niulakita",
  type: "Reef island · former atoll",
  lon: 179.4711,
  lat: -10.79,
  areaKm2: 0.42,
  population2022: 6,
  settlement: "Teava",
  geography: "The southernmost and smallest island is oval, with low-lying land and landlocked wetland features.",
  freshwater: "Household-scale water figures were not available in the sources reviewed; national rainwater dependence provides context only.",
  vulnerability: "Its small size and limited service footprint constrain redundancy during drought and coastal flooding.",
  infrastructure: "Teava is the island’s village; island-level building inventories are not available in the sources reviewed.",
  mapShape: "niulakita"
}];
export const islandById = Object.fromEntries(islands.map(island => [island.id, island]));
export const dataSources = [{
  label: "UNESCO · Tuvalu island geography",
  url: "https://whc.unesco.org/en/tentativelists/6707"
}, {
  label: "SPREP · Tuvalu country report",
  url: "https://pacific-data.sprep.org/dataset/sprep-country-report-tuvalu"
}, {
  label: "Tuvalu Central Statistics Division · 2022 census",
  url: "https://stats.gov.tv/download/85/population-and-housing-census/1836/tuvalu_2022_census_report"
}, {
  label: "Tuvalu Climate Hazards · 2024",
  url: "https://www.tuvaluclimatechange.gov.tv/sites/default/files/documents/TuvaluClimateHazards_Final_30May2024.pdf"
}, {
  label: "ADB · Funafuti Water Supply and Sanitation Project",
  url: "https://pwd.gov.tv/wp-content/uploads/2024/09/53417-002-rrp-en.pdf"
}, {
  label: "NASA · Sea level projections for Pacific islands",
  url: "https://sealevel.nasa.gov/news/265/nasa-un-partnership-gauges-sea-level-threat-to-tuvalu/"
}, {
  label: "OpenStreetMap · map data",
  url: "https://www.openstreetmap.org/copyright"
}];
