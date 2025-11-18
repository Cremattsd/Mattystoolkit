const RNX_LEFT = "RNX_LEFT";
const RNX_RIGHT = "RNX_RIGHT";
let splitEnabled = false, contactToProperty = false, propertyToContact = false;

chrome.storage.local.get(
  ["splitViewToggle", "contactToPropertyToggle", "propertyToContactToggle"],
  (r) => {
    splitEnabled = !!r.splitViewToggle;
    contactToProperty = !!r.contactToPropertyToggle;
    propertyToContact = !!r.propertyToContactToggle;
    if (splitEnabled) initSplitLogic();
  }
);

chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.action) {
    case "splitView":
      splitEnabled = msg.state;
      if (splitEnabled) initSplitLogic();
      break;
    case "contactToProperty":
      contactToProperty = msg.state;
      if (contactToProperty) {
        propertyToContact = false;
        chrome.storage.local.set({ propertyToContactToggle: false });
      }
      break;
    case "propertyToContact":
      propertyToContact = msg.state;
      if (propertyToContact) {
        contactToProperty = false;
        chrome.storage.local.set({ contactToPropertyToggle: false });
      }
      break;
  }
});

function initSplitLogic() {
  try {
    window.name =
      location.pathname.includes("property") && location.hash.includes("#key=")
        ? RNX_RIGHT
        : RNX_LEFT;
  } catch {}

  document.addEventListener("click", (e) => {
    if (!splitEnabled) return;
    const link = e.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;

    const isProperty = href.includes("property#key=");
    const isContact = href.includes("contact#key=");

    if (contactToProperty && isContact) {
      e.preventDefault();
      openInRight(href);
    } else if (propertyToContact && isProperty) {
      e.preventDefault();
      openInLeft(href);
    }
  }, true);
}

function openInRight(url) {
  const abs = absUrl(url);
  let w = window.open("", RNX_RIGHT, "width=1400,height=1000");
  if (!w || w.closed) w = window.open(abs, RNX_RIGHT);
  else w.location.href === abs ? w.location.reload() : (w.location.href = abs);
  w.focus();
}

function openInLeft(url) {
  const abs = absUrl(url);
  let w = window.open("", RNX_LEFT, "width=1200,height=1000");
  if (!w || w.closed) w = window.open(abs, RNX_LEFT);
  else w.location.href === abs ? w.location.reload() : (w.location.href = abs);
  w.focus();
}

function absUrl(h) {
  const ORIGIN = location.origin;
  try {
    return h.startsWith("/") ? `${ORIGIN}${h}` : new URL(h, ORIGIN).href;
  } catch { return h; }
}
