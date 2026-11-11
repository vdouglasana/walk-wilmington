import type { ProjectedMap } from "@/lib/geo"

const ns = { vectorEffect: "non-scaling-stroke" as const }

/**
 * A tiny "you are here" map: all five paths in gray, with this one in its color,
 * so you can see where in town it sits.
 */
export function PathLocator({ map, id, className }: { map: ProjectedMap; id: number; className?: string }) {
  const p = map.paths.find((x) => x.id === id)
  return (
    <svg
      viewBox={`0 0 ${map.width} ${map.height}`}
      className={className}
      role="img"
      aria-label={`Where the ${p?.name ?? "path"} sits among the five paths`}
    >
      {map.paths
        .filter((x) => x.id !== id)
        .map((x) => (
          <path key={x.id} d={x.d} fill="none" stroke="var(--muted-foreground)" strokeOpacity={0.5} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" {...ns} />
        ))}
      {p && (
        <>
          <path d={p.d} fill="none" stroke="var(--foreground)" strokeOpacity={0.25} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" {...ns} />
          <path d={p.d} fill="none" stroke={`var(--path-${id})`} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" {...ns} />
          {p.trailheads.map((t) => (
            <circle key={t.label} cx={t.x} cy={t.y} r={9} fill="var(--card)" stroke="var(--foreground)" strokeWidth={2} {...ns} />
          ))}
        </>
      )}
    </svg>
  )
}
