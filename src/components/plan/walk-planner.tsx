"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowUpDownIcon, CheckIcon, LinkIcon, MapPinIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ProjectedMap } from "@/lib/geo"
import { BaseLayer } from "@/components/path-map"

export type Place = { id: string; name: string; hub: string; x: number; y: number }
export type Seg = { t: string; d: string }
export type Route = { miles: number; busyMiles: number; streetMiles: number; pathMiles: number; segs: Seg[] }
export type Trip = { today: Route; paths: Route; box: { x: number; y: number; w: number; h: number } }
type Box = Trip["box"]

const MIN_PER_MILE = 20 // the same pace as the walk times on the rest of the site
const BUSY = "#d9442f"
const ns = { vectorEffect: "non-scaling-stroke" as const }
const mins = (mi: number) => Math.round(mi * MIN_PER_MILE)

const PRESETS = [
  { label: "Whitefield to the high school", from: "whitefield", to: "high-school" },
  { label: "Train to the library", from: "nw-station", to: "library" },
  { label: "Ice arena to the post office", from: "ristuccia", to: "post-office" },
  { label: "Market Basket to Rotary Park", from: "market-basket", to: "rotary-park" },
  { label: "CVS to the post office", from: "cvs", to: "post-office" },
]

/** One plain-language sentence about what the paths change for this trip */
function verdict(t: Route, p: Route) {
  const faster = mins(t.miles) - mins(p.miles)
  const calmer = mins(t.busyMiles) - mins(p.busyMiles)
  if (p.pathMiles < 0.05) return { tone: "flat", text: `The five paths don't really change this trip. It's a ${mins(t.miles)}-minute walk either way.` }
  if (faster >= 1 && calmer >= 1) return { tone: "good", text: `${faster} minutes faster, and ${calmer} fewer minutes walking along busy roads.` }
  if (faster >= 1) return { tone: "good", text: `${faster} minutes faster, with ${mins(p.pathMiles)} minutes on the new paths.` }
  if (calmer >= 1 && faster <= -2)
    return { tone: "trade", text: `${-faster} minutes longer, but ${calmer} fewer minutes along busy roads. The quiet way around.` }
  if (calmer >= 1) return { tone: "good", text: `About the same time, with ${calmer} fewer minutes walking along busy roads.` }
  return { tone: "flat", text: "About the same either way. The paths help more on other trips." }
}

export function WalkPlanner({ map, places, trips }: { map: ProjectedMap; places: Place[]; trips: Record<string, Trip> }) {
  const [from, setFrom] = useState("whitefield")
  const [to, setTo] = useState("high-school")
  const [view, setView] = useState<"paths" | "today">("paths")
  const [copied, setCopied] = useState(false)
  const reduce = useReducedMotion()

  // start from a shared link (?from=...&to=...) if there is one
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const f = q.get("from")
    const t = q.get("to")
    const ok = (id: string | null) => !!id && places.some((p) => p.id === id)
    if (ok(f) && ok(t) && f !== t) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on load
      setFrom(f!)
      setTo(t!)
    }
  }, [places])

  const pick = (f: string, t: string) => {
    setFrom(f)
    setTo(t)
    const url = new URL(window.location.href)
    url.searchParams.set("from", f)
    url.searchParams.set("to", t)
    history.replaceState(null, "", url)
  }

  // each trip is stored once (A to B); going B to A is the same walk
  const trip = trips[`${from}|${to}`] ?? trips[`${to}|${from}`]
  const a = places.find((p) => p.id === from)!
  const b = places.find((p) => p.id === to)!
  const v = trip ? verdict(trip.today, trip.paths) : null

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("Copy this link:", window.location.href)
    }
  }

  return (
    <div>
      {/* the trip picker, styled like a trail pass */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <PlaceSelect label="From" dot="A" value={from} places={places} disabled={to} onChange={(id) => pick(id, to)} />
          <button
            type="button"
            onClick={() => pick(to, from)}
            aria-label="Swap start and end"
            className="mx-auto grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:mb-0.5"
          >
            <ArrowUpDownIcon className="size-4 sm:rotate-90" />
          </button>
          <PlaceSelect label="To" dot="B" value={to} places={places} disabled={from} onChange={(id) => pick(from, id)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-dashed border-border pt-4">
          <span className="field-label mr-1 self-center">Try</span>
          {PRESETS.map((p) => {
            const on = (from === p.from && to === p.to) || (from === p.to && to === p.from)
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => pick(p.from, p.to)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  on ? "border-foreground bg-foreground text-background" : "border-border hover:bg-muted"
                )}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {trip && v && (
        <>
          {/* the verdict */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={`${from}|${to}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              aria-live="polite"
              className="mt-10 max-w-3xl text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.12] font-medium tracking-[-0.03em] text-balance"
            >
              <span className="text-muted-foreground">
                {a.name} to {b.name}:{" "}
              </span>
              {v.text}
            </motion.p>
          </AnimatePresence>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            {/* the two cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <RouteCard
                title="Today"
                note="Along the streets as they are now"
                r={trip.today}
                selected={view === "today"}
                onSelect={() => setView("today")}
              />
              <RouteCard
                title="With the paths"
                note="Using the five proposed paths where they help"
                r={trip.paths}
                selected={view === "paths"}
                onSelect={() => setView("paths")}
                highlight
              />
              <button
                type="button"
                onClick={share}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-4 py-2.5 text-sm font-medium transition-colors hover:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:col-span-2 lg:col-span-1"
              >
                {copied ? <CheckIcon className="size-4" aria-hidden /> : <LinkIcon className="size-4" aria-hidden />}
                <span aria-live="polite">{copied ? "Link copied!" : "Copy a link to this trip"}</span>
              </button>
            </div>

            {/* the map */}
            <RouteMap map={map} trip={trip} view={view} a={a} b={b} reduce={reduce} onView={setView} />
          </div>
        </>
      )}
    </div>
  )
}

function PlaceSelect({
  label,
  dot,
  value,
  places,
  disabled,
  onChange,
}: {
  label: string
  dot: string
  value: string
  places: Place[]
  disabled: string
  onChange: (id: string) => void
}) {
  // group the places by hub, so the list reads like the map
  const hubs = [...new Set(places.map((p) => p.hub))]
  return (
    <label className="block">
      <span className="field-label flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-full bg-foreground font-mono text-[10px] text-background">{dot}</span>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base font-medium focus-visible:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
      >
        {hubs.map((h) => (
          <optgroup key={h} label={h}>
            {places
              .filter((p) => p.hub === h)
              .map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === disabled}>
                  {p.name}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
}

function RouteCard({
  title,
  note,
  r,
  selected,
  onSelect,
  highlight,
}: {
  title: string
  note: string
  r: Route
  selected: boolean
  onSelect: () => void
  highlight?: boolean
}) {
  const total = r.busyMiles + r.streetMiles + r.pathMiles || 1
  const parts = [
    { key: "busy", label: "Busy roads", mi: r.busyMiles, color: BUSY },
    { key: "street", label: "Quiet streets", mi: r.streetMiles, color: "var(--muted-foreground)" },
    { key: "path", label: "New paths", mi: r.pathMiles, color: "var(--brand-green)" },
  ]
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-2xl border bg-card p-5 text-left transition-[border-color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        selected ? "border-foreground shadow-md" : "border-border hover:border-foreground/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn("font-semibold tracking-[-0.02em]", highlight && "text-foreground")}>{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
        </div>
        <span className={cn("mt-0.5 size-3 shrink-0 rounded-full border-2", selected ? "border-foreground bg-foreground" : "border-border")} aria-hidden />
      </div>
      <div className="mt-4 flex items-baseline gap-4">
        <p className="text-4xl font-semibold tracking-[-0.04em] tabular-nums">
          {mins(r.miles)}
          <span className="ml-1 text-base font-normal text-muted-foreground">min</span>
        </p>
        <p className="font-mono text-sm text-muted-foreground tabular-nums">{r.miles.toFixed(2)} mi</p>
      </div>
      {/* how the walk splits up */}
      <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden>
        {parts.map((p) =>
          p.mi > 0.005 ? <span key={p.key} style={{ flexGrow: p.mi / total, flexBasis: 0, background: p.color }} className="h-full" /> : null
        )}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
        {parts.map((p) => (
          <div key={p.key}>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ background: p.color }} aria-hidden />
              {p.label}
            </dt>
            <dd className="mt-0.5 font-mono tabular-nums">{mins(p.mi)} min</dd>
          </div>
        ))}
      </dl>
    </button>
  )
}

function RouteMap({
  map,
  trip,
  view,
  a,
  b,
  reduce,
  onView,
}: {
  map: ProjectedMap
  trip: Trip
  view: "paths" | "today"
  a: Place
  b: Place
  reduce: boolean | null
  onView: (v: "paths" | "today") => void
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [cw, setCw] = useState(700)
  const [ch, setCh] = useState(520)
  const [box, setBox] = useState<Box>({ x: 0, y: 0, w: map.width, h: map.height })
  const boxRef = useRef(box)
  useEffect(() => {
    boxRef.current = box
  }, [box])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setCw(el.clientWidth)
      setCh(el.clientHeight)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // fit both routes, with room around them, in the shape of the map box
  const target = useMemo(() => {
    const A = cw / Math.max(1, ch)
    const pad = Math.max(trip.box.w, trip.box.h) * 0.18 + 20
    let w = trip.box.w + pad * 2
    let h = trip.box.h + pad * 2
    if (w / h < A) w = h * A
    else h = w / A
    return { x: trip.box.x + trip.box.w / 2 - w / 2, y: trip.box.y + trip.box.h / 2 - h / 2, w, h }
  }, [trip, cw, ch])

  useEffect(() => {
    const from = boxRef.current
    const c = animate(0, 1, {
      duration: reduce ? 0 : 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (t) =>
        setBox({
          x: from.x + (target.x - from.x) * t,
          y: from.y + (target.y - from.y) * t,
          w: from.w + (target.w - from.w) * t,
          h: from.h + (target.h - from.h) * t,
        }),
    })
    return () => c.stop()
  }, [target, reduce])

  const u = box.w / Math.max(1, cw) // one screen pixel in map units
  const shown = view === "paths" ? trip.paths : trip.today
  const other = view === "paths" ? trip.today : trip.paths
  const color = (t: string) => (t === "busy" ? BUSY : t === "street" ? "var(--foreground)" : `var(--path-${t.slice(1)})`)
  const key = `${a.id}|${b.id}|${view}`

  return (
    <div className="relative overflow-hidden rounded-2xl map-land ring-1 ring-border">
      <svg
        ref={ref}
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        className="block h-[min(64svh,560px)] min-h-[360px] w-full"
        role="img"
        aria-label={`Map of the walk from ${a.name} to ${b.name}, ${view === "paths" ? "with the paths" : "today"}`}
      >
        <BaseLayer map={map} />

        {/* the five paths, faint, for context */}
        {map.paths.map((p) => (
          <path key={p.id} d={p.d} fill="none" stroke={`var(--path-${p.id})`} strokeOpacity={0.3} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" {...ns} />
        ))}

        {/* the other route, as a faint dashed ghost */}
        {other.segs.map((s, i) => (
          <path key={`o${i}`} d={s.d} fill="none" stroke="var(--foreground)" strokeOpacity={0.35} strokeWidth={2.5} strokeDasharray="4 5" strokeLinecap="round" {...ns} />
        ))}

        {/* the chosen route, drawn in as it changes */}
        <g key={key}>
          {shown.segs.map((s, i) => (
            <path key={`c${i}`} d={s.d} fill="none" stroke="var(--background)" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" {...ns} />
          ))}
          {shown.segs.map((s, i) => (
            <motion.path
              key={`s${i}`}
              d={s.d}
              fill="none"
              stroke={color(s.t)}
              strokeWidth={s.t === "street" ? 5 : 6}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...ns}
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + (i / Math.max(1, shown.segs.length)) * 0.6, ease: "easeInOut" }}
            />
          ))}
        </g>

        {/* start and end */}
        {[
          { p: a, label: "A" },
          { p: b, label: "B" },
        ].map(({ p, label }) => (
          <g key={label}>
            <circle cx={p.x} cy={p.y} r={11 * u} fill="var(--foreground)" stroke="var(--background)" strokeWidth={3} {...ns} />
            <text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={11 * u} className="font-mono font-semibold" fill="var(--background)">
              {label}
            </text>
          </g>
        ))}
      </svg>

      {/* today / with paths switch */}
      <div role="tablist" aria-label="Which walk to show" className="absolute top-3 left-3 inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
        {(["today", "paths"] as const).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={view === k}
            onClick={() => onView(k)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              view === k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {k === "today" ? "Today" : "With the paths"}
          </button>
        ))}
      </div>

      {/* key */}
      <div className="absolute right-3 bottom-3 left-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-card/95 px-3 py-2 text-[11px] sm:right-auto">
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-4 rounded-full" style={{ background: BUSY }} /> Busy road
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-4 rounded-full bg-foreground" /> Quiet street
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex h-1 w-4 overflow-hidden rounded-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="h-full flex-1" style={{ background: `var(--path-${i})` }} />
            ))}
          </span>
          New path
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-4 border-t-2 border-dashed border-foreground/40" /> Other walk
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <MapPinIcon className="size-3" aria-hidden /> A to B
        </span>
      </div>
    </div>
  )
}
