// ===============================================================
// Matty’s Toolkit Background – v17.5 (TAB SYNC + AUTO-RELOAD FIX)
// Contacts ↔ Properties | Tab Routing | UUID Suppression | SPA Reload
// ===============================================================

console.log("✅ Background Loaded v17.5");

// TAB STATE
let leftTabId = null;      // Contact tab
let rightTabId = null;     // Property tab

let lastLeftKey = null;
let lastRightKey = null;

const KEY_RE =
  /#key=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;


// ======================================================================
// MAIN MESSAGE ROUTER
// ======================================================================
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  try {
    // Routing from content.js
    if (msg.route === "property") {
      handlePropertyRouting(msg.url);
      return sendResponse({ ok: true });
    }

    if (msg.route === "contact") {
      handleContactRouting(msg.url);
      return sendResponse({ ok: true });
    }

    // Theme relay to all tabs
    if (["darkMode", "lightMode", "resetMode"].includes(msg.action)) {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => chrome.tabs.sendMessage(tab.id, msg));
      });
      return sendResponse({ ok: true });
    }

    // Page detection (optional)
    if (msg.action === "pageTypeDetected") {
      return sendResponse({ ok: true });
    }

    sendResponse({ ok: true });

  } catch (err) {
    console.error("❌ Background Error:", err);
    sendResponse({ error: err.message });
  }
});


// ======================================================================
// PROPERTY TAB ROUTER (Right Side)
// ======================================================================
function handlePropertyRouting(url) {
  const key = url.match(KEY_RE)?.[0];

  // SAME record → don't reload
  if (key && key === lastRightKey) return;
  lastRightKey = key;

  // Already have a property tab
  if (rightTabId !== null) {
    chrome.tabs.update(rightTabId, { url }, (tab) => {
      if (chrome.runtime.lastError || !tab) {
        rightTabId = null;
        return handlePropertyRouting(url);
      }

      // 🔥 FORCE SPA RELOAD
      chrome.tabs.reload(rightTabId);
    });
    return;
  }

  // Make new tab
  chrome.tabs.create({ url, active: false }, (tab) => {
    rightTabId = tab.id;
    chrome.tabs.reload(rightTabId);  // ensure RealNex loads the module
  });
}


// ======================================================================
// CONTACT TAB ROUTER (Left Side)
// ======================================================================
function handleContactRouting(url) {
  const key = url.match(KEY_RE)?.[0];

  if (key && key === lastLeftKey) return;
  lastLeftKey = key;

  if (leftTabId !== null) {
    chrome.tabs.update(leftTabId, { url }, (tab) => {
      if (chrome.runtime.lastError || !tab) {
        leftTabId = null;
        return handleContactRouting(url);
      }

      // 🔥 FORCE SPA RELOAD
      chrome.tabs.reload(leftTabId);
    });
    return;
  }

  chrome.tabs.create({ url, active: false }, (tab) => {
    leftTabId = tab.id;
    chrome.tabs.reload(leftTabId);
  });
}


// ======================================================================
// CLEANUP WHEN USER CLOSES A TAB
// ======================================================================
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === leftTabId) {
    leftTabId = null;
    lastLeftKey = null;
  }
  if (tabId === rightTabId) {
    rightTabId = null;
    lastRightKey = null;
  }
});
