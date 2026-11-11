"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"
import { useLenis } from "lenis/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

/**
 * A clear "Scroll to explore" button at the bottom center of the screen, for people
 * who might not realize there's more below. It shows when a page first opens and
 * fades away as soon as they start scrolling. Clicking it scrolls down one screen.
 */
export function ScrollCue() {
  const pathname = usePathname()
  const lenis = useLenis()
  const reduce = useReducedMotion()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const check = () => {
      const more = document.documentElement.scrollHeight > window.innerHeight + 300
      setShow(more && window.scrollY < 40)
    }
    // wait a moment so it arrives after the page's own entrance animation
    const t = setTimeout(check, 1400)
    window.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check)
    return () => {
      clearTimeout(t)
      window.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [pathname])

  const go = () => {
    const y = window.innerHeight * 0.85
    if (lenis) lenis.scrollTo(y, { immediate: !!reduce })
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={go}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card/95 py-2 pr-3 pl-4 text-sm font-medium text-foreground shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Scroll to explore
          <motion.span
            className="grid size-6 place-items-center rounded-full bg-foreground text-background"
            animate={reduce ? undefined : { y: [0, 3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDownIcon className="size-4" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
