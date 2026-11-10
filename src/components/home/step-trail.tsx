"use client"

import { useEffect, useRef, useState, type RefObject } from "react"
import { ArrowDownIcon } from "lucide-react"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

/**
 * A faint walking trail down the lane beside the steps, linking their badges
 * like waypoints on a route.
 *
 * - It starts at a trailhead circle (same style as the map's trailheads).
 * - The dashed line is the planned route; a muted green line draws along it as you scroll.
 * - When it reaches a step, a soft ring appears around that badge.
 * - Just past the last step it fades out into a small "Keep scrolling" arrow.
 *
 * It finds the badges by their `data-step-badge` attribute and measures where
 * they are, so it lines up at any screen size.
 */

// The trail stays inside the narrow lane under the badges, so it never runs behind text
const WIDTH = 64
const CX = 32 // the trail's center line (lined up with the badge centers)
const WIGGLE = 11
const START = 20 // where the trailhead sits, from the top of the steps
const FADE = 110 // how long the fade-out at the end is

type Layout = { height: number; points: number[]; offsetX: number; end: number }

export function StepTrail({
  containerRef,
  nextHref,
}: {
  containerRef: RefObject<HTMLElement | null>
  nextHref: string
}) {
  const reduce = useReducedMotion()
  const [layout, setLayout] = useState<Layout | null>(null)
  const walked = useRef<SVGPathElement>(null)
  const dot = useRef<SVGGElement>(null)
  const lineLength = useRef(0)

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
      const items = el.querySelectorAll("li")
      const lastText = items[items.length - 1]?.lastElementChild?.getBoundingClientRect()
      const height = Math.round(box.height)
      setLayout({
        height,
        offsetX: Math.round(first.left + first.width / 2 - box.left - CX),
        points: badges.map((b) => {
          const r = b.getBoundingClientRect()
          return Math.round(r.top + r.height / 2 - box.top)
        }),
        // End a little below the last step's text, not at the very bottom of the section
        end: Math.min(height - 40, Math.round((lastText?.bottom ?? box.bottom) - box.top + 70)),
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [containerRef])

  const height = layout?.height ?? 1
  const end = layout?.end ?? 1
  // How much of the line is drawn (0 to 1), from the trailhead to the end
  const drawn = useTransform(scrollYProgress, [START / height, end / height], [0, 1], {
    clamp: true,
  })
  // The arrow shows up as the line gets close to the end
  const arrowOpacity = useTransform(
    scrollYProgress,
    [(end - FADE * 1.6) / height, (end - FADE * 0.4) / height],
    [0, 1],
    { clamp: true }
  )

  // Move the "you are here" dot to the tip of the drawn line
  const placeDot = (v: number) => {
    const p = walked.current
    const g = dot.current
    if (!p || !g) return
    // Measuring a long curve is slow, so do it once and reuse it
    if (!lineLength.current) lineLength.current = p.getTotalLength()
    const pt = p.getPointAtLength(lineLength.current * v)
    g.setAttribute("transform", `translate(${pt.x} ${pt.y})`)
    g.style.opacity = v > 0.005 && v < 0.88 ? "1" : "0"
  }
  useMotionValueEvent(drawn, "change", placeDot)
  useEffect(() => {
    lineLength.current = 0 // the trail's shape changed, so measure it again
    if (layout) placeDot(drawn.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout])

  if (!layout) return null
  const { points, offsetX } = layout

  // From the trailhead, through each badge, to the end.
  // Between stops the line swings a little left and right, like a footpath.
  const stops = [START, ...points, end]
  let d = `M${CX} ${START}`
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1]
    const b = stops[i]
    const side = i % 2 ? 1 : -1
    d += `C${CX + side * WIGGLE} ${a + (b - a) / 3} ${CX - side * WIGGLE} ${a + ((b - a) * 2) / 3} ${CX} ${b}`
  }

  return (
    <>
      <svg
        aria-hidden
        width={WIDTH}
        height={height}
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="pointer-events-none absolute top-0 -z-10"
        style={{ left: offsetX }}
        fill="none"
      >
        <defs>
          {/* fades the trail out over its last stretch */}
          <linearGradient id="trail-fade" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={end - FADE} y2={end}>
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="trail-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={WIDTH} height={height}>
            <rect width={WIDTH} height={height} fill="url(#trail-fade)" />
          </mask>
        </defs>

        <g mask="url(#trail-mask)">
          {/* the trail bed: a soft, wide band like a worn footpath */}
          <path d={d} stroke="var(--foreground)" strokeOpacity={0.05} strokeWidth={14} strokeLinecap="round" />
          {/* planned route: dashed center line */}
          <path
            d={d}
            stroke="var(--foreground)"
            strokeOpacity={0.2}
            strokeWidth={1.5}
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
          {/* walked part, drawn by scrolling, in a muted green so the map stays the focus */}
          <motion.path
            ref={walked}
            d={d}
            stroke="var(--brand-green)"
            strokeOpacity={0.5}
            strokeWidth={2}
            strokeLinecap="round"
            style={{ pathLength: reduce ? 1 : drawn }}
          />
        </g>

        {/* trailhead, styled like the ones on the map */}
        <circle cx={CX} cy={START} r={5.5} fill="var(--band)" />
        <circle cx={CX} cy={START} r={4} fill="var(--background)" stroke="var(--foreground)" strokeOpacity={0.55} strokeWidth={1.5} />

        {points.map((y, i) => (
          <Waypoint key={i} y={y} at={y / height} progress={scrollYProgress} reduce={reduce} />
        ))}

        {!reduce && (
          <g ref={dot} style={{ opacity: 0, transition: "opacity 0.2s" }}>
            <circle r={7} fill="var(--brand-green)" fillOpacity={0.2} />
            <circle r={3.5} fill="var(--brand-green)" stroke="var(--background)" strokeWidth={1.5} />
          </g>
        )}
      </svg>

      {/* Where the trail fades out: a small nudge to keep going */}
      <motion.a
        href={nextHref}
        className="group absolute flex items-center gap-3 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        style={{
          top: end - 18,
          left: offsetX + CX - 18,
          opacity: reduce ? 1 : arrowOpacity,
        }}
      >
        <motion.span
          className="grid size-9 place-items-center rounded-full border border-foreground/15 bg-band text-muted-foreground transition-colors group-hover:border-foreground/30 group-hover:text-foreground"
          animate={reduce ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDownIcon className="size-4" />
        </motion.span>
        <span className="field-label transition-colors group-hover:text-foreground">Keep scrolling</span>
      </motion.a>
    </>
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
      strokeOpacity={0.5}
      strokeWidth={1.25}
      fill="var(--brand-green)"
      fillOpacity={0.08}
      style={
        reduce
          ? undefined
          : { opacity: shown, scale, transformBox: "fill-box", transformOrigin: "center" }
      }
    />
  )
}
