// ===================================================
// Matty’s Blackout Popup – v15.2
// Master Lock + Clean Light/Dark + Split Indicator Fix + Exclusive Logic
// ===================================================

document.addEventListener("DOMContentLoaded", () => {

  // All toggles we need to load from storage
  const toggles = [
    "themeMaster",
    "lightMode",
    "darkMode",
    "splitViewToggle",
    "contactToPropertyToggle",
    "propertyToContactToggle"
  ];

  chrome.storage.local.get(toggles, (res) => {
    // Apply stored toggle states to UI
    toggles.forEach(id => {
      const el = document.getElementById(id);
      if (el && res[id] !== undefined) {
        el.checked = res[id];
      }
    });

    // Apply popup dark-mode styling to the popup itself
    if (res.darkMode && res.themeMaster) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Restore split glow
    if (res.splitViewToggle) {
      document.getElementById("splitIndicator").classList.add("active");
    }
  });

  // ================================================
  // MASTER: Entire theme system ON/OFF
  // ================================================
  document.getElementById("themeMaster").addEventListener("change", e => {
    const enabled = e.target.checked;

    // Save everything disabled on OFF
    chrome.storage.local.set({
      themeMaster: enabled,
      lightMode: false,
      darkMode: false
    });

    if (!enabled) {
      // Turn everything off (back to stock RealNex)
      document.getElementById("lightMode").checked = false;
      document.getElementById("darkMode").checked = false;

      document.body.classList.remove("dark-mode");
      safeSend("resetMode", true);
    }
  });

  // ================================================
  // LIGHT MODE (Exclusive with dark)
  // ================================================
  document.getElementById("lightMode").addEventListener("change", e => {
    const val = e.target.checked;
    const master = document.getElementById("themeMaster").checked;

    if (!master) {
      e.target.checked = false;
      return;
    }

    chrome.storage.local.set({ lightMode: val });
    if (val) {
      document.getElementById("darkMode").checked = false;
      chrome.storage.local.set({ darkMode: false });
      document.body.classList.remove("dark-mode");
      safeSend("darkMode", false);
    }
    safeSend("lightMode", val);
  });

  // ================================================
  // DARK MODE (Exclusive with light)
  // ================================================
  document.getElementById("darkMode").addEventListener("change", e => {
    const val = e.target.checked;
    const master = document.getElementById("themeMaster").checked;

    if (!master) {
      e.target.checked = false;
      return;
    }

    chrome.storage.local.set({ darkMode: val });
    if (val) {
      document.getElementById("lightMode").checked = false;
      chrome.storage.local.set({ lightMode: false });
      document.body.classList.add("dark-mode");
      safeSend("lightMode", false);
    }
    safeSend("darkMode", val);
  });

  // ================================================
  // SPLIT VIEW TOGGLE
  // ================================================
  document.getElementById("splitViewToggle").addEventListener("change", async (e) => {
    const enabled = e.target.checked;

    chrome.storage.local.set({ splitViewToggle: enabled });

    const indicator = document.getElementById("splitIndicator");
    if (enabled) indicator.classList.add("active");
    else indicator.classList.remove("active");

    safeSend("splitViewToggle", enabled);
  });

  // ================================================
  // CONTACT → PROPERTY AUTO ROUTE (Exclusive)
  // ================================================
  document.getElementById("contactToPropertyToggle").addEventListener("change", e => {
    const enabled = e.target.checked;
    if (enabled) document.getElementById("propertyToContactToggle").checked = false;
    chrome.storage.local.set({ contactToPropertyToggle: enabled, propertyToContactToggle: !enabled });
    safeSend("contactToPropertyToggle", enabled);
  });

  // ================================================
  // PROPERTY → CONTACT AUTO ROUTE (Exclusive)
  // ================================================
  document.getElementById("propertyToContactToggle").addEventListener("change", e => {
    const enabled = e.target.checked;
    if (enabled) document.getElementById("contactToPropertyToggle").checked = false;
    chrome.storage.local.set({ propertyToContactToggle: enabled, contactToPropertyToggle: !enabled });
    safeSend("propertyToContactToggle", enabled);
  });

  // Bonus: Reset All Button (for epicness)
  document.getElementById("resetAll").addEventListener("click", () => {
    toggles.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
      chrome.storage.local.set({ [id]: false });
    });
    document.body.classList.remove("dark-mode");
    document.getElementById("splitIndicator").classList.remove("active");
    safeSend("resetMode", true);
    safeSend("splitViewToggle", false);
    console.log("🧹 All reset!");
  });
});


// ===================================================
// SAFE SEND — Ensures content.js is injected if needed
// ===================================================
async function safeSend(action, state) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  // Ignore chrome:// and edge:// pages
  if (/^(chrome|edge|about):/i.test(tab.url)) return;

  try {
    await chrome.tabs.sendMessage(tab.id, { action, state });
    console.log(`📨 Sent ${action}`, state);

  } catch (err) {
    console.warn("Injecting content.js...");

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    await chrome.tabs.sendMessage(tab.id, { action, state });
  }
}