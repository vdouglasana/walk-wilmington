import Link from "next/link"

import { nav, site } from "@/lib/site"
import { paths } from "@/lib/paths"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-xs">
          <p className="font-semibold tracking-tight">Walk Wilmington</p>
          <p className="mt-2 text-sm text-muted-foreground">
            A student urban planning project for Wilmington, MA.
          </p>
          <div className="mt-5 flex gap-1.5" aria-hidden>
            {paths.map((p) => (
              <span
                key={p.id}
                className="h-1 w-6 rounded-full"
                style={{ background: `var(--path-${p.id})` }}
              />
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="field-label">Pages</p>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="field-label">The paths</p>
          <ul className="mt-3 space-y-2 text-sm">
            {paths.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{ background: `var(--path-${p.id})` }}
                />
                <Link
                  href={`/the-paths#${p.slug}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-page flex flex-col gap-1 border-t border-border py-5 font-mono text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>Wilmington, MA · 42.546° N, 71.174° W</span>
        <span>Last updated {site.lastUpdated}</span>
      </div>
    </footer>
  )
}
