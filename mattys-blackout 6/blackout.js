// ======================================================================
// Matty’s Blackout ULTRA v18.1 — ROUNDING RESTORE EDITION
// True ON/OFF • No Style Leakage • Rounded Menus + Rounded Photos
// Apple UI • Fast Observer • Stable Engine
// ======================================================================

console.log("🔥 Matty’s Blackout ULTRA v18.1 Loaded");

let darkMode = false;
let themeEnabled = false;
let observer = null;

// Restore saved states
chrome.storage.local.get(["themeMaster", "darkMode"], r => {
  themeEnabled = !!r.themeMaster;
  darkMode     = !!r.darkMode;

  if (themeEnabled) enableTheme();
});

// Listen for commands from popup.js → content.js → this file
window.addEventListener("message", evt => {
  const { action, state } = evt.data || {};
  if (!action) return;

  switch (action) {

    case "resetMode":
      disableTheme();
      break;

    case "lightMode":
      darkMode = false;
      chrome.storage.local.set({ darkMode:false });
      if (themeEnabled) applyStyles();
      break;

    case "darkMode":
      darkMode = true;
      chrome.storage.local.set({ darkMode:true });
      if (themeEnabled) applyStyles();
      break;
  }
});

// ======================================================================
// 🎛 THEME ENGINE ON/OFF
// ======================================================================

function enableTheme() {
  console.log("🎨 Blackout Enabled");
  themeEnabled = true;
  applyStyles();
  startObserver();

  // force rounding once after load
  setTimeout(forceFullRounding, 400);
}

function disableTheme() {
  console.log("💀 Blackout Disabled — True Reset");
  themeEnabled = false;

  stopObserver();
  removeInlineStyles();
  removeVariables();
  removeClasses();
}

// ======================================================================
// 🧼 CLEANUP
// ======================================================================

function removeClasses() {
  document.body.classList.remove("ultra-dark", "ultra-light");
}

function removeVariables() {
  document.documentElement.style.removeProperty("--border-color");
}

function removeInlineStyles() {
  const selectors = `
    .admin-nav--tabs ul.d-flex > li,
    .nav.navbar-nav > li,
    .nav.navbar-nav > li > a,
    .dropdown-menu,
    .dropdown-menu li a,
    .btn-primary,
    .list-action-buttons .btn,
    .tile_view .list-item--row,
    .item_block,
    .list-item,
    .card,
    .rn-card,
    img.avatar,
    img.contact-photo,
    img,
    label[for^='dt-tv-ItemKey'],
    li.list-item--row-checkbox,
    li.list-item--row
  `;

  document.querySelectorAll(selectors).forEach(el => el.removeAttribute("style"));
}

// ======================================================================
// 👁 DYNAMIC OBSERVER
// ======================================================================

function startObserver() {
  if (observer) return;

  observer = new MutationObserver(() => {
    if (!themeEnabled) return;
    applyStyles();
  });

  observer.observe(document.body, { childList:true, subtree:true });
}

function stopObserver() {
  if (observer) observer.disconnect();
  observer = null;
}

// ======================================================================
// 🎨 APPLY STYLING ENGINE
// ======================================================================

function applyStyles() {
  document.body.classList.toggle("ultra-dark",  darkMode);
  document.body.classList.toggle("ultra-light", !darkMode);

  document.documentElement.style.setProperty("--border-color", "#ffffff", "important");

  cleanMainMenu();
  cleanTopMenu();
  cleanTopToolsMenu();
  cleanDropdowns();
  cleanPrimaryButtons();
  cleanActionButtons();
  cleanTileBorders();
  removeCardBorders();
  roundPhotosHard();        // ← NEW upgraded rounding
  addHoverEffects();
  forceWhiteCheckboxBorders();
}

// ======================================================================
// 💥 FULL ROUNDING PATCH (menus + all photos)
// ======================================================================

function forceFullRounding() {
  cleanDropdowns();
  roundPhotosHard();
  cleanTileBorders();
  removeCardBorders();
}

// ======================================================================
// 🔵 MENUS / ROWS / CARDS / BUTTONS
// ======================================================================

function cleanMainMenu() {
  document.querySelectorAll(".admin-nav--tabs ul.d-flex > li").forEach(li => {
    li.style.cssText = `
      display:flex !important;
      flex-direction:column !important;
      padding:0 5px !important;
      background:transparent !important;
      border-left:1px solid #fff !important;
      border-bottom:2px solid transparent !important;
      cursor:pointer !important;
    `;

    li.querySelectorAll("i, svg, img").forEach(i =>
      i.style.setProperty("display", "none", "important")
    );

    const a = li.querySelector("a");
    if (!a) return;

    a.style.cssText = `
      font-size:14px !important;
      font-weight:500 !important;
      padding:4px 0 !important;
      color:${darkMode ? "#fff" : "#000"} !important;
      display:flex !important;
      flex-direction:column !important;
      align-items:center !important;
      background:transparent !important;
      border:none !important;
    `;
  });
}

function cleanTopMenu() {
  const nav = document.querySelector(".nav.navbar-nav");
  if (!nav) return;

  const wrap = nav.closest(".navbar-collapse, .nav-wrapper, .navbar-header");
  if (wrap) {
    wrap.style.cssText = `
      display:flex !important;
      justify-content:flex-end !important;
      width:100% !important;
      margin:0 !important;
      padding:0 !important;
      background:#fff !important;
    `;
  }

  nav.style.cssText = `
    display:flex !important;
    flex-direction:row !important;
    align-items:center !important;
    gap:0 !important;
    margin:0 !important;
    padding:0 !important;
  `;

  document.querySelectorAll(".nav.navbar-nav > li").forEach(li => {
    li.style.cssText = `
      display:flex !important;
      align-items:center !important;
      margin:0 !important;
      padding:0 !important;
    `;

    li.querySelectorAll("i, svg, img, .material-symbols-rounded")
      .forEach(i => {
        if (!i.classList.contains("arrow"))
          i.style.setProperty("display", "none", "important");
      });

    const link = li.querySelector("a, .dropdown-toggle");
    if (!link) return;

    link.style.cssText = `
      display:flex !important;
      align-items:center !important;
      padding:0 6px !important;
      height:20px !important;
      font-size:10px !important;
      font-weight:500 !important;
      color:${darkMode ? "#fff" : "#000"} !important;
      background:transparent !important;
      border:none !important;
    `;
  });
}

function cleanTopToolsMenu() {
  const btn = document.querySelector("#btnTools");
  if (!btn) return;

  btn.querySelectorAll("i, svg, img, .material-symbols-rounded:not(.arrow)")
    .forEach(i => i.style.setProperty("display", "none", "important"));
}

function cleanDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.style.cssText = `
      background:#fff !important;
      border:1px solid #e9ecf2 !important;
      border-radius:10px !important;
      padding:4px 0 !important;
      overflow:hidden !important;
    `;
  });
}

function cleanPrimaryButtons() {
  document.querySelectorAll(".btn-primary").forEach(btn => {
    btn.style.cssText = `
      background:#fff !important;
      border-color:#ccc !important;
      color:#070707 !important;
    `;
  });
}

function cleanActionButtons() {
  document.querySelectorAll(".list-action-buttons .btn").forEach(btn => {
    btn.style.cssText = `
      background:#fff !important;
      border:1px solid #fff !important;
      padding:3px !important;
    `;
  });
}

function cleanTileBorders() {
  document.querySelectorAll(".tile_view .list-item--row").forEach(tile => {
    tile.style.cssText = `
      border:1px solid #e9ecf2 !important;
      border-radius:10px !important;
      overflow:hidden !important;
    `;
  });
}

function removeCardBorders() {
  document.querySelectorAll(".item_block, .list-item, .card, .rn-card").forEach(card => {
    card.style.cssText = `
      border:none !important;
      background:transparent !important;
      box-shadow:none !important;
      border-radius:10px !important;
      overflow:hidden !important;
    `;
  });
}

// ======================================================================
// 🖼 PHOTO ROUNDING (New Universal Engine)
// ======================================================================

function roundPhotosHard() {
  document.querySelectorAll(`
    img.avatar,
    img.contact-photo,
    img[src*="profile"],
    .list-item img,
    .rn-photo img,
    .item_block img,
    .tile_view img
  `).forEach(img => {
    img.style.cssText = `
      border-radius:10px !important;
      object-fit:cover !important;
      overflow:hidden !important;
    `;
  });
}

// ======================================================================
// ✔ WHITE CHECKBOX FIX
// ======================================================================

function forceWhiteCheckboxBorders() {
  document.querySelectorAll("label[for^='dt-tv-ItemKey']").forEach(lbl => {
    lbl.style.setProperty("border-color", "#ffffff", "important");
  });

  document.querySelectorAll("input[type='checkbox']").forEach(chk => {
    chk.style.setProperty("border-color", "#ffffff", "important");
  });
}

// ======================================================================
// ✨ HOVER EFFECTS
// ======================================================================

function addHoverEffects() {
  document.querySelectorAll(".navbar-nav > li > a, .navbar-nav > li > .dropdown-toggle")
    .forEach(a => {
      a.addEventListener("mouseenter", () => {
        a.style.background = "rgba(255,110,0,0.12)";
      });
      a.addEventListener("mouseleave", () => {
        a.style.background = "transparent";
      });
    });
}
