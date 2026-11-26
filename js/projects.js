// Project archive data. Source: images published on chinchmalatpurearchitects.com
// (Architectural Design and Interior Designing galleries). Names are taken from the
// practice's own file names and drawing title blocks; see docs/VERIFICATION.md.
// kind: "render" = architectural visualisation, "photo" = photograph of a built interior.
// Private homeowners are not named.
window.PCA_ARCHIVE = (function () {
  var r = "render", p = "photo";
  function bung(n, file) { return { id: "B-" + n, type: "bungalow", title: "Bungalow " + n, file: file, kind: r }; }
  return [
    // Public / government
    { id: "G-01", type: "public", title: "Vegetable godowns, Kalamna market yard", sub: "A.P.M.C. Nagpur", file: "apmc-godowns", kind: r, href: "case-study-apmc.html" },
    { id: "G-02", type: "public", title: "Market shed", sub: "A.P.M.C. Nagpur", file: "apmc-market-shed", kind: r, href: "case-study-apmc.html#shed" },
    { id: "G-03", type: "public", title: "Auditorium and training centre", sub: "A.P.M.C. Nagpur", file: "apmc-auditorium", kind: r, href: "case-study-apmc.html#auditorium" },
    // Townships
    { id: "T-01", type: "township", title: "Pearl Heritage — site view", sub: "Township", file: "pearl-heritage-top", kind: r },
    { id: "T-02", type: "township", title: "Pearl Heritage — row houses", sub: "Township", file: "pearl-heritage-row-houses", kind: r },
    { id: "T-03", type: "township", title: "Pearl Heritage — club house", sub: "Township", file: "pearl-heritage-club-house", kind: r },
    { id: "T-04", type: "township", title: "Pearl Heritage — apartments", sub: "Township", file: "pearl-heritage-flats", kind: r },
    { id: "T-05", type: "township", title: "Pearl Heritage — entrance", sub: "Township", file: "pearl-heritage-entrance", kind: r },
    { id: "T-06", type: "township", title: "Nostalgia — entrance gate", sub: "Township", file: "nostalgia-gate", kind: r },
    { id: "T-07", type: "township", title: "Township bungalow, type 1", sub: "Township", file: "township-bungalow-1", kind: r },
    { id: "T-08", type: "township", title: "Township bungalow, type 2", sub: "Township", file: "township-bungalow-2", kind: r },
    { id: "T-09", type: "township", title: "Township bungalow, type 2 — aerial", sub: "Township", file: "township-bungalow-2-aerial", kind: r },
    { id: "T-10", type: "township", title: "Township layout — aerial", sub: "Township", file: "township-aerial", kind: r },
    // Commercial and institutional
    { id: "C-01", type: "commercial", title: "Konark Chambers", sub: "Commercial", file: "konark-chambers", kind: r },
    { id: "C-02", type: "commercial", title: "Hostel, Nagpur", sub: "Institutional", file: "hostel-nagpur", kind: r },
    { id: "C-03", type: "commercial", title: "Ushakaal — mixed-use", sub: "Commercial", file: "ushakaal-render", kind: r },
    // Flat schemes
    { id: "F-01", type: "flats", title: "Ushakaal-9", sub: "For Swapna Shilp Developers", file: "ushakaal-09", kind: r },
    { id: "F-02", type: "flats", title: "Ushakaal-3", sub: "Flat scheme", file: "ushakaal-03", kind: r },
    { id: "F-03", type: "flats", title: "Ushakaal-4", sub: "Flat scheme", file: "ushakaal-04", kind: r },
    { id: "F-04", type: "flats", title: "Ushakaal-5", sub: "Flat scheme", file: "ushakaal-05", kind: r },
    { id: "F-05", type: "flats", title: "Ushakaal-6", sub: "Flat scheme", file: "ushakaal-06", kind: r },
    { id: "F-06", type: "flats", title: "Ushakaal-10", sub: "Flat scheme", file: "ushakaal-10", kind: r },
    { id: "F-07", type: "flats", title: "Ushakaal-12", sub: "Flat scheme", file: "ushakaal-12", kind: r },
    { id: "F-08", type: "flats", title: "Ushakaal-1 & 2", sub: "Flat scheme", file: "ushakaal-01-02", kind: r },
    { id: "F-09", type: "flats", title: "Shalwak Residency", sub: "Flat scheme", file: "shalwak-residency", kind: r },
    { id: "F-10", type: "flats", title: "Vijaya Villa", sub: "Flat scheme", file: "vijaya-villa", kind: r },
    { id: "F-11", type: "flats", title: "Swara Residency", sub: "Flat scheme", file: "swara-residency", kind: r },
    { id: "F-12", type: "flats", title: "Raje Bhonsale Mahal", sub: "Flat scheme", file: "raje-bhonsale-mahal", kind: r },
    { id: "F-13", type: "flats", title: "R. K.", sub: "Flat scheme", file: "rk", kind: r },
    { id: "F-14", type: "flats", title: "Aryaditya Developers — scheme A", sub: "For Aryaditya Developers", file: "aryaditya-a", kind: r },
    { id: "F-15", type: "flats", title: "Aryaditya Developers — scheme B", sub: "For Aryaditya Developers", file: "aryaditya-b", kind: r },
    { id: "F-16", type: "flats", title: "Manjusha Regalia", sub: "Flat scheme", file: "flat-scheme-1", kind: r },
    { id: "F-17", type: "flats", title: "Flat scheme", sub: "Flat scheme", file: "flat-scheme-2", kind: r },
    // Bungalows (private clients, not named)
    bung("01", "bungalow-01"), bung("02", "bungalow-02"), bung("03", "bungalow-03"), bung("04", "bungalow-04"),
    bung("05", "bungalow-05"), bung("06", "bungalow-06"), bung("07", "bungalow-07"), bung("08", "bungalow-08"),
    bung("09", "bungalow-09"), bung("10", "bungalow-10"), bung("11", "bungalow-11"), bung("12", "bungalow-12"),
    bung("13", "bungalow-13"), bung("14", "bungalow-14"), bung("15", "bungalow-15"),
    // Interiors (photographs)
    { id: "I-01", type: "interior", title: "Living room", sub: "Residential interior", file: "int-living-01", kind: p },
    { id: "I-02", type: "interior", title: "Bedroom", sub: "Residential interior", file: "int-bedroom-01", kind: p },
    { id: "I-03", type: "interior", title: "Living room and storage wall", sub: "Residential interior", file: "int-living-02", kind: p },
    { id: "I-04", type: "interior", title: "Master bedroom", sub: "Residential interior", file: "int-bedroom-02", kind: p },
    { id: "I-05", type: "interior", title: "Living and dining", sub: "Residential interior", file: "int-living-03", kind: p },
    { id: "I-06", type: "interior", title: "Panelled living room", sub: "Residential interior", file: "int-living-04", kind: p },
    { id: "I-07", type: "interior", title: "Child's bedroom", sub: "Residential interior", file: "int-kids-01", kind: p },
    { id: "I-08", type: "interior", title: "Feature wall", sub: "Residential interior", file: "int-wall-01", kind: p },
    { id: "I-09", type: "interior", title: "Child's study and play room", sub: "Residential interior", file: "int-kids-02", kind: p },
    { id: "I-10", type: "interior", title: "Beauty parlour", sub: "Commercial interior", file: "int-parlour-01", kind: p },
    { id: "I-11", type: "interior", title: "Beauty parlour", sub: "Commercial interior", file: "int-parlour-02", kind: p },
    { id: "I-12", type: "interior", title: "Conference room", sub: "Office interior", file: "int-office-01", kind: p },
    { id: "I-13", type: "interior", title: "Reception", sub: "Office interior", file: "int-office-02", kind: p },
    { id: "I-14", type: "interior", title: "Workstations", sub: "Office interior", file: "int-office-03", kind: p },
    { id: "I-15", type: "interior", title: "Jali ceiling", sub: "Residential interior", file: "int-ceiling-01", kind: p }
  ];
})();
