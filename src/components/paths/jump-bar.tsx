"use client"

import { useEffect, useState } from "react"
import { useLenis } from "lenis/react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { PathBadge } from "./path-badge"

type Item = { id: number; slug: string; short: string }

/**
 * A slim bar that sticks under the header with all five paths. The one you're reading
 * lights up, and tapping another jumps straight to it.
 */
export function PathJumpBar({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null)
  const lenis = useLenis()
  const reduce = useReducedMotion()

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.slug)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      // a thin line across the middle of the screen decides which path you're on
      { rootMargin: "-45% 0px -54% 0px" }
    )
    els.forEach((el) => io.observe(el))
    // clear the highlight when you're above the first path or below the last
    const clear = () => {
      const first = els[0]?.getBoundingClientRect()
      const last = els[els.length - 1]?.getBoundingClientRect()
      const mid = window.innerHeight / 2
      if ((first && first.top > mid) || (last && last.bottom < mid)) setActive(null)
    }
    window.addEventListener("scroll", clear, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener("scroll", clear)
    }
  }, [items])

  const go = (e: React.MouseEvent, slug: string) => {
    const el = document.getElementById(slug)
    if (!el) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(el, { offset: -112, immediate: !!reduce })
    else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })
    history.replaceState(null, "", `#${slug}`)
  }

  return (
    <nav aria-label="Jump to a path" className="sticky top-14 z-30 border-b border-border bg-background">
      <ul className="container-page flex gap-1.5 overflow-x-auto py-2 [scrollbar-width:none]">
        {items.map((i) => {
          const on = active === i.slug
          return (
            <li key={i.slug} className="shrink-0">
              <a
                href={`#${i.slug}`}
                onClick={(e) => go(e, i.slug)}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  on
                    ? "border-foreground/80 bg-card text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-card hover:text-foreground"
                )}
              >
                <PathBadge id={i.id} className="size-5 text-[10px]" />
                {i.short}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
