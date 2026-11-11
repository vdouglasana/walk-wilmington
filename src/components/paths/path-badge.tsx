import { cn } from "@/lib/utils"

/** A path's number on its own map color (dark text on yellow so it stays readable) */
export function PathBadge({ id, className }: { id: number; className?: string }) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full font-mono font-semibold", className ?? "size-6 text-[11px]")}
      style={{ background: `var(--path-${id})`, color: id === 1 ? "#1a1a1a" : "#fff" }}
    >
      {id}
    </span>
  )
}
