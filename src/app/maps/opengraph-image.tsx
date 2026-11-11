import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Maps: all five proposed paths on one interactive map"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({ kicker: "Maps", title: "All five paths", soft: "on one map." })
}
