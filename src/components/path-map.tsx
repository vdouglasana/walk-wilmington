"use client"

import { memo } from "react"
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"

import type { ProjectedMap, ProjectedPath } from "@/lib/geo"
import { inkOn } from "@/lib/paths"

type Props = {
  map: ProjectedMap
  /** 0 to 1. Drives the drawing. Leave out to show the finished map. */
  progress?: MotionValue<number>
  className?: string
  title?: string
  /** The path that's highlighted (others fade back) */
  activeId?: number | null
  /** Pulse the number badges so people know they can click (until they do) */
  beckon?: boolean
  /** Called when the mouse moves onto (id) or off (null) a path */
  onHover?: (id: number | null) => void
  /** Called when someone clicks or taps a path. Leave both out for a static map. */
  onSelect?: (id: number) => void
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
  active,
  dimmed,
  beckon,
}: {
  p: ProjectedPath
  i: number
  progress?: MotionValue<number>
  reduce: boolean | null
  active: boolean
  dimmed: boolean
  beckon?: boolean
}) {
  const start = DRAW_START + i * DRAW_STEP
  const draw = useRange(progress, [start, start + DRAW_LEN], reduce)
  const visible = useRange(progress, [start, start + 0.005], reduce)
  const label = useRange(progress, [0.56, 0.64], reduce)
  const color = `var(--path-${p.id})`

  return (
    <motion.g
      animate={{ opacity: dimmed ? 0.22 : 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* darker casing under the line, like a printed trail map */}
      <motion.path
        d={p.d}
        fill="none"
        stroke="var(--foreground)"
        strokeOpacity={0.18}
        strokeWidth={active ? 11 : 8}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: draw, opacity: visible }}
      />
      <motion.path
        d={p.d}
        fill="none"
        stroke={color}
        strokeWidth={active ? 7 : 4.5}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: draw, opacity: visible }}
      />
      <motion.g style={{ opacity: label }}>
        {beckon && (
          <circle
            cx={p.labelAt.x}
            cy={p.labelAt.y}
            r={11}
            fill="none"
            stroke={color}
            strokeWidth={2}
            className="beacon"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        )}
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
          fill={inkOn(p.id)}
        >
          {p.id}
        </text>
      </motion.g>
    </motion.g>
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

/**
 * Streets, woods, parks, and water from OpenStreetMap, drawn under the trails.
 * It never changes, so it's memoized and lives in its own <svg> layer: the browser
 * draws it once instead of redrawing thousands of street lines on every scroll frame.
 */
export const BaseLayer = memo(function BaseLayer({ map }: { map: ProjectedMap }) {
  const b = map.basemap
  const ns = { vectorEffect: "non-scaling-stroke" as const }
  return (
    <g aria-hidden>
      <path d={b.wetland} className="map-wetland" fillRule="evenodd" />
      <path d={b.parks} className="map-park" fillRule="evenodd" />
      <path d={b.woods} className="map-wood" fillRule="evenodd" />
      <path d={b.water} className="map-water" fillRule="evenodd" />
      <path d={b.streams} className="map-stream" strokeWidth={1.2} {...ns} />
      <path d={b.minor} className="map-road-minor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" {...ns} />
      <path d={b.major} className="map-road-casing" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" {...ns} />
      <path d={b.major} className="map-road-major" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...ns} />
      <path d={b.rail} className="map-rail" strokeWidth={1.4} strokeDasharray="5 3" {...ns} />
    </g>
  )
})

export function PathMap({
  map,
  progress,
  className,
  title,
  activeId = null,
  beckon = false,
  onHover,
  onSelect,
}: Props) {
  const reduce = useReducedMotion()
  const half = map.unitsPerMile / 2

  const box = `0 0 ${map.width} ${map.height}`

  return (
    <>
      {/* Bottom layer: the basemap (static) */}
      <svg
        viewBox={box}
        className={className}
        overflow="visible"
        aria-hidden
        style={{ willChange: "transform" }}
      >
        <BaseLayer map={map} />
      </svg>

      {/* Top layer: the trails, which draw as you scroll. Same size and viewBox, so they line up. */}
      <svg
      viewBox={box}
      className={className}
      // Let things spill past the edges so the map fills whatever box it sits in
      overflow="visible"
      role="img"
      aria-label={
        title ??
        "Map of Wilmington, MA showing the five proposed walking paths and their trailheads"
      }
    >
      {map.paths.map((p, i) => (
        <MapPath
          key={p.id}
          p={p}
          i={i}
          progress={progress}
          reduce={reduce}
          active={p.id === activeId}
          dimmed={activeId != null && p.id !== activeId}
          beckon={beckon && activeId == null}
        />
      ))}

      {/* A copy of the highlighted path drawn on top, so it's never hidden under another one.
          (Moving the real element to the front would break clicks.) */}
      {activeId != null &&
        map.paths
          .filter((p) => p.id === activeId)
          .map((p) => (
            <g key={p.id} pointerEvents="none">
              <path d={p.d} fill="none" stroke="var(--foreground)" strokeOpacity={0.18} strokeWidth={11} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
              <path d={p.d} fill="none" stroke={`var(--path-${p.id})`} strokeWidth={7} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={p.labelAt.x} cy={p.labelAt.y} r={11} fill={`var(--path-${p.id})`} stroke="var(--background)" strokeWidth={3} />
              <text x={p.labelAt.x} y={p.labelAt.y} dy="0.35em" textAnchor="middle" className="font-mono text-[11px] font-semibold" fill={inkOn(p.id)}>
                {p.id}
              </text>
            </g>
          ))}

      <Trailheads map={map} progress={progress} reduce={reduce} />

      {/* Wide invisible lines on top, so each path is easy to hover or tap. Order never changes. */}
      {onSelect &&
        map.paths.map((p) => (
          <path
            key={p.id}
            d={p.d}
            fill="none"
            stroke="transparent"
            strokeWidth={24}
            vectorEffect="non-scaling-stroke"
            pointerEvents="stroke"
            className="cursor-pointer"
            aria-hidden
            onPointerEnter={(e) => e.pointerType === "mouse" && onHover?.(p.id)}
            onPointerLeave={(e) => e.pointerType === "mouse" && onHover?.(null)}
            onClick={() => onSelect(p.id)}
          />
        ))}

      {/* North arrow */}
      <g
        transform={`translate(${map.width - 26} 30) scale(0.75)`}
        className="font-mono"
        fill="var(--foreground)"
      >
        <circle r={20} cy={2} fill="var(--card)" fillOpacity={0.85} />
        <path d="M0 -14 L6 6 L0 2 L-6 6 Z" />
        <text y={16} textAnchor="middle" className="text-[9px]">
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
    </>
  )
}
