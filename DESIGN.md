# 🌲 ARBORIST — Master Design System & Architectural Specification

> **File:** `UI/DESIGN.md`  
> **Brand:** ARBORIST Care & Removal  
> **Aesthetic:** Ultra-Luxury Editorial Botanical Craftsmanship (Strict Anti-Vibe-Coded)  
> **Audience:** High-Net-Worth Residential Estates, Municipal Conservation Authorities, Heritage Tree Stewards

---

## 🎨 1. Curated Organic Color Palette

Our palette rejects generic saturated AI gradients, neon purple-on-dark, or generic corporate blues. Every hue is an organic, high-contrast HSL value inspired by British woodlands, aged bark, and botanical specimens:

| Token | Hex Value | Role & Usage Context |
|---|---|---|
| `primary` | `#174C3C` | Deep British Forest Green. Core brand identity, active steppers, primary CTAs, header background. |
| `primary-dark` | `#0B2D23` | Deep nocturnal evergreen. Hover states, pressed states, deep footer backgrounds (`#00281d`). |
| `primary-light` | `#236B54` | Elevated woodland green. Accent badges, secondary highlights. |
| `primary-container` | `#174C3C` | Solid structural containers, selected cards, high-contrast action bars. |
| `sage` | `#8EAD91` | Organic botanical sage. Subtitles, subtle borders, card outlines. |
| `sage-light` | `#EAF1EB` | Soft sage wash. Badge backgrounds, active pill highlights. |
| `parchment` / `background` | `#F8F7F2` | Warm artisanal sand/parchment. Replaces harsh pure white `#FFF` as the global background. |
| `surface-card` | `#FFFFFF` | Crisp card containers floating on parchment background with soft elevation. |
| `surface-container-low` | `#ecf6ed` | Soft muted green containers, table headers, inset wells. |
| `surface-container-high`| `#e1ebe1` | Border accents, inactive stepper lines, subtle separators. |
| `amber-gold` / `tertiary` | `#E5B869` / `#F0BF64` | Warm golden honey. AI sparkle accents (`auto_awesome`), seasonal badge callouts. |
| `on-surface` | `#151E18` | Deep pine-black body typography. High contrast, readable on parchment and white. |
| `on-surface-variant` | `#404945` | Muted slate-green for explanatory labels and secondary descriptions. |
| `danger-soft` | `#FFDAD6` / `#BA1A1A` | Soft rose emergency accents (never screaming neon red). |

---

## ✍️ 2. Editorial Typography Hierarchy

We pair distinct serif editorial authority for headlines with engineered sans-serif precision for metadata:

* **Display & Step Headlines**: `'DM Serif Display'`, `'Noto Serif'`, serif  
  - Standard step title style: `font-headline-lg text-3xl sm:text-4xl lg:text-[42px] leading-[48px] text-primary tracking-tight font-normal text-center`
  - Subtitle style: `font-body-md text-sm md:text-base text-on-surface-variant mt-2 text-center max-w-xl mx-auto`
* **Metadata, Navigation & Eyebrows**: `Manrope`, sans-serif  
  - Eyebrows: `font-label-sm text-xs uppercase tracking-widest text-primary font-bold`
  - Navigation & Buttons: `font-label-md text-sm font-semibold tracking-wide`
* **Prose, Form Inputs & Descriptions**: `'DM Sans'`, sans-serif  
  - Inputs & Card descriptions: `font-body-md text-sm md:text-base text-on-surface`

---

## 🌊 3. Tactile Motion & Kinetic Physics

* **Page Sweep Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (Zero-flicker GPU accelerated transitions).
* **Card & Pill Popovers**: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (Natural physical spring overshoot).
* **Button Presses**: `active:scale-[0.985]` with 150ms transition.

---

## 🧪 4. Liquid Glass & Cloud Bubble Recipes

### Liquid Glass Navigation Indicator (`.liquid-glass-pill`)
```css
.liquid-glass-pill {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(184, 238, 216, 0.25) 100%);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.12), inset 0 1px 1.5px rgba(255, 255, 255, 0.65);
}
```

### Temporary Liquid Cloud-Glass Resume Pill (`.liquid-cloud-bubble`)
```css
.liquid-cloud-bubble {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(244, 248, 245, 0.9) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(23, 76, 60, 0.18);
  box-shadow: 0 16px 38px rgba(23, 76, 60, 0.2), 0 2px 8px rgba(0, 0, 0, 0.04);
}
```

---

## 🛡️ 5. Strict Anti-Vibe-Coded Rules Checklist

1. ❌ **NO Universal Icon Overload**: Never stick Lucide/generic icons on every button. Use rare, bespoke SVGs or clean text.
2. ❌ **NO Box-in-Box Trapping**: Never instinctively wrap small text snippets in border pills or repetitive neon Bento grids. Let whitespace breathe.
3. ❌ **NO Generic Purple Gradients**: Strict organic woodland palette (`#174C3C`, `#8EAD91`, `#F8F7F2`, `#E5B869`).
4. ❌ **NO Static Chat Widgets**: AI assistant features dynamic states, amber star sparkle (`auto_awesome`), and live voice capability.
5. ✅ **Proximity-Aware Micro-Interactions**: Elements respond organically to cursor presence and touch gestures.
