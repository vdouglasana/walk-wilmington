"""
Builds src/lib/walks.json for the Plan Your Walk page.

For every pair of places, it finds a walking route twice on the OpenStreetMap street
network. Today: simply the shortest walk, since that's what people do now. With the
paths: the five proposed paths are added, and the route is the one most people would
pick once they exist: the shortest, but with busy roads (state routes, highway=primary or
secondary) counted as one and a half times as long, since most people will go a little out
of their way to use a path instead of walking along one. If a route barely touches the
paths, it's treated as the same walk as today.
Run with: python3 scripts/build-walks.py   (needs data/osm-raw.json, which is gitignored)
"""
import json, math, heapq

M_PER_DEG = 111320.0
K = math.cos(math.radians(42.55))
BUSY = {"primary", "primary_link", "secondary", "secondary_link", "trunk", "trunk_link"}
SKIP = {"motorway", "motorway_link"}
BUSY_PENALTY = 1.5

def dist(a, b):
    dx = (a[0] - b[0]) * K * M_PER_DEG
    dy = (a[1] - b[1]) * M_PER_DEG
    return math.hypot(dx, dy)

PLACES = [
    {"id": "nw-station", "name": "North Wilmington train stop", "hub": "North Wilmington", "c": [-71.15967, 42.56965]},
    {"id": "elias", "name": "Elia's grocery store", "hub": "North Wilmington", "c": [-71.15859, 42.56916]},
    {"id": "rmv", "name": "RMV office", "hub": "North Wilmington", "c": [-71.15940, 42.56775]},
    {"id": "whitefield", "name": "Whitefield ball field", "hub": "North Wilmington", "c": [-71.16090, 42.56722]},
    {"id": "market-basket", "name": "Market Basket", "hub": "Wilmington Crossing", "c": [-71.17833, 42.55535]},
    {"id": "cvs", "name": "CVS", "hub": "Wilmington Crossing", "c": [-71.18065, 42.55655]},
    {"id": "ristuccia", "name": "Ristuccia ice arena", "hub": "Wilmington Crossing", "c": [-71.17899, 42.55818]},
    {"id": "high-school", "name": "Wilmington High School", "hub": "Center", "c": [-71.16362, 42.55513]},
    {"id": "library", "name": "Memorial Library", "hub": "Center", "c": [-71.16399, 42.55753]},
    {"id": "common", "name": "Town Common", "hub": "Center", "c": [-71.16637, 42.55629]},
    {"id": "scanlon", "name": "Dick Scanlon Field", "hub": "Center", "c": [-71.16426, 42.55478]},
    {"id": "rotary-park", "name": "Rotary Park trails", "hub": "Rotary Park", "c": [-71.170972, 42.549863]},
    {"id": "station", "name": "Wilmington train station", "hub": "Center Crossroads", "c": [-71.17441, 42.54685]},
    {"id": "post-office", "name": "Post office", "hub": "Center Crossroads", "c": [-71.17297, 42.54780]},
    {"id": "yentile", "name": "Yentile Farm", "hub": "Yentile Area", "c": [-71.160888, 42.540196]},
    {"id": "colonial-park", "name": "Colonial Park Mall", "hub": "Yentile Area", "c": [-71.16558, 42.54136]},
    {"id": "mckinnons", "name": "McKinnon's Market", "hub": "Southern Commercial Area", "c": [-71.14829, 42.53843]},
    {"id": "legion", "name": "American Legion hall", "hub": "Southern Commercial Area", "c": [-71.15328, 42.54070]},
    {"id": "windsor", "name": "Windsor Place", "hub": "West St. Cluster", "c": [-71.13829, 42.53905]},
    {"id": "burger-king", "name": "Burger King", "hub": "West St. Cluster", "c": [-71.14190, 42.53941]},
]

raw = json.load(open("data/osm-raw.json"))
geo = json.load(open("src/lib/paths-geo.json"))
PATH_IDS = {"North Wilmington Path": 1, "Main Street Path": 2, "Rotary Park Connector": 3, "Rotary Park Connecter": 3, "Butters Row Path": 4, "Yentile-East Path": 5}

coord = {}
adj_road = {}

def add_edge(adj, a, b, kind):
    d = dist(coord[a], coord[b])
    adj.setdefault(a, []).append((b, d, kind))
    adj.setdefault(b, []).append((a, d, kind))

for e in raw["elements"]:
    if e["type"] != "way":
        continue
    hw = e.get("tags", {}).get("highway")
    if not hw or hw in SKIP:
        continue
    kind = "busy" if hw in BUSY else "street"
    nodes, g = e["nodes"], e["geometry"]
    for n, pt in zip(nodes, g):
        coord[n] = (pt["lon"], pt["lat"])
    for a, b in zip(nodes, nodes[1:]):
        add_edge(adj_road, a, b, kind)

road_nodes = list(adj_road.keys())

def nearest_road(c):
    return min(road_nodes, key=lambda n: dist(coord[n], c))

# the "with paths" network: today's streets plus the five paths
adj_paths = {k: list(v) for k, v in adj_road.items()}
for line in geo["lines"]:
    pid = PATH_IDS[line["name"]]
    pts = line["coords"]
    # densify to about every 20 m so the path can join the streets where it crosses them
    dense = [pts[0]]
    for a, b in zip(pts, pts[1:]):
        n = max(1, int(dist(a, b) // 20))
        for k in range(1, n + 1):
            dense.append([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n])
    ids = []
    for k, p in enumerate(dense):
        nid = f"p{pid}_{k}"
        coord[nid] = tuple(p)
        ids.append(nid)
    for a, b in zip(ids, ids[1:]):
        add_edge(adj_paths, a, b, f"p{pid}")
    # trailheads always connect to the nearest street; other points join a street they pass within 30 m of
    for k, nid in enumerate(ids):
        r = nearest_road(coord[nid])
        d = dist(coord[nid], coord[r])
        if k in (0, len(ids) - 1) and d < 200 or d < 30:
            add_edge(adj_paths, nid, r, "street")

def route(adj, src, dst, penalty):
    cost = {src: 0.0}
    prev = {}
    pq = [(0.0, src)]
    while pq:
        c, u = heapq.heappop(pq)
        if u == dst:
            break
        if c > cost.get(u, 1e18):
            continue
        for v, d, kind in adj.get(u, []):
            nc = c + d * (penalty if kind == "busy" else 1)
            if nc < cost.get(v, 1e18):
                cost[v] = nc
                prev[v] = (u, kind, d)
                heapq.heappush(pq, (nc, v))
    if dst not in prev and dst != src:
        return None
    steps = []
    u = dst
    while u != src:
        p, kind, d = prev[u]
        steps.append((p, u, kind, d))
        u = p
    steps.reverse()
    return steps

def simplify(pts, tol=6.0):
    if len(pts) < 3:
        return pts
    a, b = pts[0], pts[-1]
    def perp(p):
        ax, ay = a[0] * K * M_PER_DEG, a[1] * M_PER_DEG
        bx, by = b[0] * K * M_PER_DEG, b[1] * M_PER_DEG
        px, py = p[0] * K * M_PER_DEG, p[1] * M_PER_DEG
        L = math.hypot(bx - ax, by - ay) or 1e-9
        return abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / L
    i, dmax = max(((i, perp(p)) for i, p in enumerate(pts[1:-1], 1)), key=lambda t: t[1])
    if dmax > tol:
        return simplify(pts[: i + 1], tol)[:-1] + simplify(pts[i:], tol)
    return [a, b]

def summarize(steps, place_a, place_b, snap_a, snap_b):
    totals = {"busy": 0.0, "street": 0.0, "path": 0.0}
    segs = []
    # walking from the place itself to the street
    for _, _, kind, d in steps:
        totals["path" if kind.startswith("p") else kind] += d
    cur = None
    pts_all = [place_a] + [coord[snap_a]]
    for a, b, kind, d in steps:
        if cur is None or cur["t"] != kind:
            if cur:
                segs.append(cur)
            cur = {"t": kind, "c": [list(coord[a])]}
        cur["c"].append(list(coord[b]))
    if cur:
        segs.append(cur)
    for s in segs:
        s["c"] = [[round(x, 5), round(y, 5)] for x, y in simplify(s["c"])]
    mi = lambda m: round(m / 1609.344, 2)
    total = sum(totals.values())
    return {
        "miles": mi(total),
        "busyMiles": mi(totals["busy"]),
        "streetMiles": mi(totals["street"]),
        "pathMiles": mi(totals["path"]),
        "segs": segs,
    }

snaps = {}
path_nodes = [n for n in adj_paths if isinstance(n, str) and n.startswith("p")]
for p in PLACES:
    pid = "place:" + p["id"]
    coord[pid] = tuple(p["c"])
    r = nearest_road(p["c"])
    add_edge(adj_road, pid, r, "street")
    add_edge(adj_paths, pid, r, "street")
    near = min(path_nodes, key=lambda n: dist(coord[n], p["c"]))
    if dist(coord[near], p["c"]) < 80:
        add_edge(adj_paths, pid, near, "street")
    snaps[p["id"]] = pid
for p in PLACES:
    pass

pairs = {}
for i, a in enumerate(PLACES):
    for b in PLACES[i + 1 :]:
        sa, sb = snaps[a["id"]], snaps[b["id"]]
        today = route(adj_road, sa, sb, 1.0)
        withp = route(adj_paths, sa, sb, BUSY_PENALTY)
        t = summarize(today, a["c"], b["c"], sa, sb)
        w = summarize(withp, a["c"], b["c"], sa, sb)
        # if the paths don't really get used, it's the same walk as today
        if w["pathMiles"] < 0.05:
            w = t
        pairs[f'{a["id"]}|{b["id"]}'] = {"today": t, "paths": w}
        print(f'{a["name"]:28} -> {b["name"]:28} today {t["miles"]:.2f} mi (busy {t["busyMiles"]:.2f})  paths {w["miles"]:.2f} mi (busy {w["busyMiles"]:.2f}, on paths {w["pathMiles"]:.2f})')

json.dump(
    {"note": "Built by scripts/build-walks.py from OpenStreetMap streets and the five KML paths.", "busyPenalty": BUSY_PENALTY, "places": PLACES, "pairs": pairs},
    open("src/lib/walks.json", "w"),
    separators=(",", ":"),
)
