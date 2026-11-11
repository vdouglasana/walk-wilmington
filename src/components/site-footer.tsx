import Link from "next/link"

import { finePrint, nav, site } from "@/lib/site"
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
      {/* the fine print: small, quiet, but always one click away */}
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-5 font-mono text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Fine print">
            <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
              {finePrint.map((item, i) => (
                <li key={item.href} className="flex items-center gap-x-1">
                  {i > 0 && (
                    <span aria-hidden className="text-muted-foreground/50">
                      ·
                    </span>
                  )}
                  <Link
                    href={item.href}
                    className="rounded px-0.5 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <span>© {site.lastUpdatedISO.slice(0, 4)} Walk Wilmington</span>
            <span>42.546° N, 71.174° W</span>
            <span>Updated {site.lastUpdated}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
