# 🤝 ARBORIST — Complete Project Handover & Agent Continuation Dossier

> **File:** `UI/PROJECT_HANDOVER.md`  
> **Target Audience:** Any incoming AI Agent or Developer taking over from another account or session.  
> **Project Root:** `d:\CODE\WORK` | **Active App Directory:** `d:\CODE\WORK\UI`  
> **Framework:** Handcrafted Vanilla HTML5, Tailwind CSS, Custom GPU Acceleration, JavaScript (Zero bloat, zero unnecessary framework lock-in).

---

## 🌟 1. Executive Summary

**ARBORIST Care & Removal** is an ultra-luxury, editorial-grade web application built for tree surgeons and high-net-worth estate stewardship. It features:
1. **0ms Latency In-Memory Connected Booking Engine** (5-step interactive appointment wizard running directly inside `index.html` with zero page reloads).
2. **Interactive AI Voice & Chat Systems** (Talk to AI chat and Live Voice call assistant integration).
3. **Cloud-Glass Cognitive Load Reducer** (Temporary liquid cloud-glass pill that allows instant 1-tap return to booking if closed).
4. **Planned PWA & Owner Client Portal** (Multi-property tree inventory, upcoming booking widgets, cascading 3D notification deck).

> [!IMPORTANT]
> **All planned items are fully editable and flexible.** The architectural plans outlined here provide the foundation, but can be adapted whenever the user requests.

---

## 📁 2. Complete File Directory & Component Map

All active code lives in `d:\CODE\WORK\UI`:

```
d:\CODE\WORK\UI/
├── assets/
│   ├── logo.png                     # Official ARBORIST Tree Surgeon shield logo
│   └── service-*.jpg                # High-res photography for services & treatments
├── index.html                       # MASTER PRODUCTION ENTRY POINT (Includes Home + In-Memory Booking Overlay)
├── desktop.html                     # Desktop-specific home view (synchronized with index.html)
├── mobile.html                      # Mobile-specific home view (synchronized with index.html)
├── booking.html                     # Master 5-step SPA booking template
├── booking-step1.html               # Step 1 fallback: Service Selection
├── booking-step2.html               # Step 2 fallback: Property Location & 3D Isometric House
├── booking-step3.html               # Step 3 fallback: Interactive Date & Time Calendar
├── booking-step4.html               # Step 4 fallback: Client Details & Order Summary
├── booking-step5.html               # Step 5 fallback: Confirmation & Bear Mascot Animation
├── desktop-chat.html                # Desktop AI Assistant Chat Interface
├── desktop-live-voice.html          # Desktop Gemini Live Bidirectional Voice Call Module
├── mobile-welcome.html              # Mobile AI Welcome Screen
├── mobile-chat.html                 # Mobile AI Chat Screen
├── mobile-live-voice.html           # Mobile AI Live Voice Screen
├── owner/                           # OWNER PORTAL & OPERATIONAL DASHBOARD (Desktop + Tablet + Mobile)
│   ├── index.html                   # Master Interconnected Responsive Owner App (All 5 tabs, 0ms switch)
│   ├── dashboard.html               # Unified Responsive Owner App defaulting to Dashboard tab
│   ├── bookings.html                # Unified Responsive Owner App defaulting to Bookings & Calendar tab
│   ├── customers.html               # Unified Responsive Owner App defaulting to Customers tab
│   ├── ai.html                      # Unified Responsive Owner App defaulting to AI Management tab
│   ├── settings.html                # Unified Responsive Owner App defaulting to Settings tab
│   ├── desktop-dashboard.html       # Connected Desktop Dashboard screen
│   ├── desktop-bookings.html        # Connected Desktop Bookings & Calendar screen
│   ├── desktop-customers.html       # Connected Desktop Customers screen
│   ├── desktop-ai.html              # Connected Desktop Operational AI Management screen
│   ├── desktop-settings.html        # Connected Desktop Settings screen
│   ├── mobile-dashboard.html        # Connected Mobile Dashboard screen
│   ├── mobile-bookings.html         # Connected Mobile Bookings & Calendar screen
│   ├── mobile-customers.html        # Connected Mobile Customers screen
│   ├── mobile-ai.html               # Connected Mobile Operational AI Management screen
│   ├── mobile-settings.html         # Connected Mobile Settings screen
│   └── raw/                         # Unmodified Stitch raw HTML downloads for reference
├── separate-booking-screen.html     # Historical isolated screen reference
├── DESIGN.md                        # Master Design System, Color Tokens & Typography rules
├── continuation_of_project.md       # Owner Portal & PWA specification profile
└── PROJECT_HANDOVER.md              # THIS HANDOVER DOSSIER
```

---

## ⚡ 3. Core Interactive Architecture & Global JavaScript APIs

### A. Connected In-Memory Booking Flow
The 5-step booking flow is embedded directly inside `index.html` (as well as `desktop.html` and `mobile.html`) as `#booking-flow-overlay`:
```html
<div id="booking-flow-overlay" class="fixed inset-0 z-[100] bg-background overflow-y-auto hidden opacity-0 transition-opacity duration-300" style="overscroll-behavior: contain;">
  <!-- Complete 5-Step Booking HTML Pre-rendered in Memory -->
</div>
```

### B. Global Controller Methods (Available on `window`):
1. **`window.openBookingModal(preselectedService)`**:
   - Opens `#booking-flow-overlay` in **0ms** without reloading the page.
   - Resets stepper to Step 1 (or selects preselected service card, e.g. `'tree-removal'`).
   - Locks body scroll (`document.body.style.overflow = 'hidden'`).
   - Synchronizes URL bar via `history.pushState({ view: 'booking', step: 1 }, '', 'booking-step1.html')`.
2. **`window.closeBookingModal(event)`**:
   - Instantly fades out `#booking-flow-overlay` (280ms transition).
   - Restores body scroll.
   - Smoothly scrolls viewport to home page top: `window.scrollTo({ top: 0, behavior: 'smooth' })`.
   - Updates URL bar back to `index.html` via `history.replaceState({ view: 'home' }, '', 'index.html')`.
   - **Triggers the Temporary Liquid Cloud-Glass Pill** at the click coordinates!
3. **`window.goToStep(stepNumber)`**:
   - Fluid zero-flicker sweep transitions (`sweepInFromRight` / `sweepInFromLeft`, easing: `cubic-bezier(0.16, 1, 0.3, 1)`).
   - Dynamically morphs Bar 2 title and icon (smooth opacity & translateY transition).
   - Updates Bar 3 stepper badges, checkmarks, and progress lines.
   - Syncs URL parameters (`?step=N`) without reloading.
4. **`window.showResumeBookingCloud(clickX, clickY)`**:
   - Spawns a floating liquid cloud-glass pill (`#booking-resume-cloud-pill`) right near where the user clicked Home or Cancel.
   - **Desktop Hover**: Stays visible indefinitely as long as the mouse cursor hovers over it.
   - **Auto-Dismiss**: If not hovered or if the mouse moves away, gracefully fades out after **3 seconds**.
   - **Mobile Touch**: Stays for 3 seconds then fades away.
   - **Clicking It (`window.resumeBookingFromCloud()`):** Immediately re-opens the booking modal right where the user left off, minimizing cognitive load!
5. **`window.handleTalkToAi(event)`**:
   - Opens the AI Chat interface (`openDesktopAi()` or `openMobileAi()`).
6. **`window.handleCallNow(event)`**:
   - Opens the AI Live Voice Call interface (`openDesktopAi('voice')` or `openMobileAi('voice')`).
7. **`window.AppointmentAPI`**:
   - `onAppointmentChanged(appointmentData)`: Dispatches appointment updates and saves to `sessionStorage` (`sylva_booking_registration`).
   - `finalizeBooking(fullData)`: Final booking confirmation endpoint hook.

---

## 📋 4. Step-by-Step Booking Engine Details

| Step | Title (Unified Center `42px`) | Content & Features | Bottom Action Buttons |
|---|---|---|---|
| **Step 1** | **What Can We Help You With?** | 6 Interactive Service Cards with check badges and active amber rings. | Left: **Home** (returns to home) · Right: **Continue** (to Step 2) |
| **Step 2** | **Where Is Your Tree Located?** | Address input with postal autocomplete + 3D Isometric Estate House illustration with interactive marker pins. | Left: **Back to Tree Details** · Right: **Continue to Appointment** |
| **Step 3** | **Choose Your Appointment.** | Interactive October 2026 Calendar (selectable active days) + 4 Time Slots (9:00 AM, 10:30 AM, 1:00 PM, 3:00 PM). | Left: **Back to Location** · Right: **Continue to Your Details** |
| **Step 4** | **How Can We Reach You?** | Client contact form (Name, Phone, Email) + Live dynamic order summary card synced from Step 1-3. | Left: **Back to Appointment** · Right: **Continue to Review** |
| **Step 5** | **You’re All Set!** | Celebratory Golden Aura + Fluffy Brown Bear Mascot SVG + Next steps action cards. | Bottom: **Back** (to Step 4) · **Done** (returns to Home) |

---

## 🔮 5. Planned PWA & Owner Portal Roadmap (Editable)

The user has envisioned turning ARBORIST into an **installable Progressive Web App** with a dedicated **Owner Client Portal**. All specifications are flexible and can be modified:

### 1. PWA Standards
* `manifest.webmanifest`: Standalone display mode (no browser URL bar), `#174C3C` theme color, high-res maskable icons.
* Service Worker (`sw.js`): Cache shell assets and store confirmed appointment passes offline in IndexedDB.
* Safe-area padding for mobile notches and gesture bars.

### 2. Personalized Hero Section
* Dynamic greeting for logged-in owners: *"Welcome back, [Client Name]! Let's keep your trees in pristine health."*
* **Upcoming Booking Widget**: Positioned directly above the 6 service cards with date, time, lead certified arborist, and quick reschedule/message actions.

### 3. Authenticated Top Navigation Shell
```
[ LOGO + ARBORIST ] ── [ Home ] [ Booking ] [ My Trees ] ── [ 📅 My Bookings ] [ 🔔 (2) ] [ ✦ AI Assist (Yellow Glow) ] [ 👤 Profile ]
```

### 4. Owner Account Hub / Estate Profile Hierarchy
* **Personal Information & Security**: Profile photo, name, phone, email, password & 2FA settings.
* **My Bookings Archive**: Live and past itemized service receipts.
* **My Properties (Multi-Property Management)**:
  - Top action button: `[+] Add Property`.
  - Desktop: **3 to 4 column grid**, stacking down.
  - Mobile: **1-column vertical card stack**.
  - Clicking any property card drops down that property's specific **"My Trees"** inventory.
* **My Trees (Specimen Inventory)**:
  - Sub-cards under each property: Species (Oak, Maple, Pine), DBH trunk diameter, health score, pruning history.
  - Empty onboarding state for new properties.
* **Notification Preferences**:
  - **Mandatory Alerts (Locked / Grayed Out)**: Appointment Updates, Weather Alerts, Seasonal Reminders, Tree Care Tips. Tapping shows an explanatory popup: *"This alert is essential for safety & coordination and cannot be disabled."*
  - **Marketing Offers (Toggleable)**: Active toggle to opt out of promotional offers.
* **Footer Controls**: Privacy Policy, Terms of Service, Sign Out.

### 5. In-Screen Cascading 3D Notification Deck
* Center-screen display with background blur (`backdrop-blur-md bg-black/40`).
* Staggered top-right card stack (`scale(0.96)`, `rotate(1.5deg)`).
* Dismiss via top-right `[X]` button or mobile touch swipe-left/swipe-right physics.
* Bespoke botanical mascot/illustrations for weather alerts, en-route dispatch, and diagnostic reports.

---

## 🛠️ 6. How the Incoming Agent Should Continue Work

When taking over this workspace in a new chat/account:

1. **Verify Existing Files**:
   - Run: `node -e "['UI/index.html', 'UI/booking.html'].forEach(f => console.log(f, fs.existsSync(f)))"`
2. **Review Design Rules**:
   - Always adhere to `UI/DESIGN.md` (no generic AI clichés, pure organic HSL colors, responsive typography).
3. **Check User's Immediate Next Request**:
   - The user requested:
     > *"Don't try to create the screen now or create the prompt just save this when the time reaches we are going to I'm going to tell you exactly how you are going to format the prompt with the design of time... so save it to my continuation of project"*
   - When the user asks to begin building the Owner Portal screens or PWA manifest:
     - Consult Section 5 above and `UI/continuation_of_project.md`.
     - Implement screens with the same in-memory 0ms switching architecture.
4. **Maintenance of Standalone vs Connected Files**:
   - When editing `UI/booking.html`, run our helper scripts (`UI/update_booking_files.js` or `scratch/inject_connected_booking.js`) so that `booking-step1.html` through `booking-step5.html` and the `#booking-flow-overlay` in `index.html` stay 100% in sync.
