import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, CircleDollarSignIcon, LandmarkIcon, MapIcon, TreesIcon, UsersIcon } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionCue } from "@/components/section-cue"
import { MethodSteps } from "@/components/method/method-steps"
import { ElevationProfiles } from "@/components/method/elevation-profiles"
import { projectPaths } from "@/lib/geo"
import { paths } from "@/lib/paths"
import elevation from "@/lib/elevation.json"

export const metadata: Metadata = {
  title: "Methodology: How I Picked the Paths",
  description:
    "How the five paths were chosen: finding Wilmington's hubs, looking for the land between them, and measuring length, walk time, and elevation.",
  alternates: { canonical: "/methodology" },
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

const steps = [
  {
    n: 1,
    title: "Found the hubs",
    body: "Using aerial photos, I outlined the places people actually go: shopping plazas, the town center, train stations, schools, and job clusters.",
  },
  {
    n: 2,
    title: "Looked for the land in between",
    body: "Instead of following the roads, I looked for woods, brook edges, parks, and back lots that already connect the hubs.",
  },
  {
    n: 3,
    title: "Drew and measured each path",
    body: "Every path was drawn in Google Earth and measured for length and walk time.",
  },
  {
    n: 4,
    title: "Checked what's nearby",
    body: "The Tri-Community Greenway in Woburn, Winchester, and Stoneham shows paths like these get built in towns like ours.",
  },
]

type ElevationFile = { source: string; paths: Record<string, { profile: [number, number][]; min: number; max: number; range: number }> }

export default function MethodologyPage() {
  const map = projectPaths(520, 30, true)
  const elev = elevation as unknown as ElevationFile
  const profiles = paths.map((p) => {
    const e = elev.paths[String(p.id)]
    return { id: p.id, name: p.name, points: e.profile, min: e.min, max: e.max, range: e.range }
  })
  const maxMiles = Math.max(2, ...profiles.map((p) => p.points[p.points.length - 1][0]))
  const steepest = [...profiles].sort((a, b) => b.range - a.range)[0]

  return (
    <>
      {/* 1. Intro */}
      <section className="container-page pt-14 pb-4 sm:pt-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:items-end md:gap-16">
          <Reveal>
            <Label>Methodology</Label>
            <h1 className="mt-5 text-[clamp(2.8rem,7vw,5.75rem)] leading-[0.92] font-semibold tracking-[-0.05em] text-balance">
              How I picked{" "}
              <span className="text-muted-foreground">the paths.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg text-pretty text-muted-foreground">
              Four steps, from aerial photos to measured routes. Scroll through them and watch the map
              build itself.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. The four steps, with a map that changes as you read */}
      <section aria-label="The four steps" className="container-page pb-8">
        <MethodSteps steps={steps} map={map} miles={Object.fromEntries(paths.map((p) => [p.id, p.miles]))} />
        <Reveal className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a
            href="https://www.traillink.com/trail/tri-community-greenway"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            More about the Tri-Community Greenway
          </a>
        </Reveal>
        <SectionCue className="pb-4" />
      </section>

      {/* 3. Important findings: elevation */}
      <section className="grain bg-band">
        <div className="container-page pt-20 sm:pt-28">
          <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end md:gap-16">
            <Reveal>
              <Label>Important Findings</Label>
              <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance">
                Hills aren&apos;t{" "}
                <span className="text-muted-foreground">the problem.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-lg text-pretty text-muted-foreground">
                The biggest elevation change on any path is about 43 feet, spread over 2 miles on the
                Yentile-East Path. The rest change by about 24 feet or less. Wilmington is flat enough that
                hills aren&apos;t the problem, allowing for geographic peace of mind when it comes to
                actual path planning.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-12 rounded-2xl border border-border bg-background/80 p-5 sm:p-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="field-label">The ground under each path</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Height above sea level, 75 to 120 ft. Every row uses the same scale. Hover or tap to read it.
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-semibold tracking-[-0.04em] tabular-nums">
                  {Math.round(steepest.range)}
                  <span className="ml-1 text-base font-normal text-muted-foreground">ft</span>
                </p>
                <p className="field-label mt-1">Biggest change, over {steepest.points[steepest.points.length - 1][0].toFixed(1)} mi</p>
              </div>
            </div>
            <ElevationProfiles profiles={profiles} maxMiles={maxMiles} />
            <p className="mt-8 border-t border-border pt-4 text-xs text-pretty text-muted-foreground">
              Checked a second way: ground heights every 40 meters from USGS lidar (the 3D Elevation
              Program). They land within a few feet of the Google Earth measurements. For scale, 40 feet is
              about a four-story building, spread across 2 miles of walking.
            </p>
          </Reveal>
        </div>
        <SectionCue className="pb-8 sm:pb-10" />
      </section>

      {/* 4. Honest limits */}
      <section className="container-page pt-20 pb-8 sm:pt-28 sm:pb-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
          <Reveal>
            <Label>Honest Limits</Label>
            <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance">
              What still{" "}
              <span className="text-muted-foreground">needs to happen.</span>
            </h2>
            <p className="mt-6 text-lg text-pretty text-muted-foreground">
              This is a student project, not an engineering study. Elevation numbers come from Google
              Earth and are approximate. Before any path could be built, the town would need to confirm
              land ownership, check wetland rules with the Conservation Commission, and estimate costs.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="field-label">Before anything gets built</p>
            <ol className="mt-4 grid gap-3">
              {[
                { icon: UsersIcon, title: "Confirm land ownership", text: "Who owns each stretch of woods, brook edge, and back lot." },
                { icon: TreesIcon, title: "Check wetland rules", text: "With the Conservation Commission, for paths near brooks and wet ground." },
                { icon: CircleDollarSignIcon, title: "Estimate costs", text: "Paved and unpaved paths, boardwalks, and crossings all cost different amounts." },
              ].map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-4 rounded-xl border border-dashed border-foreground/25 bg-card p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-medium">
                      <span className="mr-2 font-mono text-xs text-muted-foreground">0{i + 1}</span>
                      {title}
                    </p>
                    <p className="mt-1 text-sm text-pretty text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              href="https://www.wilmingtonma.gov/planning-conservation"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              <LandmarkIcon className="size-4" aria-hidden />
              Wilmington Planning &amp; Conservation
            </a>
          </Reveal>
        </div>
        <SectionCue />
      </section>

      {/* 5. Just me */}
      <section className="grain bg-paper">
        <div className="container-page py-20 sm:py-28">
          <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <Image
              src="/images/method-6.jpg"
              alt="Vinny Anastasia, the Wilmington High School senior behind Walk Wilmington"
              width={400}
              height={400}
              className="size-24 rounded-full object-cover ring-4 ring-background sm:size-28"
            />
            <blockquote className="mt-8 text-[clamp(1.7rem,3.8vw,2.9rem)] leading-[1.12] font-medium tracking-[-0.03em] text-balance">
              &ldquo;This project was just me, my computer, drone, and passion for urban planning, all
              coming together to improve my hometown.&rdquo;
            </blockquote>
            <p className="field-label mt-6">Vinny Anastasia · Wilmington High School</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/maps"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Next: Explore the map
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/the-paths"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-3 text-sm font-medium transition-colors hover:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <MapIcon className="size-4" aria-hidden />
                Back to the paths
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
