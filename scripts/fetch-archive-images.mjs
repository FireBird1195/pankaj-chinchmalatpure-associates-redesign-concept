// Run locally ONLY after the practice has granted permission to use its images.
// Downloads the archive images referenced by the concept into assets/projects/.
// Usage: node scripts/fetch-archive-images.mjs
import { writeFile, mkdir } from "node:fs/promises";
const base = "https://www.chinchmalatpurearchitects.com/wp-content/uploads/2022/07/";
const map = {
  "apmc-nagpur-top.jpg": "A.P.M.C._NAGPUR_TOP-12.gif", // GIF on source; convert to JPEG/WebP after download
};
await mkdir(new URL("../assets/projects/", import.meta.url), { recursive: true });
for (const [out, src] of Object.entries(map)) {
  const res = await fetch(base + src);
  if (!res.ok) { console.error("Failed", src, res.status); continue; }
  const file = new URL("../assets/projects/" + out.replace(/\.jpg$/, ".gif"), import.meta.url);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log("Saved", file.pathname, "- convert to", out, "(e.g. squoosh / ImageMagick) at 1600px and 2400px widths");
}
