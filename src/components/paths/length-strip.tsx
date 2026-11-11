"use client"

import { motion, useReducedMotion } from "motion/react"

type Seg = { id: number; short: string; miles: number }

/**
 * All 5.4 miles laid end to end as one bar, each path taking its real share of the
 * length. It fills in left to right the first time it scrolls into view.
 */
export function LengthStrip({ segs, total }: { segs: Seg[]; total: number }) {
  const reduce = useReducedMotion()
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="field-label">All five, end to end</p>
        <p className="font-mono text-xs text-muted-foreground tabular-nums">{total} mi</p>
      </div>
      <div className="mt-3 flex h-3.5 gap-1" role="img" aria-label={segs.map((s) => `Path ${s.id}, ${s.short}: ${s.miles} miles`).join(". ")}>
        {segs.map((s, i) => (
          <motion.span
            key={s.id}
            className="h-full origin-left rounded-full"
            style={{ flexGrow: s.miles, flexBasis: 0, background: `var(--path-${s.id})` }}
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.55, delay: 0.15 + i * 0.16, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </div>
      {/* labels sit under their own segment when there's room; the short ones just get a number */}
      <div className="mt-2 flex gap-1">
        {segs.map((s) => (
          <span key={s.id} className="min-w-0 truncate font-mono text-[11px] text-muted-foreground" style={{ flexGrow: s.miles, flexBasis: 0 }}>
            <span className="text-foreground">{s.id}</span>
            {s.miles >= 0.9 && <span className="hidden sm:inline"> {s.short}</span>}
            {s.miles >= 0.8 && <span className="tabular-nums"> {s.miles.toFixed(1)}</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
