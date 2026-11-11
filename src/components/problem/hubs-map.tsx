"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import type { ProjectedMap } from "@/lib/geo"
import { BaseLayer } from "@/components/path-map"

const HUB_RED = "#e5533f"
const ns = { vectorEffect: "non-scaling-stroke" as const }

/**
 * Wilmington's hubs on the real street map, with the five paths that would connect them.
 * Hover (or tap) a hub, on the map or in the list, to see which paths reach it.
 */
export function HubsMap({ map }: { map: ProjectedMap }) {
  const [active, setActive] = useState<string | null>(null)
  const hub = map.hubs.find((h) => h.name === active)
  const lit = (pathId: number) => !hub || hub.paths.includes(pathId)

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:items-start md:gap-10">
      {/* list of hubs */}
      <ul className="order-2 flex flex-col md:order-1" aria-label="Wilmington's hubs">
        {map.hubs.map((h) => (
          <li key={h.name}>
            <button
              type="button"
              onMouseEnter={() => setActive(h.name)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(h.name)}
              onBlur={() => setActive(null)}
              onClick={() => setActive((cur) => (cur === h.name ? null : h.name))}
              className={cn(
                "flex w-full items-center justify-between gap-3 border-b border-border py-3 text-left transition-colors",
                active === h.name ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="size-2.5 rounded-full transition-transform"
                  style={{ background: HUB_RED, transform: active === h.name ? "scale(1.5)" : undefined }}
                />
                <span className="font-medium">{h.name}</span>
              </span>
              <span className="flex gap-1" aria-label={`Reached by path ${h.paths.join(" and ")}`}>
                {h.paths.map((p) => (
                  <span
                    key={p}
                    className="grid size-5 place-items-center rounded-full font-mono text-[10px] font-semibold"
                    style={{ background: `var(--path-${p})`, color: p === 1 ? "#1a1a1a" : "#fff" }}
                  >
                    {p}
                  </span>
                ))}
              </span>
            </button>
          </li>
        ))}
        <li className="pt-3 font-mono text-[11px] text-muted-foreground">
          Numbers show which proposed paths reach each hub.
        </li>
      </ul>

      {/* the map */}
      <div className="relative order-1 overflow-hidden rounded-xl map-land ring-1 ring-border md:order-2">
        <svg viewBox={`0 0 ${map.width} ${map.height}`} className="block h-auto w-full" aria-hidden overflow="hidden">
          <BaseLayer map={map} />
        </svg>
        <svg
          viewBox={`0 0 ${map.width} ${map.height}`}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Map of Wilmington's hubs and the five proposed paths connecting them"
        >
          {/* hubs: soft red areas */}
          {map.hubs.map((h) => (
            <motion.path
              key={h.name}
              d={h.d}
              fill="none"
              stroke={HUB_RED}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...ns}
              animate={{ strokeWidth: active === h.name ? 40 : 30, strokeOpacity: !hub || active === h.name ? 0.28 : 0.12 }}
              transition={{ duration: 0.25 }}
              className="cursor-pointer"
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(h.name)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
              onClick={() => setActive((cur) => (cur === h.name ? null : h.name))}
            />
          ))}

          {/* the five paths */}
          {map.paths.map((p) => (
            <motion.g key={p.id} animate={{ opacity: lit(p.id) ? 1 : 0.15 }} transition={{ duration: 0.25 }} pointerEvents="none">
              <path d={p.d} fill="none" stroke="var(--foreground)" strokeOpacity={0.2} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" {...ns} />
              <path d={p.d} fill="none" stroke={`var(--path-${p.id})`} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" {...ns} />
            </motion.g>
          ))}

          {/* hub centers and labels */}
          {map.hubs.map((h) => (
            <g key={h.name} pointerEvents="none" opacity={!hub || active === h.name ? 1 : 0.4}>
              <circle cx={h.x} cy={h.y} r={4} fill={HUB_RED} stroke="var(--card)" strokeWidth={1.5} />
              <text
                x={h.x + h.label.dx}
                y={h.y + h.label.dy}
                dy="0.35em"
                textAnchor={h.label.anchor}
                className="text-[11px] font-semibold tracking-tight"
                fill="var(--foreground)"
                stroke="var(--card)"
                strokeWidth={3.5}
                strokeLinejoin="round"
                style={{ paintOrder: "stroke" }}
              >
                {h.name}
              </text>
            </g>
          ))}
        </svg>

        {/* red label, a nod to the original map */}
        <span className="pointer-events-none absolute top-3 left-3 rounded-md px-2.5 py-1 text-sm font-semibold text-white shadow-md" style={{ background: HUB_RED }}>
          Wilmington&apos;s Hubs
        </span>
        <span className="pointer-events-none absolute right-2 bottom-1.5 font-mono text-[9px] text-muted-foreground/80">
          © OpenStreetMap contributors
        </span>
      </div>
    </div>
  )
}
