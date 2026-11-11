"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { MousePointerClickIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ProjectedMap } from "@/lib/geo"
import { BaseLayer } from "@/components/path-map"

const HUB_RED = "#e5533f"
const ns = { vectorEffect: "non-scaling-stroke" as const }

function PathChips({ paths }: { paths: number[] }) {
  return (
    <span className="flex gap-1" aria-label={`Reached by path ${paths.join(" and ")}`}>
      {paths.map((p) => (
        <span
          key={p}
          className="grid size-5 place-items-center rounded-full font-mono text-[10px] font-semibold"
          style={{ background: `var(--path-${p})`, color: p === 1 ? "#1a1a1a" : "#fff" }}
        >
          {p}
        </span>
      ))}
    </span>
  )
}

/**
 * Wilmington's hubs, traced from Vinny's original Google Earth map, on the real street map
 * with the five paths that would connect them. Hover or tap a hub (on the map or in the
 * list) to see what's there and which paths reach it.
 */
export function HubsMap({ map }: { map: ProjectedMap }) {
  // `hover` follows the mouse; `picked` sticks after a click so the details stay put
  const [hover, setHover] = useState<string | null>(null)
  const [picked, setPicked] = useState<string>(map.hubs[0]?.name ?? "")
  const shown = hover ?? picked
  const info = map.hubs.find((h) => h.name === shown)
  const focus = hover ? map.hubs.find((h) => h.name === hover) : undefined
  const lit = (pathId: number) => !focus || focus.paths.includes(pathId)
  const pick = (name: string) => setPicked(name)

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start md:gap-10">
      <div className="order-2 md:order-1">
        {/* what's in the hub being looked at */}
        <div className="relative min-h-[13.5rem] overflow-hidden rounded-xl border border-border bg-card p-5 sm:min-h-[12.5rem]">
          <AnimatePresence mode="wait" initial={false}>
            {info && (
              <motion.div
                key={info.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                aria-live="polite"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
                    <span aria-hidden className="size-2.5 rounded-full" style={{ background: HUB_RED }} />
                    {info.name}
                  </h3>
                  <PathChips paths={info.paths} />
                </div>
                <p className="mt-2 text-sm text-pretty text-muted-foreground">{info.blurb}</p>
                <p className="field-label mt-4">What&apos;s here</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {info.here.map((item) => (
                    <li key={item} className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* list of hubs */}
        <ul className="mt-4 flex flex-col" aria-label="Wilmington's hubs">
          {map.hubs.map((h) => (
            <li key={h.name}>
              <button
                type="button"
                aria-pressed={picked === h.name}
                onMouseEnter={() => setHover(h.name)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => pick(h.name)}
                onClick={() => pick(h.name)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 border-b border-border py-2.5 text-left text-sm transition-colors",
                  shown === h.name ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="size-2 rounded-full transition-transform"
                    style={{ background: HUB_RED, transform: shown === h.name ? "scale(1.6)" : undefined }}
                  />
                  <span className="font-medium">{h.name}</span>
                </span>
                <PathChips paths={h.paths} />
              </button>
            </li>
          ))}
        </ul>
        <p className="pt-3 font-mono text-[11px] text-muted-foreground">
          Numbers show which proposed paths reach each hub. Red outlines traced from the original Google Earth hubs map.
        </p>
      </div>

      {/* the map */}
      <div className="relative order-1 overflow-hidden rounded-xl map-land ring-1 ring-border md:order-2">
        <svg viewBox={`0 0 ${map.width} ${map.height}`} className="block h-auto w-full" aria-hidden overflow="hidden">
          <BaseLayer map={map} />
        </svg>
        <svg
          viewBox={`0 0 ${map.width} ${map.height}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Map of Wilmington's hubs, outlined in red, and the five proposed paths connecting them"
        >
          {/* the five paths */}
          {map.paths.map((p) => (
            <motion.g key={p.id} animate={{ opacity: lit(p.id) ? 1 : 0.15 }} transition={{ duration: 0.25 }} pointerEvents="none">
              <path d={p.d} fill="none" stroke="var(--foreground)" strokeOpacity={0.2} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" {...ns} />
              <path d={p.d} fill="none" stroke={`var(--path-${p.id})`} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" {...ns} />
            </motion.g>
          ))}

          {/* hubs: red outlines, like the original map */}
          {map.hubs.map((h) => {
            const on = shown === h.name
            return (
              <motion.path
                key={h.name}
                d={h.d}
                stroke={HUB_RED}
                strokeLinejoin="round"
                {...ns}
                initial={false}
                animate={{
                  fillOpacity: on ? 0.32 : focus ? 0.08 : 0.18,
                  strokeWidth: on ? 3 : 2,
                  strokeOpacity: !focus || on ? 1 : 0.45,
                }}
                fill={HUB_RED}
                transition={{ duration: 0.2 }}
                className="cursor-pointer"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHover(h.name)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
                onClick={() => pick(h.name)}
              />
            )
          })}

          {/* labels */}
          {map.hubs.map((h) => (
            <text
              key={h.name}
              x={h.x + h.label.dx}
              y={h.y + h.label.dy}
              dy="0.35em"
              textAnchor={h.label.anchor}
              pointerEvents="none"
              opacity={!focus || shown === h.name ? 1 : 0.45}
              className="text-[11px] font-semibold tracking-tight"
              fill="var(--foreground)"
              stroke="var(--card)"
              strokeWidth={3.5}
              strokeLinejoin="round"
              style={{ paintOrder: "stroke" }}
            >
              {h.name}
            </text>
          ))}
        </svg>

        {/* red label, a nod to the original map */}
        <span className="pointer-events-none absolute top-3 left-3 rounded-md px-2.5 py-1 text-sm font-semibold text-white shadow-md" style={{ background: HUB_RED }}>
          Wilmington&apos;s Hubs
        </span>
        <span className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full border border-border bg-card/95 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm sm:flex">
          <MousePointerClickIcon className="size-3.5" aria-hidden />
          Tap a hub to see what&apos;s there
        </span>
        <span className="pointer-events-none absolute right-2 bottom-1.5 font-mono text-[9px] text-muted-foreground/80">
          © OpenStreetMap contributors
        </span>
      </div>
    </div>
  )
}
