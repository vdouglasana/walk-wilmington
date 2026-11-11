import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "About Walk Wilmington and how you can help"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({ kicker: "About", title: "Let's build a walkable", soft: "Wilmington, together." })
}
