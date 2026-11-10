import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export const metadata = {
  title: "Page not found",
}

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70svh] flex-col justify-center py-24">
      <p className="field-label">Error 404 · Off the map</p>
      <h1 className="mt-5 max-w-3xl text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance">
        This sidewalk just ends.
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted-foreground">
        The page you&apos;re looking for isn&apos;t here. Let&apos;s get you back on a path.
      </p>
      <Link
        href="/"
        className="group mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85"
      >
        <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
        Back to home
      </Link>
    </section>
  )
}
