# Matty’s Blackout — RealNex UI Upgrade + Split View Toolkit
Clean, modern, Apple-style UI overhaul for RealNex with dark/light theming and a full Split View engine powered by Chrome tabs. This extension is designed to make daily RealNex work faster, cleaner, and way more efficient.

---

## 🚀 Features

### **1. Blackout UI Engine (blackout.js)**
- Apple-style fonts and spacing  
- Glass UI panels  
- Rounded menus + rounded avatars  
- Button cleanup + card cleanup  
- White borders everywhere  
- Fully theme-aware  
- Instant "ON / OFF" toggle with zero CSS leakage  
- MutationObserver keeps UI styled even as RealNex updates content

---

### **2. Split View Toolkit (content.js + background.js)**
**True split-screen workflow:**

- Contact click → opens/updates Property tab  
- Property click → opens/updates Contact tab  
- Auto refresh on new record  
- UUID smart suppression (won’t reload same record)  
- Uses actual Chrome tabs (not windows) so you can snap left/right  
- Works in Chrome Canary's tab snapping mode  

---

### **3. Popup Control Panel (popup.html + popup.js)**
- Light Mode  
- Dark Mode  
- Reset Mode  
- Split View toggle  
- Contact → Property routing toggle  
- Property → Contact routing toggle  

Clean UI with animated switches, indicators, and global theme control.

---

### **4. Background Engine (background.js)**
- Receives routing commands from content.js  
- Updates/creates tabs for split view  
- Tracks left tab (Contact) + right tab (Property)  
- Relays theme changes to all active tabs  
- Auto cleanup when tabs close  

---

## 📁 File Overview

### **manifest.json**
Defines the extension, permissions, scripts, popup, and URL match rules.

### **background.js**
The traffic cop.
- Listens for routing commands (“open contact”, “open property”)  
- Manages the left/right tab IDs  
- Updates tabs or creates new ones  
- Handles cleanup  
- Broadcasts theme changes  

### **content.js**
The click interceptor.
- Detects user clicks inside RealNex  
- Determines if clicked URL is a Contact or Property  
- Sends commands to background.js  
- Toggles routing direction  
- Bridges theme messages to blackout.js  

### **blackout.js**
The styling engine.
- Adds/removes UI styles  
- Manages light/dark mode  
- Apple-style UI cleanup  
- Observes DOM changes so styling is always applied  
- Full cleanup on reset  

### **popup.html**
The control panel UI.

### **popup.js**
The logic that ties UI switches → storage → messages → content → blackout.

---

## 🔧 Installation (Dev Mode)

1. Clone the repo  
2. Go to `chrome://extensions`  
3. Enable **Developer Mode**  
4. Click **Load Unpacked**  
5. Select the extension folder  

---

## 🧪 Usage

### For Split View:
1. Open a Contact tab  
2. Open a Property tab  
3. Turn ON “Split View” in the popup  
4. Select routing mode (C→P or P→C)  
5. Click around — tabs sync automatically  

### For Theme:
- Toggle ON → Light or Dark  
- Toggle OFF → RealNex instantly returns to stock orange  

---

## 📌 Notes
- No windows are created anymore — only tabs  
- UUID matching prevents useless reloads  
- Theme is 100% reversible with zero style residue  
- Cleanest MV3 manifest possible  

---

## 👤 Author
Matthew “Matt” Smith  
San Diego  
RealNex + CRE Tech  
