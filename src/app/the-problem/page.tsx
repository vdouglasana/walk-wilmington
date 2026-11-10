import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Reveal } from "@/components/reveal"

export const metadata: Metadata = {
  title: "The Problem: Why Wilmington Is Hard to Walk",
  description:
    "Wilmington grew up around Routes 38, 62, and 129. See why its sidewalks don't connect and why the town's hubs feel far apart on foot.",
  alternates: { canonical: "/the-problem" },
}

/** A state route marker, drawn in CSS so it stays crisp at any size */
function RouteSign({ n }: { n: string }) {
  return (
    <span className="grid aspect-square w-[clamp(4.5rem,9vw,6.5rem)] place-items-center rounded-xl border-[3px] border-foreground bg-card text-[clamp(1.6rem,3.6vw,2.6rem)] font-semibold tracking-[-0.04em] shadow-[0_0_0_4px_var(--card)] ring-1 ring-border">
      {n}
    </span>
  )
}

function Dots() {
  return (
    <span aria-hidden className="flex gap-1">
      <span className="size-2 rounded-full bg-brand-green" />
      <span className="size-2 rounded-full bg-brand-blue" />
    </span>
  )
}

export default function TheProblemPage() {
  return (
    <>
      {/* 1. How Wilmington got this way */}
      <section className="container-page pt-16 pb-20 sm:pt-24 sm:pb-28">
        <Reveal>
          <p className="field-label flex items-center gap-2">
            <Dots />
            The Problem
          </p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.05em] text-balance">
            How Wilmington got this way
          </h1>
        </Reveal>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-end md:gap-16">
          <Reveal className="space-y-5 text-lg text-pretty text-muted-foreground sm:text-xl">
            <p>
              Wilmington isn&apos;t a town with roads running through it. It&apos;s a set of state
              highways with a town built around them. Routes 38, 62, and 129 were built to move
              regional traffic through what is otherwise a residential suburb. That&apos;s why
              walking here looks the way it does.
            </p>
            <p className="text-2xl leading-snug font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
              Nobody designed it badly. Nobody designed it at all.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex gap-3 md:justify-end" >
            <RouteSign n="38" />
            <RouteSign n="62" />
            <RouteSign n="129" />
          </Reveal>
        </div>

        <Reveal className="mt-14 sm:mt-20">
          <figure>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted ring-1 ring-border">
              <Image
                src="/images/problem-1.png"
                alt="Street map of Wilmington, MA with Routes 38, 62, and 129 running through the middle of town, plus I-93 and the commuter rail lines"
                fill
                sizes="(min-width: 1152px) 1088px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex justify-between gap-4 font-mono text-xs text-muted-foreground">
              <span>Routes 38 · 62 · 129</span>
              <span>Wilmington, MA</span>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* 2. A network that isn't a network */}
      <section className="grain bg-band">
        <div className="container-page grid gap-12 py-20 sm:py-28 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
          <Reveal className="md:sticky md:top-28 md:self-start">
            <p className="field-label">Sidewalks</p>
            <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
              A network that isn&apos;t a network
            </h2>
            <p className="mt-6 text-lg text-pretty text-muted-foreground">
              Wilmington has sidewalks. What it doesn&apos;t have is continuity. A sidewalk that
              ends at a property line is not infrastructure, it&apos;s a fragment.
            </p>
            <p className="mt-6 text-2xl leading-snug font-medium tracking-[-0.02em]">
              The problem isn&apos;t quantity, it&apos;s connection.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal className="sm:col-span-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <Image
                  src="/images/problem-7.jpg"
                  alt="Aerial drone view of a busy Wilmington intersection with plazas and parking lots along the road"
                  fill
                  sizes="(min-width: 768px) 600px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <Image
                  src="/images/problem-2.jpg"
                  alt="Aerial drone view of a Wilmington commercial area with large parking lots"
                  fill
                  sizes="(min-width: 768px) 300px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <Image
                  src="/images/problem-3.jpg"
                  alt="Aerial drone view of a Wilmington road lined with businesses and trees"
                  fill
                  sizes="(min-width: 768px) 300px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Wilmington's hubs */}
      <section className="container-page py-20 sm:py-28">
        <Reveal className="max-w-3xl">
          <p className="field-label">Wilmington&apos;s Hubs</p>
          <h2 className="mt-4 text-[clamp(2.4rem,6vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance">
            Close on the map.{" "}
            <span className="text-muted-foreground">Far on foot.</span>
          </h2>
        </Reveal>
        <Reveal className="mt-12 sm:mt-16">
          <figure>
            {/* Cropped a little at the top to hide the Google Earth search bar in the screenshot */}
            <div className="relative aspect-[1572/950] overflow-hidden rounded-xl bg-muted ring-1 ring-border">
              <Image
                src="/images/problem-hubs-map.jpg"
                alt="Aerial map of Wilmington with its hubs outlined in red: North Wilmington, Wilmington Crossing, the Center, Center Crossroads, Fordham Industrial Cluster, Yentile Area, Southern Commercial Area, and West St. Cluster"
                fill
                sizes="(min-width: 1152px) 1088px, 100vw"
                className="object-cover object-bottom"
              />
            </div>
            <figcaption className="mt-3 flex justify-between gap-4 font-mono text-xs text-muted-foreground">
              <span>Hubs outlined in red</span>
              <span>Google Earth</span>
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* 4. The Opportunity */}
      <section className="relative overflow-hidden bg-neutral-900 text-white">
        <Image
          src="/images/home-3.jpg"
          alt="Aerial drone view over Wilmington with woods and neighborhoods between the buildings"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.6),rgb(0_0_0/0.45)_45%,rgb(0_0_0/0.75))]"
        />
        <div className="container-page relative py-24 sm:py-36">
          <Reveal className="max-w-3xl">
            <p className="font-mono text-[0.72rem] tracking-[0.08em] text-white/75 uppercase">
              The Opportunity
            </p>
            <p className="mt-5 text-lg text-pretty text-white/85 sm:text-xl">
              You don&apos;t have to walk along a highway to get across town. Between
              Wilmington&apos;s hubs there are woods, brooks, parks, and back lots. Most of that space
              already exists. What&apos;s missing is a path through it.
            </p>
            <p className="mt-8 text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.08] font-medium tracking-[-0.03em] text-balance">
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
