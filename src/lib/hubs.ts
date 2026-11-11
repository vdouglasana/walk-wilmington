/**
 * Wilmington's hubs that the five paths connect (Fordham Industrial Cluster is left out
 * because no proposed path reaches it).
 *
 * Each hub is placed using the real trailhead coordinates from the Google My Maps KML:
 * a path that "connects X to Y" starts or ends at X and Y. Hubs with two anchors are
 * stretched between them (they're long, like Center Crossroads along Main Street).
 * Southern Commercial Area is the southern loop of the Yentile-East Path.
 */
export type Hub = {
  name: string
  anchors: [number, number][] // [lng, lat]
  paths: number[]
  // where the label goes, relative to the hub
  label: { dx: number; dy: number; anchor: "start" | "middle" | "end" }
}

export const hubs: Hub[] = [
  {
    name: "North Wilmington",
    anchors: [[-71.160232, 42.566893]],
    paths: [1],
    label: { dx: 16, dy: 4, anchor: "start" },
  },
  {
    name: "Wilmington Crossing",
    anchors: [[-71.181753, 42.557858]],
    paths: [2],
    label: { dx: 12, dy: -14, anchor: "start" },
  },
  {
    name: "Center",
    anchors: [
      [-71.165078, 42.554102],
      [-71.169921, 42.551167],
    ],
    paths: [1, 2],
    label: { dx: 22, dy: 0, anchor: "start" },
  },
  {
    name: "Center Crossroads",
    anchors: [
      [-71.170972, 42.549863],
      [-71.17371, 42.543153],
    ],
    paths: [3, 4],
    label: { dx: -20, dy: 0, anchor: "end" },
  },
  {
    name: "Yentile Area",
    anchors: [
      [-71.165017, 42.53852],
      [-71.160888, 42.540196],
    ],
    paths: [4, 5],
    label: { dx: -6, dy: 26, anchor: "end" },
  },
  {
    name: "Southern Commercial Area",
    anchors: [[-71.146957, 42.535181]],
    paths: [5],
    label: { dx: -14, dy: 8, anchor: "end" },
  },
  {
    name: "West St. Cluster",
    anchors: [[-71.139754, 42.538758]],
    paths: [5],
    label: { dx: 0, dy: -20, anchor: "end" },
  },
]
