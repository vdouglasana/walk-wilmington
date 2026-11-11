"use client"

import { useRef } from "react"
import { ChevronDownIcon } from "lucide-react"
import { useLenis } from "lenis/react"
import { motion, useInView, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A small, quiet "there's more below" button at the bottom of a section. It's the
 * smaller cousin of the "Scroll to explore" pill: just a chevron in a ring that fades in
 * when you reach the end of the section. Clicking it glides to the next section.
 * The section it sits in needs `relative`.
 */
export function SectionCue({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const ref = useRef<HTMLButtonElement>(null)
  const inView = useInView(ref, { amount: 1, margin: "0px 0px -8% 0px" })
  const lenis = useLenis()
  const reduce = useReducedMotion()

  const go = () => {
    const next = ref.current?.closest("section")?.nextElementSibling as HTMLElement | null
    if (!next) return
    if (lenis) lenis.scrollTo(next, { offset: -56, immediate: !!reduce })
    else next.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={go}
      aria-label="Scroll to the next section"
      initial={false}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 6 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group absolute bottom-5 left-1/2 z-10 grid size-9 -translate-x-1/2 place-items-center rounded-full border transition-colors focus-visible:ring-3 focus-visible:outline-none sm:bottom-7",
        tone === "dark"
          ? "border-foreground/15 text-muted-foreground hover:border-foreground/40 hover:text-foreground focus-visible:ring-ring/50"
          : "border-white/30 text-white/70 hover:border-white/70 hover:text-white focus-visible:ring-white/50",
        className
      )}
    >
      <motion.span
        animate={reduce || !inView ? undefined : { y: [0, 2.5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDownIcon className="size-4" />
      </motion.span>
    </motion.button>
  )
}
