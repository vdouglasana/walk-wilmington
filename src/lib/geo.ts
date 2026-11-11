import { paths } from "./paths"
import basemap from "./basemap.json"
import { hubs } from "./hubs"

export type ProjectedPath = {
  id: number
  name: string
  d: string
  trailheads: { label: string; x: number; y: number }[]
  /** where to put the path's number label */
  labelAt: { x: number; y: number }
}

export type Basemap = {
  woods: string
  parks: string
  wetland: string
  water: string
  streams: string
  rail: string
  major: string
  minor: string
}

export type ProjectedHub = {
  name: string
  paths: number[]
  d: string // the hub's shape (a dot, or a stretched pill between two anchors)
  x: number // label anchor point (middle of the hub)
  y: number
  label: { dx: number; dy: number; anchor: "start" | "middle" | "end" }
}

export type ProjectedMap = {
  hubs: ProjectedHub[]
  width: number
  height: number
  paths: ProjectedPath[]
  basemap: Basemap
  /** how many SVG units one mile takes up */
  unitsPerMile: number
}

type LngLat = [number, number]

/**
 * Turns real [lng, lat] coordinates (from the KML and OpenStreetMap) into SVG
 * coordinates. Uses a simple flat projection, which is fine at town scale:
 * longitude is squeezed by cos(latitude) so distances look right.
 */
export function projectPaths(width = 520, padding = 30): ProjectedMap {
  const all = paths.flatMap((p) => [...p.coords, ...p.trailheads.map((t) => t.coord)])
  const lats = all.map((c) => c[1])
  const lngs = all.map((c) => c[0])
  const midLat = (Math.min(...lats) + Math.max(...lats)) / 2
  const k = Math.cos((midLat * Math.PI) / 180)

  const minX = Math.min(...lngs) * k
  const maxX = Math.max(...lngs) * k
  const minY = Math.min(...lats)
  const maxY = Math.max(...lats)

  const scale = (width - padding * 2) / (maxX - minX)
  const height = Math.round((maxY - minY) * scale + padding * 2)

  const project = ([lng, lat]: LngLat) => ({
    x: +((lng * k - minX) * scale + padding).toFixed(1),
    y: +((maxY - lat) * scale + padding).toFixed(1),
  })

  const line = (pts: LngLat[], close = false) =>
    pts
      .map((pt, i) => {
        const { x, y } = project(pt)
        return `${i ? "L" : "M"}${x} ${y}`
      })
      .join("") + (close ? "Z" : "")

  const lines = (list: number[][][]) => list.map((l) => line(l as LngLat[])).join("")
  const areas = (list: number[][][][]) =>
    list.map((rings) => rings.map((r) => line(r as LngLat[], true)).join("")).join("")

  return {
    width,
    height,
    // 1 degree of latitude is about 69 miles
    unitsPerMile: scale / 69,
    hubs: hubs.map((h) => {
      const pts = h.anchors.map((a) => project(a))
      const mid = {
        x: +(pts.reduce((s, p) => s + p.x, 0) / pts.length).toFixed(1),
        y: +(pts.reduce((s, p) => s + p.y, 0) / pts.length).toFixed(1),
      }
      return {
        name: h.name,
        paths: h.paths,
        // a single point becomes a dot (a zero-length line with round caps)
        d: pts.length > 1 ? pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join("") : `M${mid.x} ${mid.y}l0.01 0`,
        ...mid,
        label: h.label,
      }
    }),
    basemap: {
      woods: areas(basemap.woods),
      parks: areas(basemap.parks),
      wetland: areas(basemap.wetland),
      water: areas(basemap.water),
      streams: lines(basemap.streams),
      rail: lines(basemap.rail),
      major: lines(basemap.major),
      minor: lines(basemap.minor),
    },
    paths: paths.map((p) => {
      const pts = p.coords.map(project)
      const mid = pts[Math.floor(pts.length / 2)] ?? { x: 0, y: 0 }
      return {
        id: p.id,
        name: p.name,
        d: pts.map((pt, i) => `${i ? "L" : "M"}${pt.x} ${pt.y}`).join(""),
        trailheads: p.trailheads.map((t) => ({ label: t.label, ...project(t.coord) })),
        labelAt: mid,
      }
    }),
  }
}
