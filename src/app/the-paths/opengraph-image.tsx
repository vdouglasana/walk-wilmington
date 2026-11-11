import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "The Paths: five paths, 5.4 miles, one connected town"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({ kicker: "The Paths", title: "Five paths. 5.4 miles.", soft: "One connected town." })
}
