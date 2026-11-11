import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Plan Your Walk: compare a walk in Wilmington today vs. with the paths"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({ kicker: "Plan Your Walk", title: "Your walk,", soft: "today vs. with the paths." })
}
