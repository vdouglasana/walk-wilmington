import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { finePrint, site } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * The shared layout for the quiet pages linked only from the footer
 * (Privacy Policy, Terms of Use, Sources): one narrow, easy-to-read column.
 */
export function FinePage({
  title,
  intro,
  current,
  children,
}: {
  title: string
  intro: React.ReactNode
  current: string
  children: React.ReactNode
}) {
  return (
    <article className="container-page max-w-3xl py-14 sm:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden />
        Walk Wilmington
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{title}</h1>
      <p className="mt-3 font-mono text-xs text-muted-foreground">Last updated {site.lastUpdated}</p>
      <div className="mt-8 text-lg text-pretty text-muted-foreground">{intro}</div>

      <div className="mt-12 space-y-10">{children}</div>

      {/* the other fine-print pages */}
      <nav aria-label="Fine print" className="mt-16 flex flex-wrap gap-2 border-t border-border pt-6">
        {finePrint.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            aria-current={f.href === current ? "page" : undefined}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
              f.href === current ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>
    </article>
  )
}

/** One titled part of a fine-print page */
export function FineSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-[-0.02em]">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-pretty text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:decoration-foreground/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-foreground [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  )
}
