// ===============================================================
// Matty’s Toolkit Background – v15.3
// Split View Creator + Page Detection + Theme Persistence
// (Routing moved fully to content.js for stability)
// ===============================================================

chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Matty’s Toolkit v15.3 background loaded");
});

// CURRENT STATE
let splitWindows = { left: null, right: null };
let lastDetectedPage = null;
let lastDetectedURL = null;

/* ------------------------------------------------------
   MAIN MESSAGE ROUTER (Content.js + Popup.js)
------------------------------------------------------ */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  try {
    const { action, state } = msg || {};

    // 🔍 Page detector from content.js
    if (action === "pageTypeDetected") {
      lastDetectedPage = msg.page;
      lastDetectedURL = msg.fullUrl;
      console.log("🔍 RealNex page:", msg.page, msg.fullUrl);
      return sendResponse({ ok: true });
    }

    // 🪟 User toggled split view
    if (action === "splitViewToggle") {
      if (state) activateSplitView();
      return sendResponse({ ok: true });
    }

    // 🎨 Theme persistence (forwarded to blackout.js)
    if (["darkMode", "lightMode", "resetMode"].includes(action)) {
      chrome.storage.local.set({ [action]: state });
      return sendResponse({ ok: true });
    }

    sendResponse({ ok: true });

  } catch (err) {
    console.error("❌ Background ERROR:", err);
    sendResponse({ error: err.message });
  }
});


/* ------------------------------------------------------
   BACKUP URL DETECTION
------------------------------------------------------ */
function getPageType(url) {
  if (!url) return null;
  const clean = url.toLowerCase().split("?")[0];

  if (clean.includes("/contact") || clean.includes("contact#")) return "contact";
  if (clean.includes("/property") || clean.includes("property#")) return "property";

  return null;
}


/* ------------------------------------------------------
   SPLIT VIEW CREATOR
   (No routing — routing is 100% in content.js now)
------------------------------------------------------ */
async function activateSplitView() {
  console.log("🎯 Activating split view...");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const type = lastDetectedPage || getPageType(tab.url);

  const primary = type === "property" ? "property" : "contact";
  const secondary = primary === "contact" ? "property" : "contact";

  return openSplitPair(primary, secondary);
}


/* ------------------------------------------------------
   PERMISSION CHECK (system.display)
------------------------------------------------------ */
async function ensureDisplayPermission() {
  return new Promise((resolve) => {
    chrome.permissions.contains(
      { permissions: ["system.display"] },
      (has) => {
        if (has) return resolve(true);

        console.warn("⚠️ Requesting system.display permission...");

        chrome.permissions.request(
          { permissions: ["system.display"] },
          (ok) => {
            console.log(ok ? "✅ Permission granted" : "❌ Permission denied");
            resolve(ok);
          }
        );
      }
    );
  });
}


/* ------------------------------------------------------
   OPEN SPLIT WINDOWS (no double firing)
------------------------------------------------------ */
async function openSplitPair(primary, secondary) {
  console.log(`🪟 Opening split view: ${primary} → ${secondary}`);

  const ok = await ensureDisplayPermission();
  if (!ok) return;

  const URLs = {
    contact: "https://crm.realnex.com/contact#",
    property: "https://crm.realnex.com/property#",
  };

  const displays = await chrome.system.display.getInfo();
  const d = displays[0].workArea;

  const W = d.width;
  const H = d.height;
  const mid = Math.floor(W / 2);

  // Close old
  if (splitWindows.left?.id) try { await chrome.windows.remove(splitWindows.left.id); } catch {}
  if (splitWindows.right?.id) try { await chrome.windows.remove(splitWindows.right.id); } catch {}
  splitWindows = { left: null, right: null };

  // Left
  const left = await chrome.windows.create({
    url: URLs[primary],
    left: d.left,
    top: d.top,
    width: mid,
    height: H,
    type: "popup",
    focused: true,
  });

  // Right
  const right = await chrome.windows.create({
    url: URLs[secondary],
    left: d.left + mid,
    top: d.top,
    width: mid,
    height: H,
    type: "popup",
    focused: false,
  });

  splitWindows = { left, right };

  chrome.action.setBadgeText({ text: "S" });
  chrome.action.setBadgeBackgroundColor({ color: "#00c853" });

  console.log("🟩 Split mode ACTIVE:", splitWindows);
}


/* ------------------------------------------------------
   AUTO CLEANUP
------------------------------------------------------ */
chrome.windows.onRemoved.addListener((id) => {
  if (splitWindows.left?.id === id || splitWindows.right?.id === id) {
    console.log("❌ Split window closed → cleanup");
    splitWindows = { left: null, right: null };
    chrome.action.setBadgeText({ text: "" });
  }
});
