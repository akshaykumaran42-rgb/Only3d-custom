# 09 Design System Specification

This document codifies the visual and interaction logic for the `packages/ui` library. Only3D uses a strictly typed design system driven by Tailwind CSS, Radix UI (via shadcn/ui), and Framer Motion.

## 1. Design Philosophy

The UI must feel like a precision manufacturing instrument. It rejects the overly playful, bubbly aesthetics of standard B2C e-commerce.

- **Keywords:** Precise, Monolithic, High-Contrast, Developer-centric.

## 2. Token Definitions (Tailwind Config)

### 2.1 Color Palette

- **Background (Light):** `#FAFAFA` (Zinc-50)
- **Background (Dark):** `#09090B` (Zinc-950)
- **Foreground (Light):** `#09090B`
- **Foreground (Dark):** `#FAFAFA`
- **Primary Brand:** `#F97316` (Orange-500) - Used _only_ for primary CTA (e.g., "Checkout", "Approve Order").
- **Borders:** `rgba(255, 255, 255, 0.1)` (Dark mode) | `rgba(0, 0, 0, 0.1)` (Light mode). All borders are exactly 1px solid.

### 2.2 Typography

- **Font Family:** `Inter` (sans) and `JetBrains Mono` (mono for spec data like Bounding Box X,Y,Z).
- **Scale:** Base 16px.
- **Weights:** 400 (Body), 500 (Medium/Labels), 600 (Semibold/Subheadings).

### 2.3 Spacing & Layout

- Strict 8pt grid system. (`p-2`, `p-4`, `p-8`).
- **Border Radius:** `0.5rem` (`rounded-lg`) maximum. Avoid overly circular buttons. Keep corners relatively sharp to maintain an industrial feel.

## 3. Component Architecture

### 3.1 Buttons

- **Primary:** Solid Primary Brand color, white text.
- **Secondary:** Outline, subtle background on hover.
- **Interaction:** `active:scale-[0.98]` to provide a tactile click feel. Focus states must use `ring-2 ring-offset-2`.

### 3.2 Cards (Glassmorphism Rules)

- Cards in Dark Mode utilize a slight backdrop blur and a very low opacity background to allow underlying colors to bleed through subtly.
- `bg-zinc-900/50 backdrop-blur-md border border-white/10`.

### 3.3 Forms & Inputs

- Clean, boxy inputs.
- **Validation:** Real-time validation (via `react-hook-form` + `Zod`).
- **Error State:** Border turns Red-500, helper text appears instantly below. No layout shifting.

## 4. Animation & Motion (Framer Motion)

- **Rule:** Animations must be fast and spring-based. Never use linear easing.
- **Default Spring:** `transition: { type: 'spring', stiffness: 300, damping: 30 }`
- **Page Transitions:** Initial opacity 0, y-offset 10px. Animate to opacity 1, y-offset 0.

## 5. Accessibility (A11y)

- All components must support `aria-labels` and full keyboard tab-navigation.
- Color contrast must meet WCAG 2.1 AA standards (checked via CI pipeline).
