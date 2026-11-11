import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, ConstructionIcon, MapIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Reveal } from "@/components/reveal"
import { PathBadge } from "@/components/paths/path-badge"
import { PathJumpBar } from "@/components/paths/jump-bar"
import { LengthStrip } from "@/components/paths/length-strip"
import { PathLocator } from "@/components/paths/path-locator"
import { ChainDiagram } from "@/components/paths/chain-diagram"
import { projectPaths, type ProjectedMap } from "@/lib/geo"
import { paths, totalMiles, type WalkPath } from "@/lib/paths"

export const metadata: Metadata = {
  title: "The Paths: The Five Paths",
  description:
    "Five proposed walking paths from North Wilmington to the West St. Cluster, with maps, lengths, walk times, and what's in the way.",
  alternates: { canonical: "/the-paths" },
}

const SHORT: Record<number, string> = {
  1: "North Wilmington",
  2: "Main Street",
  3: "Rotary Park",
  4: "Butters Row",
  5: "Yentile-East",
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="field-label flex items-center gap-2">
      <span aria-hidden className="flex gap-1">
        <span className="size-2 rounded-full bg-brand-green" />
        <span className="size-2 rounded-full bg-brand-blue" />
      </span>
      {children}
    </p>
  )
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-background p-4">
      <dt className="field-label">{label}</dt>
      <dd className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] tabular-nums">{children}</dd>
    </div>
  )
}

function Unit({ children }: { children: React.ReactNode }) {
  return <span className="ml-1 text-sm font-normal text-muted-foreground">{children}</span>
}

/** One path: the facts on one side, Vinny's Google Earth drawing on the other */
function PathChapter({ p, map, flip }: { p: WalkPath; map: ProjectedMap; flip: boolean }) {
  return (
    <section
      id={p.slug}
      aria-labelledby={`${p.slug}-title`}
      className={cn("scroll-mt-28", flip && "grain bg-paper")}
    >
      <div className="container-page grid gap-10 py-20 sm:py-24 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-14">
        {/* the facts */}
        <Reveal className={cn(flip && "md:order-2")}>
          <div className="flex items-center gap-3">
            <PathBadge id={p.id} className="size-10 text-base" />
            <span className="field-label">
              Path {p.id} of 5 · {p.colorName} on the map
            </span>
          </div>
          <h2
            id={`${p.slug}-title`}
            className="mt-5 text-[clamp(2.1rem,4.6vw,3.5rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance"
          >
            {p.name}
          </h2>
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-lg text-muted-foreground">
            <span className="text-foreground">{p.from}</span>
            <ArrowRightIcon className="size-4" aria-label="to" />
            <span className="text-foreground">{p.to}</span>
          </p>

          <dl className="mt-7 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
            <Stat label="Miles">{p.miles.toFixed(1)}</Stat>
            <Stat label="Minutes">{p.minutes}</Stat>
            <Stat label="Surface">
              <span className="text-lg sm:text-xl">{p.surface}</span>
            </Stat>
          </dl>

          <div className="mt-7 space-y-4 text-pretty text-muted-foreground">
            <p className="text-lg font-medium text-foreground">{p.summary}</p>
            <p className="text-base leading-relaxed">{p.writeup}</p>
          </div>

          {p.inTheWay && (
            <div className="mt-7 rounded-xl border border-dashed border-foreground/25 bg-card p-4">
              <p className="field-label flex items-center gap-2 text-foreground">
                <ConstructionIcon className="size-4" aria-hidden />
                What&apos;s in the way
              </p>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">{p.inTheWay}</p>
            </div>
          )}
        </Reveal>

        {/* the drawing */}
        <Reveal delay={0.08} className={cn("md:sticky md:top-36", flip && "md:order-1")}>
          <figure>
            <div className="relative overflow-hidden rounded-xl bg-muted shadow-[0_20px_50px_-25px_rgb(0_0_0/0.45)] ring-1 ring-border">
              <Image
                src={p.image}
                alt={`Google Earth view of the ${p.name}, drawn as a ${p.colorName.toLowerCase()} line from ${p.from} to ${p.to}, with nearby landmarks labeled.`}
                width={1400}
                height={800}
                sizes="(min-width: 768px) 640px, 100vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-4 flex items-center gap-4">
              <div className="w-24 shrink-0 rounded-lg map-land p-1.5 ring-1 ring-border sm:w-28">
                <PathLocator map={map} id={p.id} className="block h-auto w-full" />
              </div>
              <p className="text-sm text-pretty text-muted-foreground">
                Drawn and measured in Google Earth. The small map shows where it sits among the five paths.
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}

export default function ThePathsPage() {
  const map = projectPaths()
  const minutes = paths.reduce((s, p) => s + p.minutes, 0)
  const paved = paths.filter((p) => p.surface === "Paved")

  return (
    <>
      {/* 1. Intro */}
      <section className="container-page pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:items-end md:gap-16">
          <Reveal>
            <Label>The Paths</Label>
            <h1 className="mt-5 text-[clamp(2.8rem,7vw,5.75rem)] leading-[0.92] font-semibold tracking-[-0.05em] text-balance">
              Five paths. 5.4 miles.{" "}
              <span className="text-muted-foreground">One connected town.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg text-pretty text-muted-foreground">
              Each path uses land that&apos;s already there: woods, brook edges, parks, and back lots.
              Some would be paved, some would be unpaved. All of them would let you get somewhere
              without walking along a major roadway.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-14">
          <LengthStrip segs={paths.map((p) => ({ id: p.id, short: SHORT[p.id], miles: p.miles }))} total={totalMiles} />
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            <Stat label="Paths">{paths.length}</Stat>
            <Stat label="Total length">
              {totalMiles}
              <Unit>mi</Unit>
            </Stat>
            <Stat label="Walk them all">
              {Math.floor(minutes / 60)}
              <Unit>hr</Unit> {minutes % 60}
              <Unit>min</Unit>
            </Stat>
            <Stat label="Paved / unpaved">
              {paved.length}
              <span className="text-muted-foreground"> / {paths.length - paved.length}</span>
            </Stat>
          </dl>
        </Reveal>
      </section>

      {/* 2. Jump between paths */}
      <PathJumpBar items={paths.map((p) => ({ id: p.id, slug: p.slug, short: SHORT[p.id] }))} />

      {/* 3. The five paths */}
      {paths.map((p, i) => (
        <PathChapter key={p.id} p={p} map={map} flip={i % 2 === 1} />
      ))}

      {/* 4. Linking the five */}
      <section className="grain bg-band">
        <div className="container-page pt-20 sm:pt-28">
          <Reveal className="max-w-3xl">
            <Label>Linking the Five</Label>
            <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance">
              Five paths,{" "}
              <span className="text-muted-foreground">one chain.</span>
            </h2>
            <p className="mt-5 text-lg text-pretty text-muted-foreground">
              Because the paths share hubs, the five already form one chain.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-12 rounded-2xl border border-border bg-background/70 p-5 sm:p-8">
            <ChainDiagram />
          </Reveal>

          <Reveal delay={0.1} className="mt-10 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {[
              { ids: [1, 2], text: "North Wilmington Path and Main Street Path both end in the Center" },
              { ids: [3, 4], text: "Rotary Park Connector and Butters Row Path both start at Center Crossroads" },
              { ids: [4, 5], text: "Butters Row Path hands off to Yentile Path in the Yentile Area" },
            ].map((row) => (
              <p key={row.text} className="flex items-start gap-3 text-pretty">
                <span className="mt-0.5 flex -space-x-1">
                  {row.ids.map((id) => (
                    <PathBadge key={id} id={id} className="size-6 text-[11px] ring-2 ring-band" />
                  ))}
                </span>
                {row.text}
              </p>
            ))}
            <p className="flex items-start gap-3 text-pretty">
              <span aria-hidden className="mt-3 h-0 w-11 shrink-0 border-t-[3px] border-dotted border-muted-foreground" />
              The only gap: a short sidewalk link between the Center and Center Crossroads, which happens
              to be suitable for walking.
            </p>
          </Reveal>

          <Reveal className="mt-14 max-w-4xl">
            <p className="text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance">
              That turns five paths into one route,{" "}
              <span className="text-muted-foreground">linking the major hubs of Wilmington together.</span>
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/methodology"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Next: How I picked the paths
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/maps"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-3 text-sm font-medium transition-colors hover:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <MapIcon className="size-4" aria-hidden />
                See them all on the map
              </Link>
            </div>
          </Reveal>
        </div>
        <div className="h-20 sm:h-28" />
      </section>
    </>
  )
}
