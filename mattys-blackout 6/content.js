// ===============================================================
// Matty’s Toolkit Content – v17.5 (TAB SYNC + FORCED REFRESH BUILD)
// Contacts ↔ Properties | Tab Routing | Auto-Refresh | UUID Guard
// Background.js performs actual tab switching.
// ===============================================================

console.log("🔥 Matty’s Toolkit Content Loaded v17.5");

// ---------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------
const ORIGIN = location.origin;
const KEY_RE =
  /#key=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

let splitEnabled = false;
let contactToProperty = false;
let propertyToContact = false;

// ---------------------------------------------------------------
// LOAD SETTINGS ON STARTUP
// ---------------------------------------------------------------
chrome.storage.local.get(
  ["splitViewToggle", "contactToPropertyToggle", "propertyToContactToggle"],
  (r) => {
    splitEnabled = !!r.splitViewToggle;
    contactToProperty = !!r.contactToPropertyToggle;
    propertyToContact = !!r.propertyToContactToggle;

    if (splitEnabled) initSplitRouting();
  }
);

// ---------------------------------------------------------------
// RECEIVE COMMANDS FROM POPUP
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
      propertyToContact = false;
      chrome.storage.local.set({ propertyToContactToggle: false });
      break;

    case "propertyToContactToggle":
      propertyToContact = state;
      contactToProperty = false;
      chrome.storage.local.set({ contactToPropertyToggle: false });
      break;

    // Theme passthrough to blackout.js
    case "darkMode":
    case "lightMode":
    case "resetMode":
      window.postMessage({ action, state }, "*");
      break;
  }
});

// ---------------------------------------------------------------
// MAIN ROUTING ENGINE
// ---------------------------------------------------------------
function initSplitRouting() {
  document.addEventListener(
    "click",
    (e) => {
      if (!splitEnabled) return;

      const link = e.target.closest("a[href]");
      if (!link) return;

      const href = absUrl(link.getAttribute("href"));
      if (!href) return;

      // CONTACT → PROPERTY
      if (contactToProperty && isPropertyUrl(href)) {
        e.preventDefault();
        chrome.runtime.sendMessage({
          route: "property",
          url: href,
        });
        return;
      }

      // PROPERTY → CONTACT
      if (propertyToContact && isContactUrl(href)) {
        e.preventDefault();
        chrome.runtime.sendMessage({
          route: "contact",
          url: href,
        });
        return;
      }
    },
    true
  );
}

// ---------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------
function absUrl(h) {
  try {
    return h.startsWith("/")
      ? `${ORIGIN}${h}`
      : new URL(h, ORIGIN).href;
  } catch {
    return h;
  }
}

function isPropertyUrl(url) {
  try {
    const u = new URL(url, ORIGIN);
    return u.pathname.includes("/property") && KEY_RE.test(u.hash);
  } catch {
    return false;
  }
}

function isContactUrl(url) {
  try {
    const u = new URL(url, ORIGIN);
    return u.pathname.includes("/contact") && KEY_RE.test(u.hash);
  } catch {
    return false;
  }
}
