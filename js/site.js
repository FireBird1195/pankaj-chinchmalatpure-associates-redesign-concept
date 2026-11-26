// Independent concept. No network calls besides loading local images; no storage; nothing leaves the browser.
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile menu */
  var toggle = $(".menu-toggle"), nav = $("#site-nav");
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); }
    });
  }

  /* Reveal on scroll */
  var rv = $$(".rv");
  if (rv.length && "IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* Archive */
  var data = window.PCA_ARCHIVE || [];
  var grid = $("#archive-grid");
  var labels = { bungalow: "Bungalow", flats: "Flat scheme", township: "Township", commercial: "Commercial", public: "Public", interior: "Interior" };
  var visible = data.slice();
  if (grid && data.length) {
    grid.innerHTML = data.map(function (p, i) {
      return '<li data-type="' + p.type + '"><button class="tile" type="button" data-i="' + i + '" aria-haspopup="dialog">' +
        '<span class="ph"><img src="assets/img/' + p.file + '-sm.webp" alt="' + (p.kind === "photo" ? "Photograph: " : "Rendering: ") + esc(p.title) + '" loading="lazy" decoding="async" width="480" height="360"></span>' +
        '<span class="meta"><span class="t">' + esc(p.title) + '</span><span class="code">' + p.id + '</span></span>' +
        '<span class="k">' + esc(p.sub || labels[p.type]) + (p.kind === "photo" ? " · photograph" : " · rendering") + '</span></button></li>';
    }).join("");

    var tabs = $$('.tabs [role="tab"]'), status = $("#archive-status"), more = $("#archive-more"), expanded = false;
    // "All" opens on a curated first screen (a mix of every type); the rest is one click away.
    var FEATURED = ["G-01","F-01","B-04","I-06","T-01","C-01","B-08","I-05","G-03","F-09","T-02","B-15","I-09","F-12","C-02","T-06","B-11","I-15"];
    var applyFilter = function (key) {
      tabs.forEach(function (t) {
        var on = t.dataset.filter === key;
        t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
      });
      visible = [];
      var capped = key === "all" && !expanded;
      $$("li", grid).forEach(function (li) {
        var p = data[+li.firstChild.dataset.i];
        var show = key === "all" || li.dataset.type === key;
        if (capped) show = FEATURED.indexOf(p.id) > -1;
        li.hidden = !show;
        li.style.order = capped ? FEATURED.indexOf(p.id) : "";
        if (show) visible.push(+li.firstChild.dataset.i);
      });
      if (capped) visible.sort(function (a, b) { return FEATURED.indexOf(data[a].id) - FEATURED.indexOf(data[b].id); });
      if (more) more.hidden = !capped;
      if (status) status.textContent = visible.length + " projects shown";
    };
    tabs.forEach(function (t, idx) {
      t.addEventListener("click", function () { applyFilter(t.dataset.filter); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = tabs[(idx + d + tabs.length) % tabs.length];
        n.focus(); n.click();
      });
    });
    applyFilter("all");
    if (more) more.addEventListener("click", function () {
      expanded = true; applyFilter("all");
      var nxt = grid.querySelector("li:not([hidden]):nth-child(19) .tile"); if (nxt) nxt.focus();
    });

    // Jump links/buttons elsewhere on the page filter the archive
    $$("[data-jump]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        applyFilter(el.dataset.jump);
        var sec = $("#archive");
        sec.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        var tab = $('.tabs [data-filter="' + el.dataset.jump + '"]');
        if (tab) tab.focus({ preventScroll: true });
      });
    });

    /* Lightbox */
    var lb = $("#lightbox"), cur = 0, opener = null;
    var show = function (i) {
      var p = data[i]; cur = i;
      var img = $("#lb-img");
      img.src = "assets/img/" + p.file + ".webp";
      img.alt = (p.kind === "photo" ? "Photograph: " : "Rendering: ") + p.title;
      $("#lb-code").textContent = p.id + " · " + labels[p.type];
      $("#lb-title").textContent = p.title;
      $("#lb-sub").textContent = p.sub || "";
      $("#lb-kind").textContent = p.kind === "photo" ? "Photograph of a completed interior." : "Architectural rendering — a design visualisation, not a photograph.";
      var link = $("#lb-link");
      link.hidden = !p.href;
      if (p.href) link.firstChild.href = p.href;
    };
    var step = function (d) {
      var pos = visible.indexOf(cur);
      show(visible[(pos + d + visible.length) % visible.length]);
    };
    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".tile"); if (!b) return;
      opener = b; show(+b.dataset.i);
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.closest("[data-close]")) lb.close();
      var s = e.target.closest("[data-step]"); if (s) step(+s.dataset.step);
    });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
    lb.addEventListener("close", function () { if (opener) opener.focus(); });
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Enquiry form — validates and confirms locally. Nothing is sent or stored. */
  var form = $("#enquiry-form");
  if (form) {
    var hints = {
      home: "e.g. a new bungalow on a plot you own, or interiors for an existing home",
      development: "e.g. a flat scheme on a society plot, or a township layout",
      commercial: "e.g. an office floor, showroom, warehouse or industrial shed",
      institutional: "e.g. a school or college building, community hall or market facility",
      pmc: "e.g. a building already designed that needs independent management and supervision"
    };
    var hint = $("#brief-hint");
    $$('input[name="path"]', form).forEach(function (r) {
      r.addEventListener("change", function () { hint.textContent = hints[r.value]; });
    });
    var setErr = function (el, msg) {
      var err = document.getElementById(el.id + "-err");
      if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
      err.textContent = msg || "";
      return !msg;
    };
    var check = function (el) {
      var v = el.value.trim();
      switch (el.id) {
        case "f-name": return setErr(el, v.length < 2 ? "Please enter your name." : "");
        case "f-phone":
          var digits = v.replace(/\D/g, ""), email = $("#f-email").value.trim();
          if (!v && !email) return setErr(el, "Give a phone number or an email so the studio can reply.");
          if (v && (digits.length < 10 || digits.length > 13)) return setErr(el, "Enter a 10-digit mobile, or a landline with STD code.");
          return setErr(el, "");
        case "f-email":
          return setErr(el, v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "This email address looks incomplete." : "");
        case "f-brief": return setErr(el, v.length < 20 ? "A sentence or two about the site and what you need, please." : "");
      }
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
      $("[data-path]", done).textContent = chosen.parentNode.querySelector("span").firstChild.textContent.trim();
      form.reset(); form.hidden = true; done.hidden = false; done.focus();
    });
    $("#enquiry-again").addEventListener("click", function () {
      $("#enquiry-done").hidden = true; form.hidden = false; $('input[name="path"]', form).focus();
    });
  }
})();
