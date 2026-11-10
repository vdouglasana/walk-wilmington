"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRightIcon, XIcon } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react"

import type { ProjectedMap } from "@/lib/geo"
import { paths } from "@/lib/paths"
import { PathMap } from "@/components/path-map"

const steps = [
  {
    n: "01",
    title: "Idea",
    body: "Each route started with Wilmington's busiest areas, or \"hubs,\" and the easiest way to walk between them.",
  },
  {
    n: "02",
    title: "Mapped",
    body: "Each path drawn and measured in Google Earth: length, walk time, and elevation.",
  },
  {
    n: "03",
    title: "Proposed",
    body: "Five walking paths, paved or dirt, using the woods, brooks, and parks that already sit between Wilmington's hubs.",
  },
  {
    n: "04",
    title: "Brought to Wilmington!",
    body: "Neighboring towns already walk on paths like these. Wilmington could be next.",
  },
]

export function HowItWorks({ map }: { map: ProjectedMap }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.9"],
  })
  // Hovering shows a path's card; clicking or tapping keeps it open until closed
  const [hoverId, setHoverId] = useState<number | null>(null)
  const [pinnedId, setPinnedId] = useState<number | null>(null)
  // The map only becomes clickable once the paths have finished drawing
  const [ready, setReady] = useState(false)
  useMotionValueEvent(scrollYProgress, "change", (v) => setReady(v > 0.6))
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(scrollYProgress.get() > 0.6)
  }, [scrollYProgress])

  // A short delay before hiding, so you can move the mouse onto the card to click its link
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hover = (id: number | null) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    if (id === null) hideTimer.current = setTimeout(() => setHoverId(null), 200)
    else setHoverId(id)
  }
  const select = (id: number) => setPinnedId((cur) => (cur === id ? null : id))
  const close = () => {
    setPinnedId(null)
    setHoverId(null)
  }

  const activeId = ready ? (hoverId ?? pinnedId) : null
  const active = paths.find((p) => p.id === activeId)
  // Put the details card on the opposite side of the map from the path, so it doesn't cover it
  const activeGeo = map.paths.find((p) => p.id === activeId)
  const cardOnTop = activeGeo ? activeGeo.labelAt.y / map.height > 0.5 : false
  // The "tap a path" hint shows up once the paths have drawn
  const hintOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])

  return (
    <section aria-labelledby="overview" className="bg-band">
     <div className="container-page py-20 sm:py-28">
      <div className="max-w-3xl">
        <p className="field-label flex items-center gap-2" id="overview">
          <span aria-hidden className="flex gap-1">
            <span className="size-2 rounded-full bg-brand-green" />
            <span className="size-2 rounded-full bg-brand-blue" />
          </span>
          A Quick Overview
        </p>
        <p className="mt-5 text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.08] font-medium tracking-[-0.03em] text-balance">
          Five paths. One question:{" "}
          <span className="text-muted-foreground">
            what if you could cross town without walking along a major roadway?
          </span>
        </p>
      </div>

      <div
        ref={ref}
        className="mt-16 grid gap-x-16 md:mt-24 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        {/* Map: sticky so it stays put while the steps scroll past */}
        <div className="sticky top-14 z-10 -mx-5 bg-band/95 px-5 pt-3 pb-4 backdrop-blur-sm sm:-mx-8 sm:px-8 md:order-2 md:top-24 md:mx-0 md:h-[calc(100svh-8rem)] md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div className="flex h-full flex-col rounded-xl border border-border bg-paper p-3 sm:p-5">
            <div className="flex items-center justify-between pb-2">
              <span className="field-label">Wilmington, MA</span>
              <span className="field-label">5 paths · 5.4 mi</span>
            </div>
            <div className="relative h-[44svh] overflow-hidden rounded-lg map-land ring-1 ring-border md:h-auto md:min-h-0 md:flex-1">
              <PathMap
                map={map}
                progress={scrollYProgress}
                className="absolute inset-0 h-full w-full"
                activeId={activeId}
                onHover={ready ? hover : undefined}
                onSelect={ready ? select : undefined}
              />
              <span className="pointer-events-none absolute right-2 bottom-1.5 font-mono text-[9px] text-muted-foreground/80">
                © OpenStreetMap contributors
              </span>

              <AnimatePresence>
                {!active && (
                  <motion.span
                    key="hint"
                    style={{ opacity: hintOpacity }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 font-mono text-[10px] text-muted-foreground shadow-sm ring-1 ring-border backdrop-blur-sm"
                  >
                    <span className="relative flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-brand-green motion-reduce:animate-none" />
                      <span className="relative size-1.5 rounded-full bg-brand-green" />
                    </span>
                    Hover or tap a path to explore
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Details card for the highlighted path */}
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className={`absolute inset-x-2.5 ${cardOnTop ? "top-2.5" : "bottom-6"} overflow-hidden rounded-lg bg-card/95 shadow-lg ring-1 ring-border backdrop-blur-sm sm:right-auto sm:w-72`}
                    aria-live="polite"
                    onMouseEnter={() => hover(active.id)}
                    onMouseLeave={() => hover(null)}
                  >
                    <div className="h-1" style={{ background: `var(--path-${active.id})` }} />
                    <div className="p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="field-label">Path {active.id} of 5</p>
                          <p className="mt-1 font-semibold tracking-tight">{active.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={close}
                          aria-label="Close path details"
                          className="-m-1 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <XIcon className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {active.from} → {active.to}
                      </p>
                      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 font-mono text-[11px]">
                        <div>
                          <dt className="text-muted-foreground">Length</dt>
                          <dd className="mt-0.5 font-medium">{active.miles.toFixed(1)} mi</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Walk</dt>
                          <dd className="mt-0.5 font-medium">{active.minutes} min</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Surface</dt>
                          <dd className="mt-0.5 font-medium">{active.surface}</dd>
                        </div>
                      </dl>
                      <Link
                        href={`/the-paths#${active.slug}`}
                        className="group mt-3 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
                      >
                        See this path
                        <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ul className="mt-3 hidden flex-wrap gap-x-1 gap-y-1 sm:flex" aria-label="Paths on the map">
              {paths.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseEnter={() => hover(p.id)}
                    onMouseLeave={() => hover(null)}
                    onFocus={() => hover(p.id)}
                    onBlur={() => hover(null)}
                    onClick={() => select(p.id)}
                    aria-pressed={pinnedId === p.id}
                    className="flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
                  >
                    <span
                      aria-hidden
                      className="h-[3px] w-4 rounded-full"
                      style={{ background: `var(--path-${p.id})` }}
                    />
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="md:order-1">
          {steps.map((s) => (
            <motion.li
              key={s.n}
              className="flex min-h-[55svh] flex-col justify-center border-t border-foreground/10 py-10 md:min-h-[78svh]"
              initial={{ opacity: 0.25 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.6 }}
              transition={{ duration: 0.4 }}
            >
              <p className="flex items-center gap-2.5">
                <span className="inline-grid size-8 place-items-center rounded-full bg-brand-green font-mono text-xs font-semibold text-[#14320a]">
                  {s.n}
                </span>
                <span className="field-label">Step {Number(s.n)} of 4</span>
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                {s.title}
              </h3>
              <p className="mt-4 max-w-md text-lg text-pretty text-muted-foreground">
                {s.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
     </div>
    </section>
  )
}
