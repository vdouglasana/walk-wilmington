import type { MetadataRoute } from "next"

import { finePrint, nav, site } from "@/lib/site"

/** Every page on the site, so search engines can find them all */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.lastUpdatedISO)
  const main = nav.map((item, i) => ({
    url: `${site.url}${item.href === "/" ? "" : item.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: i === 0 ? 1 : 0.8,
  }))
  // the fine-print pages (the FAQ link is a spot on the About page, so it's skipped)
  const fine = finePrint
    .filter((f) => !f.href.includes("#"))
    .map((f) => ({ url: `${site.url}${f.href}`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 }))
  return [...main, ...fine]
}
