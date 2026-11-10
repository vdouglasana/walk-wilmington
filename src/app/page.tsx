import { projectPaths } from "@/lib/geo"
import { Hero } from "@/components/home/hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { TrailPasses } from "@/components/home/trail-passes"
import { Closing } from "@/components/home/closing"

export default function Home() {
  const map = projectPaths()
  return (
    <>
      <Hero />
      <HowItWorks map={map} />
      <TrailPasses />
      <Closing />
    </>
  )
}
