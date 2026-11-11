import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Methodology: how the five paths were picked"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({ kicker: "Methodology", title: "How I picked", soft: "the paths." })
}
