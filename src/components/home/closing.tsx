"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { ArrowRightIcon } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { NumberTicker } from "@/components/ui/number-ticker"

export function Closing() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-900 text-white"
      aria-label="Wilmington connected"
    >
      <motion.div className="absolute -inset-y-[12%] inset-x-0" style={reduce ? undefined : { y }}>
        <Image
          src="/images/home-3.jpg"
          alt="Aerial drone view over Wilmington's commercial area along the train tracks, with woods and neighborhoods beyond"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.55),rgb(0_0_0/0.35)_40%,rgb(0_0_0/0.7))]"
      />

      <div className="container-page relative py-24 sm:py-36">
        <div className="grid border-y border-white/25 sm:grid-cols-3 sm:divide-x sm:divide-white/25">
          <Stat unit="paths">
            <NumberTicker value={5} className="text-inherit tracking-[inherit]" />
          </Stat>
          <Stat unit="miles">
            <NumberTicker value={5.4} decimalPlaces={1} className="text-inherit tracking-[inherit]" />
          </Stat>
          <Stat unit="connected">Wilmington</Stat>
        </div>

        <div className="mt-20 max-w-4xl sm:mt-28">
          <p className="text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance">
            Wilmington&apos;s hubs are already close together.{" "}
            <span className="text-white/65">
              The paths between them just don&apos;t exist yet.
            </span>{" "}
            It&apos;s time to Walk, Wilmington!
          </p>
          <Link
            href="/the-paths"
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-white/50 focus-visible:outline-none"
          >
            See the five paths
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Stat({ unit, children }: { unit: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-white/25 py-6 last:border-b-0 sm:block sm:border-b-0 sm:px-6 sm:py-8 sm:first:pl-0 lg:px-8">
      <p className="text-5xl font-semibold tracking-[-0.04em] tabular-nums sm:text-[clamp(1.9rem,4vw,3.75rem)]">
        {children}
      </p>
      <p className="font-mono text-[0.72rem] tracking-[0.08em] text-white/70 uppercase sm:mt-2">
        {unit}
      </p>
    </div>
  )
}
