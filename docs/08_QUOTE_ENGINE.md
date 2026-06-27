# 08 Quote Engine Algorithm & Mathematics

This is the most critical piece of business logic in Only3D. It must be executed on the backend (NestJS) for security, but identical math must run on the frontend (Next.js) via `packages/utils` for instant UI feedback.

## 1. File Upload & Geometry Extraction

When an STL/3MF is uploaded to R2, a background worker or serverless function parses the binary/ASCII data.
**Outputs extracted:**

- $V_{model}$: Volume in $cm^3$
- $SA_{model}$: Surface Area in $cm^2$
- $B_x, B_y, B_z$: Bounding Box dimensions in mm.

### 1.1 Printability Validation (Constraints)

Before calculating price, the system checks if the part physically fits in the factory.

- Query `Printers` where `Status != MAINTENANCE` and `isActive == true`.
- Condition: $(B_x \le Printer.X)$ AND $(B_y \le Printer.Y)$ AND $(B_z \le Printer.Z)$
- _If no printer satisfies this, the API returns `422 Unprocessable Entity` with a "Model too large" message._

## 2. Core Mathematical Algorithm

### Variables from Database (`04_DATABASE.md`)

- $D_{mat}$: Material Density ($g/cm^3$)
- $C_{kg}$: Material Cost per Kg (₹)
- $H_{cost}$: Printer Hourly Cost (₹)
- $E_{rate}$: Electricity Cost per kWh (₹)
- $P_{margin}$: Profit Margin Multiplier (e.g., 1.5 for 50% markup)
- $F_{buffer}$: Failure Buffer Multiplier (e.g., 1.1 for 10% waste buffer)
- $BaseFee$: Flat Handling Fee (₹)

### User Inputs

- $I_{\%}$: Infill Percentage (0.0 to 1.0)
- $L_h$: Layer Height (mm)
- $Q$: Quantity

---

### Step 1: Material Cost Calculation

Actual printed volume is less than solid volume due to infill.

- _Effective Volume:_ $V_{eff} = V_{model} \times (I_{\%} + (1 - I_{\%}) \times ShellModifier)$ _(ShellModifier is a constant, approx 0.2)_
- _Weight (grams):_ $W_g = V_{eff} \times D_{mat}$
- _Weight (kg):_ $W_{kg} = \frac{W_g}{1000}$
- **Total Material Cost ($C_{mat}$):** $W_{kg} \times C_{kg}$

### Step 2: Machine Time & Cost Calculation

Print time is heavily dependent on volume and layer height.

- _Time Estimate (Hours):_ $T_{est} = \frac{V_{eff}}{PrintSpeedConstant \times L_h}$
- _Machine Wear Cost:_ $C_{mach} = T_{est} \times H_{cost}$
- _Electricity Cost:_ $C_{elec} = T_{est} \times PrinterWattage \times E_{rate}$
- **Total Operations Cost ($C_{ops}$):** $C_{mach} + C_{elec}$

### Step 3: Margin Application

- _Base Cost:_ $C_{base} = C_{mat} + C_{ops}$
- _Risk Adjusted Cost:_ $C_{risk} = C_{base} \times F_{buffer}$
- _Subtotal:_ $C_{sub} = C_{risk} + BaseFee$
- **Unit Final Price:** $P_{unit} = C_{sub} \times P_{margin}$

### Step 4: Final Total

- **Grand Total:** $P_{final} = P_{unit} \times Q$

## 3. Caching & Performance

Because the math requires pulling multiple variables from the DB, the NestJS service must cache the `PricingRules` and `Material` variables in memory (Redis or Node cache) with a short TTL (e.g., 5 minutes). This ensures the `/api/customer/quotes/calculate` endpoint resolves in `< 50ms`.
