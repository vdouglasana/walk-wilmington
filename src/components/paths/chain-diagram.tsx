"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"
import { inkOn } from "@/lib/paths"

/**
 * "Linking the Five" as a transit-style line map. The paths share hubs, so they snap
 * together into one route: the main line runs North Wilmington to the West St. Cluster,
 * with Main Street as a branch. The one gap is the short sidewalk link (dotted) from the
 * Center down Main Street to Center Crossroads. The Rotary Park trails sit along it, much
 * closer to the Center, and the Rotary Park Connector runs from there to Center
 * Crossroads, alongside the sidewalk.
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
    { name: "North Wilmington", x: 78, y: 150, lx: 78, ly: 190, anchor: "middle" },
    { name: "Center", x: 260, y: 150, big: true, lx: 260, ly: 194, anchor: "middle" },
    { name: "Wilmington Crossing", x: 140, y: 60, lx: 140, ly: 30, anchor: "middle" },
    { name: "Rotary Park trails", x: 350, y: 150, lx: 365, ly: 194, anchor: "middle" },
    { name: "Center Crossroads", x: 560, y: 150, big: true, lx: 560, ly: 194, anchor: "middle" },
    { name: "Yentile Area", x: 760, y: 150, big: true, lx: 760, ly: 194, anchor: "middle" },
    { name: "West St. Cluster", x: 940, y: 150, lx: 940, ly: 190, anchor: "middle" },
  ],
  lines: [
    { id: 1, d: "M78 150 L260 150", badge: [169, 150] },
    { id: "gap", d: "M260 150 L560 150" },
    { id: 3, d: "M350 150 Q350 104 396 104 L514 104 Q560 104 560 150", badge: [455, 104] },
    { id: 4, d: "M560 150 L760 150", badge: [660, 150] },
    { id: 5, d: "M760 150 L940 150", badge: [850, 150] },
    { id: 2, d: "M260 150 L260 100 Q260 60 220 60 L140 60", badge: [200, 60] },
  ],
  gapLabel: { x: 455, y: 170, anchor: "middle" },
}

const tall: Layout = {
  w: 360,
  h: 720,
  stations: [
    { name: "North Wilmington", x: 170, y: 50, lx: 148, ly: 50, anchor: "end" },
    { name: "Center", x: 170, y: 200, big: true, lx: 146, ly: 200, anchor: "end" },
    { name: "Wilmington Crossing", x: 282, y: 200, lx: 282, ly: 170, anchor: "middle" },
    { name: "Rotary Park trails", x: 170, y: 262, lx: 148, ly: 262, anchor: "end" },
    { name: "Center Crossroads", x: 170, y: 400, big: true, lx: 146, ly: 400, anchor: "end" },
    { name: "Yentile Area", x: 170, y: 540, big: true, lx: 146, ly: 540, anchor: "end" },
    { name: "West St. Cluster", x: 170, y: 680, lx: 148, ly: 680, anchor: "end" },
  ],
  lines: [
    { id: 1, d: "M170 50 L170 200", badge: [170, 125] },
    { id: "gap", d: "M170 200 L170 400" },
    { id: 3, d: "M170 262 Q216 262 216 306 L216 356 Q216 400 170 400", badge: [216, 331] },
    { id: 4, d: "M170 400 L170 540", badge: [170, 470] },
    { id: 5, d: "M170 540 L170 680", badge: [170, 610] },
    { id: 2, d: "M170 200 L282 200", badge: [226, 200] },
  ],
  gapLabel: { x: 148, y: 331, anchor: "end" },
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
            <text x={l.badge[0]} y={l.badge[1]} dy="0.35em" textAnchor="middle" className="font-mono text-[12px] font-semibold" fill={inkOn(l.id)}>
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
      aria-label="Diagram of how the five paths link up. Path 1 runs from North Wilmington to the Center. Path 2 branches from the Center to Wilmington Crossing. A short sidewalk link runs from the Center to Center Crossroads, passing the Rotary Park trails close to the Center. Path 3 connects the Rotary Park trails to Center Crossroads, alongside the sidewalk. Path 4 runs from Center Crossroads to the Yentile Area, and Path 5 from the Yentile Area to the West St. Cluster."
    >
      <Diagram layout={wide} show={show} reduce={reduce} className="hidden h-auto w-full md:block" />
      <Diagram layout={tall} show={show} reduce={reduce} className="mx-auto block h-auto w-full max-w-[360px] md:hidden" />
    </div>
  )
}
