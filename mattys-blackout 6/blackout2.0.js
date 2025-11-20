// ===========================================
// Matty's Blackout – v17.4 Low-Latency Navigation + Rounded Avatars
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
    tooltips: document.querySelectorAll(".tooltip, .tooltip-inner, .tooltip-arrow"),
    navigationContainer: document.querySelector('body') // delegate navigation clicks from body
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

    // AVATARS
    els.avatars.forEach(img => {
      img.style.borderRadius = "8px";
      img.style.overflow = "hidden";
      img.style.objectFit = "cover";
      img.style.objectPosition = "center";
      img.style.backgroundColor = darkMode ? "#1a1a1a" : "#f0f0f0";
      if (!img.complete) img.addEventListener('load', () => img.style.backgroundColor = 'transparent', { once: true });
      else img.style.backgroundColor = 'transparent';
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

    // ROWS
    els.rows.forEach(row => {
      const separator = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
      row.style.borderBottom = `1px solid ${separator}`;
      row.style.transition = "background-color 0.18s ease";
      row.onmouseenter = () => row.style.backgroundColor = darkMode ? "rgba(255,140,0,0.25)" : "rgba(255,140,0,0.10)";
      row.onmouseleave = () => row.style.backgroundColor = bgPrimary;
    });

    // TOOLTIPS
    els.tooltips.forEach(tt => {
      const bg = darkMode ? "#000" : "#fff";
      const txt = darkMode ? "#fff" : "#000";
      tt.style.backgroundColor = bg;
      tt.style.color = txt;
      tt.style.border = darkMode ? "1px solid #444" : "1px solid #ccc";
    });

    cleanTopNav();
    fixTopRightHolyAlignment();
    rafScheduled = false;
  });
}

// ===========================================
// TOP NAV FIXES
// ===========================================
function cleanTopNav() {
  const nav = document.querySelector(".main-toolbar, ul.d-flex.main-toolbar");
  if (!nav) return;
  nav.style.cssText = "background:transparent!important;border:none!important;box-shadow:none!important;padding:4px 0 2px 0!important;";
}

function fixTopRightHolyAlignment() {
  const header = document.querySelector('.header-bar, .main-header, [class*="header"]');
  if (!header) return;
  header.style.alignItems = 'flex-start';
}

// ===========================================
// NAVIGATION EVENT DELEGATION (ULTRA-LOW LATENCY)
// ===========================================
function fastNavigate(event) {
  const target = event.target.closest('a');
  if (!target || !target.href) return;

  event.preventDefault();
  const url = target.href;

  // Update SPA-style content
  // Example: fetch content, replace container innerHTML
  const container = document.querySelector('#main-content');
  if (container) {
    fetch(url).then(res => res.text()).then(html => {
      container.innerHTML = html;
      applyTheme(true); // re-apply theme after content load
      window.history.pushState({}, '', url); // update URL
    });
  } else {
    window.location.href = url; // fallback full-page navigation
  }
}

// Delegate clicks for navigation
document.body.addEventListener('click', fastNavigate);

// ===========================================
// HELPERS
// ===========================================
function containsOrange(val) {
  return val && ORANGE_SHADES.some(hex => val.toLowerCase().includes(hex.slice(1)));
}

// ===========================================
// MUTATION OBSERVER (THROTTLED)
// ===========================================
const observer = new MutationObserver(muts => {
  if (muts.some(m => m.addedNodes.length > 50 || [...m.addedNodes].some(n => n.classList?.contains('leaflet')))) return;
  applyTheme();
});
observer.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['class','style'] });

// ===========================================
// HISTORY POPSTATE HANDLER FOR BACK/FORWARD
// ===========================================
window.addEventListener('popstate', () => applyTheme(true));
