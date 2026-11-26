// Independent concept. No network calls, no storage, no data leaves the browser.
(function () {
  "use strict";

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("open")) toggle.click();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { toggle.click(); toggle.focus(); }
    });
  }

  // Image plates: show the archive photograph if it has been supplied locally,
  // otherwise keep the drawn frame and its "to be supplied" caption.
  document.querySelectorAll(".plate").forEach(function (plate) {
    var img = plate.querySelector("img");
    if (!img) { plate.classList.add("missing"); return; }
    function fail() { plate.classList.add("missing"); }
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail);
  });

  // Typology index filter
  var filters = document.querySelector(".filters");
  if (filters) {
    var rows = document.querySelectorAll(".index li");
    var status = document.getElementById("filter-status");
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var key = btn.dataset.filter;
      filters.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      var shown = 0;
      rows.forEach(function (r) {
        var match = key === "all" || r.dataset.for.split(" ").indexOf(key) > -1;
        r.hidden = !match; if (match) shown++;
      });
      if (status) status.textContent = shown + " typolog" + (shown === 1 ? "y" : "ies") + " shown";
    });
  }

  // Enquiry form — validates and confirms locally. Nothing is sent or stored.
  var form = document.getElementById("enquiry-form");
  if (form) {
    var pathHints = {
      home: "e.g. a new bungalow on a plot you own, or interiors for an existing home",
      commercial: "e.g. an office floor, showroom, warehouse or industrial shed",
      institutional: "e.g. a school or college building, community hall or public facility",
      development: "e.g. a flat scheme, township layout or group housing",
      pmc: "e.g. a project already designed that needs independent management and supervision"
    };
    var brief = form.querySelector("#f-brief");
    var briefHint = form.querySelector("#brief-hint");
    form.querySelectorAll('input[name="path"]').forEach(function (r) {
      r.addEventListener("change", function () { briefHint.textContent = pathHints[r.value] || ""; });
    });

    function setError(el, msg) {
      var err = document.getElementById(el.id + "-err");
      if (msg) { el.setAttribute("aria-invalid", "true"); err.textContent = msg; }
      else { el.removeAttribute("aria-invalid"); err.textContent = ""; }
      return !msg;
    }
    function check(el) {
      var v = el.value.trim();
      if (el.id === "f-name") return setError(el, v.length < 2 ? "Please enter your name." : "");
      if (el.id === "f-phone") {
        var digits = v.replace(/[^\d]/g, "");
        var email = form.querySelector("#f-email").value.trim();
        if (!v && !email) return setError(el, "Give a phone number or an email so the studio can reply.");
        if (v && (digits.length < 10 || digits.length > 13)) return setError(el, "Enter a 10-digit mobile or landline with STD code.");
        return setError(el, "");
      }
      if (el.id === "f-email") {
        if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setError(el, "This email address looks incomplete.");
        return setError(el, "");
      }
      if (el.id === "f-brief") return setError(el, v.length < 20 ? "A sentence or two about the site and what you need (20 characters or more)." : "");
      return true;
    }
    ["f-name", "f-phone", "f-email", "f-brief"].forEach(function (id) {
      var el = form.querySelector("#" + id);
      el.addEventListener("blur", function () { if (el.value) check(el); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var pathErr = document.getElementById("path-err");
      var chosen = form.querySelector('input[name="path"]:checked');
      pathErr.textContent = chosen ? "" : "Choose the kind of project.";
      var ok = !!chosen;
      var first = chosen ? null : form.querySelector('input[name="path"]');
      ["f-name", "f-phone", "f-email", "f-brief"].forEach(function (id) {
        var el = form.querySelector("#" + id);
        if (!check(el)) { ok = false; first = first || el; }
      });
      if (!ok) { first.focus(); return; }
      var label = chosen.closest("label").querySelector("span").firstChild.textContent.trim();
      var done = document.getElementById("enquiry-done");
      done.querySelector("[data-path]").textContent = label;
      form.reset();
      form.hidden = true;
      done.hidden = false;
      done.focus();
    });
    var again = document.getElementById("enquiry-again");
    if (again) again.addEventListener("click", function () {
      document.getElementById("enquiry-done").hidden = true;
      form.hidden = false;
      form.querySelector('input[name="path"]').focus();
    });
  }
})();
