import { cn } from "@/lib/utils"

export type Milestone = { status: "done" | "now" | "next" | "later"; when: string; title: string; text: string }

const STATUS = {
  done: { label: "Done", dot: "bg-foreground border-foreground" },
  now: { label: "Now", dot: "bg-brand-green border-brand-green" },
  next: { label: "Next", dot: "bg-background border-foreground" },
  later: { label: "Later", dot: "bg-background border-foreground/40" },
}

/** "Where things stand": what's done, what's happening now, and what's next */
export function Timeline({ items }: { items: Milestone[] }) {
  return (
    <ol className="relative">
      {/* a dotted line linking the steps */}
      <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-0.5 bg-[repeating-linear-gradient(to_bottom,var(--border)_0_4px,transparent_4px_9px)]" />
      {items.map((m) => {
        const s = STATUS[m.status]
        return (
          <li key={m.title} className="relative grid grid-cols-[1rem_minmax(0,1fr)] gap-5 pb-9 last:pb-0">
            <span aria-hidden className={cn("relative z-10 mt-1.5 size-4 rounded-full border-2", s.dot, m.status === "now" && "ring-4 ring-brand-green/25")} />
            <div>
              <p className="field-label flex flex-wrap items-center gap-2">
                <span className={cn(m.status === "now" && "text-foreground")}>{s.label}</span>
                {m.when && <span className="text-muted-foreground/70">· {m.when}</span>}
              </p>
              <p className={cn("mt-1.5 text-lg font-semibold tracking-[-0.02em]", (m.status === "next" || m.status === "later") && "text-foreground/80")}>
                {m.title}
              </p>
              <p className="mt-1 max-w-xl text-pretty text-muted-foreground">{m.text}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
