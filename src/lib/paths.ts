import geo from "./paths-geo.json"

export type Surface = "Paved" | "Unpaved"

export type WalkPath = {
  id: number
  slug: string
  name: string
  colorName: string
  hex: string
  from: string
  to: string
  route: string
  miles: number
  minutes: number
  surface: Surface
  summary: string
  writeup: string
  inTheWay: string
  image: string
  /** [lng, lat] pairs from the Google My Maps KML */
  coords: [number, number][]
  trailheads: { label: string; coord: [number, number] }[]
}

type Base = Omit<WalkPath, "coords" | "trailheads">

const base: Base[] = [
  {
    id: 1,
    slug: "north-wilmington",
    name: "North Wilmington Path",
    colorName: "Yellow",
    hex: "#FFD600",
    from: "North Wilmington",
    to: "The Center",
    route:
      "North Wilmington station area to the library and the high school in the center",
    miles: 1.3,
    minutes: 27,
    surface: "Unpaved",
    summary: "Connects North Wilmington to the Center.",
    writeup:
      "It starts at White Field, follows parts of Palmer Way and Douglas Ave, crosses Middlesex Ave, then runs along Middlesex Ave and Wildwood St past the library and Wildwood Cemetery. It ends near Wilmington High School at Adams St. A train station, a library, and a high school on one walk.",
    inTheWay:
      "It passes a pond and wet ground near Lubbers Brook, so parts may need a boardwalk.",
    image: "/images/path-1-north-wilmington.png",
  },
  {
    id: 2,
    slug: "main-street",
    name: "Main Street Path",
    colorName: "Red",
    hex: "#A52714",
    from: "Wilmington Crossing",
    to: "The Center",
    route: "Wilmington Crossing down Main St, then Clark St to Church St",
    miles: 0.9,
    minutes: 18,
    surface: "Paved",
    summary: "Connects Wilmington Crossing to the Center.",
    writeup:
      "A widened sidewalk runs down Main Street from Wilmington Crossing, then turns onto Clark Street and ends at Church Street.",
    inTheWay:
      "Route 38 traffic and a long run of plaza driveways. This is the only path that follows a major road, because there's no way around it.",
    image: "/images/path-2-main-street.png",
  },
  {
    id: 3,
    slug: "rotary-park",
    name: "Rotary Park Connector",
    colorName: "Blue",
    hex: "#3949AB",
    from: "Center Crossroads",
    to: "Rotary Park trails",
    route: "Center Crossroads area to the Rotary Park trails",
    miles: 0.3,
    minutes: 6,
    surface: "Paved",
    summary: "Connects Center Crossroads to the Rotary Park trails.",
    writeup:
      "It's the shortest of the five, but it puts a real trail network a few minutes from the commuter rail station. Allows pedestrians to avoid part of the busy Center Crossroads intersection.",
    inTheWay: "",
    image: "/images/path-3-rotary-park.png",
  },
  {
    id: 4,
    slug: "butters-row",
    name: "Butters Row Path",
    colorName: "Orange",
    hex: "#F57C00",
    from: "Center Crossroads",
    to: "Yentile Area",
    route: "Center Crossroads to Yentile Area",
    miles: 0.8,
    minutes: 17,
    surface: "Unpaved",
    summary: "Connects Center Crossroads to the Yentile Area.",
    writeup:
      "It runs behind the commercial buildings off Main Street and comes out at Butters Row.",
    inTheWay:
      "The path crosses land behind commercial lots, so the owners would need to be on board.",
    image: "/images/path-4-butters-row.png",
  },
  {
    id: 5,
    slug: "yentile-east",
    name: "Yentile-East Path",
    colorName: "Purple",
    hex: "#673AB7",
    from: "Yentile Area",
    to: "West St. Cluster",
    route: "Yentile trail, across Woburn St, to West St Cluster",
    miles: 2.0,
    minutes: 40,
    surface: "Paved",
    summary: "Connects the Yentile Area to the West St. Cluster.",
    writeup:
      "The longest of the five, it starts at the Yentile Farm trail, loops south around the office and industrial campuses, crosses Woburn Street, and comes back up near West Street.",
    inTheWay:
      "A Woburn Street crossing and private campus land. It stops at the West St. Cluster because the I-93 interchange just past it isn't walkable.",
    image: "/images/path-5-yentile-east.png",
  },
]

const norm = (s: string) => s.toLowerCase().replace(/connecter/, "connector")

export const paths: WalkPath[] = base.map((p) => {
  const line = geo.lines.find((l) => norm(l.name) === norm(p.name))
  const trailheads = geo.points
    .filter((pt) => norm(pt.name).startsWith(norm(p.name)))
    .map((pt) => ({
      label: pt.name.split("- ")[1] ?? pt.name,
      coord: pt.coord as [number, number],
    }))
  return {
    ...p,
    coords: (line?.coords ?? []) as [number, number][],
    trailheads,
  }
})

export const totalMiles = 5.4
