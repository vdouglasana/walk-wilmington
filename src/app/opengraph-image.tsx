import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Walk Wilmington: five walking paths for Wilmington, MA, shown on a map of the town"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({ kicker: "Walk Wilmington", title: "Let's walk,", soft: "Wilmington." })
}
