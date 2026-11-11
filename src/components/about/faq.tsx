import { PlusIcon } from "lucide-react"

export type FaqItem = { q: string; a: React.ReactNode }

/**
 * Questions and answers that open and close. Built on the browser's own
 * <details> element, so it works with a keyboard and screen readers, even without JavaScript.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-medium tracking-[-0.01em] transition-colors hover:text-foreground/80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border transition-transform duration-300 group-open:rotate-45">
              <PlusIcon className="size-4" aria-hidden />
            </span>
          </summary>
          <div className="max-w-2xl pb-6 text-pretty text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:decoration-foreground/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-foreground">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  )
}
