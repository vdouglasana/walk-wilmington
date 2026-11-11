"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

/**
 * "Linking the Five" as a transit-style line map. The paths share hubs, so they snap
 * together into one route: the main line runs North Wilmington to the West St. Cluster,
 * with Main Street and Rotary Park as branches. The Rotary Park Connector runs from
 * Center Crossroads back up toward the Center, so its branch points that way. The one gap (a short sidewalk link
 * between the Center and Center Crossroads) is drawn dashed.
 *
 * There are two layouts: wide for laptops, tall for phones.
 */
type Station = { name: string; x: number; y: number; big?: boolean; lx: number; ly: number; anchor: "start" | "middle" | "end" }
type Line = { id: number | "gap"; d: string; badge?: [number, number] }
type Layout = { w: number; h: number; stations: Station[]; lines: Line[]; gapLabel: { x: number; y: number; anchor: "start" | "middle" | "end" } }

const wide: Layout = {
  w: 1000,
  h: 222,
  stations: [
    { name: "North Wilmington", x: 70, y: 150, lx: 70, ly: 190, anchor: "middle" },
    { name: "Center", x: 300, y: 150, big: true, lx: 300, ly: 194, anchor: "middle" },
    { name: "Wilmington Crossing", x: 160, y: 60, lx: 160, ly: 30, anchor: "middle" },
    { name: "Center Crossroads", x: 470, y: 150, big: true, lx: 470, ly: 194, anchor: "middle" },
    { name: "Rotary Park trails", x: 385, y: 60, lx: 385, ly: 30, anchor: "middle" },
    { name: "Yentile Area", x: 700, y: 150, big: true, lx: 700, ly: 194, anchor: "middle" },
    { name: "West St. Cluster", x: 930, y: 150, lx: 930, ly: 190, anchor: "middle" },
  ],
  lines: [
    { id: 1, d: "M70 150 L300 150", badge: [185, 150] },
    { id: "gap", d: "M300 150 L470 150" },
    { id: 4, d: "M470 150 L700 150", badge: [585, 150] },
    { id: 5, d: "M700 150 L930 150", badge: [815, 150] },
    { id: 2, d: "M300 150 L300 100 Q300 60 260 60 L160 60", badge: [230, 60] },
    { id: 3, d: "M470 150 L470 100 Q470 60 430 60 L385 60", badge: [470, 112] },
  ],
  gapLabel: { x: 385, y: 128, anchor: "middle" },
}

const tall: Layout = {
  w: 360,
  h: 720,
  stations: [
    { name: "North Wilmington", x: 170, y: 50, lx: 148, ly: 50, anchor: "end" },
    { name: "Center", x: 170, y: 210, big: true, lx: 146, ly: 210, anchor: "end" },
    { name: "Wilmington Crossing", x: 282, y: 210, lx: 282, ly: 180, anchor: "middle" },
    { name: "Center Crossroads", x: 170, y: 350, big: true, lx: 146, ly: 350, anchor: "end" },
    { name: "Rotary Park trails", x: 282, y: 288, lx: 282, ly: 258, anchor: "middle" },
    { name: "Yentile Area", x: 170, y: 510, big: true, lx: 146, ly: 510, anchor: "end" },
    { name: "West St. Cluster", x: 170, y: 670, lx: 148, ly: 670, anchor: "end" },
  ],
  lines: [
    { id: 1, d: "M170 50 L170 210", badge: [170, 130] },
    { id: "gap", d: "M170 210 L170 350" },
    { id: 4, d: "M170 350 L170 510", badge: [170, 430] },
    { id: 5, d: "M170 510 L170 670", badge: [170, 590] },
    { id: 2, d: "M170 210 L282 210", badge: [226, 210] },
    { id: 3, d: "M170 350 L250 350 Q282 350 282 318 L282 288", badge: [222, 350] },
  ],
  gapLabel: { x: 148, y: 280, anchor: "end" },
}

// the order the lines draw in, like walking the chain
const ORDER: (number | "gap")[] = [1, 2, "gap", 3, 4, 5]

function Diagram({ layout, show, reduce, className }: { layout: Layout; show: boolean; reduce: boolean | null; className: string }) {
  const delayOf = (id: number | "gap") => (reduce ? 0 : 0.2 + ORDER.indexOf(id) * 0.28)
  return (
    <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className={className} aria-hidden>
      {/* casings under the colored lines */}
      {layout.lines
        .filter((l) => l.id !== "gap")
        .map((l) => (
          <path key={`c${l.id}`} d={l.d} fill="none" stroke="var(--foreground)" strokeOpacity={0.12} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      {layout.lines.map((l) =>
        l.id === "gap" ? (
          <motion.path
            key="gap"
            d={l.d}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth={4}
            strokeDasharray="2 9"
            strokeLinecap="round"
            initial={false}
            animate={{ opacity: show ? 1 : 0 }}
            transition={{ duration: 0.4, delay: delayOf("gap") }}
          />
        ) : (
          <motion.path
            key={l.id}
            d={l.d}
            fill="none"
            stroke={`var(--path-${l.id})`}
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: show ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: delayOf(l.id), ease: "easeInOut" }}
          />
        )
      )}
      <motion.text
        x={layout.gapLabel.x}
        y={layout.gapLabel.y}
        textAnchor={layout.gapLabel.anchor}
        className="font-mono text-[12px]"
        fill="var(--muted-foreground)"
        initial={false}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.4, delay: delayOf("gap") + 0.2 }}
      >
        short sidewalk link
      </motion.text>

      {/* number badges on each line */}
      {layout.lines.map((l) =>
        l.badge && typeof l.id === "number" ? (
          <motion.g
            key={`b${l.id}`}
            initial={false}
            animate={{ opacity: show ? 1 : 0 }}
            transition={{ duration: 0.3, delay: delayOf(l.id) + 0.35 }}
          >
            <circle cx={l.badge[0]} cy={l.badge[1]} r={12} fill={`var(--path-${l.id})`} stroke="var(--background)" strokeWidth={3} />
            <text x={l.badge[0]} y={l.badge[1]} dy="0.35em" textAnchor="middle" className="font-mono text-[12px] font-semibold" fill={l.id === 1 ? "#1a1a1a" : "#fff"}>
              {l.id}
            </text>
          </motion.g>
        ) : null
      )}

      {/* stations: the shared hubs are bigger, like interchange stops */}
      {layout.stations.map((s) => (
        <g key={s.name}>
          <circle cx={s.x} cy={s.y} r={s.big ? 12 : 9} fill="var(--background)" stroke="var(--foreground)" strokeWidth={s.big ? 4 : 3.5} />
          <text
            x={s.lx}
            y={s.ly}
            dy="0.35em"
            textAnchor={s.anchor}
            className={s.big ? "text-[16px] font-semibold" : "text-[15px] font-medium"}
            fill="var(--foreground)"
          >
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function ChainDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const show = inView || !!reduce
  return (
    <div
      ref={ref}
      role="img"
      aria-label="Diagram of how the five paths link up. Path 1 runs from North Wilmington to the Center. Path 2 branches from the Center to Wilmington Crossing. A short sidewalk link joins the Center to Center Crossroads. Path 3 branches from Center Crossroads back toward the Center, ending at the Rotary Park trails. Path 4 runs from Center Crossroads to the Yentile Area, and Path 5 from the Yentile Area to the West St. Cluster."
    >
      <Diagram layout={wide} show={show} reduce={reduce} className="hidden h-auto w-full md:block" />
      <Diagram layout={tall} show={show} reduce={reduce} className="mx-auto block h-auto w-full max-w-[360px] md:hidden" />
    </div>
  )
}
