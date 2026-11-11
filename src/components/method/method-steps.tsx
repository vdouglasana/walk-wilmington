"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import type { ProjectedMap } from "@/lib/geo"
import { BaseLayer } from "@/components/path-map"

const HUB_RED = "#e5533f"
const ns = { vectorEffect: "non-scaling-stroke" as const }

export type Step = { n: number; title: string; body: string }
type Miles = Record<number, number>

/**
 * The four steps of the method, told with one map that changes as you read:
 * 1. the hubs appear, 2. the green land between them lights up,
 * 3. the paths draw in with their lengths, 4. a nearby greenway shows it's been done.
 */
export function MethodSteps({ steps, map, miles }: { steps: Step[]; map: ProjectedMap; miles: Miles }) {
  const [active, setActive] = useState(1)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const reduce = useReducedMotion()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const t = (d = 0) => ({ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : d, ease: [0.22, 1, 0.36, 1] as const })

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-14">
      {/* the map that changes with each step */}
      <div className="sticky top-16 z-10 self-start md:order-2 md:top-28">
        <div className="relative overflow-hidden rounded-2xl map-land shadow-[0_24px_50px_-30px_rgb(0_0_0/0.5)] ring-1 ring-border">
          <svg viewBox={`0 0 ${map.width} ${map.height}`} className="block h-auto max-h-[42svh] w-full md:max-h-none" role="img" aria-label={`Map for step ${active}: ${steps[active - 1]?.title}`}>
            <motion.g animate={{ opacity: active === 2 ? 0.55 : 1 }} transition={t()}>
              <BaseLayer map={map} />
            </motion.g>

            {/* step 2: the woods, parks, and wetlands between the hubs, lit up green */}
            <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={t()} pointerEvents="none">
              <path d={map.basemap.woods} fill="var(--brand-green)" fillOpacity={0.55} fillRule="evenodd" />
              <path d={map.basemap.parks} fill="var(--brand-green)" fillOpacity={0.7} fillRule="evenodd" />
              <path d={map.basemap.wetland} fill="var(--brand-green)" fillOpacity={0.35} fillRule="evenodd" />
              <path d={map.basemap.streams} fill="none" stroke="var(--brand-blue)" strokeWidth={2} {...ns} />
            </motion.g>

            {/* the paths (step 3 on) */}
            {map.paths.map((p, i) => (
              <g key={p.id} pointerEvents="none">
                <motion.path
                  d={p.d}
                  fill="none"
                  stroke="var(--foreground)"
                  strokeOpacity={0.2}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...ns}
                  initial={false}
                  animate={{ pathLength: active >= 3 ? 1 : 0, opacity: active >= 3 ? 1 : 0 }}
                  transition={t(i * 0.12)}
                />
                <motion.path
                  d={p.d}
                  fill="none"
                  stroke={`var(--path-${p.id})`}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...ns}
                  initial={false}
                  animate={{ pathLength: active >= 3 ? 1 : 0, opacity: active >= 3 ? 1 : 0 }}
                  transition={t(i * 0.12)}
                />
              </g>
            ))}

            {/* the hubs (always there, quieter once the paths arrive) */}
            {map.hubs.map((h) => (
              <motion.path
                key={h.name}
                d={h.d}
                fill={HUB_RED}
                stroke={HUB_RED}
                strokeWidth={2}
                strokeLinejoin="round"
                {...ns}
                initial={false}
                animate={{ fillOpacity: active === 1 ? 0.3 : 0.12, strokeOpacity: active === 1 ? 1 : 0.5, scale: 1 }}
                transition={t()}
              />
            ))}
            {map.hubs.map((h, i) => (
              <motion.text
                key={`l${h.name}`}
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
                initial={false}
                animate={{ opacity: active === 1 ? 1 : 0 }}
                transition={t(active === 1 ? i * 0.06 : 0)}
              >
                {h.name}
              </motion.text>
            ))}

            {/* step 3: each path's measured length */}
            {map.paths.map((p, i) => (
              <motion.g key={`m${p.id}`} initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={t(active === 3 ? 0.5 + i * 0.12 : 0)}>
                <rect x={p.labelAt.x - 24} y={p.labelAt.y - 11} width={48} height={22} rx={11} fill={`var(--path-${p.id})`} stroke="var(--background)" strokeWidth={2.5} {...ns} />
                <text x={p.labelAt.x} y={p.labelAt.y} dy="0.35em" textAnchor="middle" className="font-mono text-[11px] font-semibold" fill={p.id === 1 ? "#1a1a1a" : "#fff"}>
                  {miles[p.id]?.toFixed(1)} mi
                </text>
              </motion.g>
            ))}
          </svg>

          {/* step 4: the greenway next door */}
          <AnimatePresence>
            {active === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={t()}
                className="absolute right-3 bottom-3 max-w-[16rem] rounded-xl border border-border bg-card p-4 shadow-lg"
              >
                <p className="field-label">A few miles south</p>
                <p className="mt-1.5 font-semibold tracking-[-0.02em]">Tri-Community Greenway</p>
                <p className="mt-1 text-sm text-muted-foreground">Woburn, Winchester, and Stoneham</p>
                <p className="mt-2 font-mono text-xs">About 6.5 miles · opened 2019</p>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="pointer-events-none absolute top-3 left-3 rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[10px] shadow-sm">
            Step {active} of {steps.length}
          </span>
        </div>
      </div>

      {/* the steps */}
      <ol className="relative md:order-1">
        {steps.map((s, i) => (
          <li
            key={s.n}
            ref={(el) => {
              refs.current[i] = el
            }}
            data-step={s.n}
            className="flex min-h-[55svh] flex-col justify-center py-10 md:min-h-[70svh]"
          >
            <div
              className={cn(
                "transition-opacity duration-500",
                active === s.n ? "opacity-100" : "opacity-35"
              )}
            >
              <span className="field-label">Step {s.n}</span>
              <h3 className="mt-3 text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.04em]">{s.title}</h3>
              <p className="mt-4 max-w-md text-lg text-pretty text-muted-foreground">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
