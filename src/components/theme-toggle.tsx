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

      <AnimatePresence>
        {note && (
          <motion.div
            key={note}
            aria-hidden
            initial={{ opacity: 0, y: -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="absolute top-full right-0 mt-2 flex origin-top-right items-center gap-2 rounded-full bg-foreground py-1.5 pr-3.5 pl-2 text-xs font-medium whitespace-nowrap text-background shadow-lg [text-shadow:none]"
          >
            <span className="grid size-5 place-items-center rounded-full bg-background/15">
              {note === "dark" ? <MoonIcon className="size-3" /> : <SunIcon className="size-3" />}
            </span>
            {note === "dark" ? "Dark mode on" : "Light mode on"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
