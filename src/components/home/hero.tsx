"use client"

import Image from "next/image"
import { motion } from "motion/react"

const words = ["Let's", "walk,", "Wilmington"]
const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section className="container-page pt-14 pb-10 sm:pt-20 md:pt-24">
      <motion.p
        className="field-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        The Walk Wilmington Project
      </motion.p>

      <h1 className="mt-5 text-[clamp(3.4rem,12.5vw,11.5rem)] leading-[0.86] font-semibold tracking-[-0.055em]">
        {words.map((w, i) => (
          <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.09, ease }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        ))}
      </h1>

      <motion.p
        className="mt-8 max-w-xl text-lg text-pretty text-muted-foreground sm:text-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease }}
      >
        Wilmington, MA wasn&apos;t built for walking. Here&apos;s how it could be.
      </motion.p>

      <motion.figure
        className="mt-14 sm:mt-20"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.65, ease }}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted sm:aspect-[21/9]">
          <Image
            src="/images/home-1.jpg"
            alt="Aerial view of Wilmington, MA, with Main Street running through town between houses, plazas, and woods"
            fill
            priority
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="object-cover object-[50%_60%]"
          />
        </div>
        <figcaption className="mt-3 flex justify-between font-mono text-xs text-muted-foreground">
          <span>Wilmington from above</span>
          <span>42.546° N, 71.174° W</span>
        </figcaption>
      </motion.figure>
    </section>
  )
}
