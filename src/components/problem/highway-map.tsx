"use client"

import { useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import type { RouteKey, TownMap } from "@/lib/town-map"

const ROUTES: RouteKey[] = ["38", "62", "129"]
const ns = { vectorEffect: "non-scaling-stroke" as const }

/**
 * Wilmington's town line with the three state routes drawing themselves through it.
 * Hover a route (or its row in the key) to pick it out and see its mileage.
 */
export function HighwayMap({ map }: { map: TownMap }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const [active, setActive] = useState<RouteKey | null>(null)
  const show = inView || reduce

  return (
    <div ref={ref} className="flex h-full flex-col rounded-xl border border-border bg-paper p-3 sm:p-5">
      <div className="flex items-center justify-between pb-2">
        <span className="field-label">Wilmington town line</span>
        <span className="field-label">State routes</span>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-card ring-1 ring-border">
        <svg
          viewBox={`0 0 ${map.width} ${map.height}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Map of Wilmington's town line with Routes 38, 62, and 129 and I-93 running through it. About ${map.stateRouteMiles} miles of state route lie inside the town.`}
        >
          <defs>
            {/* roads get trimmed at the town line */}
            <clipPath id="town-clip">
              <path d={map.boundary} />
            </clipPath>
          </defs>

          {/* town */}
          <path d={map.boundary} className="map-land" style={{ fill: "var(--map-land)" }} />
          <path d={map.water} className="map-water" />
          <path d={map.streams} className="map-stream" strokeWidth={1} {...ns} />
          <path d={map.boundary} fill="none" stroke="var(--foreground)" strokeOpacity={0.45} strokeWidth={1.5} strokeDasharray="6 4" {...ns} />
          <path d={map.rail} className="map-rail" strokeWidth={1.2} strokeDasharray="4 3" {...ns} />

          <g clipPath="url(#town-clip)">
          {/* I-93, drawn quieter: it runs along the east side */}
          <path d={map.i93} fill="none" stroke="var(--foreground)" strokeOpacity={0.22} strokeWidth={6} strokeLinecap="round" {...ns} />

          {/* the three state routes, drawn like roads with a dashed center line */}
          {ROUTES.map((r, i) => {
            const dim = active != null && active !== r
            const on = active === r
            const transition = { duration: reduce ? 0 : 1.4, delay: reduce ? 0 : 0.2 + i * 0.35, ease: [0.65, 0, 0.35, 1] as const }
            return (
              <motion.g
                key={r}
                animate={{ opacity: dim ? 0.25 : 1 }}
                transition={{ duration: 0.25 }}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(r)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                onClick={() => setActive((cur) => (cur === r ? null : r))}
                className="cursor-pointer"
              >
                <path d={map.routes[r]} fill="none" stroke="transparent" strokeWidth={20} {...ns} />
                <motion.path
                  d={map.routes[r]}
                  fill="none"
                  stroke="var(--foreground)"
                  strokeWidth={on ? 9 : 6.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...ns}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: show ? 1 : 0 }}
                  transition={transition}
                />
                <motion.path
                  d={map.routes[r]}
                  fill="none"
                  stroke="var(--card)"
                  strokeWidth={1.2}
                  strokeDasharray="3 4"
                  {...ns}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: show ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: reduce ? 0 : transition.delay + 1.2 }}
                />
              </motion.g>
            )
          })}

          </g>

          {/* route signs */}
          {map.shields.map((s, i) => {
            const interstate = s.route === "93"
            const w = interstate ? 40 : 32
            return (
              <motion.g
                key={s.route}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: show ? (active && active !== s.route ? 0.35 : 1) : 0, scale: show ? 1 : 0.6 }}
                transition={{ duration: 0.35, delay: reduce ? 0 : active ? 0 : 1.4 + i * 0.2 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                className="pointer-events-none"
              >
                <rect x={s.x - w / 2} y={s.y - 16} width={w} height={32} rx={6} fill="var(--card)" stroke={interstate ? "var(--muted-foreground)" : "var(--foreground)"} strokeWidth={2.5} />
                <text x={s.x} y={s.y} dy="0.36em" textAnchor="middle" className="text-[14px] font-semibold tracking-tight" fill={interstate ? "var(--muted-foreground)" : "var(--foreground)"}>
                  {interstate ? "I-93" : s.route}
                </text>
              </motion.g>
            )
          })}
        </svg>
        <span className="pointer-events-none absolute right-2 bottom-1.5 font-mono text-[9px] text-muted-foreground/80">
          © OpenStreetMap contributors
        </span>
      </div>

      {/* key, with each route's miles inside town */}
      <ul className="mt-3 grid grid-cols-3 gap-2" aria-label="Miles of each state route inside Wilmington">
        {ROUTES.map((r) => (
          <li key={r}>
            <button
              type="button"
              onMouseEnter={() => setActive(r)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(r)}
              onBlur={() => setActive(null)}
              className={cn(
                "flex w-full flex-col items-start rounded-lg px-2.5 py-2 text-left transition-colors",
                active === r ? "bg-muted" : "hover:bg-muted/60"
              )}
            >
              <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">Route {r}</span>
              <span className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums">
                {map.miles[r].toFixed(1)} <span className="text-sm font-normal text-muted-foreground">mi</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
