import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon, NavigationIcon } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionCue } from "@/components/section-cue"
import { ExploreMap } from "@/components/maps/explore-map"
import { MapTabs } from "@/components/maps/map-tabs"
import { PathBadge } from "@/components/paths/path-badge"
import { projectPaths } from "@/lib/geo"
import { paths } from "@/lib/paths"

export const metadata: Metadata = {
  title: "Maps: Interactive Map",
  description:
    "Explore all five proposed walking paths in Wilmington, MA on one interactive map, with trailheads at both ends of every path.",
  alternates: { canonical: "/maps" },
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="field-label flex items-center gap-2">
      <span aria-hidden className="flex gap-1">
        {paths.map((p) => (
          <span key={p.id} className="size-2 rounded-full" style={{ background: `var(--path-${p.id})` }} />
        ))}
      </span>
      {children}
    </p>
  )
}

const coord = ([lng, lat]: [number, number]) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`

export default function MapsPage() {
  const map = projectPaths(520, 30, true)
  const info = paths.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    from: p.from,
    to: p.to,
    miles: p.miles,
    minutes: p.minutes,
    surface: p.surface,
  }))

  return (
    <>
      {/* 1. The map */}
      <section className="container-page pt-14 pb-8 sm:pt-20 sm:pb-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] md:items-end md:gap-16">
          <Reveal>
            <Label>Maps</Label>
            <h1 className="mt-5 text-[clamp(2.6rem,6.5vw,5.25rem)] leading-[0.94] font-semibold tracking-[-0.05em] text-balance">
              All five paths{" "}
              <span className="text-muted-foreground">on one map.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg text-pretty text-muted-foreground">
              Click, zoom, and look. Pick a path to fly to it, turn on the hubs, or switch to the
              satellite view to see the real ground.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-10">
          <MapTabs>
            <ExploreMap map={map} info={info} />
          </MapTabs>
        </Reveal>
        <SectionCue />
      </section>

      {/* 2. Trailheads */}
      <section className="grain bg-band">
        <div className="container-page pt-20 pb-20 sm:pt-28 sm:pb-28">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:gap-16">
            <Reveal>
              <p className="field-label">Trailheads</p>
              <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance">
                Ten trailheads,{" "}
                <span className="text-muted-foreground">one at each end.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-lg text-pretty text-muted-foreground">
                Every path has a trailhead at both ends. Want to see where one would start? Get
                directions to the spot.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <article
                  style={{ "--c": `var(--path-${p.id})` } as React.CSSProperties}
                  className="h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <div className="h-1.5 bg-[var(--c)]" aria-hidden />
                  <div className="p-5">
                    <div className="flex items-center gap-2.5">
                      <PathBadge id={p.id} className="size-7 text-xs" />
                      <h3 className="font-semibold tracking-[-0.02em]">
                        <Link href={`/the-paths#${p.slug}`} className="underline-offset-4 hover:underline">
                          {p.name}
                        </Link>
                      </h3>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {p.trailheads.map((t) => {
                        const [lng, lat] = t.coord
                        return (
                          <li key={t.label} className="flex items-center justify-between gap-3 border-t border-border pt-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium">{t.label}</p>
                              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">{coord(t.coord)}</p>
                            </div>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Directions to the ${p.name} ${t.label.toLowerCase()}`}
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[color-mix(in_oklch,var(--c)_14%,var(--card))] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                            >
                              <NavigationIcon className="size-3" aria-hidden />
                              Directions
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}

            {/* the last slot: where to go next */}
            <Reveal delay={0.25}>
              <div className="flex h-full flex-col justify-between rounded-2xl bg-foreground p-6 text-background">
                <p className="text-xl leading-snug font-medium tracking-[-0.02em] text-balance">
                  How long would your walk take with the paths?
                </p>
                <Link
                  href="/plan-your-walk"
                  className="group mt-6 inline-flex items-center gap-2 self-start rounded-full bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  Next: Plan your walk
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
