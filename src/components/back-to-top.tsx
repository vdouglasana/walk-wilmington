"use client"

import { useState } from "react"
import { useLenis } from "lenis/react"
import { ArrowUpIcon } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react"

export function BackToTop() {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)
  const reduce = useReducedMotion()
  const lenis = useLenis()

  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 900))

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() =>
            lenis
              ? lenis.scrollTo(0, { immediate: !!reduce })
              : window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
          }
          aria-label="Back to top"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed right-5 bottom-5 z-30 grid size-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <ArrowUpIcon className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
