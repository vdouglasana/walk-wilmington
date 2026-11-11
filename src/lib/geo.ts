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
  blurb: string
  here: string[]
  d: string // the hub's outline
  x: number // middle of the hub (where the label is measured from)
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
export function projectPaths(width = 520, padding = 30, withHubs = false): ProjectedMap {
  const all: LngLat[] = paths.flatMap((p) => [...p.coords, ...p.trailheads.map((t) => t.coord)]) as LngLat[]
  // the hubs map also needs room for the hub outlines
  if (withHubs) all.push(...hubs.flatMap((h) => h.outline))
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
      const pts = h.outline.map((a) => project(a))
      // middle of the shape (area-weighted, so long shapes don't skew it)
      let A = 0, cx = 0, cy = 0
      pts.forEach((p, i) => {
        const q = pts[(i + 1) % pts.length]
        const c = p.x * q.y - q.x * p.y
        A += c
        cx += (p.x + q.x) * c
        cy += (p.y + q.y) * c
      })
      return {
        name: h.name,
        paths: h.paths,
        blurb: h.blurb,
        here: h.here,
        d: pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join("") + "Z",
        x: +(cx / (3 * A)).toFixed(1),
        y: +(cy / (3 * A)).toFixed(1),
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
