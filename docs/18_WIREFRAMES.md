# 18 Wireframe Architectures

This document mathematically maps the visual grid and spatial relationships of the Only3D platform. _UI Inspiration: Linear (Admin), Vercel (Customer), Apple (Public)._

## 1. Grid Definitions

- **Desktop:** 12-column grid. Max container width: `1440px`. Gutters: `24px` (`gap-6`).
- **Tablet:** 8-column grid. Gutters: `16px` (`gap-4`).
- **Mobile:** 4-column grid. Gutters: `16px` (`gap-4`).

## 2. Public Website: Instant Quote Layout

_Target: Minimal distraction, focus on the 3D viewer and price._

```mermaid
block-beta
  columns 12
  Header:12
  SpaceDown:12

  block:Viewer:8
    canvas["3D WebGL Canvas"]
  end

  block:Configurator:4
    title["Quote Details"]
    mat["Material Dropdown"]
    col["Color Swatches"]
    inf["Infill Slider"]
    price["Giant Price Display"]
    cta["Checkout Button"]
  end

  Footer:12
```

_Rules:_ The Configurator must be `sticky top-4` so it remains visible if the 3D Viewer height exceeds the viewport.

## 3. Admin OS: Fulfillment Dashboard

_Target: Extreme data density. Zero wasted space. Keyboard-first._

```mermaid
block-beta
  columns 12

  block:Sidebar:2
    logo["Only3D OS"]
    nav1["Orders (Active)"]
    nav2["Printers"]
    nav3["Materials"]
    nav4["Pricing Rules"]
  end

  block:Main:10
    columns 1
    topbar["CMD+K Search | User Profile"]

    block:Kanban:1
      columns 4
      col1["PENDING (3)"]
      col2["PRINTING (12)"]
      col3["POST_QA (2)"]
      col4["SHIPPED (40)"]
    end
  end
```

_Rules:_ Sidebar is fixed. Topbar is fixed. Kanban columns scroll vertically independently (`overflow-y-auto`).

## 4. Admin OS: Order Action Drawer

_Target: Slides in from the right edge. Overlays the Kanban board._

```mermaid
block-beta
  columns 12

  block:Overlay:8
    bg["Dark backdrop (backdrop-blur-sm)"]
  end

  block:Drawer:4
    columns 1
    head["Order #1042 - Jane Doe"]
    stl["Mini 3D Viewer"]
    specs["PETG • Black • 20% Infill"]
    action1["Assign to Printer Dropdown"]
    action2["Mark as PRINTING (Button)"]
  end
```

## 5. Customer Portal: Asset Library

_Target: Clean, visual grid of intellectual property._

```mermaid
block-beta
  columns 12

  block:Sidebar:3
    nav["Dashboard | Orders | Assets | Settings"]
  end

  block:Main:9
    columns 3
    card1["Thumbnail + Name"]
    card2["Thumbnail + Name"]
    card3["Thumbnail + Name"]
    card4["Thumbnail + Name"]
    card5["Thumbnail + Name"]
  end
```

_Rules:_ Cards use CSS aspect ratio `aspect-square` for perfect grid alignment. Hovering a card reveals the "Re-quote" overlay.
