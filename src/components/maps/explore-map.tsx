"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { animate, AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRightIcon, LocateFixedIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ProjectedMap } from "@/lib/geo"
import { BaseLayer } from "@/components/path-map"
import { PathBadge } from "@/components/paths/path-badge"

type Box = { x: number; y: number; w: number; h: number }
type PathInfo = { id: number; slug: string; name: string; from: string; to: string; miles: number; minutes: number; surface: string }

const HUB_RED = "#e5533f"
const ns = { vectorEffect: "non-scaling-stroke" as const }

/** The smallest box around a path, from its SVG "M x yL x y..." outline */
function bboxOf(d: string): Box {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
  const xs = nums.filter((_, i) => i % 2 === 0)
  const ys = nums.filter((_, i) => i % 2 === 1)
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }
}

/**
 * The big interactive trail map. Drag to move around, use + and − to zoom, click a
 * path (or pick one in the legend) to fly to it and see its details.
 */
export function ExploreMap({ map, info }: { map: ProjectedMap; info: PathInfo[] }) {
  const W = map.width
  const H = map.height
  // the map box's shape (width / height); the view always matches it so nothing stretches
  const [A, setA] = useState(W / H)
  // the whole map, centered in a box of a given shape
  const fullFor = useCallback(
    (a: number): Box => (a >= W / H ? { x: -(H * a - W) / 2, y: 0, w: H * a, h: H } : { x: 0, y: -(W / a - H) / 2, w: W, h: W / a }),
    [W, H]
  )
  const full = useMemo(() => fullFor(A), [fullFor, A])
  const [box, setBox] = useState<Box>(full)
  const [selected, setSelected] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [showHubs, setShowHubs] = useState(false)
  const [cw, setCw] = useState(800) // the map's width on screen
  const svgRef = useRef<SVGSVGElement>(null)
  const boxRef = useRef(box)
  const drag = useRef<{ x: number; y: number; box: Box; moved: boolean } | null>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    boxRef.current = box
  }, [box])
  const zoom = full.w / box.w
  const zoomed = zoom > 1.02

  // when the map's size changes, match its shape and start from the whole map again
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    let last = 0
    const ro = new ResizeObserver(() => {
      const a = el.clientWidth / Math.max(1, el.clientHeight)
      setCw(el.clientWidth)
      if (Math.abs(last - a) > 0.01) {
        last = a
        setA(a)
        setBox(fullFor(a))
        setSelected(null)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [fullFor])
  const px = cw / box.w // screen pixels per map unit, so markers and text stay the same size when zoomed

  // keep the view's middle over the map, and don't zoom out past the whole map
  const clamp = (b: Box): Box => {
    const w = Math.min(full.w, Math.max(full.w / 8, b.w))
    if (w >= full.w) return full
    const h = w / A
    const cx = Math.min(W, Math.max(0, b.x + b.w / 2))
    const cy = Math.min(H, Math.max(0, b.y + b.h / 2))
    return { x: cx - w / 2, y: cy - h / 2, w, h }
  }

  const flyTo = (target: Box) => {
    const to = clamp(target)
    const from = boxRef.current
    if (reduce) return setBox(to)
    animate(0, 1, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (t) =>
        setBox({
          x: from.x + (to.x - from.x) * t,
          y: from.y + (to.y - from.y) * t,
          w: from.w + (to.w - from.w) * t,
          h: from.h + (to.h - from.h) * t,
        }),
    })
  }

  const zoomBy = (f: number, cx?: number, cy?: number) => {
    const b = boxRef.current
    const w = b.w / f
    const h = w / A
    const ax = cx ?? b.x + b.w / 2
    const ay = cy ?? b.y + b.h / 2
    flyTo({ x: ax - ((ax - b.x) / b.w) * w, y: ay - ((ay - b.y) / b.h) * h, w, h })
  }

  const focusPath = (id: number | null) => {
    setSelected(id)
    if (id == null) return flyTo(full)
    const p = map.paths.find((x) => x.id === id)
    if (!p) return
    const bb = bboxOf(p.d)
    // fit the path with room around it, keeping the map's shape
    const w = Math.min(Math.max(bb.w * 1.6, bb.h * 1.6 * A, full.w / 6), full.w)
    const h = w / A
    flyTo({ x: bb.x + bb.w / 2 - w / 2, y: bb.y + bb.h / 2 - h / 2, w, h })
  }

  // screen point -> map units
  const toMap = (clientX: number, clientY: number) => {
    const r = svgRef.current!.getBoundingClientRect()
    const b = boxRef.current
    return { x: b.x + ((clientX - r.left) / r.width) * b.w, y: b.y + ((clientY - r.top) / r.height) * b.h }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!zoomed) return
    drag.current = { x: e.clientX, y: e.clientY, box: boxRef.current, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const r = svgRef.current!.getBoundingClientRect()
    const dx = ((e.clientX - d.x) / r.width) * d.box.w
    const dy = ((e.clientY - d.y) / r.height) * d.box.h
    // only grab the pointer once it's really a drag, so plain clicks still reach the paths
    if (!d.moved && Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 4) {
      d.moved = true
      ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
    }
    setBox(clamp({ ...d.box, x: d.box.x - dx, y: d.box.y - dy }))
  }
  const onPointerUp = () => {
    // a real drag shouldn't also count as a click on a path
    setTimeout(() => (drag.current = null), 0)
  }
  const wasDrag = () => drag.current?.moved

  const active = hover ?? selected
  const sel = info.find((p) => p.id === selected)
  const u = 1 / px // one screen pixel, in map units

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl map-land ring-1 ring-border">
        <svg
          ref={svgRef}
          viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
          className={cn("block h-[min(74svh,700px)] min-h-[400px] w-full select-none", zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-default")}
          style={{ touchAction: zoomed ? "none" : "pan-y" }}
          role="img"
          aria-label="Interactive map of Wilmington, MA with the five proposed walking paths and their ten trailheads"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={(e) => {
            const p = toMap(e.clientX, e.clientY)
            zoomBy(1.8, p.x, p.y)
          }}
        >
          <BaseLayer map={map} />

          {/* hubs, outlined in red like the original map */}
          {showHubs &&
            map.hubs.map((h) => (
              <g key={h.name} pointerEvents="none">
                <path d={h.d} fill={HUB_RED} fillOpacity={0.16} stroke={HUB_RED} strokeWidth={2} strokeLinejoin="round" {...ns} />
                <text
                  x={h.x + h.label.dx * u * 0.9}
                  y={h.y + h.label.dy * u * 0.9}
                  dy="0.35em"
                  textAnchor={h.label.anchor}
                  fontSize={11 * u}
                  fontWeight={600}
                  fill="var(--foreground)"
                  stroke="var(--card)"
                  strokeWidth={3.5 * u}
                  strokeLinejoin="round"
                  style={{ paintOrder: "stroke" }}
                >
                  {h.name}
                </text>
              </g>
            ))}

          {/* the five paths */}
          {map.paths.map((p) => {
            const dim = active != null && active !== p.id
            return (
              <motion.g key={p.id} animate={{ opacity: dim ? 0.25 : 1 }} transition={{ duration: 0.2 }} pointerEvents="none">
                <path d={p.d} fill="none" stroke="var(--foreground)" strokeOpacity={0.2} strokeWidth={active === p.id ? 12 : 9} strokeLinecap="round" strokeLinejoin="round" {...ns} />
                <path d={p.d} fill="none" stroke={`var(--path-${p.id})`} strokeWidth={active === p.id ? 8 : 5.5} strokeLinecap="round" strokeLinejoin="round" {...ns} />
              </motion.g>
            )
          })}

          {/* trailheads: a ring at each end of every path */}
          {map.paths.map((p) =>
            p.trailheads.map((t) => (
              <g key={`${p.id}-${t.label}`} pointerEvents="none" opacity={active != null && active !== p.id ? 0.35 : 1}>
                <circle cx={t.x} cy={t.y} r={5.5 * u} fill="var(--card)" stroke="var(--foreground)" strokeWidth={2} {...ns} />
                {active === p.id && (
                  <text
                    x={t.x + 9 * u}
                    y={t.y}
                    dy="0.35em"
                    fontSize={10.5 * u}
                    className="font-mono"
                    fill="var(--foreground)"
                    stroke="var(--card)"
                    strokeWidth={3 * u}
                    style={{ paintOrder: "stroke" }}
                  >
                    {t.label}
                  </text>
                )}
              </g>
            ))
          )}

          {/* number badges */}
          {map.paths.map((p) => (
            <g key={`b${p.id}`} pointerEvents="none" opacity={active != null && active !== p.id ? 0.35 : 1}>
              <circle cx={p.labelAt.x} cy={p.labelAt.y} r={10 * u} fill={`var(--path-${p.id})`} stroke="var(--background)" strokeWidth={2.5} {...ns} />
              <text x={p.labelAt.x} y={p.labelAt.y} dy="0.35em" textAnchor="middle" fontSize={10.5 * u} className="font-mono font-semibold" fill={p.id === 1 ? "#1a1a1a" : "#fff"}>
                {p.id}
              </text>
            </g>
          ))}

          {/* wide invisible lines on top, so paths are easy to hover and tap */}
          {map.paths.map((p) => (
            <path
              key={`hit${p.id}`}
              d={p.d}
              fill="none"
              stroke="transparent"
              strokeWidth={24}
              strokeLinecap="round"
              strokeLinejoin="round"
              {...ns}
              className="cursor-pointer"
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(p.id)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
              onClick={() => {
                if (wasDrag()) return
                focusPath(selected === p.id ? null : p.id)
              }}
            >
              <title>{p.name}</title>
            </path>
          ))}
        </svg>

        {/* controls */}
        <div className="absolute top-3 right-3 flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <button type="button" onClick={() => zoomBy(1.6)} aria-label="Zoom in" className="grid size-9 place-items-center hover:bg-muted focus-visible:bg-muted focus-visible:outline-none">
            <PlusIcon className="size-4" />
          </button>
          <button type="button" onClick={() => zoomBy(1 / 1.6)} disabled={!zoomed} aria-label="Zoom out" className="grid size-9 place-items-center border-t border-border hover:bg-muted focus-visible:bg-muted focus-visible:outline-none disabled:opacity-40">
            <MinusIcon className="size-4" />
          </button>
          <button type="button" onClick={() => focusPath(null)} disabled={!zoomed && selected == null} aria-label="Show the whole map" className="grid size-9 place-items-center border-t border-border hover:bg-muted focus-visible:bg-muted focus-visible:outline-none disabled:opacity-40">
            <LocateFixedIcon className="size-4" />
          </button>
        </div>

        <label className="absolute top-3 left-3 flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-sm select-none">
          <input type="checkbox" checked={showHubs} onChange={(e) => setShowHubs(e.target.checked)} className="size-3.5 accent-[#e5533f]" />
          Show hubs
        </label>

        <span className="pointer-events-none absolute bottom-2 left-3 hidden font-mono text-[10px] text-muted-foreground sm:block">
          {zoomed ? "Drag to move · double-click to zoom" : "Click a path · double-click or + to zoom"}
        </span>
        <span className="pointer-events-none absolute right-2 bottom-1.5 font-mono text-[9px] text-muted-foreground/80">
          © OpenStreetMap contributors
        </span>

        {/* details for the selected path */}
        <AnimatePresence>
          {sel && (
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className="absolute right-3 bottom-8 left-3 rounded-xl border border-border bg-card p-4 shadow-lg sm:right-auto sm:w-80"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <PathBadge id={sel.id} className="size-7 text-xs" />
                  <p className="font-semibold tracking-[-0.02em]">{sel.name}</p>
                </div>
                <button type="button" onClick={() => focusPath(null)} aria-label="Close" className="-m-1 rounded p-1 text-muted-foreground hover:text-foreground">
                  <XIcon className="size-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {sel.from} → {sel.to}
              </p>
              <p className="mt-2 font-mono text-xs">
                {sel.miles.toFixed(1)} mi · {sel.minutes} min · {sel.surface}
              </p>
              <Link href={`/the-paths#${sel.slug}`} className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
                Read about this path
                <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* legend: also a way to fly to each path */}
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Paths">
        {info.map((p) => {
          const on = selected === p.id
          return (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => focusPath(on ? null : p.id)}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                style={{ "--c": `var(--path-${p.id})` } as React.CSSProperties}
                className={cn(
                  "flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  on
                    ? "border-[var(--c)] bg-[color-mix(in_oklch,var(--c)_18%,var(--background))] font-medium"
                    : "border-border bg-card hover:bg-[color-mix(in_oklch,var(--c)_10%,var(--background))]"
                )}
              >
                <PathBadge id={p.id} className="size-5 text-[10px]" />
                {p.name}
                <span className="font-mono text-xs text-muted-foreground">{p.miles.toFixed(1)} mi</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
