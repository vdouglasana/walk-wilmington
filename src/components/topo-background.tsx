/**
 * Faint topographic contour lines, like the background of a hiking map.
 * Drawn from a few made-up "hills". Every fifth ring is a little darker,
 * the way real topo maps mark index contours. Same output every time.
 */

const hills = [
  { x: 210, y: 560, rings: 15, a: 0.4, b: 1.9 },
  { x: 760, y: 150, rings: 14, a: 2.2, b: 0.7 },
  { x: 1120, y: 620, rings: 13, a: 1.1, b: 3.0 },
]
const SPACING = 19

function ring(cx: number, cy: number, r: number, a: number, b: number, k: number) {
  const steps = 72
  let d = ""
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const wobble =
      1 + 0.13 * Math.sin(3 * t + a) + 0.07 * Math.sin(5 * t + b) + 0.035 * Math.sin(2 * t + k * 0.35)
    const x = cx + Math.cos(t) * r * 1.25 * wobble
    const y = cy + Math.sin(t) * r * 0.85 * wobble
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d + "Z"
}

const lines = hills.flatMap((h) =>
  Array.from({ length: h.rings }, (_, i) => ({
    d: ring(h.x, h.y, (i + 1) * SPACING, h.a, h.b, i),
    index: (i + 1) % 5 === 0,
  }))
)

export function TopoBackground({ className, ...rest }: { className?: string; "data-fx"?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1300 760"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      fill="none"
      {...rest}
    >
      {lines.map((l, i) => (
        <path
          key={i}
          d={l.d}
          stroke="var(--foreground)"
          strokeOpacity={l.index ? 0.13 : 0.065}
          strokeWidth={l.index ? 1.4 : 1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
