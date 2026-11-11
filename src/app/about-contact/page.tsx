import type { Metadata } from "next"

import Image from "next/image"
import Link from "next/link"
import { ArrowDownIcon, ExternalLinkIcon, FootprintsIcon, LandmarkIcon, Share2Icon } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SectionCue } from "@/components/section-cue"
import { ContactForm } from "@/components/about/contact-form"
import { ShareButton } from "@/components/about/share-button"
import { Faq, type FaqItem } from "@/components/about/faq"
import { Timeline, type Milestone } from "@/components/about/timeline"
import { paths } from "@/lib/paths"
import { pageMetadata, site } from "@/lib/site"

export const metadata: Metadata = pageMetadata({
  title: "About & Get Involved",
  description:
    "Meet the Wilmington High School senior behind Walk Wilmington and find out how you can help make these paths happen.",
  path: "/about-contact",
})

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="field-label flex items-center gap-2">
      <span aria-hidden className="flex gap-1">
        <span className="size-2 rounded-full bg-brand-green" />
        <span className="size-2 rounded-full bg-brand-blue" />
      </span>
      {children}
    </p>
  )
}


// Where the project stands, in time order. Update it as things happen.
const milestones: Milestone[] = [
  {
    status: "done",
    when: "",
    title: "Found the hubs and drew five paths",
    text: "Mapped Wilmington's busiest areas, then drew and measured five paths between them in Google Earth.",
  },
  {
    status: "done",
    when: "",
    title: "First Walk Wilmington website",
    text: "Put the idea online for the first time, built in Canva.",
  },
  {
    status: "now",
    when: "November 2026",
    title: "A new walkwilmington.com",
    text: "Interactive maps, real elevation data, and Plan Your Walk, so anyone can see what the paths would change.",
  },
  {
    status: "next",
    when: "",
    title: "Hear where people already walk",
    text: "Collect shortcuts, worn trails, and wish-I-could-walk-here spots from neighbors to make the map better.",
  },
  {
    status: "next",
    when: "",
    title: "Share the plan with the town",
    text: "Bring the paths to the Planning Department and the Conservation Commission.",
  },
  {
    status: "later",
    when: "",
    title: "Keep improving the paths",
    text: "Adjust the routes based on what neighbors and the town say.",
  },
]

const faq: FaqItem[] = [
  {
    q: "Is this an official town plan?",
    a: (
      <p>
        No. Walk Wilmington is a student project, not a plan from the Town of Wilmington, and no town
        board has approved it. The goal is to start a conversation and show what&apos;s possible, then
        share it with the Planning Department and the Conservation Commission.
      </p>
    ),
  },
  {
    q: "Who would build these paths?",
    a: (
      <p>
        That would be up to the town. Projects like this usually start with town departments and boards
        deciding it&apos;s worth studying, then a design by engineers, with chances for residents to weigh
        in along the way.
      </p>
    ),
  },
  {
    q: "Who would pay for it?",
    a: (
      <p>
        Usually a mix of town money and state or federal grants. The nearby Tri-Community Greenway, for
        example, was a $5 million state project paid for with federal and state money. Massachusetts also
        has grant programs for trails (like MassTrails), and unpaved paths generally cost much less to
        build than paved ones.
      </p>
    ),
  },
  {
    q: "Who owns the land?",
    a: (
      <p>
        It depends on the path. Some of the land is parks or conservation land, and some is private,
        like the back lots behind businesses. Before anything could be built, the town would need to
        confirm who owns each stretch, and private owners would have to agree.
      </p>
    ),
  },
  {
    q: "What about wetlands?",
    a: (
      <p>
        A few paths pass brooks and wet ground. Any work near wetlands has to be reviewed by the
        Conservation Commission, and wet stretches can use a raised boardwalk, like the one the North
        Wilmington Path may need near Lubbers Brook.
      </p>
    ),
  },
  {
    q: "Why not just add more sidewalks?",
    a: (
      <p>
        Sidewalks help, and Wilmington has gaps worth filling. But a sidewalk along Route 38 or Route 62
        is still a walk next to fast traffic. The paths use the land between the hubs instead, so the
        walk is calmer and often shorter. Try a trip on <Link href="/plan-your-walk">Plan Your Walk</Link>{" "}
        to see the difference.
      </p>
    ),
  },
  {
    q: "Can I walk the paths now?",
    a: (
      <p>
        Not yet. They&apos;re proposals, and many cross private land, so please don&apos;t go looking for
        them on the ground. The best way to help them exist is on this page: tell me where you walk, share
        the project, and talk to the town.
      </p>
    ),
  },
]

export default function AboutPage() {
  return (
    <>
      {/* 1. About me */}
      <section className="container-page pt-14 pb-8 sm:pt-20 sm:pb-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] md:items-center md:gap-16">
          <Reveal>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="overflow-hidden rounded-[2rem] bg-muted shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] ring-1 ring-border">
                <Image
                  src="/images/method-6.jpg"
                  alt="Vinny, smiling, standing in a doorway"
                  width={400}
                  height={400}
                  priority
                  sizes="(min-width: 768px) 384px, 90vw"
                  className="aspect-square h-auto w-full object-cover"
                />
              </div>
              {/* a little trail-pass stub, in the five path colors */}
              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-md">
                <span aria-hidden className="flex gap-1">
                  {paths.map((p) => (
                    <span key={p.id} className="size-2.5 rounded-full" style={{ background: `var(--path-${p.id})` }} />
                  ))}
                </span>
                <span className="font-mono text-[11px] whitespace-nowrap">The Walk Wilmington Project</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Label>About</Label>
            <h1 className="mt-5 text-[clamp(2.6rem,6.5vw,5.25rem)] leading-[0.94] font-semibold tracking-[-0.05em] text-balance">
              A little{" "}
              <span className="text-muted-foreground">about me.</span>
            </h1>
            <p className="mt-6 text-lg text-pretty text-muted-foreground sm:text-xl">
              I&apos;m Vinny, a senior at Wilmington High School who wants to be an urban planner. I started
              the Walk Wilmington Project because getting around this town on foot shouldn&apos;t mean walking
              along busy roads.
            </p>
            <p className="mt-5 border-l-2 border-foreground pl-4 text-2xl leading-snug font-medium tracking-[-0.02em] text-balance">
              These paths only happen if people in town want them.
            </p>
            <a
              href="#help"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              See how you can help
              <ArrowDownIcon className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
            </a>
          </Reveal>
        </div>
        <SectionCue className="pt-16 sm:pt-20" />
      </section>

      {/* 2. Trails like this */}
      <section className="relative overflow-hidden bg-neutral-900 text-white">
        <Image
          src="/images/paths-overview-2.jpg"
          alt="A paved walking path curving through autumn woods, with two people walking in the distance"
          fill
          sizes="100vw"
          quality={60}
          className="object-cover object-[50%_60%]"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.75),rgb(0_0_0/0.2)_60%,rgb(0_0_0/0.35))]" />
        <div className="container-page relative flex min-h-[70svh] items-end py-16 sm:py-24">
          <Reveal className="max-w-3xl">
            <p className="text-[clamp(2.2rem,5.6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance">
              Let&apos;s make beautiful walking trails like this a reality!
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. Three ways to help */}
      <section id="help" className="grain scroll-mt-16 bg-band">
        <div className="container-page pt-20 sm:pt-28">
          <Reveal className="max-w-3xl">
            <Label>Get Involved</Label>
            <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance">
              Three ways{" "}
              <span className="text-muted-foreground">you can help!</span>
            </h2>
          </Reveal>

          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                id: 1,
                icon: FootprintsIcon,
                title: "Tell me where you already walk.",
                body: "Shortcuts, worn dirt trails, places you wish you could cut through. Local knowledge makes the map better.",
                action: (
                  <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90">
                    Tell me below
                    <ArrowDownIcon className="size-4" aria-hidden />
                  </a>
                ),
              },
              {
                id: 2,
                icon: Share2Icon,
                title: "Share the project.",
                body: "Send it to a neighbor, a teacher, or anyone who's ever tried to walk anywhere in town and found it inconvenient.",
                action: <ShareButton url={site.url} title={site.title} text="Five walking paths that could connect Wilmington, MA." />,
              },
              {
                id: 3,
                icon: LandmarkIcon,
                title: "Talk to the town.",
                body: "If a path matters to you, tell the Planning Department or the Conservation Commission.",
                action: (
                  <a
                    href="https://www.wilmingtonma.gov/planning-conservation"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Planning &amp; Conservation
                    <ExternalLinkIcon className="size-4" aria-hidden />
                  </a>
                ),
              },
            ].map(({ id, icon: Icon, title, body, action }, i) => (
              <li key={id} className="h-full">
                <Reveal delay={i * 0.08} className="h-full">
                <div
                  style={{ "--c": `var(--path-${[2, 3, 5][i]})` } as React.CSSProperties}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <div className="h-1.5 bg-[var(--c)]" aria-hidden />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-full bg-[color-mix(in_oklch,var(--c)_16%,var(--card))]">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="font-mono text-5xl font-semibold tracking-[-0.06em] text-foreground/10">0{id}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                    <p className="mt-2 flex-1 text-pretty text-muted-foreground">{body}</p>
                    <div className="mt-6">{action}</div>
                  </div>
                </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
        <SectionCue className="pb-8 sm:pb-10" />
      </section>

      {/* 4. Where things stand */}
      <section className="container-page pt-20 pb-8 sm:pt-28 sm:pb-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <Reveal>
            <Label>What&apos;s Next</Label>
            <h2 className="mt-4 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance">
              Where things{" "}
              <span className="text-muted-foreground">stand.</span>
            </h2>
            <p className="mt-5 max-w-sm text-pretty text-muted-foreground">
              The project keeps moving. Check back to see what&apos;s new.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Timeline items={milestones} />
          </Reveal>
        </div>
        <SectionCue />
      </section>

      {/* 5. Contact */}
      <section id="contact" className="container-page scroll-mt-16 py-20 sm:py-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <Reveal>
            <Label>Contact</Label>
            <h2 className="mt-4 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance">
              Let&apos;s build a walkable future for Wilmington,{" "}
              <span className="text-muted-foreground">together!</span>
            </h2>
            <div className="relative mt-10 hidden overflow-hidden rounded-2xl md:block">
              <Image
                src="/images/about-2.jpg"
                alt="Drone view of Wilmington Center: the high school, the Town Common, and Middlesex Avenue running north into the woods"
                width={1600}
                height={1200}
                sizes="40vw"
                className="h-auto w-full"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] text-white">
                The Center, from my drone
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ContactForm pathNames={paths.map((p) => p.name)} />
            <p className="mt-4 text-xs text-pretty text-muted-foreground">
              By sending a message, you agree to the{" "}
              <Link href="/terms" className="underline decoration-foreground/30 underline-offset-4 hover:text-foreground">
                Terms of Use
              </Link>
              . See the{" "}
              <Link href="/privacy" className="underline decoration-foreground/30 underline-offset-4 hover:text-foreground">
                Privacy Policy
              </Link>{" "}
              for what happens to your message.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="grain scroll-mt-16 bg-paper">
        <div className="container-page grid gap-10 py-20 sm:py-28 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <Reveal>
            <Label>FAQ</Label>
            <h2 className="mt-4 text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance">
              Questions{" "}
              <span className="text-muted-foreground">people ask.</span>
            </h2>
            <p className="mt-5 max-w-sm text-pretty text-muted-foreground">
              Have one that isn&apos;t here? <a href="#contact" className="text-foreground underline decoration-foreground/30 underline-offset-4">Ask me</a>.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Faq items={faq} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
