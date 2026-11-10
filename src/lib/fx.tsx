"use client"

/**
 * TEMPORARY: switches for testing which effect makes scrolling stutter.
 * Add ?off=NAME to the address to turn an effect off, e.g.
 *   localhost:3100/?off=lenis
 *   localhost:3100/?off=grain,map
 *   localhost:3100/?off=all
 * Names: lenis, parallax, grain, map, draw, trail, topo, all
 * Remove this file (and its uses) once we know the answer.
 */

import { useEffect, useState } from "react"

// Written out so the CSS tool keeps their rules: fx-off-grain fx-off-map fx-off-topo
export const FX_NAMES = ["lenis", "parallax", "grain", "map", "draw", "trail", "topo"] as const

function readOff(): string[] {
  const v = new URLSearchParams(window.location.search).get("off")
  if (!v) return []
  const list = v.split(",").map((s) => s.trim())
  return list.includes("all") ? [...FX_NAMES] : list
}

/** True when this effect has been switched off in the address */
export function useFxOff(name: (typeof FX_NAMES)[number]) {
  const [off, setOff] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOff(readOff().includes(name))
  }, [name])
  return off
}

/** Adds fx-off-NAME classes to the page (for the CSS-only effects) and shows a small label */
export function FxSwitches() {
  const [off, setOff] = useState<string[]>([])
  useEffect(() => {
    const list = readOff()
    list.forEach((n) => document.documentElement.classList.add(`fx-off-${n}`))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOff(list)
  }, [])
  if (!off.length) return null
  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-3 py-1.5 font-mono text-[11px] text-background shadow-lg">
      Test mode · off: {off.join(", ")}
    </div>
  )
}
