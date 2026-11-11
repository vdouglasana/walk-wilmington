/**
 * Wilmington's hubs that the five paths connect (Fordham Industrial Cluster is left out
 * because no proposed path reaches it).
 *
 * The outlines are traced from Vinny's original Google Earth hubs map. That image was
 * lined up with the real map (using Silver Lake, three ponds, and I-93 as landmarks),
 * so each outline sits where he drew it, within about 30 meters.
 *
 * "What's here" comes from OpenStreetMap, checked against business listings.
 */
export type Hub = {
  name: string
  outline: [number, number][] // [lng, lat]
  paths: number[]
  blurb: string
  here: string[]
  // where the label goes, relative to the middle of the hub (map units)
  label: { dx: number; dy: number; anchor: "start" | "middle" | "end" }
}

export const hubs: Hub[] = [
  {
    name: "North Wilmington",
    outline: [
      [-71.16081, 42.571198], [-71.160257, 42.571577], [-71.159415, 42.570796], [-71.158743, 42.571089],
      [-71.159027, 42.569909], [-71.157147, 42.566732], [-71.1577, 42.566353], [-71.159753, 42.566193],
      [-71.159913, 42.567088], [-71.160717, 42.56715], [-71.160818, 42.569127], [-71.160302, 42.570225],
    ],
    paths: [1],
    blurb: "A commuter rail stop with a cluster of everyday errands around it on Middlesex Ave.",
    here: ["North Wilmington train stop", "RMV office", "Planet Fitness", "Cafes and gas stations", "Whitefield ball field"],
    label: { dx: 16, dy: -8, anchor: "start" },
  },
  {
    name: "Wilmington Crossing",
    outline: [
      [-71.182937, 42.558377], [-71.180556, 42.558819], [-71.180414, 42.558283], [-71.178595, 42.558526],
      [-71.177977, 42.557647], [-71.177273, 42.557311], [-71.177241, 42.556682], [-71.178622, 42.556814],
      [-71.178951, 42.556533], [-71.178708, 42.556271], [-71.176902, 42.554533], [-71.178424, 42.55295],
      [-71.17767, 42.551626], [-71.178689, 42.551411], [-71.180262, 42.553067], [-71.183106, 42.55495],
      [-71.182123, 42.555884], [-71.182644, 42.557127],
    ],
    paths: [2],
    blurb: "The town's biggest shopping plazas, lined up along Main Street (Route 38).",
    here: ["Market Basket", "CVS", "Panera and Starbucks", "Banks", "Ristuccia ice arena"],
    label: { dx: 4, dy: -40, anchor: "middle" },
  },
  {
    name: "Center",
    outline: [
      [-71.168689, 42.556903], [-71.16735, 42.557597], [-71.166012, 42.55649], [-71.163757, 42.55808],
      [-71.160978, 42.556555], [-71.163093, 42.553133], [-71.166595, 42.554454],
    ],
    paths: [1, 2],
    blurb: "Where the town's public life happens: the high school, the library, and the Town Common.",
    here: ["Wilmington High School", "Memorial Library", "Town Common", "Swain Green"],
    label: { dx: 0, dy: -30, anchor: "middle" },
  },
  {
    name: "Center Crossroads",
    outline: [
      [-71.178341, 42.549082], [-71.176787, 42.550036], [-71.174275, 42.550158], [-71.17232, 42.547758],
      [-71.171772, 42.548227], [-71.170505, 42.543589], [-71.171295, 42.543382], [-71.173316, 42.544843],
      [-71.174171, 42.543644], [-71.174912, 42.544699], [-71.175926, 42.544394], [-71.1768, 42.545804],
    ],
    paths: [3, 4],
    blurb: "Wilmington's train station, right where Routes 38 and 62 cross.",
    here: ["Wilmington station (Lowell Line)", "Post office", "Banks and shops", "Apartments by the station"],
    label: { dx: 26, dy: -10, anchor: "start" },
  },
  {
    name: "Yentile Area",
    outline: [
      [-71.169755, 42.542355], [-71.169001, 42.543281], [-71.165732, 42.542042], [-71.166148, 42.541218],
      [-71.164529, 42.540913], [-71.165438, 42.538542],
    ],
    paths: [4, 5],
    blurb: "Shops and car services on Main Street, next door to Yentile Farm's fields and trails.",
    here: ["Colonial Park Mall", "Auto dealers and repair", "Coffee and donuts", "Yentile Farm next door"],
    label: { dx: -24, dy: 14, anchor: "end" },
  },
  {
    name: "Southern Commercial Area",
    outline: [
      [-71.156483, 42.540289], [-71.155459, 42.540414], [-71.154216, 42.540727], [-71.152602, 42.540512],
      [-71.152474, 42.540246], [-71.150865, 42.540121], [-71.150732, 42.539766], [-71.148328, 42.539758],
      [-71.148191, 42.539313], [-71.147034, 42.539082], [-71.146627, 42.537836], [-71.147148, 42.536828],
      [-71.150965, 42.537597], [-71.151135, 42.538672], [-71.156442, 42.53948],
    ],
    paths: [5],
    blurb: "A row of plazas along Lowell Street (Route 129), anchored by a grocery store.",
    here: ["McKinnon's Market", "Eastgate plaza", "American Legion hall", "Restaurants and banks"],
    label: { dx: -10, dy: -26, anchor: "middle" },
  },
  {
    name: "West St. Cluster",
    outline: [
      [-71.143039, 42.539309], [-71.141667, 42.539356], [-71.141525, 42.538821], [-71.137525, 42.538958],
      [-71.137224, 42.539778], [-71.136758, 42.539614], [-71.137356, 42.537883], [-71.142856, 42.537965],
    ],
    paths: [5],
    blurb: "The last stop before the I-93 interchange, where the path has to end.",
    here: ["Windsor Place senior living", "Fast food and gas", "I-93 on-ramp"],
    label: { dx: 16, dy: -22, anchor: "end" },
  },
]
