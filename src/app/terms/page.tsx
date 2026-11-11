import type { Metadata } from "next"

import { pageMetadata } from "@/lib/site"
import Link from "next/link"

import { FinePage, FineSection } from "@/components/fine-print/fine-page"

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Walk Wilmington is a student project, not an official town plan. Here's how to use what's on this site.",
  path: "/terms",
})

export default function TermsPage() {
  return (
    <FinePage
      title="Terms of Use"
      current="/terms"
      intro={
        <p>
          Walk Wilmington is a student urban planning project. By using this site, you agree to these
          simple terms.
        </p>
      }
    >
      <FineSection title="This isn't an official town plan">
        <p>
          The five paths are proposals from a high school student. They are not a plan from, or
          endorsed by, the Town of Wilmington or any town board. Nothing here has been approved,
          funded, or scheduled.
        </p>
      </FineSection>

      <FineSection title="The paths don't exist yet">
        <p>
          Many of the proposed paths cross woods, wetlands, and private land. Please don&apos;t go looking
          for them on the ground: respect &ldquo;No Trespassing&rdquo; signs and private property, stay on
          public sidewalks and trails, and use your own judgment about safety, especially near busy
          roads.
        </p>
      </FineSection>

      <FineSection title="Numbers are estimates">
        <p>
          Lengths, walk times, elevations, and the walks on Plan Your Walk are estimates for comparing
          ideas. They come from Google Earth, OpenStreetMap, and USGS data (see{" "}
          <Link href="/sources">Sources</Link>) and may be off. Don&apos;t use them as directions, and
          don&apos;t rely on them for engineering, legal, or safety decisions.
        </p>
      </FineSection>

      <FineSection title="Using what's here">
        <ul>
          <li>
            You&apos;re welcome to share links to the site and quote it with credit to Walk Wilmington.
          </li>
          <li>
            The writing, drone photos, and path drawings are mine. Please ask before reusing the photos.
          </li>
          <li>
            Map data is &copy;{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
              OpenStreetMap contributors
            </a>{" "}
            and is available under the Open Database License. Google imagery belongs to Google and its
            providers.
          </li>
        </ul>
      </FineSection>

      <FineSection title="Links to other sites">
        <p>
          Some links go to other websites (like the Town of Wilmington or Google Maps). I don&apos;t
          control those sites and am not responsible for what&apos;s on them.
        </p>
      </FineSection>

      <FineSection title="Changes">
        <p>
          These terms may be updated as the project grows. The date at the top shows the latest
          version. Questions? Use the <Link href="/about-contact#contact">contact form</Link>.
        </p>
      </FineSection>
    </FinePage>
  )
}
