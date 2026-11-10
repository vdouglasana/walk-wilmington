"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

/**
 * A faint walking trail that runs down behind the steps and links their badges
 * like waypoints. The dashed line is the planned route; the solid line is the
 * "walked" part and draws itself as you scroll. When it reaches a step, a soft
 * ring appears around that step's badge.
 *
 * It finds the badges by their `data-step-badge` attribute and measures where
 * they are, so it lines up at any screen size.
 */

// The trail stays inside the narrow lane under the badges, so it never runs behind text
const WIDTH = 64
const CX = 32 // the trail's center line (lined up with the badge centers)
const WIGGLE = 11

type Layout = { height: number; points: number[]; offsetX: number }

export function StepTrail({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion()
  const [layout, setLayout] = useState<Layout | null>(null)
  const walked = useRef<SVGPathElement>(null)
  const dot = useRef<SVGGElement>(null)

  // Draw so the tip of the line sits a bit above the middle of the screen
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.55", "end 0.55"],
  })

  // Measured after the page is in place (the parent's ref isn't ready any earlier)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const box = el.getBoundingClientRect()
      const badges = [...el.querySelectorAll<HTMLElement>("[data-step-badge]")]
      if (!badges.length) return
      const first = badges[0].getBoundingClientRect()
      setLayout({
        height: Math.round(box.height),
        offsetX: Math.round(first.left + first.width / 2 - box.left - CX),
        points: badges.map((b) => {
          const r = b.getBoundingClientRect()
          return Math.round(r.top + r.height / 2 - box.top)
        }),
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [containerRef])

  // Move the "you are here" dot to the tip of the walked line
  const placeDot = (v: number) => {
    const p = walked.current
    const g = dot.current
    if (!p || !g) return
    const pt = p.getPointAtLength(p.getTotalLength() * Math.min(Math.max(v, 0), 1))
    g.setAttribute("transform", `translate(${pt.x} ${pt.y})`)
    g.style.opacity = v > 0.005 && v < 0.995 ? "1" : "0"
  }
  useMotionValueEvent(scrollYProgress, "change", placeDot)
  useEffect(() => {
    if (layout) placeDot(scrollYProgress.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout])

  if (!layout) return null
  const { height, points, offsetX } = layout

  // Start at the top, pass through each badge, end at the bottom.
  // Between stops the line swings left and right a little, like a footpath.
  const stops = [0, ...points, height]
  let d = `M${CX} 0`
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1]
    const b = stops[i]
    const side = i % 2 ? 1 : -1
    d += `C${CX + side * WIGGLE} ${a + (b - a) / 3} ${CX - side * WIGGLE} ${a + ((b - a) * 2) / 3} ${CX} ${b}`
  }

  return (
    <svg
      aria-hidden
      width={WIDTH}
      height={height}
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="pointer-events-none absolute top-0 -z-10"
      style={{ left: offsetX }}
      fill="none"
    >
      {/* the trail bed: a soft, wide band like a worn footpath */}
      <path
        d={d}
        stroke="var(--foreground)"
        strokeOpacity={0.05}
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* planned route: dashed center line */}
      <path
        d={d}
        stroke="var(--foreground)"
        strokeOpacity={0.2}
        strokeWidth={1.5}
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      {/* walked part, drawn by scrolling, in the same green as the badges */}
      <motion.path
        ref={walked}
        d={d}
        stroke="var(--brand-green)"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ pathLength: reduce ? 1 : scrollYProgress }}
      />
      {points.map((y, i) => (
        <Waypoint
          key={i}
          y={y}
          at={y / height}
          progress={scrollYProgress}
          reduce={reduce}
        />
      ))}
      {!reduce && (
        <g ref={dot} style={{ opacity: 0, transition: "opacity 0.2s" }}>
          <circle r={7} fill="var(--brand-green)" fillOpacity={0.25} />
          <circle r={3.5} fill="var(--brand-green)" stroke="var(--background)" strokeWidth={1.5} />
        </g>
      )}
    </svg>
  )
}

function Waypoint({
  y,
  at,
  progress,
  reduce,
}: {
  y: number
  at: number
  progress: MotionValue<number>
  reduce: boolean | null
}) {
  // The ring fades and grows in right as the line arrives at this step
  const shown = useTransform(progress, [at - 0.03, at], [0, 1], { clamp: true })
  const scale = useTransform(shown, [0, 1], [0.6, 1])
  return (
    <motion.circle
      cx={CX}
      cy={y}
      r={24}
      stroke="var(--brand-green)"
      strokeWidth={1.5}
      fill="var(--brand-green)"
      fillOpacity={0.12}
      style={
        reduce
          ? undefined
          : { opacity: shown, scale, transformBox: "fill-box", transformOrigin: "center" }
      }
    />
  )
}
