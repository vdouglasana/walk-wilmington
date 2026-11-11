"use client"

import Image from "next/image"
import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "motion/react"

/**
 * Vinny's drone shot with red circles where the sidewalk ends, drawn on like
 * someone circling them with a marker. Each loop sits on a real gap, checked up close.
 * Coordinates are in the photo's own pixels (1600 x 1200).
 */
const circles = [
  // past the rail crossing: no sidewalk on the right side, just parking lots and lawn
  { cx: 945, cy: 376, rx: 88, ry: 26, rot: -33 },
  // left side by the trees: the trees come right to the road edge
  { cx: 700, cy: 718, rx: 24, ry: 100, rot: -3 },
  // right side, in front of the gas station lots: open pavement until the sidewalk starts
  { cx: 768, cy: 680, rx: 24, ry: 108, rot: -5 },
  // bottom left: the sidewalk runs out into the bank's parking lot
  { cx: 724, cy: 1128, rx: 28, ry: 70, rot: -14 },
]

// A slightly open, overlapping loop, so it reads as hand-drawn rather than a perfect ellipse
function loop({ cx, cy, rx, ry }: (typeof circles)[number]) {
  const pts: string[] = []
  for (let i = 0; i <= 40; i++) {
    const t = -0.4 + (i / 40) * (Math.PI * 2 + 0.55)
    const wob = 1 + 0.05 * Math.sin(t * 3)
    pts.push(`${(cx + Math.cos(t) * rx * wob).toFixed(1)} ${(cy + Math.sin(t) * ry * wob).toFixed(1)}`)
  }
  return "M" + pts.join("L")
}

export function CircledPhoto() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const show = inView || reduce

  return (
    <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-[0_20px_50px_-25px_rgb(0_0_0/0.45)]">
      <Image
        src="/images/problem-7.jpg"
        alt="Aerial drone view of a busy Wilmington intersection. Red circles mark four spots where the sidewalk ends."
        fill
        sizes="(min-width: 768px) 640px, 100vw"
        className="object-cover"
      />
      <svg aria-hidden viewBox="0 0 1600 1200" className="absolute inset-0 h-full w-full" fill="none">
        {circles.map((c, i) => (
          <motion.path
            key={i}
            d={loop(c)}
            transform={`rotate(${c.rot} ${c.cx} ${c.cy})`}
            stroke="#ef4a37"
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.3 + i * 0.35, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  )
}
