import { paths } from "./paths"

export type ProjectedPath = {
  id: number
  name: string
  d: string
  trailheads: { label: string; x: number; y: number }[]
  /** where to put the path's number label */
  labelAt: { x: number; y: number }
}

export type ProjectedMap = {
  width: number
  height: number
  paths: ProjectedPath[]
  /** how many SVG units one mile takes up */
  unitsPerMile: number
}

/**
 * Turns the real [lng, lat] coordinates from the KML into SVG coordinates.
 * Uses a simple flat projection (good enough at town scale): longitude is
 * squeezed by cos(latitude) so distances look right.
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

  const project = ([lng, lat]: [number, number]) => ({
    x: +((lng * k - minX) * scale + padding).toFixed(1),
    y: +((maxY - lat) * scale + padding).toFixed(1),
  })

  return {
    width,
    height,
    // 1 degree of latitude is about 69 miles
    unitsPerMile: scale / 69,
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
