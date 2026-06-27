# 01 Project Overview

## 1. Executive Summary

Only3D is an enterprise-grade, bespoke 3D printing manufacturing platform based in India. It is engineered from the ground up to serve as the singular operating system powering the entire manufacturing lifecycle—from initial customer quote to final physical shipment.

Crucially, **this is not an e-commerce platform.** Traditional e-commerce models (e.g., Shopify) assume static inventory and simple variation matrices. In contrast, Only3D sells custom manufacturing capabilities. The software must dynamically analyze 3D geometry (STL/3MF), evaluate material constraints, compute machine time, and orchestrate a physical production floor.

## 2. Business Vision & Mission

**Vision:** To build the most technologically advanced and frictionless manufacturing pipeline in the hardware sector, allowing anyone to produce physical parts with the exact same reliability and ease as deploying software to the cloud.

**Mission:** To abstract the immense complexity of 3D printing (slicing, material science, machine constraints) behind a highly performant, mathematically precise, and visually stunning software interface.

## 3. Long-Term Objectives (3-5 Years)

- **Fully Automated Production Floor:** The platform will act as the master orchestrator, not just tracking orders but eventually dispatching G-code directly to a fleet of network-connected 3D printers via OEM APIs (e.g., Bambu Lab Cloud, OctoPrint).
- **Multi-Tenant Architecture:** Evolving the platform to support isolated instances for enterprise B2B clients, allowing them to white-label the quoting engine for their internal hardware teams.
- **AI-Assisted Geometry Analysis:** Implementing machine learning to automatically flag non-manifold geometry, unsupported overhangs, and printability issues before the customer pays.

## 4. Short-Term Objectives (MVP)

- Deploy a mathematically sound Quote Engine that accurately calculates material weight and machine time based on user-provided 3D models.
- Establish a fully decoupled, headless architecture (Next.js + NestJS) to guarantee instant UI responses.
- Provide administrators with a highly dense, keyboard-navigable dashboard to adjust pricing rules, manage the printer fleet, and fulfill orders without touching application code.

## 5. Platform Architecture Overview

The platform is logically separated into three core domains, each serving a distinct user base with specific UX requirements:

### 5.1 Public Website (Marketing & Acquisition)

- **Purpose:** Top-of-funnel conversion, SEO, and brand positioning.
- **UX Paradigm:** Hardware-focused aesthetics (deep contrast, macro-typography, fluid animations). See `09_DESIGN_SYSTEM.md`.
- **Key Capabilities:** Dynamic catalog of capabilities, material datasheets, and the Instant Quote entry point.

### 5.2 Customer Portal (Client Operations)

- **Purpose:** A secure, private workspace for clients to manage their manufacturing pipeline.
- **UX Paradigm:** Developer-tier dashboard (minimalist, data-dense, highly trustworthy).
- **Key Capabilities:** Tracking live order status, viewing PDF invoices, and managing a library of uploaded CAD assets.

### 5.3 Admin Dashboard (The Operating System)

- **Purpose:** The nerve center for Only3D staff to run the physical business.
- **UX Paradigm:** High-density, keyboard-centric interface utilizing Command Palettes and advanced data grids.
- **Key Capabilities:** Manipulating the core Pricing Math (`08_QUOTE_ENGINE.md`), updating the physical Printer Fleet, moving orders through the state machine, and dynamically generating the public website via CMS controls.

## 6. The Customer Journey

1.  **Discovery:** The user lands on the Next.js marketing site, experiencing sub-second load times. They navigate to the Material Library to understand the physical constraints of ABS vs. PETG.
2.  **Upload & Analysis:** The user drags an STL/3MF file into the browser. The file is securely uploaded to Cloudflare R2, while the geometry is parsed to extract Volume ($cm^3$) and Bounding Box ($X, Y, Z$).
3.  **Configuration:** The user interacts with the real-time Quote Engine, selecting Material, Color, Infill, and Layer Height.
4.  **Instant Quote:** The backend applies the mathematical rules defined in `08_QUOTE_ENGINE.md`, returning a precise price instantly.
5.  **Checkout & Order Creation:** The user authenticates (or proceeds as a guest), inputs shipping data, and completes payment via Razorpay. The order enters the `PENDING` state.
6.  **Fulfillment Tracking:** The user logs into the Customer Portal to watch the order progress from `PRINTING` to `POST_PROCESSING` to `SHIPPED`.
7.  **Re-ordering:** The user accesses their Saved Models asset library to instantly re-order a part without re-uploading or re-configuring.

## 7. The Manufacturing Workflow (Admin)

1.  **Intake:** A new order appears in the Admin Dashboard queue. The system automatically flags any parameters that exceed standard printer volumes.
2.  **Assignment:** The Admin reviews the 3D model in a web-based CAD viewer, accepts the job, and assigns it to a specific physical printer ID defined in the database.
3.  **State Transitions:** The Admin updates the order status to `PRINTING`. This triggers a webhook/email to the customer (see `15_OPERATIONS_MONITORING.md`).
4.  **Quality Control:** Once printed, the order moves to `POST_PROCESSING` for support removal and inspection.
5.  **Dispatch:** The part is boxed. The Admin inputs the physical courier tracking number, transitions the order to `SHIPPED`, and the lifecycle concludes.

---

_Refer to `02_PRD.md` for exact feature specifications and `03_ARCHITECTURE.md` for technical implementation details._
