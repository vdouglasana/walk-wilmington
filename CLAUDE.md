# Walk Wilmington: Website Rebuild Brief

You are rebuilding walkwilmington.com, a student urban planning project by Vinny (Vincent Anastasia), a senior at Wilmington High School in Wilmington, MA, who wants to be an urban planner. The current site was made in Canva. The goal is a hand-coded site that looks slicker, cleaner, and genuinely unique, deployed on Vercel.

## How to work with Vinny

- Plan first. Before writing code, show Vinny a short plan (pages, sections, which components you'll use) and wait for his OK.
- Run the dev server early (`npm run dev`) so he can watch the site come together, and build in small steps he can see.
- Write in simple, plain language when explaining things. He is learning as he goes.
- Never use em dashes, in site copy or in messages to him. Use commas, periods, parentheses, or colons.
- Ask before installing anything big or adding paid services.
- Commit to git often with clear messages.
- Do NOT touch the domain or DNS. Vinny will point walkwilmington.com at Vercel himself once the new site is approved.

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- shadcn/ui as the base (most of the component libraries below install through the shadcn CLI)
- Motion (motion.dev) for all animation
- Deploy: GitHub repo, imported into Vercel

## Skills and tools to set up

Run these at the start:

```bash
npx skills add benjitaylor/skills --skill stageshow
npm install motion
npx motion-ai
```

- **Stageshow** (benji.org/stageshow): a skill plus React kit for polished UI illustrations (browser windows, phones, cursors, bento grids). Follow its design rules everywhere, not just where you use the kit: real words only on what matters, one clear focal point per section, crop with intent, no generic AI look.
- **Motion** (motion.dev): scroll animations (useScroll), layout animations, springs, gestures. Use the free library only, not Motion+.

## Component libraries (pull from these instead of building from scratch)

Check each site's docs for the exact install command before using it. Pick only what fits; do not pile on effects.

- **Magic UI** (magicui.design): 150+ free animated components (React, Tailwind, Motion, shadcn).
- **Componentry** (componentry.dev): animated components via `npx shadcn@latest add @componentry/<component>`.
- **Skiper UI** (skiper-ui.com): bold, attention grabbing effects via `npx shadcn add @skiper-ui/<component>`.
- **Cult UI** (cult-ui.com): components that adapt to the site theme (docks, popovers, Dynamic Island).
- **Kokonut UI** (kokonutui.com): ready-made pieces like scroll-animated text, built on Motion.
- **BKLit UI**: chart components. Search for its docs if needed. Good for path stats.
- **dqnamo Kitchen** (dqnamo.com/kitchen): copy-paste React components with full source on each page. Especially relevant: Ticket (perforated ticket, uses `react-parallax-tilt`), Stamp, Animated Signature (SVG that draws itself), Logo Trace Loader.

## Inspiration (look, don't copy code)

- details.so: web design examples by section (heroes, footers, transitions). Most of the library is paid, use only what's free.
- refero.design: huge library of real UI screenshots with search.
- designspells.com: micro-interactions and small delightful details.
- motion.dev and dqnamo.com themselves: restraint, confident type, one strong visual per screen.

## Design direction

- **Light, paper trail map feel.** Warm off-white background, near-black text, lots of white space. It should feel familiar compared to the current site but much cleaner.
- **Color:** the UI itself stays neutral. The only strong colors are the five path colors (below), used as data: on the map, on each path's ticket, in stats.
- **Type:** one clean sans for reading, plus a monospace font for path data (distances, walk times, surface, coordinates) so it reads like field notes.
- **One big moment:** a large, confident headline on the homepage. Everything else stays calm.
- **Signature ideas (pick 3 or 4, not all):**
  1. The five real paths drawing themselves across a map of Wilmington as you scroll (use the KML coordinates, see Maps below).
  2. Each path presented as a perforated "trail pass" ticket (name, color, from/to, length, time, surface).
  3. Trailhead "stamps."
  4. Animated stat counters for "5 paths · 5.4 miles."
- **Avoid:** purple glows, sparkles, gradient everything, stacking flashy effects. That's what makes vibe coded sites all look the same.

## Pages and content

Keep the same structure as the current site. Use Vinny's text as written (lightly fix line breaks from Canva; don't rewrite his voice). The live site is still up at walkwilmington.com if you need to double check anything.

### Home
- Headline: "Let's walk, Wilmington"
- Subhead: "Wilmington, MA wasn't built for walking. Here's how it could be."
- Label: "The Walk Wilmington Project"
- "A Quick Overview: Five paths. One question: what if you could cross town without walking along a major roadway?"
- Four steps:
  - Step 1, Idea: Each route started with Wilmington's busiest areas, or "hubs," and the easiest way to walk between them.
  - Step 2, Mapped: Each path drawn and measured in Google Earth: length, walk time, and elevation.
  - Step 3, Proposed: Five walking paths, paved or dirt, using the woods, brooks, and parks that already sit between Wilmington's hubs.
  - Step 4, Brought to Wilmington!: Neighboring towns already walk on paths like these. Wilmington could be next.
- Closing: "Wilmington's hubs are already close together. The paths between them just don't exist yet. It's time to Walk, Wilmington!"
- Stat line: "5 paths · 5.4 miles · Wilmington connected"

### The Problem
- "How Wilmington got this way": Wilmington isn't a town with roads running through it. It's a set of state highways with a town built around them. Routes 38, 62, and 129 were built to move regional traffic through what is otherwise a residential suburb. That's why walking here looks the way it does. Nobody designed it badly. Nobody designed it at all.
- "A network that isn't a network": Wilmington has sidewalks. What it doesn't have is continuity. A sidewalk that ends at a property line is not infrastructure, it's a fragment. The problem isn't quantity, it's connection.
- Photo caption: "Red circles mark where the sidewalk ends. And this is just one spot in town."
- "Wilmington's Hubs: Close on the map. Far on foot."
- "The Opportunity": You don't have to walk along a highway to get across town. Between Wilmington's hubs there are woods, brooks, parks, and back lots. Most of that space already exists. What's missing is a path through it. A walking path doesn't need a road, it needs a route.
- Button: "Go to the Paths!"

### The Paths
- Intro: "Five paths. 5.4 miles. One connected town." Each path uses land that's already there: woods, brook edges, parks, and back lots. Some would be paved, some would be unpaved. All of them would let you get somewhere without walking along a major roadway.

| # | Path | Map color | Hex | From and to | Length | Walk time | Surface |
|---|---|---|---|---|---|---|---|
| 1 | North Wilmington Path | Yellow | #FFD600 | North Wilmington station area to the library and the high school in the center | 1.3 mi | 27 min | Unpaved |
| 2 | Main Street Path | Red | #A52714 | Wilmington Crossing down Main St, then Clark St to Church St | 0.9 mi | 18 min | Paved |
| 3 | Rotary Park Connector | Blue | #3949AB | Center Crossroads area to the Rotary Park trails | 0.3 mi | 6 min | Paved |
| 4 | Butters Row Path | Orange | #F57C00 | Center Crossroads to Yentile Area | 0.8 mi | 17 min | Unpaved |
| 5 | Yentile-East Path | Purple | #673AB7 | Yentile trail, across Woburn St, to West St Cluster | 2.0 mi | 40 min | Paved |

Path writeups:

1. **North Wilmington Path** (1.3 miles, 27 minutes, unpaved): Connects North Wilmington to the Center. It starts at White Field, follows parts of Palmer Way and Douglas Ave, crosses Middlesex Ave, then runs along Middlesex Ave and Wildwood St past the library and Wildwood Cemetery. It ends near Wilmington High School at Adams St. A train station, a library, and a high school on one walk. What's in the way: it passes a pond and wet ground near Lubbers Brook, so parts may need a boardwalk.
2. **Main Street Path** (0.9 miles, 18 minutes, paved): Connects Wilmington Crossing to the Center. A widened sidewalk runs down Main Street from Wilmington Crossing, then turns onto Clark Street and ends at Church Street. What's in the way: Route 38 traffic and a long run of plaza driveways. This is the only path that follows a major road, because there's no way around it.
3. **Rotary Park Connector** (0.3 miles, 6 minutes, paved): Connects Center Crossroads to the Rotary Park trails. It's the shortest of the five, but it puts a real trail network a few minutes from the commuter rail station. Allows pedestrians to avoid part of the busy Center Crossroads intersection.
4. **Butters Row Path** (0.8 miles, 17 minutes, unpaved): Connects Center Crossroads to the Yentile Area. It runs behind the commercial buildings off Main Street and comes out at Butters Row. What's in the way: the path crosses land behind commercial lots, so the owners would need to be on board.
5. **Yentile-East Path** (2.0 miles, 40 minutes, paved): Connects the Yentile Area to the West St. Cluster. The longest of the five, it starts at the Yentile Farm trail, loops south around the office and industrial campuses, crosses Woburn Street, and comes back up near West Street. What's in the way: a Woburn Street crossing and private campus land. It stops at the West St. Cluster because the I-93 interchange just past it isn't walkable.

"Linking the Five": Because the paths share hubs, the five already form one chain:
- North Wilmington Path and Main Street Path both end in the Center
- Rotary Park Connector and Butters Row Path both start at Center Crossroads
- Butters Row Path hands off to Yentile Path in the Yentile Area
- The only gap: a short sidewalk link between the Center and Center Crossroads, which happens to be suitable for walking.

That turns five paths into one route, linking the major hubs of Wilmington together.

### Methodology
"How I picked the paths:"
1. Found the hubs: Using aerial photos, I outlined the places people actually go: shopping plazas, the town center, train stations, schools, and job clusters.
2. Looked for the land in between: Instead of following the roads, I looked for woods, brook edges, parks, and back lots that already connect the hubs.
3. Drew and measured each path: Every path was drawn in Google Earth and measured for length and walk time.
4. Checked what's nearby: The Tri-Community Greenway in Woburn, Winchester, and Stoneham shows paths like these get built in towns like ours.

"Important Findings": The biggest elevation change on any path is about 43 feet, spread over 2 miles on the Yentile-East Path. The rest change by 23 feet or less. Wilmington is flat enough that hills aren't the problem, allowing for geographic peace of mind when it comes to actual path planning.

"Honest Limits": This is a student project, not an engineering study. Elevation numbers come from Google Earth and are approximate. Before any path could be built, the town would need to confirm land ownership, check wetland rules with the Conservation Commission, and estimate costs.

"This project was just me, my computer, drone, and passion for urban planning, all coming together to improve my hometown."

### Maps
- "All five paths on one map. Click, zoom, and look." Legend uses the five path colors.
- Google My Maps ID: `16-06Tuwcw1yQxwluXR7QMHZx_Q39nv4`
  - Embed: https://www.google.com/maps/d/embed?mid=16-06Tuwcw1yQxwluXR7QMHZx_Q39nv4
  - KML export (real path coordinates): https://www.google.com/maps/d/kml?mid=16-06Tuwcw1yQxwluXR7QMHZx_Q39nv4&forcekml=1
- 10 trailheads, one at each end of every path (North/South for paths 1 to 4, West/East for Yentile-East).
- Use the KML to draw the real paths yourself (for example as animated SVG or with a map library). Keep the Google embed as a fallback or "open full map" option. If the KML download fails, ask Vinny to export it from My Maps (menu, Download KML) and drop it in the project.

### About / Contact
- "A little about me": I'm Vinny, a senior at Wilmington High School who wants to be an urban planner. I started the Walk Wilmington Project because getting around this town on foot shouldn't mean walking along busy roads. These paths only happen if people in town want them.
- "Let's make beautiful walking trails like this a reality!"
- "Three ways you can help!"
  1. Tell me where you already walk. Shortcuts, worn dirt trails, places you wish you could cut through. Local knowledge makes the map better.
  2. Share the project. Send it to a neighbor, a teacher, or anyone who's ever tried to walk anywhere in town and found it inconvenient.
  3. Talk to the town. If a path matters to you, tell the Planning Department or the Conservation Commission.
- "Let's build a walkable future for Wilmington, together!"
- Contact form fields: Full name (required), Email (required), Phone (optional), "Which path do you care about most?" (dropdown of the five), Message.
- The old form was a Canva widget and won't carry over. Replace it with a free form service that emails submissions (Formspree or Web3Forms). Ask Vinny which email to use.

## Images from the current site

Vinny has no separate path photos; use what's on the current site (his drone shots, map screenshots, diagrams). Download these into `/public/images`, check each one, and tell Vinny which ones look blurry or are missing (a few on the old site loaded in ways that can't be downloaded).

Homepage: 
- https://walkwilmington.com/_assets/media/9aabfebf4f24ecc7eb0cbcc4cf074406.jpg
- https://walkwilmington.com/_assets/media/6ac9211e4c02506ef2c74d1d478b7511.png
- https://walkwilmington.com/_assets/media/5cea13fbf927dc19613bf4360c27af5f.jpg

The Problem:
- https://walkwilmington.com/_assets/media/6fec6b6b95edfa6549fc7b56881ac9ba.png
- https://walkwilmington.com/_assets/media/6568ec7b597e2d7cd99cedb0321e893c.jpg
- https://walkwilmington.com/_assets/media/6d406b43343d9eb8fa570633a2c8fcd7.jpg
- https://walkwilmington.com/_assets/media/e894dc6c008e016aa16bd81fb843a28d.png
- https://walkwilmington.com/_assets/media/2d86332eea516d4d8de8100084d98df5.png
- https://walkwilmington.com/_assets/media/0570bc6966c7bd0817c057153a18dbcc.png
- https://walkwilmington.com/_assets/media/d796a7189cfff26d54a0dd3f3ae3333b.jpg
- https://walkwilmington.com/_assets/media/8f2465b17d3875990a788c3ba1da4027.jpg (sidewalk gaps, red circles)
- https://walkwilmington.com/_assets/media/97830dc155008d3aa1078e973ccf638d.png
- https://walkwilmington.com/_assets/media/25c776af6e39a333f6788879102cb4f1.png

The Paths (path maps in order 1 to 5, then overview images):
- https://walkwilmington.com/_assets/media/76daa601dddb122669077227b22bb8a7.png (North Wilmington)
- https://walkwilmington.com/_assets/media/c94db74c20e9d95a41586a1bafca97c8.png (Main Street)
- https://walkwilmington.com/_assets/media/27225053534434b9cd5462a88813a851.png (Rotary Park)
- https://walkwilmington.com/_assets/media/b8811aefad1bdb55e8df62047270e0a6.png (Butters Row)
- https://walkwilmington.com/_assets/media/74e53bb2a2560b0c67bb67556fd063c8.png (Yentile-East)
- https://walkwilmington.com/_assets/media/5f077a4d289cb6b8d7b945a6388e660b.png
- https://walkwilmington.com/_assets/media/1be935b24ea63805cf0b713a5674aff0.jpg
- https://walkwilmington.com/_assets/media/6339a99d4725cdf137bae01c78f7212f.png

Methodology:
- https://walkwilmington.com/_assets/media/14de79d7c6c33e0df4ca6e78769f028d.jpg
- https://walkwilmington.com/_assets/media/ef7b8fb94dc1b85272d587b48c6531a0.png
- https://walkwilmington.com/_assets/media/13e99c4a5add3ae476671393473c11ea.png
- https://walkwilmington.com/_assets/media/94905b68f713e39fae12d766cc859776.png
- https://walkwilmington.com/_assets/media/003ae7b88db26894042088b82132bd42.png
- https://walkwilmington.com/_assets/media/0c103f6a0831005633d884c80970d2a0.jpg

About:
- https://walkwilmington.com/_assets/media/e809109f0a120dc08c59fc0a7885fa9b.png
- https://walkwilmington.com/_assets/media/843444b397ac768c1e417482449242ab.jpg

Site-wide:
- Favicon: https://walkwilmington.com/_assets/images/f72e43d724622bc06ea583954e5f5f3d.png
- Social share image: https://walkwilmington.com/_assets/images/ad36d9fd930251ba9b9d09508cd9a234.jpg
- If Vinny has a sharper logo file, use that instead.

## SEO (reuse the current site's wording)

- Site title: "Walk Wilmington | Walking Paths for Wilmington, MA"
- Site description: "A student-led plan for five walking paths connecting Wilmington, MA's hubs. 5.4 miles of paved and unpaved paths, one connected town."
- Page titles and descriptions:
  - The Problem: "The Problem - Why Wilmington Is Hard to Walk" / "Wilmington grew up around Routes 38, 62, and 129. See why its sidewalks don't connect and why the town's hubs feel far apart on foot."
  - The Paths: "The Paths - The Five Paths" / "Five proposed walking paths from North Wilmington to the West St. Cluster, with maps, lengths, walk times, and what's in the way."
  - Methodology: "Methodology - How I Picked the Paths" / "How the five paths were chosen: finding Wilmington's hubs, looking for the land between them, and measuring length, walk time, and elevation."
  - Maps: "Maps - Interactive Map" / "Explore all five proposed walking paths in Wilmington, MA on one interactive map, with trailheads at both ends of every path."
  - About/Contact: "About & Get Involved" / "Meet the Wilmington High School senior behind Walk Wilmington and find out how you can help make these paths happen."
  (Replace the hyphen separators with a colon or pipe if you like; no em dashes.)

## Features to include

- Mobile menu, sticky header, hover states, scroll progress bar, back to top button
- Dark mode toggle (light is the default)
- Skip to content link, good contrast, keyboard friendly, respects reduced motion
- Expandable FAQ if it fits (for example "Who would build these?" or "Is this an official town plan?"), but only with answers Vinny approves
- "Last updated" date in the footer
- Form success and error states

## Before launch checklist

Favicon, meta titles and descriptions, social share image, custom 404 page, alt text on every image, robots.txt, sitemap.xml, canonical URLs, mobile check, accessibility check, test the contact form, check for broken links, and optimize performance (next/image, lazy loading). Add Vercel Analytics only if Vinny wants it; if so, add a short privacy note.

## Deploy

1. Create a GitHub repo and push the project.
2. Help Vinny import the repo into Vercel and share the preview link (something.vercel.app).
3. Stop there. Vinny will review it, then add walkwilmington.com in Vercel (Settings, Domains) and update the DNS records in Canva himself.
