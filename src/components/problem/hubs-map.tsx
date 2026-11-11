"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ArrowLeftIcon, ArrowRightIcon, MousePointerClickIcon } from "lucide-react"

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
  // `picked` is the hub in the card; `hover` only lights it up on the map
  const [hover, setHover] = useState<string | null>(null)
  const [index, setIndex] = useState(0)
  const [toured, setToured] = useState(false)
  const picked = map.hubs[index]?.name ?? ""
  const shown = hover ?? picked
  const focus = map.hubs.find((h) => h.name === shown)
  const lit = (pathId: number) => !focus || focus.paths.includes(pathId)
  const pick = (name: string) => {
    const i = map.hubs.findIndex((h) => h.name === name)
    if (i >= 0) setIndex(i)
    setToured(true)
  }
  const step = (by: number) => {
    setIndex((i) => (i + by + map.hubs.length) % map.hubs.length)
    setToured(true)
  }
  const last = index === map.hubs.length - 1

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start md:gap-10">
      <div className="order-2 md:order-1">
        {/* what's in the hub being looked at. Every hub's details sit in the same spot and
            only one is visible, so the card is always as tall as the longest one and the
            list below never moves. */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="field-label">
              Hub {index + 1} of {map.hubs.length}
            </p>
            <div className="flex gap-1" aria-hidden>
              {map.hubs.map((h, i) => (
                <span
                  key={h.name}
                  className={cn("h-1 w-4 rounded-full transition-colors", i <= index ? "bg-[#e5533f]" : "bg-border")}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 grid" aria-live="polite">
            {map.hubs.map((h) => {
              const on = h.name === picked
              return (
                <div
                  key={h.name}
                  aria-hidden={!on}
                  className={cn(
                    "col-start-1 row-start-1 transition-[opacity,translate] duration-200",
                    on ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
                      <span aria-hidden className="size-2.5 rounded-full" style={{ background: HUB_RED }} />
                      {h.name}
                    </h3>
                    <PathChips paths={h.paths} />
                  </div>
                  <p className="mt-2 text-sm text-pretty text-muted-foreground">{h.blurb}</p>
                  <p className="field-label mt-4">What&apos;s here</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {h.here.map((item) => (
                      <li key={item} className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* step through the hubs */}
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => step(-1)}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <ArrowLeftIcon className="size-4" aria-hidden />
              Back
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="group relative inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {/* a soft pulse until someone starts the tour */}
              {!toured && (
                <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-foreground/30 [animation-duration:1.8s] motion-reduce:hidden" />
              )}
              <span className="relative">{last ? "Start over" : "Next hub"}</span>
              <ArrowRightIcon className="relative size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </button>
          </div>
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
                onClick={() => pick(h.name)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 border-b border-border py-2.5 text-left text-sm transition-colors",
                  picked === h.name ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="size-2 rounded-full transition-transform"
                    style={{ background: HUB_RED, transform: picked === h.name ? "scale(1.6)" : undefined }}
                  />
                  <span className={cn(picked === h.name && "font-semibold", "font-medium")}>{h.name}</span>
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
                  fillOpacity: on ? 0.34 : 0.12,
                  strokeWidth: on ? 3 : 2,
                  strokeOpacity: on ? 1 : 0.6,
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
              opacity={shown === h.name ? 1 : 0.6}
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
