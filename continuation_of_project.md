# 🌿 ARBORIST — Project Continuation Profile & Owner Dashboard Blueprint

> **Profile Location:** `UI/continuation_of_project.md`  
> **Status:** Architecture Saved & Prepped (Awaiting User Signal to Generate Screens)  
> **Ecosystem:** ARBORIST Care & Removal PWA & Client Portal

---

## 📌 Executive Summary & Purpose

This profile preserves the complete architectural vision, design system rules, data models, and screen specifications for the upcoming **ARBORIST Owner Client Portal & PWA App**. It ensures zero context loss across development sessions or account switches.

Per explicit user direction:
* **No screens or prompts are generated yet.**
* All specifications are locked in this profile so they are immediately accessible when the user initiates the screen generation phase.

---

## 🎨 Design System Mandates (Anti-Vibe-Coded Strict Rules)

1. **Color Palette Tokens**:
   - `primary`: `#174C3C` (Deep British Racing Green / Forest)
   - `primary-dark`: `#0B2D23`
   - `primary-light`: `#236B54`
   - `sage`: `#8EAD91` (Botanical Muted Sage)
   - `sage-light`: `#EAF1EB`
   - `amber-gold`: `#E5B869` / `#F0BF64` (AI Accent & Status Glow)
   - `background`: `#F8F7F2` (Warm Sand / Parchment)
   - `surface-card`: `#FFFFFF`
   - `danger-soft`: `#FFDAD6` / `#BA1A1A`
2. **Typography**:
   - Headlines & Main Step Titles: `'DM Serif Display'`, `'Noto Serif'`, serif (`text-3xl sm:text-4xl lg:text-[42px] leading-[48px]`).
   - UI Labels & Metadata: `Manrope`, sans-serif (uppercase tracking-wide).
   - Body Prose & Inputs: `'DM Sans'`, sans-serif.
3. **Motion Physics**:
   - Organic spring easing: `cubic-bezier(0.16, 1, 0.3, 1)`.
   - Card popovers and 3D deck dismissal: `cubic-bezier(0.175, 0.885, 0.32, 1.275)`.

---

## 🧭 1. Installed PWA & Authenticated Top Navigation Shell

When the web app is installed or the user logs in:

```
[ LOGO + ARBORIST ] ── [ Home ] [ Booking ] [ My Trees ] ── [ 📅 My Bookings ] [ 🔔 (2) ] [ ✦ AI Assist (Yellow Glow) ] [ 👤 Profile ]
```

* **Left**: ARBORIST shield branding (`./assets/logo.png`).
* **Center Navigation**:
  * **Home**: Personalized main screen.
  * **Booking**: Instant 0ms connected booking flow.
  * **My Trees**: Direct shortcut to the client's tree inventory.
* **Right Controls**:
  * **My Bookings Quick Action**: Dedicated calendar button opening only the client's active and past booking vouchers.
  * **Notification Bell**: Unread indicator badge triggering the in-screen stacked deck.
  * **AI Assistant**: Distinctive warm yellow/amber halo glow (`filter: drop-shadow(0 0 10px rgba(240, 191, 100, 0.45))`).
  * **Owner Profile Avatar**: Tapping opens the complete Owner Account Hub drawer.

---

## 🏡 2. Personalized Home Screen & Hero

* **Personalized Greeting**:
  > **"Welcome back, [Client Name]! Let's keep your trees in pristine health."**
* **Contextual "Upcoming Bookings" Widget**:
  - Inserted prominently **immediately above the 6 Service Type Cards**.
  - Displays: Next visit date, arrival window, service type, and assigned lead certified arborist.
  - One-tap quick actions: `[View Pass]`, `[Reschedule]`, `[Message Arborist AI]`.

---

## 👤 3. Owner Account Hub & Profile Hierarchy

Tapping the Profile Avatar opens the full-screen or sliding luxury estate management drawer with the following sequential sections:

### 1. Personal Information & Security
- Profile Photo upload/change with live preview.
- Full Name, Primary Phone, Estate Email Address.
- Security Settings: Password change, Two-Factor Authentication, Session log.

### 2. My Bookings Archive
- Live upcoming appointments and completed service receipts with downloadable itemized invoices.

### 3. My Properties (Multi-Property Management)
- **`[+] Add Property` Action Button** on top.
- **Responsive Layout**:
  - **Desktop / Laptop**: Stacks in a clean **3 to 4 column grid**, wrapping down cleanly as more estates are added.
  - **Mobile / Phone**: Vertical **1-column stacked cards** for comfortable thumb scrolling.
- **Interaction**: Clicking any property card smoothly drops down / expands that property's specific **"My Trees"** inventory.

### 4. My Trees (Specimen Inventory)
- Positioned directly beneath each respective property.
- Individual tree profiles: Species (e.g., *English Oak, London Plane, Japanese Maple*), Estimated Height & Trunk DBH, Pruning History, Acoustic Tomography Health Rating.
- **Empty / Onboarding State**: If no trees/properties have been registered yet, displays an elegant botanical card: *"Welcome to your arbor inventory! Add your first estate to track tree health."*

### 5. Notification Preferences (Mandatory vs Marketing)
- **Mandatory Safety & Service Alerts (Locked / Grayed Out)**:
  - *Appointment Updates* (locked)
  - *Weather-Related Hazard Alerts* (locked)
  - *Seasonal Pruning Reminders* (locked)
  - *Arborist Tree Care Tips* (locked)
  - *Behavior*: Attempting to tap any of these displays an explanatory modal:
    > *"This alert is essential for property safety and active arborist field coordination and cannot be disabled."*
- **Marketing Offers (Toggleable)**:
  - Active toggle switch.
  - Tapping opens a confirmation screen allowing the client to turn off promotional discounts.

### 6. Legal & Session Controls
- Privacy Policy, Terms of Service, and **Sign Out** button.

---

## 🗂️ 4. In-Screen Cascading 3D Notification Deck (Center Screen)

* **Visual Composition**: Viewport dims with a soft background blur (`backdrop-blur-md bg-black/40`).
* **Tactile Stacking**: Notification cards stack slightly on top of each other, staggered toward the top-right (`rotate(1.5deg)`, offset X/Y).
* **Dismiss Controls**:
  - **Desktop**: Top-right `[X]` button dismisses the card, springing the next card forward (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`).
  - **Mobile Touch**: Full swipe-left or swipe-right gesture physics with dynamic tilt angle and opacity fade.
* **Botanical Mascots / Custom Illustrations**:
  - High-wind storm alerts.
  - Live dispatch en route.
  - Sonic tomography assessment ready.

---

## 📋 5. Prompt Formatting & Generation Rules (For Future Phase)

When the user signals to begin generating screens:
1. Screen prompts will be formatted with exact component hierarchy, styling tokens, responsive breakpoints, and tactile motion guidelines.
2. Layouts will be crafted with strict adherence to human craftsmanship (no AI vibe-coded clichés).
3. Generated screens will integrate directly with `UI/index.html` via in-memory pre-warmed controllers for instant 0ms switching.
