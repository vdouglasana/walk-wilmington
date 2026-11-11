import { ImageResponse } from "next/og"

import { projectPaths } from "@/lib/geo"
import { paths } from "@/lib/paths"

/**
 * The share previews (the picture that shows up when someone texts or posts a link).
 * Every page gets its own, in the site's style: its headline on the left, the real
 * map of the five paths on the right.
 */
export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

const PAPER = "#f4f1ea"
const INK = "#1b1a17"
const MUTED = "#6f6a60"
const HUB_RED = "#e5533f"

type Options = {
  kicker: string
  title: string
  /** the part of the title shown in gray, like the headlines on the site */
  soft?: string
  /** which path to highlight (the others fade), or "hubs" to show the hub outlines */
  focus?: number | "hubs"
}

function mapSvg(focus?: number | "hubs") {
  const map = projectPaths(520, 30, focus === "hubs")
  const lines = map.paths
    .map((p) => {
      const hex = paths.find((x) => x.id === p.id)!.hex
      const dim = typeof focus === "number" && focus !== p.id
      const op = focus === "hubs" ? 0.55 : dim ? 0.2 : 1
      return `<g opacity="${op}"><path d="${p.d}" fill="none" stroke="${INK}" stroke-opacity="0.22" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="${p.d}" fill="none" stroke="${hex}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>`
    })
    .join("")
  const heads = map.paths
    .flatMap((p) => p.trailheads.map((t) => `<circle cx="${t.x}" cy="${t.y}" r="7" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>`))
    .join("")
  const hubs =
    focus === "hubs"
      ? map.hubs.map((h) => `<path d="${h.d}" fill="${HUB_RED}" fill-opacity="0.22" stroke="${HUB_RED}" stroke-width="3" stroke-linejoin="round"/>`).join("")
      : ""
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${map.width} ${map.height}" width="${map.width}" height="${map.height}">${hubs}${lines}${heads}</svg>`
  return { src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, w: map.width, h: map.height }
}

export function ogImage({ kicker, title, soft, focus }: Options) {
  const m = mapSvg(focus)
  const mapH = 540
  const mapW = Math.round((m.w / m.h) * mapH)
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, color: INK, padding: "56px 0 56px 72px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 3, color: MUTED }}>
            <div style={{ display: "flex", gap: 6 }}>
              {paths.map((p) => (
                <div key={p.id} style={{ width: 14, height: 14, borderRadius: 7, background: p.hex }} />
              ))}
            </div>
            {kicker.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 78, lineHeight: 1, letterSpacing: -3 }}>
            <span>{title}</span>
            {soft && <span style={{ color: MUTED, marginTop: 6 }}>{soft}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: MUTED }}>
            <span style={{ color: INK }}>Walk Wilmington</span>
            <span>·</span>
            <span>walkwilmington.com</span>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- this is an image generator, not a page */}
        <img src={m.src} width={mapW} height={mapH} alt="" style={{ marginRight: 40, alignSelf: "center" }} />
      </div>
    ),
    ogSize
  )
}
