import { createRequire } from "node:module"; const { chromium } = createRequire(import.meta.url)(process.env.PW || "playwright");
import http from "node:http"; import { readFile } from "node:fs/promises"; import path from "node:path";
const root = path.resolve(process.argv[2] || ".");
const types = {".html":"text/html",".css":"text/css",".js":"text/javascript",".woff2":"font/woff2",".svg":"image/svg+xml"};
const srv = http.createServer(async (q,s)=>{ let p=decodeURIComponent(q.url.split("?")[0]); if(p.endsWith("/"))p+="index.html";
  try{const b=await readFile(path.join(root,p)); s.writeHead(200,{"content-type":types[path.extname(p)]||"application/octet-stream"}); s.end(b);}catch{ s.writeHead(404); s.end("nf");}}).listen(4173);
const b = await chromium.launch(); const out=[];
const pages=["index.html","case-study-apmc.html"]; const vps=[[390,844],[768,1024],[1024,768],[1440,900]];
for (const pg of pages) for (const [w,h] of vps) {
  const p = await b.newPage({viewport:{width:w,height:h}}); const errs=[]; const bad=[];
  p.on("console",m=>{if(m.type()==="error")errs.push(m.text())}); p.on("pageerror",e=>errs.push(e.message));
  p.on("response",r=>{ if(r.status()>=400) bad.push(r.status()+" "+r.url())});
  await p.goto("http://localhost:4173/"+pg,{waitUntil:"networkidle"});
  await p.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,60))}scrollTo({top:0,behavior:'instant'})}); await p.waitForTimeout(900);
  const ov = await p.evaluate(()=>document.documentElement.scrollWidth - innerWidth);
  const robots = await p.$eval('meta[name=robots]',m=>m.content);
  const anchors = await p.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute("href")).filter(h=>h.length>1&&!document.querySelector(h)));
  await p.screenshot({path:`qa/screens/${pg.replace(".html","")}-${w}.png`,fullPage:true});
  out.push({pg,w,overflow:ov,robots,brokenAnchors:anchors,consoleErrors:errs,badResponses:bad});
  await p.close();
}
// form test
const p = await b.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
await p.goto("http://localhost:4173/index.html");
await p.locator("#enquiry-form button[type=submit]").scrollIntoViewIfNeeded(); await p.click("#enquiry-form button[type=submit]");
const errsShown = await p.$$eval(".error",e=>e.map(x=>x.textContent).filter(Boolean));
const focused = await p.evaluate(()=>document.activeElement.name);
await p.check('input[value=home]'); await p.fill("#f-name","Test Person"); await p.fill("#f-phone","12");
await p.fill("#f-brief","A bungalow on a plot in Nagpur, about two storeys."); await p.locator("#enquiry-form button[type=submit]").scrollIntoViewIfNeeded(); await p.click("#enquiry-form button[type=submit]");
const phoneErr = await p.textContent("#f-phone-err");
await p.fill("#f-phone","98765 43210"); await p.locator("#enquiry-form button[type=submit]").scrollIntoViewIfNeeded(); await p.click("#enquiry-form button[type=submit]");
const done = await p.isVisible("#enquiry-done"); const doneText = await p.textContent("#enquiry-done h3");
let reqs=0; p.on("request",()=>reqs++);
await p.click("#enquiry-again"); const formBack = await p.isVisible("#enquiry-form");
// filter + lightbox
await p.click('.index-tools [data-f=home]'); const vis = await p.$$eval("#idx-body tr",l=>l.filter(x=>!x.hidden).length);
const counts = await p.evaluate(()=>{const c={};PCA_ARCHIVE.forEach(x=>c[x.type]=(c[x.type]||0)+1);c.all=PCA_ARCHIVE.length;return c});
const tabCounts = await p.$$eval('.index-tools button',b=>b.map(x=>x.textContent)); const chCounts = await p.$$eval('#idx-body tr',r=>{const c={};r.forEach(x=>c[x.dataset.ch]=(c[x.dataset.ch]||0)+1);return c});
await p.click('.zmap .pt[data-id=saoner]'); const ro = await p.textContent('#readout');
await p.click('#idx-body tr:not([hidden]) button'); const lbOpen = await p.isVisible('#lightbox'); await p.keyboard.press('ArrowRight'); const lbTitle = await p.textContent('#lb-title'); await p.keyboard.press('Escape'); const lbClosed = !(await p.isVisible('#lightbox'));
const brokenImgs = await p.evaluate(async()=>{const bad=[];for(const x of PCA_ARCHIVE){for(const s of ['','-sm']){const ok=await new Promise(r=>{const i=new Image();i.onload=()=>r(1);i.onerror=()=>r(0);i.src='assets/img/'+x.file+s+'.webp'});if(!ok)bad.push(x.file+s)}}return bad});
// menu
await p.click(".menu-toggle"); const menuOpen = await p.isVisible("#site-nav a[href='#market']"); await p.keyboard.press("Escape"); const menuClosed = !(await p.isVisible("#site-nav a[href='#market']"));
// keyboard: first tab goes to skip link
await p.goto("http://localhost:4173/index.html"); await p.keyboard.press("Tab"); const firstTab = await p.evaluate(()=>document.activeElement.textContent);
out.push({form:{errsShown:errsShown.length,focused,phoneErr,done,doneText,networkRequestsAfterSubmit:reqs,formBack},filterInteriorRows:vis,counts,tabCounts,chCounts,ro,lbOpen,lbTitle,lbClosed,brokenImgs,menuOpen,menuClosed,firstTab});
console.log(JSON.stringify(out,null,1)); await b.close(); srv.close();
