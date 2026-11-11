import type { Metadata } from "next"

import { pageMetadata } from "@/lib/site"
import Link from "next/link"

import { FinePage, FineSection } from "@/components/fine-print/fine-page"

export const metadata: Metadata = pageMetadata({
  title: "Sources",
  description:
    "Where Walk Wilmington's maps, measurements, elevations, and facts come from.",
  path: "/sources",
})

export default function SourcesPage() {
  return (
    <FinePage
      title="Sources"
      current="/sources"
      intro={
        <p>
          Every map, number, and fact on this site comes from somewhere. Here&apos;s where, so you can check
          it yourself.
        </p>
      }
    >
      <FineSection title="The five paths and the hubs">
        <ul>
          <li>
            Each path was drawn and measured by me in Google Earth, then saved to a{" "}
            <a href="https://www.google.com/maps/d/viewer?mid=16-06Tuwcw1yQxwluXR7QMHZx_Q39nv4" target="_blank" rel="noreferrer">
              Google My Map
            </a>
            . The lines on every map here come straight from that map&apos;s KML file.
          </li>
          <li>
            The hub outlines are traced from my Google Earth hubs map, lined up with OpenStreetMap using
            landmarks (Silver Lake, nearby ponds, and I-93).
          </li>
          <li>Walk times use a pace of about 20 minutes per mile.</li>
        </ul>
      </FineSection>

      <FineSection title="Maps, streets, and places">
        <ul>
          <li>
            Streets, rail lines, water, parks, woods, the town line, and the places listed in each hub:{" "}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
              &copy; OpenStreetMap contributors
            </a>
            , downloaded through the{" "}
            <a href="https://overpass-api.de" target="_blank" rel="noreferrer">
              Overpass API
            </a>{" "}
            in November 2026.
          </li>
          <li>
            Highway mileage on The Problem page is measured along Routes 38, 62, and 129 inside the town
            line in that same data, with shared stretches counted once.
          </li>
          <li>
            Some places were double-checked against business listings (for example, McKinnon&apos;s
            Market on Lowell Street and Windsor Place on West Street).
          </li>
        </ul>
      </FineSection>

      <FineSection title="Elevation">
        <ul>
          <li>
            The hill charts on the Methodology page use ground heights every 40 meters along each path
            from the{" "}
            <a href="https://www.usgs.gov/3d-elevation-program" target="_blank" rel="noreferrer">
              USGS 3D Elevation Program
            </a>{" "}
            (1-meter lidar), through the{" "}
            <a href="https://epqs.nationalmap.gov" target="_blank" rel="noreferrer">
              Elevation Point Query Service
            </a>
            .
          </li>
          <li>The elevation numbers in the text come from Google Earth&apos;s elevation profiles.</li>
        </ul>
      </FineSection>

      <FineSection title="Plan Your Walk">
        <ul>
          <li>
            Walks follow the OpenStreetMap street network. &ldquo;Today&rdquo; is the shortest walk on the
            streets. &ldquo;With the paths&rdquo; adds the five paths and counts busy roads (state routes) as
            1.5 times as long.
          </li>
          <li>
            The routes don&apos;t know where sidewalks exist or about informal shortcuts, so they&apos;re for
            comparing, not for directions.
          </li>
        </ul>
      </FineSection>

      <FineSection title="Nearby examples and the town">
        <ul>
          <li>
            Tri-Community Greenway (Woburn, Winchester, Stoneham), 6.63 miles, opened in June 2019 as a
            $5 million MassDOT project:{" "}
            <a href="https://patch.com/massachusetts/stoneham/snip-ribbon-greenway-officially-opens" target="_blank" rel="noreferrer">
              Stoneham Patch
            </a>{" "}
            and{" "}
            <a href="https://www.traillink.com/trail/tri-community-greenway" target="_blank" rel="noreferrer">
              TrailLink
            </a>
            .
          </li>
          <li>
            Town of Wilmington{" "}
            <a href="https://www.wilmingtonma.gov/planning-conservation" target="_blank" rel="noreferrer">
              Planning &amp; Conservation Department
            </a>
            .
          </li>
        </ul>
      </FineSection>

      <FineSection title="Photos">
        <p>
          The aerial photos are my own drone shots of Wilmington. Path drawings are screenshots of my
          Google Earth work (imagery &copy; Google and its providers).
        </p>
      </FineSection>

      <FineSection title="How the site was built">
        <p>
          Hand-coded with Next.js, Tailwind CSS, Motion, and Lenis, with icons from Lucide and the Geist
          typeface. Hosted on Vercel. See the <Link href="/privacy">Privacy Policy</Link> for what that
          means for your data.
        </p>
      </FineSection>
    </FinePage>
  )
}
