// Independent concept. Loads only local files; no storage; nothing leaves the browser.
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Menu */
  var toggle = $(".menu-toggle"), nav = $("#site-nav");
  if (toggle && nav) {
    var setMenu = function (o) { nav.classList.toggle("open", o); toggle.setAttribute("aria-expanded", String(o)); toggle.textContent = o ? "Close" : "Menu"; };
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); } });
  }

  /* Reveal */
  var rv = $$(".rv");
  if (rv.length && "IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* Hero milestones: the hovered or focused stone widens to show its work */
  var stones = $$(".road .stone");
  if (stones.length) {
    var setOn = function (el) { stones.forEach(function (s) { s.classList.toggle("on", s === el); }); };
    stones.forEach(function (st) {
      st.addEventListener("mouseenter", function () { setOn(st); });
      st.addEventListener("focus", function () { setOn(st); });
    });
    setOn(stones[0]);
  }

  /* Zero Mile map */
  var places = window.PCA_PLACES, chName = { market: "बाजार Market", mill: "गिरणी Mill", school: "शाळा School", city: "शहर City", home: "घर Home" };
  if (places && $(".zmap")) {
    var pts = $$(".zmap .pt");
    var select = function (id) {
      var p = places[id]; if (!p) return;
      pts.forEach(function (g) { g.classList.toggle("on", g.dataset.id === id); g.setAttribute("aria-pressed", String(g.dataset.id === id)); });
      $$(".zmap .ray").forEach(function (l) { l.classList.toggle("on", l.dataset.for === id); });
      $("#ro-km").innerHTML = (id === "mumbai" ? "≈" : "") + p.km + "<small>KM FROM ZERO MILE</small>";
      $("#ro-name").innerHTML = esc(p.en) + ' <span class="mr" lang="mr">' + p.mr + "</span>";
      $("#ro-note").innerHTML = esc(p.note || "") + (p.href ? (p.note ? " · " : "") + '<a href="' + p.href + '">Open</a>' : "");
      $("#ro-cl").innerHTML = p.cl.map(function (c) { return '<span class="chip">' + esc(c) + "</span>"; }).join("") +
        p.ch.map(function (c) { return '<a class="chip" href="#' + c + '">' + chName[c] + " →</a>"; }).join("");
    };
    pts.forEach(function (g) {
      g.addEventListener("click", function () { select(g.dataset.id); });
      g.addEventListener("mouseenter", function () { if (window.matchMedia("(hover:hover)").matches) select(g.dataset.id); });
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(g.dataset.id); } });
    });
    select("nagpur");
  }

  /* Chain: highlight the chapter in view (the last chapter whose top has passed 40% of the viewport) */
  var chainLinks = $$(".chain a"), chIds = ["market", "mill", "school", "city", "home"];
  if (chainLinks.length) {
    var ticking = false;
    var updateChain = function () {
      ticking = false;
      var line = window.innerHeight * 0.4, cur = null;
      chIds.forEach(function (id) { var s = document.getElementById(id); if (s && s.getBoundingClientRect().top <= line && s.getBoundingClientRect().bottom > 0) cur = id; });
      var past = document.getElementById("home"); if (past && past.getBoundingClientRect().bottom < line) cur = null;
      chainLinks.forEach(function (a) { a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + cur)); });
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(updateChain); } }, { passive: true });
    updateChain();
  }

  /* Archive data → series, rail, index, lightbox */
  var data = window.PCA_ARCHIVE || [];
  var chapterOf = function (p) {
    if (p.type === "public") return "market";
    if (p.id === "C-02") return "school";
    if (p.type === "commercial" || p.type === "flats" || p.type === "township") return "city";
    return "home";
  };
  var labelCh = { market: "बाजार Market", school: "शाळा School", city: "शहर City", home: "घर Home" };
  var byId = {}; data.forEach(function (p, i) { p.i = i; p.ch = chapterOf(p); byId[p.id] = p; });
  var kindTxt = function (p) { return p.kind === "photo" ? "Photograph" : "Rendering"; };

  var series = $("#series");
  if (series) {
    series.innerHTML = data.filter(function (p) { return /^ushakaal-\d/.test(p.file); }).map(function (p) {
      var n = p.title.replace("Ushakaal-", "");
      return '<li><button type="button" data-open="' + p.id + '" aria-label="Enlarge ' + esc(p.title) + '"><img src="assets/img/' + p.file + '-sm.webp" alt="Rendering of ' + esc(p.title) + '" loading="lazy" width="480" height="640"><span class="n" aria-hidden="true">' + esc(n) + "</span></button></li>";
    }).join("");
  }
  var rail = $("#rail");
  if (rail) {
    rail.innerHTML = data.filter(function (p) { return p.type === "bungalow"; }).map(function (p) {
      return '<li><button type="button" data-open="' + p.id + '"><img src="assets/img/' + p.file + '-sm.webp" alt="Rendering of ' + esc(p.title) + '" loading="lazy" width="480" height="360"><span class="t"><span>' + esc(p.title) + "</span><span>" + p.id + "</span></span></button></li>";
    }).join("");
    $$("[data-rail]").forEach(function (b) {
      b.addEventListener("click", function () { rail.scrollBy({ left: +b.dataset.rail * rail.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" }); });
    });
  }

  var body = $("#idx-body"), visible = data.map(function (p) { return p.i; });
  if (body) {
    body.innerHTML = data.map(function (p) {
      return '<tr data-ch="' + p.ch + '"><td>' + p.id + '</td><td><button type="button" data-open="' + p.id + '"><img src="assets/img/' + p.file + '-sm.webp" alt="" loading="lazy" width="58" height="43"><span>' + esc(p.title) + (p.sub && p.sub !== "Flat scheme" && p.sub !== "Township" && p.sub !== "Residential interior" ? ' <span class="muted" style="font-family:var(--sans);font-size:.85rem">· ' + esc(p.sub) + "</span>" : "") + "</span></button></td>" +
        '<td class="k hide-s">' + labelCh[p.ch] + '</td><td class="k hide-s">' + kindTxt(p) + "</td></tr>";
    }).join("");
    var fbtns = $$(".index-tools button"), more = $("#idx-more"), expanded = false, CAP = 12;
    var applyIdx = function (f) {
      fbtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.f === f)); });
      visible = [];
      var n = 0, capped = f === "all" && !expanded;
      $$("tr", body).forEach(function (tr, k) { var on = f === "all" || tr.dataset.ch === f; if (on && capped && n >= CAP) on = false; tr.hidden = !on; if (on) { visible.push(k); n++; } });
      if (more) more.hidden = !capped;
      $("#idx-status").textContent = visible.length + " items shown";
    };
    fbtns.forEach(function (b) { b.addEventListener("click", function () { applyIdx(b.dataset.f); }); });
    applyIdx("all");
    if (more) more.addEventListener("click", function () { expanded = true; applyIdx("all"); var r = $$("tr", body)[CAP]; if (r) r.querySelector("button").focus(); });
    $$("[data-index]").forEach(function (b) {
      b.addEventListener("click", function () { applyIdx(b.dataset.index); $("#index").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
    });
  }

  /* Lightbox */
  var lb = $("#lightbox"), cur = 0, opener = null, ring = null;
  if (lb) {
    var show = function (i) {
      var p = data[i]; cur = i;
      var img = $("#lb-img"); img.src = "assets/img/" + p.file + ".webp"; img.alt = kindTxt(p) + ": " + p.title;
      $("#lb-code").textContent = p.id + " · " + labelCh[p.ch];
      $("#lb-title").textContent = p.title;
      $("#lb-sub").textContent = p.sub || "";
      $("#lb-kind").textContent = p.kind === "photo" ? "Photograph of a completed interior." : "Architectural rendering — a design visualisation, not a photograph.";
      var l = $("#lb-link"); l.hidden = !p.href; if (p.href) l.firstChild.href = p.href;
    };
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-open]"); if (!b) return;
      var p = byId[b.dataset.open]; if (!p) return;
      opener = b;
      // Navigation stays within the group the item was opened from
      ring = b.closest("#idx-body") ? visible.slice() : b.closest("#rail") ? data.filter(function (x) { return x.type === "bungalow"; }).map(function (x) { return x.i; }) : b.closest("#series") ? data.filter(function (x) { return /^ushakaal-\d/.test(x.file); }).map(function (x) { return x.i; }) : data.filter(function (x) { return x.ch === p.ch; }).map(function (x) { return x.i; });
      show(p.i);
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
    });
    var step = function (d) { var k = ring.indexOf(cur); show(ring[(k + d + ring.length) % ring.length]); };
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.closest("[data-close]")) lb.close();
      var s = e.target.closest("[data-step]"); if (s) step(+s.dataset.step);
    });
    lb.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
    lb.addEventListener("close", function () { if (opener) opener.focus(); });
  }

  /* Enquiry form — validates and confirms locally. Nothing is sent or stored. */
  var form = $("#enquiry-form");
  if (form) {
    var hints = {
      market: "e.g. godowns or a market shed for a committee or trader",
      mill: "e.g. a factory building, processing unit or industrial shed",
      school: "e.g. a school or college building, community hall or public facility",
      city: "e.g. a flat scheme on a society plot, a township layout or an office building",
      home: "e.g. a bungalow on a plot you own, or interiors for an existing home"
    };
    $$('input[name="path"]', form).forEach(function (r) { r.addEventListener("change", function () { $("#brief-hint").textContent = hints[r.value]; }); });
    var setErr = function (el, msg) { var err = document.getElementById(el.id + "-err"); if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); err.textContent = msg || ""; return !msg; };
    var check = function (el) {
      var v = el.value.trim();
      if (el.id === "f-name") return setErr(el, v.length < 2 ? "Please enter your name." : "");
      if (el.id === "f-phone") {
        var d = v.replace(/\D/g, ""), em = $("#f-email").value.trim();
        if (!v && !em) return setErr(el, "Give a phone number or an email so the studio can reply.");
        return setErr(el, v && (d.length < 10 || d.length > 13) ? "Enter a 10-digit mobile, or a landline with STD code." : "");
      }
      if (el.id === "f-email") return setErr(el, v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "This email address looks incomplete." : "");
      if (el.id === "f-brief") return setErr(el, v.length < 20 ? "A sentence or two about the site and what you need, please." : "");
      return true;
    };
    var ids = ["f-name", "f-phone", "f-email", "f-brief"];
    ids.forEach(function (id) { var el = $("#" + id); el.addEventListener("blur", function () { if (el.value) check(el); }); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var chosen = $('input[name="path"]:checked', form);
      $("#path-err").textContent = chosen ? "" : "Choose the kind of project.";
      var ok = !!chosen, first = chosen ? null : $('input[name="path"]', form);
      ids.forEach(function (id) { var el = $("#" + id); if (!check(el)) { ok = false; first = first || el; } });
      if (!ok) { first.focus(); return; }
      var done = $("#enquiry-done");
      $("[data-path]", done).textContent = chosen.parentNode.querySelector("b").textContent;
      form.reset(); form.hidden = true; done.hidden = false; done.focus();
    });
    $("#enquiry-again").addEventListener("click", function () { $("#enquiry-done").hidden = true; form.hidden = false; $('input[name="path"]', form).focus(); });
  }
})();
