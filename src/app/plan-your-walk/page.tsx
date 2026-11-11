import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionCue } from "@/components/section-cue"
import { WalkPlanner, type Place, type Trip } from "@/components/plan/walk-planner"
import { makeProjector, projectPaths } from "@/lib/geo"
import { paths } from "@/lib/paths"
import walks from "@/lib/walks.json"

export const metadata: Metadata = {
  title: "Plan Your Walk: Today vs. With the Paths",
  description:
    "Pick two places in Wilmington, MA and compare the walk today with the walk using the five proposed paths: time, distance, and how much of it is along busy roads.",
  alternates: { canonical: "/plan-your-walk" },
}

type RawRoute = { miles: number; busyMiles: number; streetMiles: number; pathMiles: number; segs: { t: string; c: [number, number][] }[] }
type RawWalks = {
  busyPenalty: number
  places: { id: string; name: string; hub: string; c: [number, number] }[]
  pairs: Record<string, { today: RawRoute; paths: RawRoute }>
}

export default function PlanYourWalkPage() {
  const map = projectPaths(520, 30, true)
  const { project } = makeProjector(520, 30, true)
  const data = walks as unknown as RawWalks

  const places: Place[] = data.places.map((p) => ({ id: p.id, name: p.name, hub: p.hub, ...project(p.c) }))

  // turn every route into SVG lines on the same map, plus the box that fits the whole trip
  const trips: Record<string, Trip> = {}
  for (const [key, pair] of Object.entries(data.pairs)) {
    const xs: number[] = []
    const ys: number[] = []
    const conv = (r: RawRoute) => ({
      miles: r.miles,
      busyMiles: r.busyMiles,
      streetMiles: r.streetMiles,
      pathMiles: r.pathMiles,
      segs: r.segs.map((s) => ({
        t: s.t,
        d: s.c
          .map((c, i) => {
            const { x, y } = project(c)
            xs.push(x)
            ys.push(y)
            return `${i ? "L" : "M"}${x} ${y}`
          })
          .join(""),
      })),
    })
    const today = conv(pair.today)
    const withPaths = conv(pair.paths)
    const x = Math.min(...xs)
    const y = Math.min(...ys)
    trips[key] = { today, paths: withPaths, box: { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y } }
  }

  return (
    <>
      <section className="container-page pt-14 pb-8 sm:pt-20 sm:pb-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:items-end md:gap-16">
          <Reveal>
            <p className="field-label flex items-center gap-2">
              <span aria-hidden className="flex gap-1">
                {paths.map((p) => (
                  <span key={p.id} className="size-2 rounded-full" style={{ background: `var(--path-${p.id})` }} />
                ))}
              </span>
              Plan Your Walk
            </p>
            <h1 className="mt-5 text-[clamp(2.6rem,6.5vw,5.25rem)] leading-[0.94] font-semibold tracking-[-0.05em] text-balance">
              Your walk,{" "}
              <span className="text-muted-foreground">today vs. with the paths.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg text-pretty text-muted-foreground">
              Pick where you&apos;re starting and where you&apos;re going. See how long the walk takes
              now, how much of it is along busy roads, and what changes with the five paths.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-10">
          <WalkPlanner map={map} places={places} trips={trips} />
        </Reveal>
        <SectionCue />
      </section>

      {/* how it works, in plain words */}
      <section className="grain bg-band">
        <div className="container-page grid gap-10 py-20 sm:py-28 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
          <Reveal>
            <p className="field-label">How these walks are figured out</p>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance">
              Real streets,{" "}
              <span className="text-muted-foreground">real distances.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="space-y-4 text-pretty text-muted-foreground">
            <p>
              Every walk follows Wilmington&apos;s actual streets from OpenStreetMap. The &ldquo;with the
              paths&rdquo; version adds the five proposed paths, joined to the streets wherever they meet.
            </p>
            <p>
              Each walk is the shortest one, except that a stretch along a busy road (like Main Street,
              Route 62, or Route 129) counts as {data.busyPenalty} times as long. Most people would go a little out of
              their way to stay off a busy road, so sometimes the calmer walk is a bit longer.
            </p>
            <p>
              Times use the same pace as the rest of the site, about 20 minutes per mile. These are
              estimates for comparing, not exact directions.
            </p>
            <Link
              href="/about-contact"
              className="group mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Next: How you can help
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
