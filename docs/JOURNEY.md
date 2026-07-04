# Journey Section — Production Grade Interaction Specification

## Objective

The Journey section should feel like Apple, Linear, or Stripe storytelling rather than a normal scrolling section.

The screen is divided into two columns:

* **Left (45%)** → Journey description
* **Right (55%)** → Animated ID Card / Experience Card

The section itself remains pinned while the user scrolls through multiple journey steps.

---

## Expected Scroll Behaviour

### 1. Enter Animation

When the Journey section enters the viewport:

* Fade in the entire section.
* Left description slides upward slightly while fading in.
* Right ID card scales from 0.95 → 1 with a soft fade.
* Only the first journey item is visible.

The animation should feel calm and premium.

---

### 2. Sticky Section

Once the section reaches the viewport:

* The entire section becomes sticky.
* The browser continues scrolling internally through the journey items.
* The page itself should not continue until all journey items have been displayed.

This creates the feeling that the user is progressing through a timeline instead of scrolling a normal page.

---

### 3. Scroll Progress

Each scroll progress reveals exactly one journey item.

For every step:

Current Item
↓

Left Description updates

AND

Right ID Card updates

Both must change together.

Never allow one side to update before the other.

---

## Left Panel Behaviour

The description must not disappear instantly.

Instead:

Old description

↓

fade out (150–200ms)

↓

move upward 12px

↓

new description fades in

↓

slides upward into position

The container height must remain fixed.

Do NOT resize the layout.

Do NOT push other elements.

Only the content changes.

---

## Right Card Behaviour

The ID Card should never pop or jump.

Old Card

↓

slightly scales down

↓

opacity decreases

↓

moves down 10px

↓

new card enters

↓

opacity increases

↓

scale 0.95 → 1

↓

settles naturally

The card container must remain fixed.

Only the card content changes.

---

## Synchronization

Both panels must be driven by the same active journey index.

Example:

Scroll reaches Journey #2

↓

activeIndex becomes 1

↓

Left description changes

↓

Right card changes

↓

Animations start together

↓

Animations finish together

Never trigger them independently.

---

## Scrolling Rules

One scroll progress equals one journey step.

Do not allow multiple steps to skip.

Do not rapidly change items during fast scrolling.

The active index should be calculated from scroll progress.

Example:

0–20%
Journey 1

20–40%
Journey 2

40–60%
Journey 3

60–80%
Journey 4

80–100%
Journey 5

The transition should occur only when entering the next range.

---

## Layout Stability

The section height must never change.

The left panel width must never change.

The right panel width must never change.

Card size must remain identical across every journey item.

Description container must remain identical.

No jumping.

No layout shift.

No reflow.

---

## Motion Principles

Avoid:

* sudden appearance
* popping
* instant content replacement
* scaling above 1.02
* aggressive easing
* bouncing animations
* rotating cards
* changing container dimensions

Prefer:

* opacity transitions
* slight vertical movement
* subtle scale
* smooth easing
* premium motion
* stable layouts

---

## Visual Quality

The interaction should feel like:

* Apple product pages
* Linear.app animations
* Stripe storytelling
* Framer premium landing pages

The user should feel that they are moving through a timeline, not watching unrelated components refresh.

---

## Performance Requirements

* Animate only transform and opacity.
* Do not animate width or height.
* Keep both columns mounted.
* Only replace internal content.
* Use GPU-friendly transforms.
* Avoid unnecessary React re-renders.
* Maintain a consistent 60 FPS.

---

## Success Criteria

A successful implementation should feel like one synchronized story:

1. Section becomes sticky.
2. User scrolls.
3. Scroll progress advances one journey step.
4. Left description and right ID card transition simultaneously.
5. Layout never moves.
6. No flickering.
7. No jumping.
8. No content overlap.
9. No delayed updates.
10. The experience feels smooth, intentional, and premium.
