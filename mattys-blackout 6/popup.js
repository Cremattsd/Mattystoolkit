// ===================================================
// Matty’s Blackout Popup – v15.6 (FINAL CLEAN BUILD)
// Syncs with Content v17.3 + No Red Errors + True Reset
// ===================================================

document.addEventListener("DOMContentLoaded", () => {

  const toggles = [
    "themeMaster",
    "lightMode",
    "darkMode",
    "splitViewToggle",
    "contactToPropertyToggle",
    "propertyToContactToggle"
  ];

  // Load switch states
  chrome.storage.local.get(toggles, (res) => {

    toggles.forEach(id => {
      const el = document.getElementById(id);
      if (el && res[id] !== undefined) el.checked = res[id];
    });

    // UI Dark Mode class
    if (res.darkMode && res.themeMaster) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Split View Indicator
    if (res.splitViewToggle) {
      document.getElementById("splitIndicator").classList.add("active");
    }
  });

  // ===================================================
  // MASTER THEME SWITCH
  // ===================================================
  document.getElementById("themeMaster").addEventListener("change", e => {
    const enabled = e.target.checked;

    chrome.storage.local.set({
      themeMaster: enabled,
      lightMode: false,
      darkMode: false
    });

    if (!enabled) {
      document.getElementById("lightMode").checked = false;
      document.getElementById("darkMode").checked = false;
      document.body.classList.remove("dark-mode");

      // Wipe custom CSS
      safeSend("resetMode", true);
    }
  });

  // ===================================================
  // LIGHT MODE
  // ===================================================
  document.getElementById("lightMode").addEventListener("change", e => {
    const val = e.target.checked;

    if (!document.getElementById("themeMaster").checked)
      return (e.target.checked = false);

    chrome.storage.local.set({ lightMode: val });

    // Turn off dark
    if (val) {
      document.getElementById("darkMode").checked = false;
      chrome.storage.local.set({ darkMode: false });
      document.body.classList.remove("dark-mode");
      safeSend("darkMode", false);
    }

    safeSend("lightMode", val);
  });

  // ===================================================
  // DARK MODE
  // ===================================================
  document.getElementById("darkMode").addEventListener("change", e => {
    const val = e.target.checked;

    if (!document.getElementById("themeMaster").checked)
      return (e.target.checked = false);

    chrome.storage.local.set({ darkMode: val });

    if (val) {
      document.getElementById("lightMode").checked = false;
      chrome.storage.local.set({ lightMode: false });
      document.body.classList.add("dark-mode");
      safeSend("lightMode", false);
    }

    safeSend("darkMode", val);
  });

  // ===================================================
  // SPLIT VIEW
  // ===================================================
  document.getElementById("splitViewToggle").addEventListener("change", e => {
    const enabled = e.target.checked;

    chrome.storage.local.set({ splitViewToggle: enabled });

    document.getElementById("splitIndicator").classList.toggle("active", enabled);

    safeSend("splitViewToggle", enabled);
  });

  // ===================================================
  // CONTACT → PROPERTY
  // ===================================================
  document.getElementById("contactToPropertyToggle").addEventListener("change", e => {
    const enabled = e.target.checked;

    if (enabled) {
      document.getElementById("propertyToContactToggle").checked = false;
    }

    chrome.storage.local.set({
      contactToPropertyToggle: enabled,
      propertyToContactToggle: !enabled
    });

    safeSend("contactToPropertyToggle", enabled);
  });

  // ===================================================
  // PROPERTY → CONTACT
  // ===================================================
  document.getElementById("propertyToContactToggle").addEventListener("change", e => {
    const enabled = e.target.checked;

    if (enabled) {
      document.getElementById("contactToPropertyToggle").checked = false;
    }

    chrome.storage.local.set({
      propertyToContactToggle: enabled,
      contactToPropertyToggle: !enabled
    });

    safeSend("propertyToContactToggle", enabled);
  });

  // ===================================================
  // RESET ALL
  // ===================================================
  document.getElementById("resetAll").addEventListener("click", () => {

    toggles.forEach(id => {
      chrome.storage.local.set({ [id]: false });
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });

    document.body.classList.remove("dark-mode");
    document.getElementById("splitIndicator").classList.remove("active");

    safeSend("resetMode", true);
    safeSend("splitViewToggle", false);

    console.log("🧹 All Reset Complete");
  });
});


// ===================================================
// SAFE SEND — NO MORE ERRORS EVER
// ===================================================
async function safeSend(action, state) {
  let tab;

  try {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) return;
    if (!/^https?:/i.test(tab.url)) return;

    await chrome.tabs.sendMessage(tab.id, { action, state });
    return;

  } catch (err) {

    // Chrome reloads → context invalid? Ignore.
    if (String(err).includes("Extension context invalidated")) {
      console.warn("⚠️ Context refreshed — normal & safe.");
      return;
    }

    console.warn("Reinjecting content.js…", err);
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    await chrome.tabs.sendMessage(tab.id, { action, state });

  } catch (fatal) {

    if (String(fatal).includes("Extension context invalidated")) {
      console.warn("⚠️ Popup closed / extension reloaded. Safe.");
      return;
    }

    console.error("🚫 Messaging failed after reinject.", fatal);
  }
}
