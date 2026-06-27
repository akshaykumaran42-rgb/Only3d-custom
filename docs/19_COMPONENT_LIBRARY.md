# 19 Component Library Architecture (React)

This document dictates the structure of `packages/ui`. We leverage `shadcn/ui` (Radix Primitives + Tailwind) but extend them heavily to meet the premium aesthetic defined in `09_DESIGN_SYSTEM.md`.

## 1. Core Principles

- **Separation of Concerns:** Components in `packages/ui` must be pure. They cannot import from `packages/database` or make network requests. They accept props and emit events.
- **Polymorphism:** Use the `asChild` pattern (from Radix) to allow components to render as different HTML tags (e.g., rendering a Button as an `<a>` tag for Next.js `<Link>`).
- **Variant Management:** All components use `cva` (Class Variance Authority) to strictly define allowed visual variants.

## 2. The Master Component List

### 2.1 Buttons (`<Button>`)

- **Variants:** `default` (Solid Orange), `secondary` (Solid Zinc-800), `outline` (Transparent with 1px border), `ghost` (Hover background only), `destructive` (Red-500).
- **Sizes:** `sm`, `default`, `lg`, `icon`.
- **Interactions:** Must include a loading state (disables button, swaps icon for spinner).

### 2.2 Data Display (`<Card>`)

- Composed of `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardContent>`, `<CardFooter>`.
- **Style Rule:** In dark mode, cards must use `bg-zinc-950 border-zinc-800`.

### 2.3 Form Inputs (Controlled by `react-hook-form`)

- `<Input>`: Standard text input. Focus ring must be strictly `ring-2 ring-orange-500 ring-offset-2 ring-offset-background`.
- `<Select>`: Custom Radix select dropdown. Cannot use native `<select>` due to styling limitations.
- `<Slider>`: Used in Quote Engine for Infill (0% to 100%).

### 2.4 Specific Manufacturing Components

These are custom compositions built for Only3D.

#### `<ColorSwatch>`

- **Props:** `hexCode: string`, `isSelected: boolean`, `isOutOfStock: boolean`.
- **Visual:** A circular `div`. If `isSelected`, it gains a prominent outer ring. If `isOutOfStock`, a diagonal strike-through is rendered via CSS and opacity is reduced to `0.5`.

#### `<MetricBadge>`

- Used heavily in Admin UI to display values.
- **Props:** `label: string` (e.g., "Volume"), `value: string | number` (e.g., "45.2"), `unit: string` (e.g., "cm³").

#### `<StatusBadge>`

- **Props:** `status: OrderStatus`.
- **Mapping:**
  - PENDING = Gray bg, Gray text.
  - PRINTING = Blue bg, Blue text.
  - SHIPPED = Green bg, Green text.

#### `<3DViewer>`

- **Implementation:** Wraps `three.js` or `@react-three/fiber`.
- **Props:** `fileUrl: string` (R2 Signed URL).
- **Features:** Auto-centers the geometry, applies a default MatCap material (shiny gray) to highlight surface imperfections.

## 3. Layout Components

- `<Sidebar>`: Handles responsive collapsing on mobile.
- `<CommandPalette>`: Wraps `cmdk`. Globally mounted in the layout root, listening for `CMD+K`.

## 4. Animation Wrappers (Framer Motion)

- `<FadeIn>`: Wraps children and animates opacity `0 -> 1` and y `10 -> 0`.
- `<AnimatedList>`: Used for the Kanban board. When a card moves columns, it animates smoothly to its new position using `layoutId`.
