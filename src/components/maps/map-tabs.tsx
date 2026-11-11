"use client"

import { useState } from "react"
import { ExternalLinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const MY_MAPS_ID = "16-06Tuwcw1yQxwluXR7QMHZx_Q39nv4"

/**
 * Two ways to look: our drawn trail map, or Vinny's original Google My Maps (satellite,
 * real zoom). The Google map only loads when someone opens that tab, so the page stays fast
 * and Google isn't contacted unless you ask for it.
 */
export function MapTabs({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<"trail" | "google">("trail")
  const tabs = [
    { id: "trail" as const, label: "Trail map" },
    { id: "google" as const, label: "Google satellite" },
  ]
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Map type" className="inline-flex rounded-full border border-border bg-card p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                tab === t.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <a
          href={`https://www.google.com/maps/d/viewer?mid=${MY_MAPS_ID}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
        >
          Open full map in Google Maps
          <ExternalLinkIcon className="size-3.5" aria-hidden />
        </a>
      </div>

      <div id="panel-trail" role="tabpanel" hidden={tab !== "trail"}>
        {children}
      </div>
      <div id="panel-google" role="tabpanel" hidden={tab !== "google"}>
        {tab === "google" && (
          <div className="overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
            <iframe
              src={`https://www.google.com/maps/d/embed?mid=${MY_MAPS_ID}`}
              title="Walk Wilmington paths on Google My Maps"
              loading="lazy"
              className="block h-[70svh] min-h-[420px] w-full border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </div>
  )
}
