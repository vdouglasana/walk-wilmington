"use client"

import { ReactLenis } from "lenis/react"
import "lenis/dist/lenis.css"

import { useFxOff } from "@/lib/fx"

/**
 * Smooth scrolling for the whole site (Lenis).
 * It glides the page and keeps the scroll-driven animations (map drawing,
 * trail, parallax) in step with it, so nothing lags a frame behind.
 * Turns itself off for people who've asked their device to reduce motion,
 * and leaves phone touch scrolling as the phone's own.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const off = useFxOff("lenis")
  if (off) return <>{children}</>
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        smoothWheel: true,
        // in-page links (like "Keep scrolling") glide too; where they stop is set by
        // each target's scroll margin (e.g. scroll-mt-28), so it clears the sticky menu
        anchors: true,
        respectReducedMotion: true,
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
