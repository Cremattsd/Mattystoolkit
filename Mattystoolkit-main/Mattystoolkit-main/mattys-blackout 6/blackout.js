// ======================================================================
// Matty’s Blackout ULTRA v2.7 — FINAL BUILD
// Apple Nav • White Primary Buttons • Rounded Tiles • No Orange UI
// ======================================================================

console.log("🔥 Matty’s Blackout ULTRA v2.7 Loaded");

// mode management
let darkMode = false;

chrome.storage.local.get("darkMode", r => {
  darkMode = !!r.darkMode;
  applyUltraMode();
});

window.addEventListener("message", e => {
  const { action, state } = e.data || {};
  if (!action) return;

  if (action === "darkMode") {
    darkMode = state;
    chrome.storage.local.set({ darkMode });
    applyUltraMode();
  }

  if (action === "lightMode") {
    darkMode = false;
    chrome.storage.local.set({ darkMode:false });
    applyUltraMode();
  }

  if (action === "resetMode") {
    darkMode = false;
    chrome.storage.local.set({ darkMode:false });
    document.body.classList.remove("ultra-dark","ultra-light");
  }
});

// ======================================================================
// APPLY UI MODE
// ======================================================================
function applyUltraMode() {

  if (darkMode) {
    document.body.classList.add("ultra-dark");
    document.body.classList.remove("ultra-light");
  } else {
    document.body.classList.add("ultra-light");
    document.body.classList.remove("ultra-dark");
  }

  document.documentElement.style.setProperty("--border-color", "#e9ecf2", "important");
  document.documentElement.style.setProperty("--dashboard-project-ui-border-color", "#e9ecf2", "important");

  setTimeout(() => {
    cleanMainMenu();
    cleanTopMenu();
    cleanTopToolsMenu();
    removeCardBorders();
    cleanActionButtons();
    cleanPrimaryButtons();
    roundPhotosOnly();
    cleanDropdowns();
    cleanFilters();
    cleanTileBorders();
    fixSiteHeader();
  }, 30);
}

// ======================================================================
// FIX PRIMARY BUTTONS — KILL ORANGE EVERYWHERE
// ======================================================================
function cleanPrimaryButtons() {
  document.querySelectorAll(".btn-primary, .btn-primary:active, .btn-primary:focus, .btn-primary:hover")
    .forEach(btn => {
      btn.style.setProperty("background-color", "#ffffff", "important");
      btn.style.setProperty("border-color", "#cccccc", "important");
      btn.style.setProperty("color", "#070707", "important");
    });
}

// ======================================================================
// MAIN MENU (Dashboard / Contacts / Properties…)
// ======================================================================
function cleanMainMenu() {

  document.querySelectorAll(".admin-nav--tabs ul.d-flex > li").forEach(li => {

    li.style.setProperty("position", "relative", "important");
    li.style.setProperty("display", "flex", "important");
    li.style.setProperty("flex-direction", "column", "important");
    li.style.setProperty("cursor", "pointer", "important");
    li.style.setProperty("padding-left", "5px", "important");
    li.style.setProperty("padding-right", "5px", "important");
    li.style.setProperty("text-align", "center", "important");
    li.style.setProperty("justify-content", "space-around", "important");
    li.style.setProperty("border-left", "1px solid #ffffff", "important");
    li.style.setProperty("min-width", "90px", "important");
    li.style.setProperty("background", "transparent", "important");

    li.querySelectorAll("i, svg, img").forEach(i =>
      i.style.setProperty("display", "none", "important")
    );

    const a = li.querySelector("a");
    if (a) {
      a.style.setProperty("font-size", "14px", "important");
      a.style.setProperty("font-weight", "500", "important");
      a.style.setProperty("background", "transparent", "important");
      a.style.setProperty("border", "none", "important");
      a.style.setProperty("color", darkMode ? "#fff" : "#000", "important");
      a.style.setProperty("padding", "4px 0", "important");
      a.style.setProperty("display", "flex", "important");
      a.style.setProperty("flex-direction", "column", "important");
      a.style.setProperty("align-items", "center", "important");
    }

    const caret = li.querySelector(".caret, .arrow");
    if (caret) {
      caret.style.setProperty("display", "inline-block", "important");
      caret.style.setProperty("margin-top", "2px", "important");
      caret.style.setProperty("border-top-color", darkMode ? "#fff" : "#000", "important");
      caret.style.setProperty("opacity", "1", "important");
    }

    li.style.setProperty("border-bottom", "2px solid transparent", "important");
  });

  // force right-side border white
  const last = document.querySelector(".admin-nav--tabs ul li:last-child");
  if (last) {
    last.style.setProperty("border-right", "1px solid #ffffff", "important");
  }
}

// ======================================================================
// TOP NAV (Tools • Settings • My Account)
// ======================================================================
function cleanTopMenu() {

  const topNav = document.querySelector(".nav.navbar-nav");
  if (topNav) {
    topNav.style.setProperty("margin-left", "auto", "important");
    topNav.style.setProperty("display", "flex", "important");
    topNav.style.setProperty("gap", "10px", "important");
    topNav.style.setProperty("align-items", "center", "important");
    topNav.style.setProperty("margin-top", "-3px", "important");
    topNav.style.setProperty("font-size", "12px", "important");
    topNav.style.setProperty("flex-direction", "row", "important");
  }

  document.querySelectorAll(".nav.navbar-nav > li").forEach(li => {

    li.querySelectorAll("i, svg, img, .material-symbols-rounded").forEach(i => {
      if (!i.classList.contains("arrow")) i.style.setProperty("display", "none", "important");
    });

    const btn = li.querySelector("a, .dropdown-toggle");
    if (!btn) return;

    btn.style.setProperty("display", "flex", "important");
    btn.style.setProperty("align-items", "center", "important");
    btn.style.setProperty("padding", "6px 10px", "important");
    btn.style.setProperty("font-size", "12px", "important");
    btn.style.setProperty("font-weight", "500", "important");
    btn.style.setProperty("background", "transparent", "important");
    btn.style.setProperty("border", "none", "important");
    btn.style.setProperty("color", darkMode ? "#fff" : "#000", "important");

    const caret = btn.querySelector(".arrow");
    if (caret) {
      caret.style.setProperty("font-size", "16px", "important");
      caret.style.setProperty("margin-left", "4px", "important");
      caret.style.setProperty("opacity", "1", "important");
      caret.style.setProperty("transition", "transform 0.2s ease", "important");
    }
  });
}

// ======================================================================
// TOOLS MENU ONLY
// ======================================================================
function cleanTopToolsMenu() {
  const btn = document.querySelector("#btnTools");
  if (!btn) return;

  btn.querySelectorAll(".material-symbols-rounded:not(.arrow), i, svg, img")
    .forEach(i => i.style.setProperty("display", "none", "important"));

  const caption = btn.querySelector(".nav-item--caption");
  if (caption) {
    caption.style.setProperty("display", "flex", "important");
    caption.style.setProperty("align-items", "center", "important");
    caption.style.setProperty("font-size", "12px", "important");
    caption.style.setProperty("font-weight", "500", "important");
    caption.style.setProperty("color", darkMode ? "#fff" : "#000", "important");
  }

  btn.style.setProperty("display", "flex", "important");
  btn.style.setProperty("align-items", "center", "important");
  btn.style.setProperty("background", "transparent", "important");
  btn.style.setProperty("border", "none", "important");
  btn.style.setProperty("color", darkMode ? "#fff" : "#000", "important");
}

// ======================================================================
// DROPDOWNS — Rounded Apple Style
// ======================================================================
function cleanDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.style.setProperty("border", "1px solid #e9ecf2", "important");
    menu.style.setProperty("border-radius", "10px", "important");
    menu.style.setProperty("overflow", "hidden", "important");
    menu.style.setProperty("padding", "4px 0", "important");
    menu.style.setProperty("background", "#ffffff", "important");
    menu.style.setProperty("box-shadow", "0px 4px 14px rgba(0,0,0,0.08)", "important");
  });

  document.querySelectorAll(".dropdown-menu li a").forEach(a => {
    a.style.setProperty("font-size", "14px", "important");
    a.style.setProperty("padding", "10px 16px", "important");
    a.style.setProperty("color", "#000", "important");
  });

  document.querySelectorAll("li.open > a .arrow").forEach(arrow => {
    arrow.style.setProperty("transform", "rotate(180deg)", "important");
  });
}

// ======================================================================
// ACTION BUTTONS
// ======================================================================
function cleanActionButtons() {
  document.querySelectorAll(".list-action-buttons .action-buttons .btn")
    .forEach(btn => {
      btn.style.setProperty("border", "1px solid #ffffff", "important");
      btn.style.setProperty("background", "#fff", "important");
      btn.style.setProperty("padding", "3px", "important");
      btn.style.setProperty("line-height", "17px", "important");
      btn.style.setProperty("display", "flex", "important");
      btn.style.setProperty("align-items", "center", "important");
    });
}

// ======================================================================
// FILTER BUTTONS
// ======================================================================
function cleanFilters() {
  document.querySelectorAll(".filters-row--item-group.mod-left .filters-row--item .btn-group button.active")
    .forEach(btn => {
      btn.style.setProperty("background", "#ffffff", "important");
      btn.style.setProperty("border-color", "#ffffff", "important");
      btn.style.setProperty("color", "#929cae", "important");
    });
}

// ======================================================================
// TILE BORDERS
// ======================================================================
function cleanTileBorders() {
  document.querySelectorAll(".tile_view .list-item--row").forEach(tile => {
    tile.style.setProperty("border", "1px solid #e9ecf2", "important");
    tile.style.setProperty("border-radius", "4px", "important");
    tile.style.setProperty("overflow", "hidden", "important");
  });
}

// ======================================================================
// REMOVE ALL CARD BORDERS
// ======================================================================
function removeCardBorders() {
  document.querySelectorAll(`
    .item_block,
    .list-item,
    .list-item-block,
    .card,
    .rn-card
  `).forEach(card => {
    card.style.setProperty("border", "none", "important");
    card.style.setProperty("box-shadow", "none", "important");
    card.style.setProperty("background", "transparent", "important");
  });
}

// ======================================================================
// HEADER BORDER FIX
// ======================================================================
function fixSiteHeader() {
  const header = document.querySelector(".site-header");
  if (header) {
    header.style.setProperty("border-bottom", "3px solid #ffffff", "important");
  }
}

// ======================================================================
// ROUND ONLY PHOTOS
// ======================================================================
function roundPhotosOnly() {
  document.querySelectorAll(`
    img.avatar,
    .item_left img,
    .swiper-slide img,
    .swiper-slide,
    .picture-container img
  `).forEach(img => {
    img.style.setProperty("border-radius","10px","important");
    img.style.setProperty("object-fit","cover","important");
  });
}

// ======================================================================
// OBSERVER — refreshes styling on every UI update
// ======================================================================
new MutationObserver(() => {
  cleanMainMenu();
  cleanTopMenu();
  cleanTopToolsMenu();
  removeCardBorders();
  cleanActionButtons();
  cleanPrimaryButtons();
  roundPhotosOnly();
  cleanDropdowns();
  cleanFilters();
  cleanTileBorders();
  fixSiteHeader();
}).observe(document.body, {
  childList: true,
  subtree: true
});
