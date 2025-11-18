// ===========================================
// Matty’s Blackout – v16.9.1 (Google Maps Safe Edition)
// Apple+ UI • No Icons • Clean Modals • Gradient Killer
// ZERO map interference (gm-* elements skipped)
// ===========================================

const ORANGE_SHADES = [
  '#f7931e','#ee7600','#f58025','#ff8800','#f57c00','#f45000','#f15929'
];
const GRAY_SHADES = ['#333333','#757575'];
let darkMode = false;


// ===========================================
// 🚫 GOOGLE MAPS EXCLUSION ENGINE
// ===========================================
function isGoogleMapElement(el) {
  if (!el) return false;

  const id  = (el.id || "").toLowerCase();
  const cls = (el.className || "").toString().toLowerCase();

  if (id.startsWith("gm-")) return true;
  if (cls.includes("gm-")) return true;
  if (cls.includes("map") && cls.includes("gm")) return true;
  if (id.includes("map") && id.includes("gm")) return true;

  // Skip Google maps inside iframes
  if (el.tagName === "IFRAME" && (id.includes("map") || cls.includes("map"))) return true;

  return false;
}



// ===========================================
// LOAD MODE
// ===========================================
chrome.storage.local.get("darkMode", r => {
  darkMode = !!r.darkMode;
  applyTheme();
});

// Listen from popup
window.addEventListener("message", e => {
  const { action, state } = e.data || {};
  if (!action) return;

  if (action === "darkMode") darkMode = state;
  if (action === "lightMode") darkMode = false;
  if (action === "resetMode") darkMode = false;

  chrome.storage.local.set({ darkMode });
  applyTheme();
});

// Mutation watcher (safe)
new MutationObserver(() => requestAnimationFrame(applyTheme))
  .observe(document.body, { childList: true, subtree: true });



// ===========================================
// MAIN THEME ENGINE
// ===========================================
function applyTheme() {

  const textPrimary   = darkMode ? "#ffffff" : "#000000";
  const textSecondary = darkMode ? "#dddddd" : "#333333";
  const bgPrimary     = darkMode ? "#0f0f0f" : "#ffffff";
  const borderColor   = darkMode ? "#555555" : "#e6e6e6";

  document.body.style.backgroundColor = bgPrimary;
  document.body.style.color = textSecondary;


  // ===========================================
  // UNIVERSAL SWEEP (maps protected)
  // ===========================================
  document.querySelectorAll("*").forEach(el => {
    if (isGoogleMapElement(el)) return; // 🚫 Skip Maps

    const s = getComputedStyle(el);
    const rawColor  = s.color.toLowerCase();
    const rawBg     = s.backgroundColor.toLowerCase();
    const rawBorder = s.borderColor.toLowerCase();

    ORANGE_SHADES.forEach(hex => {
      const rgb = hexToRgb(hex);

      if (rawColor.includes(hex.slice(1)) || rawColor.includes(rgb))
        el.style.setProperty("color", textPrimary, "important");

      if (rawBg.includes(hex.slice(1)) || rawBg.includes(rgb))
        el.style.setProperty("background-color", bgPrimary, "important");

      if (rawBorder.includes(hex.slice(1)) || rawBorder.includes(rgb))
        el.style.setProperty("border-color", borderColor, "important");
    });

    GRAY_SHADES.forEach(gray => {
      const rgb = hexToRgb(gray);
      if (rawColor.includes(gray.slice(1)) || rawColor.includes(rgb))
        el.style.setProperty("color", textPrimary, "important");
    });

    if (darkMode) {
      el.style.setProperty("color", textPrimary, "important");
      if (rawBg === "rgb(255, 255, 255)")
        el.style.setProperty("background-color", bgPrimary, "important");
    } else {
      el.style.setProperty("color", textSecondary, "important");
    }
  });



  // ===========================================
  // FULL GRADIENT KILLER (maps protected)
  // ===========================================
  document.querySelectorAll("*").forEach(el => {
    if (isGoogleMapElement(el)) return; // 🚫 Skip Maps

    const cs = getComputedStyle(el);
    const bgImg = cs.backgroundImage.toLowerCase();
    const bgRaw = cs.background.toLowerCase();

    if (
      bgImg.includes("gradient") ||
      bgRaw.includes("gradient") ||
      bgImg.includes("f9f6f1") ||
      bgImg.includes("f2efea") ||
      bgRaw.includes("f9f6f1") ||
      bgRaw.includes("f2efea")
    ) {
      const clean = darkMode ? "#0f0f0f" : "#ffffff";
      el.style.setProperty("background", clean, "important");
      el.style.setProperty("background-color", clean, "important");
      el.style.setProperty("background-image", "none", "important");
      el.style.setProperty("filter", "none", "important");
      el.style.setProperty("-ms-filter", "none", "important");
    }
  });



  // ===========================================
  // LINKS
  // ===========================================
  document.querySelectorAll(
    "a, .contact-phone, .contact-email, .contact-address, .text-elipsis, .contact-info, .value"
  ).forEach(el => {
    if (containsOrange(getComputedStyle(el).color))
      el.style.setProperty("color", textPrimary, "important");
  });



  // ORANGE SUBTEXT
  document.querySelectorAll(`
    span.position, .contact-position, .contact-title,
    .contact-company, .contact-role, .text-elipsis,
    .span80, span[style*='color: orange']
  `).forEach(el => {
    const raw = getComputedStyle(el).color.toLowerCase();
    if (containsOrange(raw)) {
      el.style.setProperty("color", textPrimary, "important");
      el.style.setProperty("font-weight", "600", "important");
    }
  });



  // LABELS
  document.querySelectorAll(`
    label, .label, .badge, .tag,
    .input-group-addon, .form-label, .pill-bg
  `).forEach(el => {
    el.style.setProperty("border-radius", "8px", "important");
  });



  // MODALS
  document.querySelectorAll("div.modal-header").forEach(el => {
    el.style.setProperty("background-color", bgPrimary, "important");
    el.style.setProperty("border-bottom", `1px solid ${borderColor}`, "important");
  });



  // BUTTONS (primary + toggle)
  document.querySelectorAll(".btn.btn-primary, .toggle-on").forEach(el => {
    el.style.setProperty("background-color", bgPrimary, "important");
    el.style.setProperty("color", textPrimary, "important");
  });



  // CLEAN MODAL BUTTONS
  document.querySelectorAll(".btn.proceed-btn, button.btn.proceed-btn").forEach(btn => {
    btn.style.setProperty("border", darkMode ? "1px solid #ffffff" : "1px solid #000000", "important");
    btn.style.setProperty("border-radius", "8px", "important");
    btn.style.setProperty("padding", "8px 16px", "important");
    btn.style.setProperty("font-weight", "600", "important");
    btn.style.setProperty("background-color", darkMode ? "#0f0f0f" : "#ffffff", "important");
    btn.style.setProperty("color", darkMode ? "#ffffff" : "#000000", "important");
  });

  document.querySelectorAll(".btn.cancel-btn, button.btn.cancel-btn").forEach(btn => {
    btn.style.setProperty("border", darkMode ? "1px solid #777777" : "1px solid #000000", "important");
    btn.style.setProperty("border-radius", "8px", "important");
    btn.style.setProperty("background-color", darkMode ? "#0f0f0f" : "#ffffff", "important");
    btn.style.setProperty("color", darkMode ? "#ffffff" : "#000000", "important");
  });



  // LIST HEADERS
  document.querySelectorAll(`
    .items-list-header,
    .items-list-header *,
    .items-list-header.hide-on-dashboard,
    div.items-list-header,
    div.items-list-header *,
    .list-header-buttons,
    .list-header-buttons *,
    .extra_body_block,
    .extra_body_block *,
    .footer_notes_block,
    .footer_notes_block *
  `).forEach(el => {
    if (isGoogleMapElement(el)) return;

    const bg  = darkMode ? "#0f0f0f" : "#ffffff";
    const txt = darkMode ? "#ffffff" : "#000000";

    el.style.setProperty("background-color", bg, "important");
    el.style.setProperty("background-image", "none", "important");
    el.style.setProperty("color", txt, "important");
    el.style.setProperty("box-shadow", "none", "important");
    el.style.setProperty("border", "1px solid " + bg, "important");
    el.style.setProperty("border-bottom", "none", "important");
  });



  // ROW SEPARATORS
  document.querySelectorAll("tr, .data-row").forEach(el => {
    if (isGoogleMapElement(el)) return;
    const div = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
    el.style.setProperty("border-bottom", `1px solid ${div}`, "important");
  });



  // GRID SPACING
  document.querySelectorAll(".rn-card, .contact-card, .grid-card").forEach(el => {
    el.style.setProperty("margin-bottom", "12px", "important");
  });



  // TOOLTIP FIX
  document.querySelectorAll(".tooltip, .tooltip-inner").forEach(tt => {
    const bg  = darkMode ? "#000000" : "#ffffff";
    const txt = darkMode ? "#ffffff" : "#000000";
    const br  = darkMode ? "#444444" : "#cccccc";

    tt.style.setProperty("background", bg, "important");
    tt.style.setProperty("background-color", bg, "important");
    tt.style.setProperty("color", txt, "important");
    tt.style.setProperty("border", `1px solid ${br}`, "important");
    tt.style.setProperty("border-radius", "6px", "important");
    tt.style.setProperty("padding", "6px 10px", "important");
    tt.style.setProperty("font-size", "12px", "important");
    tt.style.setProperty("line-height", "14px", "important");
    tt.style.setProperty("box-shadow", "0px 4px 10px rgba(0,0,0,0.15)", "important");
  });

  document.querySelectorAll(".tooltip-arrow").forEach(arrow => {
    const bg = darkMode ? "#000000" : "#ffffff";
    arrow.style.setProperty("border-top-color", bg, "important");
    arrow.style.setProperty("border-bottom-color", bg, "important");
  });



  // SUBTABS
  document.querySelectorAll(`
    .header_nav_block,
    .header_nav_block *,
    .header_nav_block .tabs,
    .header_nav_block .contact-subtab
  `).forEach(el => {
    if (isGoogleMapElement(el)) return;

    el.style.setProperty("background-color", bgPrimary, "important");
    el.style.setProperty("color", textPrimary, "important");
    el.style.setProperty("border", "none", "important");
    el.style.setProperty("box-shadow", "none", "important");
  });



  // CARETS
  document.querySelectorAll(".caret, span.caret, .nav-item .caret").forEach(c => {
    const caretColor = darkMode ? "#bbbbbb" : "#999999";
    c.style.setProperty("border-top-color", caretColor, "important");
    c.style.setProperty("border-bottom-color", caretColor, "important");
    c.style.setProperty("opacity", "0.8", "important");
  });



  cleanTopNav();
  applyImageRounding();
}



// ===========================================
// IMAGE ROUNDING
// ===========================================
function applyImageRounding() {

  document.querySelectorAll(`
    .avatar, img.avatar,
    img[style*="border-radius: 50%"],
    [class*="avatar"], [class*="profile-img"]
  `).forEach(el => {
    if (isGoogleMapElement(el)) return;
    el.style.setProperty("border-radius", "8px", "important");
    el.style.setProperty("overflow", "hidden", "important");
  });

  document.querySelectorAll(`
    img, img.avatar, img.profile-pic,
    img[alt='Avatar'], .profile-image, .contact-image,
    .company-image, .property-img, .property-image,
    .listing-image, .gallery-image, .photo-wrapper img,
    .rn-avatar img, .rn-card img
  `).forEach(el => {
    if (isGoogleMapElement(el)) return;
    el.style.setProperty("border-radius", "8px", "important");
    el.style.setProperty("object-fit", "cover", "important");
    el.style.setProperty("object-position", "center", "important");
    el.style.setProperty("overflow", "hidden", "important");
  });
}



// ===========================================
// TOP NAV CLEANER  (Option A ⇄ Option B match)
// ===========================================
function cleanTopNav() {

  const navWrap = document.querySelector(".main-toolbar, ul.d-flex.main-toolbar");
  if (navWrap) {
    navWrap.style.setProperty("background", "transparent", "important");
    navWrap.style.setProperty("border", "none", "important");
    navWrap.style.setProperty("box-shadow", "none", "important");
    navWrap.style.setProperty("padding-top", "4px", "important");
    navWrap.style.setProperty("padding-bottom", "2px", "important");
  }

  // Map href → label so contacts/properties bar matches the system style
  const LABEL_MAP = [
    { match: "dashboard",   label: "Dashboard" },
    { match: "/contact",    label: "Contacts" },
    { match: "/contacts",   label: "Contacts" },
    { match: "/company",    label: "Companies" },
    { match: "/companies",  label: "Companies" },
    { match: "/property",   label: "Properties" },
    { match: "/properties", label: "Properties" },
    { match: "/project",    label: "Projects" },
    { match: "/projects",   label: "Projects" },
    { match: "/space",      label: "Spaces" },
    { match: "/spaces",     label: "Spaces" },
    { match: "tools",       label: "Tools" },
    { match: "settings",    label: "Settings" },
    { match: "account",     label: "My Account" },
    { match: "definitions", label: "Definitions" },
    { match: "support",     label: "Support" },
    { match: "request",     label: "Request" },
    { match: "logout",      label: "Logout" }
  ];

  function labelForHref(href) {
    if (!href) return null;
    const h = href.toLowerCase();
    for (const item of LABEL_MAP) {
      if (h.includes(item.match)) return item.label;
    }
    return null;
  }

  function applyLabelToNavItem(navItem) {
    if (!navItem) return;

    let anchor = navItem.querySelector("a");
    if (!anchor && navItem.tagName === "A") {
      anchor = navItem;
    }
    if (!anchor) return;

    const href = anchor.getAttribute("href") || "";
    const labelText = labelForHref(href);
    if (!labelText) return;

    let labelSpan =
      navItem.querySelector(".nav-item--caption") ||
      navItem.querySelector("span") ||
      anchor.querySelector("span");

    if (!labelSpan) {
      labelSpan = document.createElement("span");
      labelSpan.className = "nav-item--caption";
      anchor.appendChild(labelSpan);
    }

    labelSpan.textContent = labelText;
  }

  // Base styling for each nav item (both variants)
  document.querySelectorAll(`
    .admin-nav--tabs ul li,
    .main-toolbar .nav-item
  `).forEach(el => {
    el.style.setProperty("border", "none", "important");
    el.style.setProperty("background", "transparent", "important");
    el.style.setProperty("box-shadow", "none", "important");
    el.style.setProperty("min-width", "auto", "important");
    el.style.setProperty("padding", "0 4px", "important");

    // Make sure label text is injected/matched
    applyLabelToNavItem(el);
  });

  // REMOVE ICONS (both options)
  document.querySelectorAll(`
    .main-toolbar .nav-item i,
    .main-toolbar .nav-item svg,
    .main-toolbar .nav-item img,
    .main-toolbar .nav-item .material-symbols-rounded,
    .admin-nav--tabs ul li img,
    .admin-nav--tabs ul li svg,
    .admin-nav--tabs ul li i
  `).forEach(el => {
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("width", "0", "important");
    el.style.setProperty("height", "0", "important");
  });

  // LABEL ONLY – shared typography (Option A & B)
  document.querySelectorAll(`
    .main-toolbar .nav-item span,
    .main-toolbar .nav-item .nav-item--caption,
    .admin-nav--tabs ul li span
  `).forEach(label => {
    label.style.setProperty("font-size", "13px", "important");
    label.style.setProperty("font-weight", "500", "important");
    label.style.setProperty("padding", "0 12px", "important");
    label.style.setProperty("line-height", "26px", "important");
    label.style.setProperty("margin", "0 auto", "important");
    label.style.setProperty("display", "block", "important");
    label.style.setProperty("text-align", "center", "important");
    label.style.setProperty("color", darkMode ? "#ffffff" : "#000000", "important");
  });

  // ACTIVE UNDERLINE
  document.querySelectorAll(".main-toolbar .nav-item.active").forEach(item => {
    item.style.setProperty("border-bottom", "2px solid #f7931e", "important");
    item.style.setProperty("padding-bottom", "2px", "important");
  });
}



// ===========================================
// HELPERS
// ===========================================
function containsOrange(val) {
  if (!val) return false;
  return ORANGE_SHADES.some(hex => val.toLowerCase().includes(hex.slice(1)));
}

function hexToRgb(hex) {
  const b = parseInt(hex.slice(1), 16);
  return `rgb(${(b>>16)&255}, ${(b>>8)&255}, ${b&255})`;
}
