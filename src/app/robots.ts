import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

/** Lets search engines in everywhere and points them to the sitemap */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
