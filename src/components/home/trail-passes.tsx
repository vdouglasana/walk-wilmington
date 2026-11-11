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
import { TopoBackground } from "@/components/topo-background"
import { SectionCue } from "@/components/section-cue"

export function TrailPasses() {
  return (
    <section aria-labelledby="passes" className="grain relative isolate overflow-hidden bg-paper py-20 sm:py-28">
      <TopoBackground className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_95%)]" />
      <div className="container-page flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="field-label scroll-mt-28" id="passes">
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
      <SectionCue />
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
          {/* a small line drawing that's different for each path */}
          <TicketArt id={p.id} />
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
          <span className="absolute -top-[9px] -left-[9px] size-4 rounded-full bg-paper ring-1 ring-border [clip-path:inset(0_0_0_50%)]" />
          <span className="absolute -top-[9px] -right-[9px] size-4 rounded-full bg-paper ring-1 ring-border [clip-path:inset(0_50%_0_0)]" />
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

/**
 * A small line-drawn scene per path, all in the same thin style.
 * Each sits on a ground line along the bottom of the colored box.
 * 1 North Wilmington: a neighborhood (houses)
 * 2 Main Street: a row of shops
 * 3 Rotary Park: a park (round trees, a bench, a winding path)
 * 4 Butters Row: the woods (pine trees)
 * 5 Yentile-East: a footbridge over a brook, with a field
 */
function TicketArt({ id }: { id: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 130 64"
      preserveAspectRatio="xMaxYMax meet"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute right-0 bottom-0 h-[82%] w-[74%] opacity-50 [mask-image:linear-gradient(to_right,transparent,black_22%)]"
    >
      {SCENES[id as keyof typeof SCENES]}
      {/* ground */}
      <path d="M0 63.5H130" />
    </svg>
  )
}

const SCENES = {
  1: (
    <>
      {/* small house */}
      <path d="M14 63V44H36V63M11 46L25 34L39 46" />
      <path d="M22 63V54H28V63M16 48H21V52H16Z" />
      {/* tall house with chimney */}
      <path d="M46 63V38H74V63M42 40L60 24L78 40M66 31V25H70V34" />
      <path d="M57 63V52H63V63M49 43H55V48H49ZM65 43H71V48H65Z" />
      {/* wide house */}
      <path d="M84 63V46H122V63M80 48L103 32L126 48" />
      <path d="M99 63V54H106V63M88 51H95V56H88ZM111 51H118V56H111Z" />
      {/* fence */}
      <path d="M38 63V58M41 63V58M44 63V58M76 63V58M79 63V58M82 63V58M37 59.5H45M75 59.5H83" />
    </>
  ),
  2: (
    <>
      {/* three storefronts with awnings */}
      <path d="M4 63V30H44V63M4 36H44" />
      <path d="M2 40H46L43 46H5Z M10 40V46M18 40V46M26 40V46M34 40V46" />
      <path d="M8 63V50H18V63M22 50H40V58H22Z" />
      <path d="M48 63V22H86V63M48 28H86" />
      <path d="M46 34H88L85 40H49Z M54 34V40M62 34V40M70 34V40M78 34V40" />
      <path d="M52 63V46H62V63M66 46H82V56H66Z" />
      <path d="M90 63V34H126V63M90 40H126" />
      <path d="M88 44H128L125 50H91Z M96 44V50M104 44V50M112 44V50M120 44V50" />
      <path d="M94 63V53H103V63M107 53H122V60H107Z" />
      {/* sign boards */}
      <path d="M14 31H34V35H14ZM56 23H78V27H56ZM98 35H118V39H98Z" />
    </>
  ),
  3: (
    <>
      {/* winding path */}
      <path d="M40 63C46 56 62 56 66 50C70 44 84 44 96 42" strokeDasharray="2 2.5" />
      {/* round trees */}
      <circle cx="18" cy="34" r="11" />
      <path d="M18 45V63M18 52L13 47M18 50L23 45" />
      <circle cx="108" cy="30" r="13" />
      <path d="M108 43V63M108 51L102 46M108 49L114 44" />
      <circle cx="80" cy="40" r="7" />
      <path d="M80 47V63" />
      {/* bench */}
      <path d="M44 52H62M44 55H62M46 55V63M60 55V63M44 48H62" />
      {/* bushes */}
      <path d="M118 63C118 58 128 58 128 63M28 63C28 59 36 59 36 63" />
    </>
  ),
  4: (
    <>
      {/* pine trees of different sizes */}
      <path d="M14 63V56M14 20L4 38H9L2 50H8L-1 58H29L20 50H26L19 38H24Z" />
      <path d="M44 63V58M44 30L36 44H40L34 54H54L48 44H52Z" />
      <path d="M70 63V56M70 12L58 32H64L55 46H62L52 58H88L78 46H85L76 32H82Z" />
      <path d="M100 63V58M100 28L91 43H95L88 54H112L105 43H109Z" />
      <path d="M122 63V57M122 22L113 37H117L110 49H134L127 37H131Z" />
    </>
  ),
  5: (
    <>
      {/* brook under the bridge */}
      <path d="M30 61C36 59 42 63 48 61C54 59 60 63 66 61C72 59 78 63 84 61" />
      <path d="M38 57C42 56 46 58 50 57M60 57C64 56 68 58 72 57" />
      {/* arched footbridge with railings */}
      <path d="M22 63C34 40 74 40 88 63" />
      <path d="M22 50C34 32 74 32 88 50" />
      <path d="M26 57V46M34 50V39M44 46V36M55 45V35M66 46V36M76 50V39M84 57V46" />
      {/* field: grass tufts and a fence line */}
      <path d="M96 63L98 57L100 63M104 63L106 58L108 63M112 63L114 56L116 63M120 63L122 58L124 63" />
      <path d="M94 50H130M98 46V56M110 46V56M122 46V56" />
      <path d="M0 63L2 58L4 63M8 63L10 57L12 63" />
    </>
  ),
}
