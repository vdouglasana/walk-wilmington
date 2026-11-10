"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), [])

  // A small note that pops out under the button for a moment after switching
  const [note, setNote] = useState<"dark" | "light" | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const dark = mounted && resolvedTheme === "dark"

  const toggle = () => {
    const next = dark ? "light" : "dark"
    setTheme(next)
    setNote(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setNote(null), 1800)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? "sun" : "moon"}
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid place-items-center"
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </motion.span>
        </AnimatePresence>
      </Button>

      <div aria-live="polite" className="sr-only">
        {note && `Switched to ${note} mode`}
      </div>

      {/* Slides out to the left of the button, in the colors of the mode you just turned on */}
      <AnimatePresence>
        {note && (
          <motion.div
            key={note}
            aria-hidden
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            className="pointer-events-none absolute top-1/2 right-full mr-2 flex -translate-y-1/2 items-center gap-1.5 rounded-full border border-border bg-card py-1 pr-3 pl-1.5 text-xs font-medium whitespace-nowrap text-foreground shadow-md [text-shadow:none]"
          >
            <span className="grid size-5 place-items-center rounded-full bg-muted">
              {note === "dark" ? <MoonIcon className="size-3" /> : <SunIcon className="size-3" />}
            </span>
            {note === "dark" ? "Dark mode on" : "Light mode on"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
