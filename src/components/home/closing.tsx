import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { NumberTicker } from "@/components/ui/number-ticker"

export function Closing() {
  return (
    <section className="container-page pb-24 sm:pb-32">
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
        <Stat unit="paths">
          <NumberTicker value={5} className="text-inherit tracking-[inherit]" />
        </Stat>
        <Stat unit="miles">
          <NumberTicker value={5.4} decimalPlaces={1} className="text-inherit tracking-[inherit]" />
        </Stat>
        <Stat unit="connected">Wilmington</Stat>
      </div>

      <div className="mt-24 max-w-4xl sm:mt-32">
        <p className="text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.1] font-medium tracking-[-0.03em] text-balance">
          Wilmington&apos;s hubs are already close together.{" "}
          <span className="text-muted-foreground">
            The paths between them just don&apos;t exist yet.
          </span>{" "}
          It&apos;s time to Walk, Wilmington!
        </p>
        <Link
          href="/the-paths"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          See the five paths
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}

function Stat({ unit, children }: { unit: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 bg-background p-6 sm:block sm:p-8">
      <p className="text-5xl font-semibold tracking-[-0.04em] tabular-nums sm:text-[clamp(2.4rem,4.6vw,3.75rem)]">
        {children}
      </p>
      <p className="field-label sm:mt-2">{unit}</p>
    </div>
  )
}
