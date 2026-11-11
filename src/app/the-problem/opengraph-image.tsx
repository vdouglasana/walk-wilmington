import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "The Problem: why Wilmington is hard to walk, with its hubs outlined on a map"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({ kicker: "The Problem", title: "Close on the map.", soft: "Far on foot.", focus: "hubs" })
}
