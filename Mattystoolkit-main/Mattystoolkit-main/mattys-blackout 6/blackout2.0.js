// ===========================================
// Matty's Blackout – v17.4.1 (ULTRA MENU FIX)
// Clean Menus • No Pills • No Icons • Black Text • Carats Stay
// FAST + Map Safe + Rounded Avatars Only
// ===========================================

// ORANGE SHADES
const ORANGE_SHADES = ['#f7931e','#ee7600','#f58025','#ff8800','#f57c00','#f45000','#f15929'];
let darkMode = false;

// Load saved mode
chrome.storage.local.get("darkMode", r => {
  darkMode = !!r.darkMode;
  applyTheme(true);
});

// Listen for mode messages
window.addEventListener("message", e => {
  const { action, state } = e.data || {};
  if (!action) return;

  darkMode = action === "darkMode" ? state : false;
  chrome.storage.local.set({ darkMode });
  applyTheme(true);
});

// ===========================================
// CACHE ELEMENTS
// ===========================================
let cachedElements = null;
function getCachedElements() {
  if (cachedElements) return cachedElements;

  cachedElements = {
    avatars: document.querySelectorAll(`
      img, .avatar, .profile-img, .profile-image, .contact-image,
      .company-image, .listing-image, .gallery-image, .rn-card img,
      img[alt='Avatar'], .photo-wrapper img
    `),
    buttons: document.querySelectorAll(".btn, .toggle-on"),
    links: document.querySelectorAll("a, .contact-phone, .contact-email, .contact-address"),
    headers: document.querySelectorAll(".items-list-header, .header_nav_block, div.modal-header"),
    rows: document.querySelectorAll("tr, .data-row, .item_block"),
    tooltips: document.querySelectorAll(".tooltip, .tooltip-inner, .tooltip-arrow")
  };
  return cachedElements;
}

// ===========================================
// APPLY THEME (THROTTLED)
// ===========================================
let rafScheduled = false;
function applyTheme(forceAll=false) {
  if (rafScheduled) return;
  rafScheduled = true;

  requestAnimationFrame(() => {
    const textPrimary = darkMode ? "#fff" : "#000";
    const bgPrimary = darkMode ? "#0f0f0f" : "#fff";
    const borderColor = darkMode ? "#555" : "#e6e6e6";

    const els = getCachedElements();

    // ----------------------
    // ROUND AVATARS ONLY
    // ----------------------
    els.avatars.forEach(img => {
      img.style.borderRadius = "8px";
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
    });

    // BUTTONS
    els.buttons.forEach(b => {
      b.style.backgroundColor = bgPrimary;
      b.style.color = textPrimary;
    });

    // LINKS
    els.links.forEach(a => a.style.color = textPrimary);

    // HEADERS & MODALS
    els.headers.forEach(h => {
      h.style.backgroundColor = bgPrimary;
      h.style.color = textPrimary;
      h.style.borderColor = borderColor;
      h.style.boxShadow = "none";
    });

    // ROWS + HOVER
    els.rows.forEach(row => {
      const sep = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
      row.style.borderBottom = `1px solid ${sep}`;
      row.style.transition = "background-color .18s";
      row.onmouseenter = () => row.style.backgroundColor = darkMode ? "rgba(255,140,0,0.25)" : "rgba(255,140,0,0.10)";
      row.onmouseleave = () => row.style.backgroundColor = bgPrimary;
    });

    // TOOLTIPS
    els.tooltips.forEach(tt => {
      tt.style.backgroundColor = bgPrimary;
      tt.style.color = textPrimary;
      tt.style.border = `1px solid ${borderColor}`;
    });

    // ULTRA MENU FIX
    fixPrimaryMenu(textPrimary, bgPrimary, borderColor);
    fixTopMenu(textPrimary, bgPrimary, borderColor);

    rafScheduled = false;
  });
}

// ===========================================
// DASHBOARD / CONTACTS / PROJECTS MENU (the middle menu)
// ===========================================
function fixPrimaryMenu(text, bg, border) {
  document.querySelectorAll(".admin-nav--tabs ul.d-flex > li").forEach(li => {

    // Remove icons everywhere
    li.querySelectorAll("i,svg,img").forEach(i => {
      i.style.display = "none";
      i.remove();
    });

    // a.main-toolbar-btn
    const btn = li.querySelector("a.main-toolbar-btn");
    if (btn) {
      btn.style.background = "transparent";
      btn.style.color = text;
      btn.style.border = "none";
      btn.style.padding = "4px 14px";
      btn.style.fontSize = "14px";
      btn.style.fontWeight = "500";
      btn.style.borderRadius = "0";     // NO PILLS
    }

    // dropdown pill remover
    const dd = li.querySelector(".dropdown-toggle");
    if (dd) {
      dd.style.background = "transparent";
      dd.style.border = "none";
      dd.style.padding = "4px 10px";
      dd.style.color = text;
      dd.style.borderRadius = "0";      // NO PILLS
    }

    // ACTIVE UNDERLINE ONLY
    if (li.classList.contains("current")) {
      li.style.borderBottom = "2px solid #f7931e";
    } else {
      li.style.borderBottom = "2px solid transparent";
    }
  });

  // Carets (keep them)
  document.querySelectorAll(".caret").forEach(c => {
    c.style.borderTopColor = text;
    c.style.opacity = "0.75";
  });
}

// ===========================================
// TOP MENU (Tools, Settings, My Account, Guide Me…)
// ===========================================
function fixTopMenu(text, bg, border) {
  document.querySelectorAll(".nav.navbar-nav > li").forEach(li => {

    // Remove icons
    li.querySelectorAll("i,svg,img").forEach(i => {
      i.style.display = "none";
      i.remove();
    });

    const btn = li.querySelector("a, .dropdown-toggle");
    if (btn) {
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.padding = "4px 14px";
      btn.style.fontSize = "14px";
      btn.style.fontWeight = "500";
      btn.style.background = "transparent";
      btn.style.border = "none";
      btn.style.color = text;
      btn.style.borderRadius = "0";     // NO PILLS
    }

    const dd = li.querySelector(".dropdown-menu");
    if (dd) {
      dd.style.border = `1px solid ${border}`;
      dd.style.borderRadius = "6px";
      dd.style.background = bg;
      dd.style.color = text;
    }
  });
}

// ===========================================
// MUTATION OBSERVER
// ===========================================
const observer = new MutationObserver(muts => {
  if (muts.some(m => m.addedNodes.length > 50)) return;
  applyTheme();
});
observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['class','style'] });

window.addEventListener('popstate', () => applyTheme(true));
