"use client"

import Image from "next/image"
import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"

const words = ["Let's", "walk,", "Wilmington"]
const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  // The photo drifts and settles slightly as you scroll away (parallax)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      className="relative -mt-14 h-[100svh] min-h-[560px] overflow-hidden bg-neutral-900 text-white"
    >
      <motion.div
        className="absolute inset-0 origin-bottom"
        style={reduce ? undefined : { y, scale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Image
          src="/images/home-1.jpg"
          alt="Aerial drone view of Wilmington, MA, with Main Street running through town between houses, plazas, and woods"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_14%]"
        />
      </motion.div>

      {/* Shade the top (for the menu) and the bottom (for the headline) so the text stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.55)_0%,rgb(0_0_0/0.25)_9%,rgb(0_0_0/0)_20%,rgb(0_0_0/0)_35%,rgb(0_0_0/0.5)_65%,rgb(0_0_0/0.7)_100%)]"
      />

      <motion.div
        className="container-page relative flex h-full flex-col justify-end pb-10 sm:pb-14"
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.p
          className="font-mono text-[0.72rem] tracking-[0.08em] text-white/80 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          The Walk Wilmington Project
        </motion.p>

        <h1 className="mt-4 text-[clamp(3.4rem,12.5vw,11.5rem)] leading-[0.86] font-semibold tracking-[-0.055em] [text-shadow:0_2px_30px_rgb(0_0_0/0.25)]">
          {words.map((w, i) => (
            <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 + i * 0.09, ease }}
              >
                {w}
              </motion.span>
              {i < words.length - 1 && <span>&nbsp;</span>}
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <motion.p
            className="max-w-md text-lg text-pretty text-white/90 sm:text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease }}
          >
            Wilmington, MA wasn&apos;t built for walking. Here&apos;s how it could be.
          </motion.p>
          <motion.div
            className="flex items-center gap-3 font-mono text-xs text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
          >
            <span>42.546° N, 71.174° W</span>
            <span aria-hidden className="h-px w-8 bg-white/40" />
            <span className="flex items-center gap-2">
              Scroll
              <span className="relative block h-6 w-px overflow-hidden bg-white/25" aria-hidden>
                <motion.span
                  className="absolute inset-x-0 top-0 h-1/2 bg-white"
                  animate={reduce ? undefined : { y: ["-100%", "200%"] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
