"use client"

import Link from "next/link"
import { FootprintsIcon } from "lucide-react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { paths, type WalkPath } from "@/lib/paths"

export function TrailPasses() {
  return (
    <section aria-labelledby="passes" className="py-20 sm:py-28">
      <div className="container-page flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="field-label" id="passes">
            Trail passes
          </p>
          <h2 className="mt-4 text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.08] font-medium tracking-[-0.03em] text-balance">
            Five paths. 5.4 miles.{" "}
            <span className="text-muted-foreground">One connected town.</span>
          </h2>
        </div>
        <p className="max-w-xs text-sm text-muted-foreground">
          Each path uses land that&apos;s already there: woods, brook edges, parks, and back lots.
        </p>
      </div>

      {/* Scrolls sideways on phones, sits in a row on big screens */}
      <ul className="container-page mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto sm:scroll-px-8 pt-2 pb-6 [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:overflow-visible">
        {paths.map((p, i) => (
          <motion.li
            key={p.id}
            className="w-[70%] max-w-[260px] shrink-0 snap-start sm:w-[42%] lg:w-auto lg:max-w-none"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <Ticket p={p} />
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

function Ticket({ p }: { p: WalkPath }) {
  const reduce = useReducedMotion()
  // Tilt the ticket toward the pointer, like holding a real card
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const spring = { stiffness: 250, damping: 22 }
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), spring)
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), spring)

  const darkText = p.id === 1 // yellow needs dark text
  const color = `var(--path-${p.id})`

  return (
    <motion.div
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 800 }}
      whileHover={reduce ? undefined : { y: -6 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      onPointerLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      className="group relative"
    >
      <Link
        href={`/the-paths#${p.slug}`}
        className="block rounded-xl bg-card shadow-[0_1px_2px_rgb(0_0_0/0.06),0_8px_24px_-12px_rgb(0_0_0/0.25)] ring-1 ring-border transition-shadow group-hover:shadow-[0_2px_4px_rgb(0_0_0/0.06),0_18px_40px_-14px_rgb(0_0_0/0.35)] focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        {/* Colored header */}
        <div
          className="relative overflow-hidden rounded-t-xl px-4 pt-3.5 pb-4"
          style={{ background: color, color: darkText ? "#1a1a1a" : "#fff" }}
        >
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em] uppercase opacity-85">
            <span>Trail pass</span>
            <FootprintsIcon className="size-3.5" aria-hidden />
          </div>
          <p className="mt-5 font-mono text-4xl leading-none font-semibold tracking-tight">
            0{p.id}
          </p>
          {/* faint topo lines for texture */}
          <svg
            aria-hidden
            viewBox="0 0 100 60"
            className="pointer-events-none absolute -right-4 -bottom-6 w-32 opacity-25"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          >
            <path d="M5 50c15-18 30-22 45-14s28 6 45-12" />
            <path d="M5 58c15-18 30-22 45-14s28 6 45-12" />
            <path d="M5 42c15-18 30-22 45-14s28 6 45-12" />
            <path d="M5 34c15-18 30-22 45-14s28 6 45-12" />
          </svg>
        </div>

        {/* Main part */}
        <div className="px-4 pt-4 pb-5">
          <p className="leading-tight font-semibold tracking-tight">{p.name}</p>
          <dl className="mt-3 space-y-1.5 text-[13px]">
            <div className="flex gap-2">
              <dt className="w-9 shrink-0 font-mono text-[10px] leading-5 text-muted-foreground uppercase">
                From
              </dt>
              <dd>{p.from}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-9 shrink-0 font-mono text-[10px] leading-5 text-muted-foreground uppercase">
                To
              </dt>
              <dd>{p.to}</dd>
            </div>
          </dl>
        </div>

        {/* Perforation with notches on both sides */}
        <div className="relative h-0 border-t-2 border-dashed border-border" aria-hidden>
          <span className="absolute -top-[9px] -left-[9px] size-4 rounded-full bg-background ring-1 ring-border [clip-path:inset(0_0_0_50%)]" />
          <span className="absolute -top-[9px] -right-[9px] size-4 rounded-full bg-background ring-1 ring-border [clip-path:inset(0_50%_0_0)]" />
        </div>

        {/* Stub */}
        <div className="px-4 pt-4 pb-4">
          <dl className="grid grid-cols-3 gap-1 font-mono text-[11px]">
            <div>
              <dt className="text-[9px] tracking-wider text-muted-foreground uppercase">Miles</dt>
              <dd className="mt-0.5 text-sm font-medium">{p.miles.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-[9px] tracking-wider text-muted-foreground uppercase">Min</dt>
              <dd className="mt-0.5 text-sm font-medium">{p.minutes}</dd>
            </div>
            <div>
              <dt className="text-[9px] tracking-wider text-muted-foreground uppercase">Surface</dt>
              <dd className="mt-0.5 text-sm font-medium">{p.surface}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-end justify-between gap-3">
            <span className="font-mono text-[9px] tracking-[0.1em] whitespace-nowrap text-muted-foreground uppercase">
              Admit one walker
            </span>
            <span
              aria-hidden
              className="h-5 w-12 shrink-0 opacity-60 [background:repeating-linear-gradient(90deg,var(--foreground)_0_1px,transparent_1px_3px,var(--foreground)_3px_5px,transparent_5px_6px,var(--foreground)_6px_7px,transparent_7px_10px)]"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
