"use client"

import { useRef } from "react"
import { motion, useScroll } from "motion/react"

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
              />
              <span className="absolute right-2 bottom-1.5 font-mono text-[9px] text-muted-foreground/80">
                © OpenStreetMap contributors
              </span>
            </div>
            <ul className="mt-3 hidden flex-wrap gap-x-4 gap-y-1.5 sm:flex">
              {paths.map((p) => (
                <li key={p.id} className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                  <span
                    aria-hidden
                    className="h-[3px] w-4 rounded-full"
                    style={{ background: `var(--path-${p.id})` }}
                  />
                  {p.name}
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
