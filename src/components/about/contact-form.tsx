"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckCircle2Icon, Loader2Icon, SendIcon, TriangleAlertIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Set in Vercel (Project settings, Environment Variables) and in a local .env.local file.
// Web3Forms emails each message to the address the key was made with.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY

type Status = "idle" | "sending" | "sent" | "error"

const field =
  "mt-1.5 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base transition-colors placeholder:text-muted-foreground/70 focus-visible:border-foreground/50 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"

/**
 * The contact form. It sends through Web3Forms (free), so there's no server to run.
 * Shows clear "sending", "sent", and "something went wrong" states.
 */
export function ContactForm({ pathNames }: { pathNames: string[] }) {
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!ACCESS_KEY) {
      setStatus("error")
      setError("The form isn't connected yet. Please try again soon.")
      return
    }
    setStatus("sending")
    setError("")
    const data = new FormData(form)
    data.append("access_key", ACCESS_KEY)
    data.append("subject", `Walk Wilmington: new message from ${data.get("name") || "a visitor"}`)
    data.append("from_name", "Walk Wilmington website")
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
      const json = await res.json()
      if (json.success) {
        setStatus("sent")
        form.reset()
      } else {
        setStatus("error")
        setError(json.message || "Something went wrong.")
      }
    } catch {
      setStatus("error")
      setError("Couldn't reach the server. Check your connection and try again.")
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[28rem] flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center"
            role="status"
          >
            <CheckCircle2Icon className="size-12 text-[color-mix(in_oklch,var(--brand-green)_75%,var(--foreground))]" aria-hidden />
            <p className="mt-5 text-2xl font-semibold tracking-[-0.03em]">Thanks, message sent!</p>
            <p className="mt-2 max-w-sm text-pretty text-muted-foreground">
              I read every one. If you left an email, I&apos;ll get back to you.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-full border border-foreground/20 px-4 py-2 text-sm font-medium hover:border-foreground/50"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
          >
            {/* hidden from people; bots fill it in and get ignored */}
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Full name <span className="text-muted-foreground">(required)</span>
                <input name="name" required autoComplete="name" className={field} />
              </label>
              <label className="block text-sm font-medium">
                Email <span className="text-muted-foreground">(required)</span>
                <input name="email" type="email" required autoComplete="email" className={field} />
              </label>
              <label className="block text-sm font-medium">
                Phone <span className="text-muted-foreground">(optional)</span>
                <input name="phone" type="tel" autoComplete="tel" className={field} />
              </label>
              <label className="block text-sm font-medium">
                Which path do you care about most?
                <select name="path" defaultValue="" className={cn(field, "appearance-auto")}>
                  <option value="">Pick one (optional)</option>
                  {pathNames.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                  <option>All of them!</option>
                </select>
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Message
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Where do you already walk? Shortcuts, worn dirt trails, places you wish you could cut through..."
                  className={cn(field, "resize-y")}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" aria-hidden />
                    Sending...
                  </>
                ) : (
                  <>
                    Send message
                    <SendIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground">Your info only goes to me. No mailing lists.</p>
            </div>

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-lg border border-[#e5533f]/40 bg-[#e5533f]/10 p-3 text-sm"
                >
                  <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-[#c4402e]" aria-hidden />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
