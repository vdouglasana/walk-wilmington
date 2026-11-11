"use client"

import { useRef, useState } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { PathBadge } from "@/components/paths/path-badge"

type Profile = { id: number; name: string; points: [number, number][]; min: number; max: number; range: number }

const FT_MIN = 75
const FT_MAX = 120
const ROW_H = 84 // chart height per path, in px of the SVG

/**
 * The ground under each path, from start to finish. Every row uses the same scale
 * (same feet top to bottom, same miles left to right), so a longer path is a wider
 * row and a hillier path has a taller shape. Hover or touch a row to read it.
 */
export function ElevationProfiles({ profiles, maxMiles }: { profiles: Profile[]; maxMiles: number }) {
  const reduce = useReducedMotion()
  return (
    <div>
      <div className="space-y-5">
        {profiles.map((p, i) => (
          <Row key={p.id} p={p} i={i} maxMiles={maxMiles} reduce={reduce} />
        ))}
      </div>
      {/* shared scale for all rows */}
      <div className="mt-4 grid grid-cols-[9.5rem_minmax(0,1fr)] gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <span />
        <div className="relative h-4 font-mono text-[10px] text-muted-foreground">
          {[0, 0.5, 1, 1.5, 2].map((m) => (
            <span
              key={m}
              className="absolute top-0 whitespace-nowrap"
              style={{ left: `${(m / maxMiles) * 100}%`, transform: m === 0 ? undefined : "translateX(-50%)" }}
            >
              {m} mi
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Row({ p, i, maxMiles, reduce }: { p: Profile; i: number; maxMiles: number; reduce: boolean | null }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const show = inView || !!reduce
  const len = p.points[p.points.length - 1][0]
  const W = 1000 // the full 0 to maxMiles width
  const x = (mi: number) => (mi / maxMiles) * W
  const y = (ft: number) => ROW_H - ((ft - FT_MIN) / (FT_MAX - FT_MIN)) * ROW_H
  const line = p.points.map(([mi, ft], k) => `${k ? "L" : "M"}${x(mi).toFixed(1)} ${y(ft).toFixed(1)}`).join("")
  const area = `${line}L${x(len).toFixed(1)} ${ROW_H}L0 ${ROW_H}Z`
  const hp = hoverIdx != null ? p.points[hoverIdx] : null

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const mi = ((e.clientX - r.left) / r.width) * len
    let best = 0
    p.points.forEach(([m], k) => {
      if (Math.abs(m - mi) < Math.abs(p.points[best][0] - mi)) best = k
    })
    setHoverIdx(best)
  }

  return (
    <div className="grid grid-cols-[9.5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
      <div className="flex items-start gap-2.5">
        <PathBadge id={p.id} className="mt-0.5 size-6 text-[11px]" />
        <div className="min-w-0">
          <p className="text-sm leading-tight font-medium">{p.name}</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground tabular-nums">
            {Math.round(p.range)} ft change
          </p>
        </div>
      </div>

      <div ref={ref} className="relative">
        <svg viewBox={`0 0 ${W} ${ROW_H}`} preserveAspectRatio="none" className="block h-[84px] w-full overflow-visible" role="img" aria-label={`${p.name}: ground height from ${Math.round(p.min)} to ${Math.round(p.max)} feet above sea level over ${len.toFixed(1)} miles`}>
          {/* recessive guide lines at 80, 100, 120 ft */}
          {[80, 100, 120].map((ft) => (
            <line key={ft} x1={0} x2={W} y1={y(ft)} y2={y(ft)} stroke="var(--border)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
          <motion.g
            initial={false}
            animate={{ clipPath: show ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
            transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d={area} fill={`var(--path-${p.id})`} fillOpacity={0.28} />
            <path d={line} fill="none" stroke="var(--foreground)" strokeOpacity={0.25} strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            <path d={line} fill="none" stroke={`var(--path-${p.id})`} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </motion.g>
          {hp && (
            <line x1={x(hp[0])} x2={x(hp[0])} y1={0} y2={ROW_H} stroke="var(--foreground)" strokeOpacity={0.5} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          )}
          {/* hit area: a bit taller than the chart */}
          <rect
            x={0}
            y={-8}
            width={x(len)}
            height={ROW_H + 16}
            fill="transparent"
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setHoverIdx(null)}
          />
        </svg>
        {hp && (
          <div
            className="pointer-events-none absolute -top-9 z-10 -translate-x-1/2 rounded-md border border-border bg-card px-2 py-1 font-mono text-[11px] whitespace-nowrap shadow-md tabular-nums"
            style={{ left: `${(hp[0] / maxMiles) * 100}%` }}
          >
            {hp[0].toFixed(2)} mi · {Math.round(hp[1])} ft
          </div>
        )}
      </div>
    </div>
  )
}
