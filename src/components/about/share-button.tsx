"use client"

import { useState } from "react"
import { CheckIcon, Share2Icon } from "lucide-react"

/** Opens the phone's share sheet, or copies the link on a computer */
export function ShareButton({ url, title, text }: { url: string; title: string; text: string }) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title, text })
      } catch {
        // they closed the share sheet; nothing to do
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt("Copy this link:", url)
    }
  }
  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {copied ? <CheckIcon className="size-4" aria-hidden /> : <Share2Icon className="size-4" aria-hidden />}
      <span aria-live="polite">{copied ? "Link copied!" : "Share the project"}</span>
    </button>
  )
}
