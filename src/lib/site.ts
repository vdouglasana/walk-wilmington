import type { Metadata } from "next"

export const site = {
  name: "Walk Wilmington",
  title: "Walk Wilmington | Walking Paths for Wilmington, MA",
  description:
    "A student-led plan for five walking paths connecting Wilmington, MA's hubs. 5.4 miles of paved and unpaved paths, one connected town.",
  // The live address. On Vercel this is the project's main domain (walkwilmington.vercel.app
  // for now, walkwilmington.com once it's connected), so links and share images always work.
  url: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://walkwilmington.com",
  // Update this when the site changes.
  lastUpdated: "November 2026",
  lastUpdatedISO: "2026-11-11",
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/the-problem", label: "The Problem" },
  { href: "/the-paths", label: "The Paths" },
  { href: "/methodology", label: "Methodology" },
  { href: "/maps", label: "Maps" },
  { href: "/plan-your-walk", label: "Plan Your Walk" },
  { href: "/about-contact", label: "About" },
] as const

/** Small links that only live in the footer (and a short line under the contact form) */
export const finePrint = [
  { href: "/about-contact#faq", label: "FAQ" },
  { href: "/sources", label: "Sources" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
] as const

/**
 * Page title, description, link, and share-preview text in one go, so the text that
 * shows up when someone shares a page matches the page.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} | ${site.name}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path, siteName: site.name, type: "website" },
    twitter: { card: "summary_large_image", title: full, description },
  }
}
