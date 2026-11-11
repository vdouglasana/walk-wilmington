import type { Metadata } from "next"

import { pageMetadata } from "@/lib/site"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, LandPlotIcon, TreePineIcon, TreesIcon, WavesIcon } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionCue } from "@/components/section-cue"
import { HighwayMap } from "@/components/problem/highway-map"
import { CircledPhoto } from "@/components/problem/circled-photo"
import { HubsMap } from "@/components/problem/hubs-map"
import { projectPaths } from "@/lib/geo"
import { projectTown } from "@/lib/town-map"
import { totalMiles } from "@/lib/paths"

export const metadata: Metadata = pageMetadata({
  title: "The Problem: Why Wilmington Is Hard to Walk",
  description:
    "Wilmington grew up around Routes 38, 62, and 129. See why its sidewalks don't connect and why the town's hubs feel far apart on foot.",
  path: "/the-problem",
})

function Label({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="field-label flex items-center gap-2">
      <span aria-hidden className="flex gap-1">
        <span className="size-2 rounded-full bg-brand-green" />
        <span className="size-2 rounded-full bg-brand-blue" />
      </span>
      {children}
    </p>
  )
}

export default function TheProblemPage() {
  const town = projectTown()
  const pathsMap = projectPaths(520, 30, true)

  return (
    <>
      {/* 1. How Wilmington got this way: the highways drawing through the town line */}
      <section className="container-page pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-16">
          <div>
            <Reveal>
              <Label>The Problem</Label>
              <h1 className="mt-5 text-[clamp(2.8rem,7vw,5.75rem)] leading-[0.92] font-semibold tracking-[-0.05em] text-balance">
                How Wilmington got this way
              </h1>
            </Reveal>
            <Reveal delay={0.08} className="mt-8 space-y-5 text-lg text-pretty text-muted-foreground">
              <p>
                Wilmington isn&apos;t a town with roads running through it. It&apos;s a set of state
                highways with a town built around them. Routes 38, 62, and 129 were built to move
                regional traffic through what is otherwise a residential suburb. That&apos;s why
                walking here looks the way it does.
              </p>
              <p className="border-l-2 border-foreground pl-4 text-2xl leading-snug font-medium tracking-[-0.02em] text-foreground">
                Nobody designed it badly. Nobody designed it at all.
              </p>
            </Reveal>

            {/* Real numbers, measured from the map data */}
            <Reveal delay={0.14}>
              <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
                <div className="bg-background p-4">
                  <dt className="field-label">State routes</dt>
                  <dd className="mt-1.5 text-3xl font-semibold tracking-[-0.04em]">3</dd>
                </div>
                <div className="bg-background p-4">
                  <dt className="field-label">Highway in town</dt>
                  <dd className="mt-1.5 text-3xl font-semibold tracking-[-0.04em] tabular-nums">
                    {town.stateRouteMiles}
                    <span className="ml-1 text-base font-normal text-muted-foreground">mi</span>
                  </dd>
                </div>
                <div className="bg-background p-4">
                  <dt className="field-label">Paths proposed</dt>
                  <dd className="mt-1.5 text-3xl font-semibold tracking-[-0.04em] tabular-nums">
                    {totalMiles}
                    <span className="ml-1 text-base font-normal text-muted-foreground">mi</span>
                  </dd>
                </div>
              </dl>
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                Miles measured along Routes 38, 62, and 129 inside the town line (OpenStreetMap). Shared
                stretches counted once.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <HighwayMap map={town} />
          </Reveal>
        </div>
      </section>

      {/* 2. A network that isn't a network: Vinny's circled drone shot */}
      <section className="grain bg-band">
        <div className="container-page grid gap-12 pt-20 sm:pt-28 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:gap-16">
          <Reveal>
            <figure>
              <CircledPhoto />
              <figcaption className="mt-4 flex items-start gap-2.5 text-sm text-muted-foreground">
                <span aria-hidden className="mt-1 size-3 shrink-0 rounded-full border-2 border-[#ef4a37]" />
                Red circles mark where the sidewalk ends. And this is just one spot in town.
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.08}>
            <Label>Sidewalks</Label>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
              A network that isn&apos;t a network
            </h2>
            <p className="mt-6 text-lg text-pretty text-muted-foreground">
              Wilmington has sidewalks. What it doesn&apos;t have is continuity. A sidewalk that ends at
              a property line is not infrastructure, it&apos;s a fragment.
            </p>
            <p className="mt-6 border-l-2 border-foreground pl-4 text-2xl leading-snug font-medium tracking-[-0.02em]">
              The problem isn&apos;t quantity, it&apos;s connection.
            </p>
          </Reveal>
        </div>
        <SectionCue className="pb-8 sm:pb-10" />
      </section>

      {/* 3. Wilmington's hubs */}
      <section className="container-page pt-20 pb-8 sm:pt-28 sm:pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-3xl">
            <Label>Wilmington&apos;s Hubs</Label>
            <h2 className="mt-4 text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance">
              Close on the map.{" "}
              <span className="text-muted-foreground">Far on foot.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-[-0.04em]">{pathsMap.hubs.length}</span>
            <span className="field-label">hubs, one chain of paths</span>
          </Reveal>
        </div>

        <Reveal className="mt-10 sm:mt-14">
          <HubsMap map={pathsMap} />
        </Reveal>
        <SectionCue />
      </section>

      {/* 4. The Opportunity */}
      <section className="relative overflow-hidden bg-neutral-900 text-white">
        <Image
          src="/images/home-3.jpg"
          alt="Aerial drone view over Wilmington with woods and neighborhoods between the buildings"
          fill
          sizes="100vw"
          quality={60}
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.62),rgb(0_0_0/0.45)_45%,rgb(0_0_0/0.78))]"
        />
        <div className="container-page relative py-24 sm:py-36">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-[0.72rem] tracking-[0.08em] text-white/75 uppercase">The Opportunity</p>
            <p className="mt-5 text-lg text-pretty text-white/85 sm:text-xl">
              You don&apos;t have to walk along a highway to get across town. Between Wilmington&apos;s
              hubs there are woods, brooks, parks, and back lots. Most of that space already exists.
              What&apos;s missing is a path through it.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {[
                { icon: TreePineIcon, label: "Woods" },
                { icon: WavesIcon, label: "Brooks" },
                { icon: TreesIcon, label: "Parks" },
                { icon: LandPlotIcon, label: "Back lots" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm"
                >
                  <Icon className="size-4 text-white/80" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.08] font-medium tracking-[-0.03em] text-balance">
              A walking path doesn&apos;t need a road,{" "}
              <span className="text-white/65">it needs a route.</span>
            </p>
            <Link
              href="/the-paths"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-white/50 focus-visible:outline-none"
            >
              Go to the Paths!
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
