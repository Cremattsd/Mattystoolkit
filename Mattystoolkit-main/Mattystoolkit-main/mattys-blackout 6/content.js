// ===============================================================
// Matty’s Toolkit Content – v17.0  (FUSION EDITION)
// RealNex Split View w/ Smart Refresh + UUID Routing + Hijack Safety
// Contacts ↔ Properties (both ways)
// Ultra-Stable Focus Protection + Reload Suppression
// ===============================================================

console.log("🔥 Matty’s Toolkit Content Loaded v17.0");

// ---------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------
const RNX_LEFT  = "RNX_LEFT";
const RNX_RIGHT = "RNX_RIGHT";
const ORIGIN    = location.origin;

// Same UUID key regex used in your TamperMonkey script
const KEY_RE = /#key=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

// State
let splitEnabled = false;
let contactToProperty = false;
let propertyToContact = false;

// Track last-loaded keys to prevent extra reloads
let lastLeftKey  = null;
let lastRightKey = null;


// ---------------------------------------------------------------
// LOAD SETTINGS
// ---------------------------------------------------------------
chrome.storage.local.get(
  ["splitViewToggle", "contactToPropertyToggle", "propertyToContactToggle"],
  (r) => {
    splitEnabled = !!r.splitViewToggle;
    contactToProperty = !!r.contactToPropertyToggle;
    propertyToContact = !!r.propertyToContactToggle;

    nameThisWindow();
    if (splitEnabled) initSplitRouting();
  }
);


// ---------------------------------------------------------------
// MESSAGE LISTENER (toggle switches + themes)
// ---------------------------------------------------------------
chrome.runtime.onMessage.addListener((msg) => {
  const { action, state } = msg || {};

  switch (action) {
    case "splitViewToggle":
      splitEnabled = state;
      if (splitEnabled) initSplitRouting();
      break;

    case "contactToPropertyToggle":
      contactToProperty = state;
      if (contactToProperty) {
        propertyToContact = false;
        chrome.storage.local.set({ propertyToContactToggle: false });
      }
      break;

    case "propertyToContactToggle":
      propertyToContact = state;
      if (propertyToContact) {
        contactToProperty = false;
        chrome.storage.local.set({ contactToPropertyToggle: false });
      }
      break;

    // Forward theme messages to blackout.js
    case "darkMode":
    case "lightMode":
    case "resetMode":
      window.postMessage({ action, state }, "*");
      break;
  }
});


// ---------------------------------------------------------------
// WINDOW NAMING (RNX_LEFT / RNX_RIGHT)
// ---------------------------------------------------------------
function nameThisWindow() {
  const here = location.href;

  if (isPropertyUrl(here)) {
    window.name = RNX_RIGHT;
  } else {
    window.name = RNX_LEFT;
  }
}


// ---------------------------------------------------------------
// INIT SPLIT ROUTING (click hijack + window.open hijack)
// ---------------------------------------------------------------
function initSplitRouting() {
  hijackWindowOpen();  // override all window.open calls

  document.addEventListener("click", (e) => {
    if (!splitEnabled) return;

    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = absUrl(link.getAttribute("href"));
    if (!href) return;

    // CONTACT → PROPERTY
    if (contactToProperty && isPropertyUrl(href)) {
      e.preventDefault();
      openInRight(href);
      return;
    }

    // PROPERTY → CONTACT
    if (propertyToContact && isContactUrl(href)) {
      e.preventDefault();
      openInLeft(href);
      return;
    }
  }, true);
}


// ---------------------------------------------------------------
// URL HELPERS
// ---------------------------------------------------------------
function absUrl(h) {
  try {
    return h.startsWith("/") ? `${ORIGIN}${h}` : new URL(h, ORIGIN).href;
  } catch {
    return h;
  }
}

function isPropertyUrl(url) {
  try {
    const u = new URL(url, ORIGIN);
    return u.pathname.includes("/property") && KEY_RE.test(u.hash);
  } catch { return false; }
}

function isContactUrl(url) {
  try {
    const u = new URL(url, ORIGIN);
    return u.pathname.includes("/contact") && KEY_RE.test(u.hash);
  } catch { return false; }
}


// ---------------------------------------------------------------
// SMART WINDOW.OPEN HIJACK (TamperMonkey Fusion)
// ---------------------------------------------------------------
function hijackWindowOpen() {
  const original = window.open;

  window.open = function(url, name, specs) {
    if (!splitEnabled || !url) return original.apply(this, arguments);

    const abs = absUrl(url);

    if (contactToProperty && isPropertyUrl(abs)) {
      return openInRight(abs);
    }

    if (propertyToContact && isContactUrl(abs)) {
      return openInLeft(abs);
    }

    return original.apply(this, arguments);
  };
}


// ---------------------------------------------------------------
// OPEN IN RNX_RIGHT (SMART REFRESH + FOCUS PROTECTION)
// ---------------------------------------------------------------
function openInRight(url) {
  const abs = absUrl(url);
  const newKey = abs.match(KEY_RE)?.[0];

  let w = window.open("", RNX_RIGHT, "width=1500,height=1000");

  if (!w || w.closed) {
    lastRightKey = newKey;
    return window.open(abs, RNX_RIGHT);
  }

  // SAME RECORD → don’t reload
  if (newKey && newKey === lastRightKey) {
    console.log("⚡ SAME PROPERTY — suppressed reload");
    return w.focus();
  }

  // NEW record
  lastRightKey = newKey;
  w.location.href = abs;

  // Prevent right window from stealing focus
  setTimeout(() => {
    try { window.focus(); } catch {}
  }, 50);

  return w;
}


// ---------------------------------------------------------------
// OPEN IN RNX_LEFT (SMART REFRESH + FOCUS PROTECTION)
// ---------------------------------------------------------------
function openInLeft(url) {
  const abs = absUrl(url);
  const newKey = abs.match(KEY_RE)?.[0];

  let w = window.open("", RNX_LEFT, "width=1200,height=1000");

  if (!w || w.closed) {
    lastLeftKey = newKey;
    return window.open(abs, RNX_LEFT);
  }

  // SAME RECORD
  if (newKey && newKey === lastLeftKey) {
    console.log("⚡ SAME CONTACT — suppressed reload");
    return w.focus();
  }

  lastLeftKey = newKey;
  w.location.href = abs;

  setTimeout(() => {
    try { window.focus(); } catch {}
  }, 50);

  return w;
}


// ---------------------------------------------------------------
// REPORT PAGE TYPE TO BACKGROUND.JS
// ---------------------------------------------------------------
window.addEventListener("load", () => {
  const pageType = getPageType(location.href);
  if (pageType) {
    chrome.runtime.sendMessage({
      action: "pageTypeDetected",
      page: pageType,
      fullUrl: location.href
    });
  }
});

function getPageType(url) {
  url = url.toLowerCase();
  if (url.includes("/contact") || url.includes("contact#")) return "contact";
  if (url.includes("/property") || url.includes("property#")) return "property";
  return null;
}