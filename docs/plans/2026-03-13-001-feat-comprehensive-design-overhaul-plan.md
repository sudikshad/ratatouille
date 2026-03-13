---
title: Comprehensive Design Overhaul with Anthropic Frontend Design Skill
type: feat
status: active
date: 2026-03-13
deepened: 2026-03-13
---

# Comprehensive Design Overhaul with Anthropic Frontend Design Skill

## Enhancement Summary

**Deepened on:** 2026-03-13
**Research agents used:** frontend-design, performance-oracle, kieran-typescript-reviewer, julik-frontend-races-reviewer, code-simplicity-reviewer, framework-docs-researcher, design-implementation-reviewer

### Key Improvements
1. **Simplified scope**: Reduced from 17-25 hours to 8-12 hours by focusing on high-impact changes
2. **Performance-first**: Replace Geist fonts entirely (don't add to 4 fonts), use CSS transitions for simple interactions
3. **TypeScript safety**: Added type definitions for motion variants and animation props
4. **Race condition prevention**: Added cleanup patterns for animations and toasts

### Critical Research Findings
- **Font loading**: REPLACE Geist fonts with Fraunces + Plus Jakarta Sans (don't add more fonts)
- **CSS-first animations**: Use CSS transitions for hover/focus states; reserve Framer Motion for complex sequences
- **Bundle budget**: Target <15kb additional JS with LazyMotion + tree-shaking
- **Tailwind v4**: Use `@theme` directive in CSS for design tokens (not tailwind.config.ts)

---

## Overview

Transform the Ratatouille meal planning app from a functional but utilitarian interface into a distinctive, production-grade experience that avoids generic AI aesthetics. Using Anthropic's frontend design skill principles, we will create bold typography, high-impact animations, memorable visual identity, and a cohesive design system.

## Problem Statement / Motivation

The current app has:
- Generic Geist font family (lacks personality)
- Minimal animations (only basic hover states)
- Functional but forgettable visual design
- Inconsistent loading/error states
- Basic component styling via shadcn defaults

Users deserve a delightful cooking experience that matches the joy of making ratatouille itself.

## Proposed Solution

A phased design overhaul implementing:
1. **Bold Typography** - Distinctive font pairing (display + body)
2. **Rich Color System** - Warm, food-inspired palette with depth
3. **Micro-interactions** - Spring-based animations, staggered reveals
4. **Visual Atmosphere** - Textures, gradients, shadows for depth
5. **Cohesive States** - Polished loading, empty, and error states

### Chosen Aesthetic Direction: **Warm Organic Editorial**

Combining the warmth of a home kitchen cookbook with modern editorial sophistication:
- Hand-crafted feel with refined execution
- Organic shapes and warm colors (inspired by actual ratatouille ingredients)
- Generous white space with intentional asymmetry
- Animations that feel natural, like cooking movements

## Technical Approach

### Architecture

**Design Token System** (Tailwind v4 CSS-first approach):

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Typography - REPLACE Geist, don't add to it */
  --font-display: "Fraunces Variable", Georgia, serif;
  --font-body: "Plus Jakarta Sans Variable", system-ui, sans-serif;

  /* Colors - OKLCH for perceptual uniformity */
  --color-primary: oklch(45% 0.15 30);      /* warm terracotta */
  --color-primary-light: oklch(65% 0.12 30);
  --color-accent: oklch(75% 0.18 85);       /* golden olive */
  --color-surface: oklch(98% 0.01 90);      /* warm white */

  /* Shadows */
  --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.05);
  --shadow-md: 0 4px 6px oklch(0% 0 0 / 0.07);
  --shadow-lg: 0 10px 15px oklch(0% 0 0 / 0.1);

  /* Motion - CSS-first for simple interactions */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
}
```

**Animation Strategy** (CSS-first, Framer Motion for complex):

```typescript
// src/lib/motion.ts - TypeScript-safe motion variants
import { type Variants, type Transition } from "framer-motion";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};
```

**Font Configuration** (next/font):

```typescript
// src/app/layout.tsx
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Apply to html: className={`${fraunces.variable} ${plusJakarta.variable}`}
```

**LazyMotion Setup** (bundle optimization):

```typescript
// src/components/motion-provider.tsx
"use client";
import { LazyMotion, domAnimation } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
```

**Component Enhancement Strategy**:
- Use CSS transitions for hover/focus states (no JS needed)
- Reserve Framer Motion for: page transitions, staggered lists, complex sequences
- Add TypeScript-safe motion variant props to components
- Clean up animations on unmount to prevent memory leaks

### Implementation Phases

#### Phase 1: Foundation (Design System)

**Typography Setup**
- REPLACE Geist fonts with Fraunces + Plus Jakarta Sans via next/font
- Remove existing Geist imports from layout.tsx
- Use variable fonts with `display: "swap"` for performance
- Subset to Latin only (reduce font file size)

**Research Insight - Font Loading:**
```typescript
// CRITICAL: Remove Geist, don't add to existing fonts
// Before: 4 font families = slow LCP
// After: 2 variable fonts = faster loading
```

**Color Refinement with OKLCH**
- OKLCH provides perceptual uniformity (colors feel balanced)
- Increase contrast for WCAG AA compliance
- Add semantic colors mapping to design tokens

**Motion Foundation**
- CSS custom properties for transitions (no JS for simple states)
- TypeScript-safe Framer Motion variants in `src/lib/motion.ts`
- LazyMotion provider wrapping app for bundle optimization

**Files to modify:**
- `src/app/globals.css` - Design tokens with @theme directive
- `src/app/layout.tsx` - Font configuration (REPLACE Geist)
- `src/lib/motion.ts` - Create typed motion variants
- `src/components/motion-provider.tsx` - Create LazyMotion wrapper
- `package.json` - Add framer-motion

**Deliverables:**
- Typography renders correctly across all pages
- Design tokens in CSS (not JS config)
- Motion utilities with TypeScript types

**Estimated effort:** 2 hours

---

#### Phase 2: Core Components

**Button Enhancement (CSS-first)**
```css
/* Use CSS for hover/focus - no JS overhead */
.btn {
  transition: transform var(--duration-fast) var(--ease-spring),
              box-shadow var(--duration-fast) ease-out;
}
.btn:hover { transform: scale(1.02); box-shadow: var(--shadow-md); }
.btn:active { transform: scale(0.98); }
.btn:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
```

**Card Enhancement (CSS hover, Framer for entry)**
```typescript
// Entry animation with Framer Motion
<m.div variants={fadeUpVariants} initial="hidden" animate="visible">
  <Card className="card-hover" /> {/* CSS handles hover */}
</m.div>
```

**Input Enhancement**
- CSS focus ring animation (no JS)
- Error shake: use CSS `@keyframes` with `animation-play-state`
- Avoid success checkmark animation (YAGNI - not in current UX)

**Research Insight - Race Conditions:**
```typescript
// CRITICAL: Clean up animations on unmount
useEffect(() => {
  const controls = animate(...)
  return () => controls.stop() // Prevent memory leaks
}, [])
```

**Files to modify:**
- `src/app/globals.css` - Add component CSS transitions
- `src/components/ui/button.tsx` - Add hover classes
- `src/components/ui/card.tsx` - Wrap with motion, add CSS hover
- `src/components/ui/input.tsx` - Focus states only
- `src/components/nav-bar.tsx` - Active indicator

**Deliverables:**
- CSS-first interactions (fast, no JS bundle cost)
- Framer Motion only for entry animations
- Proper cleanup patterns

**Estimated effort:** 2 hours

---

#### Phase 3: Page Redesigns (Simplified - High Impact Only)

**Landing Page (`/`)** - PRIORITY
- Hero with staggered text reveal (staggerContainer variant)
- Feature cards with fade-up on scroll (IntersectionObserver + CSS)
- Background gradient using OKLCH tokens
- CTA button prominence with shadow

**Recipes Page (`/recipes`)** - PRIORITY
- Generated recipe cards with staggered reveal
- Loading skeleton during AI generation
- Recipe expansion with `AnimatePresence`

**Research Insight - Staggered Lists:**
```typescript
// Use staggerContainer for recipe grids
<m.div variants={staggerContainer} initial="hidden" animate="visible">
  {recipes.map((recipe, i) => (
    <m.div key={recipe.id} variants={fadeUpVariants}>
      <RecipeCard recipe={recipe} />
    </m.div>
  ))}
</m.div>
```

**Login/Signup Pages**
- Card entrance animation (single fadeUp)
- Form field CSS focus states (already done in Phase 2)

**Other Pages - CSS Only**
- Saved, Groceries, Profile: Apply new typography + colors
- Use CSS transitions from Phase 2 components
- Skip complex animations (YAGNI for MVP)

**Research Insight - Reduced Motion:**
```typescript
// ALWAYS check user preference
const prefersReducedMotion = useReducedMotion()
const variants = prefersReducedMotion ? {} : fadeUpVariants
```

**Files to modify:**
- `src/app/page.tsx` - Landing hero + features
- `src/app/recipes/page.tsx` - Staggered cards + skeleton
- `src/app/login/page.tsx` - Card entrance
- `src/app/signup/page.tsx` - Card entrance

**Deliverables:**
- High-impact pages feel premium
- Typography + colors apply everywhere
- Reduced motion respected

**Estimated effort:** 3-4 hours

---

#### Phase 4: Polish & Optimization (Essential Only)

**Skeleton Loaders**
```typescript
// Simple CSS skeleton - no JS animation library needed
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "animate-pulse rounded-md bg-muted",
      className
    )} />
  )
}
```

**Toast System with Race Condition Prevention**
```typescript
// CRITICAL: Use shadcn/ui toast with proper cleanup
import { useToast } from "@/components/ui/use-toast"

// Auto-dismiss with cleanup
const { toast, dismiss } = useToast()
useEffect(() => {
  return () => dismiss() // Clean up on unmount
}, [dismiss])
```

**Research Insight - Toast Race Conditions:**
- Always clean up toasts when component unmounts
- Use `dismiss()` in cleanup function
- Avoid multiple toasts stacking (use single instance)

**Dark Mode - Defer to Future**
- Current OKLCH colors already have good contrast
- Dark mode adds complexity without user request
- Mark as future enhancement

**Performance Verification**
- Run `npm run build` and check bundle analyzer
- Target: framer-motion adds <15kb gzipped
- Verify LCP with Lighthouse (target: <1.5s)

**Accessibility Checklist**
- [ ] All text meets 4.5:1 contrast (OKLCH helps)
- [ ] Focus states visible on all interactive elements
- [ ] `prefers-reduced-motion` respected everywhere
- [ ] Skip to main content link (if time permits)

**Files to modify:**
- Create `src/components/ui/skeleton.tsx`
- Verify `src/components/ui/toast.tsx` (shadcn may have it)
- Update recipe loading states

**Deliverables:**
- Skeleton loaders for async content
- Toast notifications with cleanup
- Accessibility verified

**Estimated effort:** 1-2 hours

## Alternative Approaches Considered

**Option A: Full Rebuild with Different Framework**
- Rejected: Unnecessary complexity, shadcn/ui works well
- Risk: Would delay shipping significantly

**Option B: Minimal Polish Only**
- Rejected: Doesn't achieve "distinctive" goal
- Risk: Would still feel generic

**Option C: Hire External Designer**
- Rejected: We have clear direction from frontend-design skill
- Risk: Additional coordination overhead

## System-Wide Impact

### Interaction Graph

Design changes trigger:
1. CSS variable updates → All components re-render
2. Font loading → Initial paint delay (mitigated with font-display: swap)
3. Animation library → Bundle size increase (~15kb with LazyMotion)
4. New components → Additional imports on affected pages

### Error & Failure Propagation

- Font load failure → Falls back to system fonts (acceptable)
- Animation failure → Components render without motion (graceful)
- CSS variable missing → Uses fallback values defined in theme

### State Lifecycle Risks

- Theme preference in localStorage → Handle SSR hydration mismatch
- Animation state → Clean up on unmount to prevent memory leaks
- Reduced motion preference → Check on mount, not just initial render

### API Surface Parity

No API changes required. This is purely frontend visual enhancement.

### Integration Test Scenarios

1. **Font loading**: Verify text renders correctly even if custom fonts fail
2. **Animation disabled**: Verify app works with `prefers-reduced-motion: reduce`
3. **Dark mode toggle**: Verify all pages render correctly in both modes
4. **Mobile responsive**: Verify all breakpoints work with new components
5. **Keyboard navigation**: Verify focus states are visible and logical

## Acceptance Criteria

### Functional Requirements

- [ ] Typography uses distinctive font pairing (Fraunces + Plus Jakarta Sans)
- [ ] All interactive elements have motion feedback
- [ ] Pages have entry animations (staggered reveals)
- [ ] Loading states use skeleton loaders
- [ ] Empty states have illustrations and helpful messaging
- [ ] Error states use toast notifications
- [ ] Dark mode is toggleable and polished

### Non-Functional Requirements

- [ ] Lighthouse performance score > 90
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Bundle size increase < 20kb
- [ ] First Contentful Paint < 1.5s

### Quality Gates

- [ ] Visual review of all pages at desktop and mobile widths
- [ ] Accessibility audit passes
- [ ] No console errors or warnings
- [ ] Framer Motion bundle uses LazyMotion optimization

## Success Metrics

1. **Visual Distinction**: App no longer looks like generic AI-generated UI
2. **User Delight**: Animations feel natural and responsive
3. **Consistency**: All pages share same design language
4. **Performance**: No perceptible slowdown from enhancements

## Dependencies & Prerequisites

- Framer Motion library installation
- Google Fonts (Fraunces, Plus Jakarta Sans) - free
- Current shadcn/ui components work as base
- No backend changes required

## Risk Analysis & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Font loading slow | Medium | Low | Use font-display: swap, subset fonts |
| Animation jank | Low | Medium | Use GPU-accelerated properties only |
| Bundle bloat | Medium | Medium | Use LazyMotion, tree-shake unused |
| Dark mode bugs | Medium | Low | Test all components in both modes |
| Accessibility issues | Low | High | Audit with axe, test with screen reader |

## Resource Requirements

- **Time**: 8-10 hours total (simplified from 17-25 hours)
  - Phase 1: 2 hours (foundation)
  - Phase 2: 2 hours (components)
  - Phase 3: 3-4 hours (pages)
  - Phase 4: 1-2 hours (polish)
- **Dependencies**: framer-motion (~15kb gzipped with LazyMotion)
- **Fonts**: Fraunces Variable (~50kb), Plus Jakarta Sans Variable (~40kb)
- **Net font change**: REPLACE Geist (~80kb) with new fonts (~90kb) = +10kb

## Future Considerations

- **Recipe images**: If AI-generated images added later, design system should accommodate
- **Internationalization**: Font choices work with Latin scripts; may need adjustment for others
- **Native apps**: Animation patterns should translate to React Native if needed
- **Theming**: Color system could support multiple themes beyond light/dark

## Documentation Plan

- Update component stories if Storybook exists
- Add design token documentation to CLAUDE.md
- Document animation patterns for future developers

## Sources & References

### Internal References

- Current styling: `src/app/globals.css`
- UI components: `src/components/ui/`
- Page layouts: `src/app/*/page.tsx`
- Illustrations: `src/components/page-illustration.tsx`

### External References

- [Anthropic Frontend Design Skill](~/.claude/plugins/frontend-design/skills/frontend-design/SKILL.md)
- [Framer Motion Documentation](https://motion.dev/)
- [Fraunces Font](https://fonts.google.com/specimen/Fraunces)
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

### Research Conducted

- Repo structure analysis (current design patterns)
- Best practices research (typography, color, animation trends 2026)
- SpecFlow analysis (user flows, gaps, edge cases)
- Vercel React best practices (performance optimization)

## MVP Checklist (Simplified)

For a meaningful first iteration, prioritize:

1. [ ] **Typography**: Replace Geist with Fraunces + Plus Jakarta Sans
2. [ ] **Design tokens**: Add OKLCH colors and CSS transitions to globals.css
3. [ ] **Motion setup**: Add framer-motion with LazyMotion provider
4. [ ] **Button/Card CSS**: Add hover/focus transitions (no JS)
5. [ ] **Landing page**: Hero stagger animation
6. [ ] **Recipes page**: Card stagger + skeleton loader
7. [ ] **Toast cleanup**: Verify proper dismiss on unmount

**What we're NOT doing (YAGNI):**
- Dark mode toggle (defer)
- Masonry grid (complexity for little gain)
- Success checkmark animations (not in current UX)
- Drag hints (not implemented yet)
- Multi-step AI progress (current UX is fine)

This delivers visible improvement in ~8 hours while avoiding over-engineering.
