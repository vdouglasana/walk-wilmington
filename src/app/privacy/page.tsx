import type { Metadata } from "next"

import { pageMetadata } from "@/lib/site"
import Link from "next/link"

import { FinePage, FineSection } from "@/components/fine-print/fine-page"

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What Walk Wilmington collects (very little), where it goes, and how to ask for it to be deleted.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return (
    <FinePage
      title="Privacy Policy"
      current="/privacy"
      intro={
        <p>
          The short version: this site doesn&apos;t track you, doesn&apos;t show ads, and never sells
          anything. The only personal information it collects is what you choose to type into the
          contact form, and that only goes to me.
        </p>
      }
    >
      <FineSection title="What the contact form collects">
        <p>
          If you send a message, the form collects your name, your email, and anything else you choose
          to add: a phone number, the path you care about most, and your message.
        </p>
        <p>
          The form is run by a free service called{" "}
          <a href="https://web3forms.com/privacy" target="_blank" rel="noreferrer">
            Web3Forms
          </a>
          , which passes your message to my email inbox. It isn&apos;t used for anything else: no mailing
          lists, no sharing, no selling.
        </p>
      </FineSection>

      <FineSection title="What the site doesn't do">
        <ul>
          <li>No accounts or sign-ups.</li>
          <li>No ads, and no tracking or advertising cookies.</li>
          <li>No visitor analytics right now. If that changes, this page will say so first.</li>
        </ul>
      </FineSection>

      <FineSection title="Other services the site uses">
        <ul>
          <li>
            <strong>Hosting.</strong> The site is hosted on{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">
              Vercel
            </a>
            , which keeps basic technical logs (like your IP address and browser type) to keep the site
            running and secure.
          </li>
          <li>
            <strong>Google Maps.</strong> The &ldquo;Google satellite&rdquo; view on the Maps page only loads
            if you click it, and the &ldquo;Directions&rdquo; buttons open Google Maps. Once you use either,{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              Google&apos;s privacy policy
            </a>{" "}
            applies.
          </li>
          <li>
            <strong>Shared trip links.</strong> On Plan Your Walk, the two places you pick are saved in the
            page&apos;s web address so you can share the trip. Nothing is stored anywhere else.
          </li>
        </ul>
      </FineSection>

      <FineSection title="How long messages are kept">
        <p>
          Messages stay in my email for as long as I need them to reply and to keep improving the
          project. If you&apos;d like yours deleted, just ask through the{" "}
          <Link href="/about-contact#contact">contact form</Link> and I&apos;ll delete it.
        </p>
      </FineSection>

      <FineSection title="If you're under 13">
        <p>Please ask a parent or guardian before sending a message.</p>
      </FineSection>

      <FineSection title="Changes and questions">
        <p>
          If this policy changes, the date at the top will change too. Questions? Send them through the{" "}
          <Link href="/about-contact#contact">contact form</Link>.
        </p>
      </FineSection>
    </FinePage>
  )
}
