import town from "./town-geo.json"

/**
 * Wilmington's town line plus Routes 38, 62, 129, I-93, rail, and water,
 * from OpenStreetMap, turned into SVG path strings (same flat projection idea as geo.ts).
 * Mileage is measured from the road lines inside the town line.
 */

type LngLat = number[]
export type RouteKey = "38" | "62" | "129"

export type TownMap = {
  width: number
  height: number
  boundary: string
  routes: Record<RouteKey, string>
  i93: string
  rail: string
  water: string
  streams: string
  shields: { route: RouteKey | "93"; x: number; y: number }[]
  miles: Record<RouteKey | "93", number>
  stateRouteMiles: number
}

export function projectTown(width = 520, padding = 26): TownMap {
  const ring = town.boundary as LngLat[]
  const lats = ring.map((c) => c[1])
  const lngs = ring.map((c) => c[0])
  const k = Math.cos((((Math.min(...lats) + Math.max(...lats)) / 2) * Math.PI) / 180)
  const minX = Math.min(...lngs) * k
  const maxX = Math.max(...lngs) * k
  const minY = Math.min(...lats)
  const maxY = Math.max(...lats)
  const scale = (width - padding * 2) / (maxX - minX)
  const height = Math.round((maxY - minY) * scale + padding * 2)
  const pt = ([lng, lat]: LngLat) => ({
    x: +((lng * k - minX) * scale + padding).toFixed(1),
    y: +((maxY - lat) * scale + padding).toFixed(1),
  })
  const line = (pts: LngLat[], close = false) =>
    pts.map((p, i) => `${i ? "L" : "M"}${pt(p).x} ${pt(p).y}`).join("") + (close ? "Z" : "")
  const lines = (list: LngLat[][]) => list.map((l) => line(l)).join("")

  const r = town.routes as Record<string, LngLat[][]>

  // Put each route sign partway along that route's longest piece, at different spots so they don't pile up
  const shieldAt = (key: RouteKey | "93", frac: number) => {
    const longest = [...r[key]].sort((a, b) => b.length - a.length)[0]
    const p = pt(longest[Math.floor(longest.length * frac)])
    return { route: key, ...p }
  }

  return {
    width,
    height,
    boundary: line(ring, true),
    routes: { "38": lines(r["38"]), "62": lines(r["62"]), "129": lines(r["129"]) },
    i93: lines(r["93"]),
    rail: lines(town.rail as LngLat[][]),
    water: (town.water as LngLat[][]).map((w) => line(w, true)).join(""),
    streams: lines(town.streams as LngLat[][]),
    shields: [shieldAt("38", 0.35), shieldAt("62", 0.55), shieldAt("129", 0.3), shieldAt("93", 0.5)],
    miles: town.miles as Record<RouteKey | "93", number>,
    stateRouteMiles: town.stateRouteMiles,
  }
}
