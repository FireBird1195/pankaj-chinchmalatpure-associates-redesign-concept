"""Convert the practice's published images into web sizes. Usage: python3 process_images.py SRC_DIR OUT_DIR"""
import sys, os
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
M = {
 "A.P.M.C._NAGPUR_TOP-12.jpg":"apmc-godowns","VEGETABLE_MARKET-3.jpg":"apmc-market-shed","FINAL-A.P.M.C.-NAGPUR-1.jpg":"apmc-auditorium",
 "PEARL-HERITAGE-TOP-VIEW-2.jpg":"pearl-heritage-top","PEARL-HERITAGE-ROW-HOUSES-3.jpg":"pearl-heritage-row-houses","PEARL-HERITAGE-CLUB-HOUSE-5-3.jpg":"pearl-heritage-club-house",
 "PEARL-HERITAGE-FLATS-1.jpg":"pearl-heritage-flats","PEARL-HERITAGE-ENTRANCE-3.jpg":"pearl-heritage-entrance","ENTRANCE-GATE.jpg":"nostalgia-gate",
 "BUNGALOW_01BHK.jpg":"township-bungalow-1","BUNGALOW_02BHK.jpg":"township-bungalow-2","BUNGALOW_02BHK_BIRDS-EYE-VIEW.jpg":"township-bungalow-2-aerial","BIRDS-EYE-VIEW.png":"township-aerial",
 "KONARK_CHAMBERS.jpg":"konark-chambers","HOSTEL_NAGPUR-1.jpg":"hostel-nagpur","ushkaal-render-3600-1.jpg":"ushakaal-render",
 "USHAKAAL_09-1.gif":"ushakaal-09","USHAKAAL_03-1.jpg":"ushakaal-03","USHAKAAL_04-1.jpg":"ushakaal-04","USHAKAAL_05-1.jpg":"ushakaal-05","USHAKAAL_06-1.jpg":"ushakaal-06",
 "USHAKAAL_10-1.jpg":"ushakaal-10","USHAKAAL_12-1.jpg":"ushakaal-12","USHAKAAL_01-02-1.jpg":"ushakaal-01-02","SHALWAK-RESIDENCY.jpg":"shalwak-residency","VIJAYA-VILLA-1.jpg":"vijaya-villa",
 "SWARA_RESIDENCY.jpg":"swara-residency","RAJE-BHONSALE_MAHAL.jpg":"raje-bhonsale-mahal","R.-K.jpg":"rk","Aryaditya-Developers.jpg":"aryaditya-a","Aryaditya-Developers-1.jpg":"aryaditya-b",
 "1.jpg":"flat-scheme-1","3.gif":"flat-scheme-2",
 "Tiwari-2.jpg":"bungalow-01","Rahul-Tarekar-1.jpg":"bungalow-02","Priti-Fule-Nagpur-1.jpg":"bungalow-03","Panwelkar-Nagpur-4.jpg":"bungalow-04","2-1.jpg":"bungalow-05","1-1.jpg":"bungalow-06",
 "HARODE.png":"bungalow-07","HUSUKALE.png":"bungalow-08","KAKDE.png":"bungalow-09","KHAPAREY.png":"bungalow-10","DEO-2.jpg":"bungalow-11","CHARDE-KATOL-4.jpg":"bungalow-12",
 "AMBADE.png":"bungalow-13","Bezalwar-Yavatmal-1.jpg":"bungalow-14","3-1.jpg":"bungalow-15",
 "PC-S-85-800x501-1.gif":"int-living-01","PC-S-98-1.jpg":"int-bedroom-01","PC-S-84.jpg":"int-living-02","3.jpeg":"int-bedroom-02","4.jpeg":"int-living-03","5.jpeg":"int-living-04",
 "6.jpeg":"int-kids-01","7.jpeg":"int-wall-01","8.jpeg":"int-kids-02","PC-Int-P-19.jpg":"int-parlour-01","PC-Int-P-18.jpg":"int-parlour-02","DSC_0006-1.jpg":"int-office-01",
 "DSC_0004.jpg":"int-office-02","2.jpeg":"int-office-03","IMG_5908.gif":"int-ceiling-01",
 "Ar.-ARUN-CHINCHMALATPURE.jpg":"portrait-arun","Ar.-PANKAJ-CHINCHMALATPURE.jpg":"portrait-pankaj",
}
missing=[]; sizes={}
for f, name in M.items():
    p = os.path.join(src, f)
    if not os.path.exists(p): missing.append(f); continue
    im = Image.open(p); im.seek(0); im = im.convert("RGB")
    im.save(os.path.join(out, name + ".webp"), "WEBP", quality=82, method=6)
    t = im.copy(); t.thumbnail((480, 480)); t.save(os.path.join(out, name + "-sm.webp"), "WEBP", quality=78, method=6)
    sizes[name] = im.size
for f in ("Logo.png", "Logo_A.png"):
    if os.path.exists(os.path.join(src, f)):
        Image.open(os.path.join(src, f)).save(os.path.join(out, f.lower().replace("_", "-")))
import json; json.dump(sizes, open(os.path.join(out, "sizes.json"), "w"))
print("missing:", missing); print(len(sizes), "processed")
