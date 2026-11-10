"use client"

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import type { ProjectedMap, ProjectedPath } from "@/lib/geo"

type Props = {
  map: ProjectedMap
  /** 0 to 1. Drives the drawing. Leave out to show the finished map. */
  progress?: MotionValue<number>
  className?: string
  title?: string
}

// When each path draws, as a share of progress
const DRAW_START = 0.22
const DRAW_STEP = 0.065
const DRAW_LEN = 0.12

function useRange(
  progress: MotionValue<number> | undefined,
  input: [number, number],
  reduce: boolean | null
) {
  // Hooks must always run, so we make a dummy transform when there's no progress
  const value = useTransform(progress ?? FULL, input, [0, 1], { clamp: true })
  return !progress || reduce ? 1 : value
}

// A motion value stand-in that's always "done"
const FULL = { get: () => 1, on: () => () => {} } as unknown as MotionValue<number>

function MapPath({
  p,
  i,
  progress,
  reduce,
}: {
  p: ProjectedPath
  i: number
  progress?: MotionValue<number>
  reduce: boolean | null
}) {
  const start = DRAW_START + i * DRAW_STEP
  const draw = useRange(progress, [start, start + DRAW_LEN], reduce)
  const visible = useRange(progress, [start, start + 0.005], reduce)
  const label = useRange(progress, [0.56, 0.64], reduce)
  const color = `var(--path-${p.id})`

  return (
    <g>
      {/* darker casing under the line, like a printed trail map */}
      <motion.path
        d={p.d}
        fill="none"
        stroke="var(--foreground)"
        strokeOpacity={0.18}
        strokeWidth={8}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: draw, opacity: visible }}
      />
      <motion.path
        d={p.d}
        fill="none"
        stroke={color}
        strokeWidth={4.5}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: draw, opacity: visible }}
      />
      <motion.g style={{ opacity: label }}>
        <circle
          cx={p.labelAt.x}
          cy={p.labelAt.y}
          r={11}
          fill={color}
          stroke="var(--background)"
          strokeWidth={3}
        />
        <text
          x={p.labelAt.x}
          y={p.labelAt.y}
          dy="0.35em"
          textAnchor="middle"
          className="font-mono text-[11px] font-semibold"
          fill={p.id === 1 ? "#1a1a1a" : "#fff"}
        >
          {p.id}
        </text>
      </motion.g>
    </g>
  )
}

function Trailheads({
  map,
  progress,
  reduce,
}: {
  map: ProjectedMap
  progress?: MotionValue<number>
  reduce: boolean | null
}) {
  const show = useRange(progress, [0.04, 0.16], reduce)
  return (
    <motion.g style={{ opacity: show }}>
      {map.paths.flatMap((p) =>
        p.trailheads.map((t) => (
          <g key={`${p.id}-${t.label}`}>
            <circle cx={t.x} cy={t.y} r={5.5} fill="var(--background)" />
            <circle
              cx={t.x}
              cy={t.y}
              r={4}
              fill="var(--background)"
              stroke="var(--foreground)"
              strokeWidth={1.75}
            />
          </g>
        ))
      )}
    </motion.g>
  )
}

export function PathMap({ map, progress, className, title }: Props) {
  const reduce = useReducedMotion()
  const half = map.unitsPerMile / 2

  return (
    <svg
      viewBox={`0 0 ${map.width} ${map.height}`}
      className={className}
      role="img"
      aria-label={
        title ??
        "Map of Wilmington, MA showing the five proposed walking paths and their trailheads"
      }
    >
      <defs>
        <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path
            d="M26 0H0V26"
            fill="none"
            stroke="var(--foreground)"
            strokeOpacity={0.06}
            strokeWidth={1}
          />
        </pattern>
      </defs>
      <rect width={map.width} height={map.height} fill="url(#grid)" />

      {map.paths.map((p, i) => (
        <MapPath key={p.id} p={p} i={i} progress={progress} reduce={reduce} />
      ))}
      <Trailheads map={map} progress={progress} reduce={reduce} />

      {/* North arrow */}
      <g
        transform={`translate(${map.width - 26} 30) scale(0.75)`}
        className="font-mono"
        fill="var(--foreground)"
      >
        <path d="M0 -18 L7 6 L0 1 L-7 6 Z" />
        <text y={24} textAnchor="middle" className="text-[12px]">
          N
        </text>
      </g>

      {/* Scale bar: half a mile */}
      <g
        transform={`translate(18 ${map.height - 16})`}
        className="font-mono"
        fill="var(--foreground)"
      >
        <rect width={half} height={3} fill="var(--foreground)" />
        <rect y={0} width={half / 2} height={3} fill="var(--background)" stroke="var(--foreground)" />
        <text y={-6} className="text-[10px]" fillOpacity={0.7}>
          0.5 mi
        </text>
      </g>
    </svg>
  )
}
