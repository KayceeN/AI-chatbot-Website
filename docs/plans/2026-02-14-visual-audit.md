# Visual Audit: Codex Build vs Reference Video

**Date:** 2026-02-14
**Reference:** 86 frames extracted from `reference/source.mov` (frames 0000–0085)
**Build reviewed:** Codex Phase 1 output (single-page marketing landing)

---

## Summary

The Codex build faithfully reproduces section order, copy hierarchy, pricing toggle, FAQ accordion, sticky nav, and floating dock. However, it has **2 entirely missing sections**, **10 missing visual assets** (all image areas are gradient placeholders), **4 missing animations/interactions**, and **8 icon/styling gaps**.

---

## A. Entire Sections Missing (not built at all)

### 1. Comparison Section — "Precision vs Basic"
**Reference:** frames 0055–0056

- Side-by-side "ORB AI" vs "Others" cards with feature bullet lists
- CTA button in the ORB AI card
- Section badge with "COMPARISON" label
- **Status:** Not present in codebase. No `ComparisonSection.tsx` exists. Not in `sectionOrder` array in `src/content/landing.ts`.

### 2. Team Section — "Team Behind Success"
**Reference:** frames 0056–0058

- 3 team member cards (Gwen Chase/Marketing, James Bond/Designer, Emily Gwen/Support Team)
- Each card: name, role, social media icons (X, Instagram, link), large portrait photo
- Carousel arrows (left/right) for navigation
- Section badge with "TEAM" label
- **Status:** Not present in codebase. No `TeamSection.tsx` exists. Not in `sectionOrder` array.

---

## B. Missing Visual Assets (gradient placeholders instead of images)

All image areas in the build use flat gradient `<div>` elements instead of actual images or meaningful illustrations.

### 3. Hero 3D Orb
**Reference:** Realistic 3D sphere with water ripple/refraction effect, centered in hero.
**Build:** CSS `.orb-rings` pseudo-elements rendering two concentric ring outlines. No 3D appearance.
**File:** `src/styles/globals.css` (`.orb-rings` class), `src/components/sections/HeroSection.tsx`

### 4. Benefits Card Illustrations
**Reference:** Three distinct illustrations — analog clock, bar chart with sliders, orb with avatar bubbles.
**Build:** `<div className="mb-5 h-36 rounded-2xl bg-gradient-to-br from-white to-[#e8e8ea] shadow-inner" />` — identical gradient placeholder for all 3 cards.
**File:** `src/components/sections/BenefitsSection.tsx`

### 5. Features Card Images
**Reference:** Robot/AI photos with rounded corners, different per card.
**Build:** Gradient placeholders with slightly varied color directions (`visualClass` map), but no actual images.
**File:** `src/components/sections/FeaturesSection.tsx`

### 6. Services Interactive Mockups
**Reference:** Four distinct visual mockups:
  - Consulting icon (briefcase/strategy)
  - Content generation UI (input field + "Generate" button + suggestion chips)
  - Chatbot interface (chat bubble + typing area)
  - Workflow node diagram (connected nodes with icons)
**Build:** Simple gradient strips — no interactive or illustrative content.
**File:** `src/components/sections/ServicesSection.tsx`

### 7. Process Step Photos
**Reference:** Phone with colorful screen, robotic arm photos alongside step descriptions.
**Build:** Gradient placeholders.
**File:** `src/components/sections/ProcessSection.tsx`

### 8. Projects Case Study Image
**Reference:** Actual project photo or screenshot in the case study card.
**Build:** Dark gradient placeholder.
**File:** `src/components/sections/ProjectsSection.tsx`

### 9. Customers Section Image
**Reference:** Photo in the right-side featured testimonial card.
**Build:** Dark gradient placeholder.
**File:** `src/components/sections/CustomersSection.tsx`

### 10. Customers Avatars
**Reference:** Circular avatar photos next to each mini-testimonial name.
**Build:** No avatar elements rendered.
**File:** `src/components/sections/CustomersSection.tsx`

### 11. Team Section Photos
**Reference:** Large portrait photos for each team member card.
**Build:** Section not built (see A.2).

### 12. Footer 3D Orb
**Reference:** Same 3D sphere with ripple effect as hero, positioned in footer.
**Build:** CSS `.orb-rings` pseudo-elements only (same as hero — ring outlines, no 3D).
**File:** `src/components/sections/FooterSection.tsx`

---

## C. Missing Animations & Interactions

### 13. FAQ Accordion Animation
**Reference:** Smooth height expand/collapse with easing when toggling FAQ items.
**Build:** Instant conditional render (`{open && <p>...</p>}`) — no height animation, content appears/disappears instantly.
**File:** `src/components/sections/FAQSection.tsx`

### 14. Pricing Toggle Slide
**Reference:** Animated indicator that slides between "Monthly" and "Yearly" buttons.
**Build:** Instant color swap on button click, no sliding indicator.
**File:** `src/components/sections/PricingSection.tsx`

### 15. Scroll-Based Nav Hide/Show
**Reference:** Navigation bar hides on scroll down, reveals on scroll up (directional scroll detection).
**Build:** Static `sticky top-0` — always visible regardless of scroll direction.
**File:** `src/components/layout/TopNav.tsx`

### 16. Process Dark Card Visualization
**Reference:** Workflow visualization with connected nodes/icons inside a dark card.
**Build:** Placeholder bars — no workflow visualization.
**File:** `src/components/sections/ProcessSection.tsx`

---

## D. Icon & Styling Gaps

### 17. Primary CTA Arrow Icons
**Reference:** "Get Started ↗" with diagonal arrow icon after text.
**Build:** No arrows on any CTA buttons.
**File:** `src/components/ui/ActionButton.tsx`

### 18. FAQ Chevron Icons
**Reference:** Proper chevron (`∨` / `∧`) arrows indicating expand/collapse state.
**Build:** `+` / `−` text characters.
**File:** `src/components/sections/FAQSection.tsx`

### 19. Section Badge Icons
**Reference:** Specific icons per section (star for benefits, gear for features, etc.).
**Build:** Generic `●` bullet for all badges via `BadgePill` default `symbol` prop.
**File:** `src/components/ui/BadgePill.tsx`, `src/components/ui/SectionHeading.tsx`

### 20. Contact Icons
**Reference:** Proper mail/phone SVG icons in black rounded squares.
**Build:** Emoji characters (mail/phone emoji).
**File:** `src/components/sections/ContactSection.tsx`

### 21. Pricing Checkmarks
**Reference:** Proper check icons (SVG or icon font).
**Build:** Text character checkmark — minor gap, functionally equivalent.
**File:** `src/components/sections/PricingSection.tsx`

### 22. Customers Star Ratings
**Reference:** 5-star row above each mini-testimonial quote.
**Build:** Missing entirely — no star rating elements.
**File:** `src/components/sections/CustomersSection.tsx`

### 23. Footer Social Icons
**Reference:** X (Twitter), Instagram, link icons above the 3D orb in footer.
**Build:** Missing — no social icon elements in footer.
**File:** `src/components/sections/FooterSection.tsx`

### 24. Footer Copyright
**Reference:** "ORBAI (c) 2025. Designed by FrameBase" at bottom of footer.
**Build:** Missing — no copyright line.
**File:** `src/components/sections/FooterSection.tsx`

---

## Priority Matrix

| Priority | Items | Rationale |
|----------|-------|-----------|
| **P0 — Missing functionality** | A.1 (Comparison), A.2 (Team) | Entire sections not built |
| **P0 — Missing assets** | B.3–B.12 (all images) | Every image area is a gradient placeholder |
| **P1 — Missing interactions** | C.13 (FAQ anim), C.15 (nav scroll), D.17–D.20 (icons) | Noticeable UX/visual gaps |
| **P2 — Polish** | C.14 (pricing slide), C.16 (process viz), D.21–D.24 (minor icons/text) | Nice-to-have refinements |
