"""Generates the Zero Mile map SVG and its data and injects them into index.html between
<!--MAP:START--> and <!--MAP:END-->. Distances are approximate straight-line km from the
Zero Mile Stone (21.1498 N, 79.0806 E), from public town coordinates (see docs/VERIFICATION.md)."""
import math, json, re, html, sys
Z = (21.1498, 79.0806)
PLACES = [
 # id, en, mr, lat, lon, chapters, clients (as listed by the practice), note
 ("kalamna","Kalamna","कळमना",21.168,79.128,["market"],["A.P.M.C. Nagpur — vegetable godowns, J. N. Market Yard"],"Read the case study","case-study-apmc.html"),
 ("kalmeshwar","Kalmeshwar","कळमेश्वर",21.2321,78.9180,["market"],["Agricultural Produce Market Committee, Kalmeshwar"],"",""),
 ("patansawangi","Patansawangi","पाटणसावंगी",21.3272,79.0219,["school"],["Ganesh Prasadik Shikshan Sanstha (listed as “Tatansawangi”)"],"Place name to be confirmed",""),
 ("saoner","Saoner","सावनेर",21.3858,78.9201,["market","mill"],["Agricultural Produce Market Committee, Saoner","Babasaheb Kedar Ginning Pressing & Prakriya Sanstha"],"",""),
 ("parseoni","Parshiwani","पारशिवनी",21.3757,79.1520,["market"],["Agricultural Produce Market Committee, Parshiwani"],"",""),
 ("katol","Katol","काटोल",21.27,78.58,["market"],["Agricultural Produce Market Committee, Katol"],"A cotton-trading town",""),
]
R_KM = 4.6   # px per km
C = 300
def pos(lat, lon):
    dy = (lat - Z[0]) * 110.57
    dx = (lon - Z[1]) * 111.32 * math.cos(math.radians((lat + Z[0]) / 2))
    return dx, dy, math.hypot(dx, dy)
out = []
out.append('<svg class="zmap" viewBox="0 0 600 600" role="group" aria-labelledby="zm-t zm-d">')
out.append('<title id="zm-t">Map: where the practice has worked, measured from Zero Mile, Nagpur</title>')
out.append('<desc id="zm-d">A radial map centred on the Zero Mile Stone in Nagpur with rings at 10, 25 and 50 km. Each town is a button; select one to see the practice\'s clients there. Positions are approximate.</desc>')
out.append(f'<line class="axis" x1="{C}" y1="20" x2="{C}" y2="580"/><line class="axis" x1="20" y1="{C}" x2="580" y2="{C}"/>')
for km in (10, 25, 50):
    r = km * R_KM
    out.append(f'<circle class="ring{" major" if km==50 else ""}" cx="{C}" cy="{C}" r="{r:.1f}"/>')
    out.append(f'<text class="ring-l" x="{C+4}" y="{C + r + 13:.1f}">{km} KM</text>')
out.append(f'<text class="ring-l" x="{C+6}" y="30">N</text>')
data = {}
for i,(pid,en,mr,la,lo,ch,cl,note,href) in enumerate(PLACES):
    dx, dy, d = pos(la, lo)
    x, y = C + dx * R_KM, C - dy * R_KM
    left = dx < 0 and pid != "patansawangi"
    tx = x - 12 if left else x + 12
    anchor = "end" if left else "start"
    if pid == "patansawangi": y_off = 22
    else: y_off = 0
    data[pid] = {"en":en,"mr":mr,"km":round(d),"ch":ch,"cl":cl,"note":note,"href":href}
    out.append(f'<line class="ray" data-for="{pid}" x1="{C}" y1="{C}" x2="{x:.1f}" y2="{y:.1f}"/>')
    out.append(f'<g class="pt" tabindex="0" role="button" data-id="{pid}" aria-label="{html.escape(en)}, about {round(d)} km from Zero Mile" style="animation-delay:{0.6+i*0.12:.2f}s">'
               f'<circle class="hit" cx="{x:.1f}" cy="{y:.1f}" r="16"/><circle class="halo" cx="{x:.1f}" cy="{y:.1f}" r="13"/><circle class="dot" cx="{x:.1f}" cy="{y:.1f}" r="5.5"/>'
               f'<text x="{tx:.1f}" y="{y-2+y_off:.1f}" text-anchor="{anchor}">{html.escape(en)}</text>'
               f'<text class="mr" lang="mr" x="{tx:.1f}" y="{y+13+y_off:.1f}" text-anchor="{anchor}">{mr}</text>'
               f'<text class="km" x="{tx:.1f}" y="{y+27+y_off:.1f}" text-anchor="{anchor}">{round(d)} KM</text></g>')
# Mumbai arrow (off-map, bearing ~251°)
mb = math.radians(251)
ax, ay = C + math.sin(mb) * 285, C - math.cos(mb) * 285
out.append(f'<g class="pt" tabindex="0" role="button" data-id="mumbai" aria-label="Mumbai, about 690 km from Zero Mile" style="animation-delay:1.5s">'
           f'<circle class="hit" cx="{ax:.1f}" cy="{ay:.1f}" r="16"/><circle class="halo" cx="{ax:.1f}" cy="{ay:.1f}" r="13"/>'
           f'<path d="M{ax+8:.1f} {ay-3:.1f} L{ax-8:.1f} {ay+3:.1f}" stroke="#211D1A" stroke-width="1.5"/><circle class="dot" cx="{ax-8:.1f}" cy="{ay+3:.1f}" r="3.5"/>'
           f'<text x="{ax+4:.1f}" y="{ay+22:.1f}" text-anchor="start">Mumbai →</text><text class="km" x="{ax+4:.1f}" y="{ay+36:.1f}">≈690 KM</text></g>')
data["mumbai"] = {"en":"Mumbai","mr":"मुंबई","km":690,"ch":["city"],"cl":["Padmadeep Developers","Ruby Constructions Corporation"],"note":"Off the map: two Mumbai developers are on the client list","href":""}
# Centre
out.append(f'<g class="pt centre on" tabindex="0" role="button" data-id="nagpur" aria-label="Zero Mile, Nagpur — the practice\'s base">'
           f'<circle class="hit" cx="{C}" cy="{C}" r="20"/><circle class="halo" cx="{C}" cy="{C}" r="16"/>'
           f'<rect x="{C-7}" y="{C-7}" width="14" height="14" fill="#F3754D" stroke="#211D1A" stroke-width="1.5" transform="rotate(45 {C} {C})"/>'
           f'<text x="{C-14}" y="{C+36}" text-anchor="end">Zero Mile, Nagpur</text><text class="mr" lang="mr" x="{C-14}" y="{C+51}" text-anchor="end">झिरो माईल, नागपूर</text></g>')
data["nagpur"] = {"en":"Nagpur","mr":"नागपूर","km":0,"ch":["school","mill","city","home"],
  "cl":["Vidya Shikshan Prasarak Mandal — school and college buildings","Maharashtra Rajya Shikshan Sanstha","Babasaheb Kedar Shetkari Sahakari Soot Girni","Kusumtai Wankhede Hall","Ushakaal-9, Vinoba Gram layout — for Swapna Shilp Developers","11 Nagpur developers · bungalows · interiors"],
  "note":"The practice's base since 1980","href":""}
out.append('</svg>')
svg = "\n".join(out)
block = "<!--MAP:START-->\n" + svg + "\n<script>window.PCA_PLACES=" + json.dumps(data, ensure_ascii=False) + "</script>\n<!--MAP:END-->"
p = sys.argv[1] if len(sys.argv) > 1 else "index.html"
s = open(p, encoding="utf-8").read()
s = re.sub(r"<!--MAP:START-->.*?<!--MAP:END-->", lambda m: block, s, flags=re.S)
open(p, "w", encoding="utf-8").write(s)
print({k:v["km"] for k,v in data.items()})
