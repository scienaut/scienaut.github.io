# Scienaut Bolt & Fastener Design Calculator

Live page: https://scienaut.github.io/engineering-tools/bolt-fastener-design/

## V1.0 implemented scope
- Basic and Detailed modes (SI and FPS display units; internal N, mm, MPa).
- Editable tensile stress area, shear area and number of shear planes.
- Nominal ISO property-class screening selector and custom material inputs.
- Rectangular, linear, circular and custom-coordinate bolt groups.
- Direct in-plane shear plus elastic torsional shear from eccentricity and/or entered Mz.
- Axial bolt tension distribution for Pz, Mx and My using a linear rigid-plate bolt-spring equilibrium model.
- Individual bolt force table, live SVG plan/side diagrams, CSV export and browser print-to-PDF.
- Built-in eccentric shear and eccentric tension examples.

## Verified eccentric shear benchmark
Four bolts at (±50, ±40) mm; Fx = 4,000 N; Fy = 0; ex = 0; ey = 100 mm; direct Mz = 0.
- Mz = ex Fy - ey Fx = -400,000 N·mm.
- Jg = Σ(x²+y²) = 16,400 mm².
- Direct shear = 1,000 N/bolt in +X.
- Moment shear components: Vmx = -Mz y/Jg; Vmy = Mz x/Jg.
- Bolt resultants: approximately 1,219.76 N, 1,219.76 N, 2,321.69 N and 2,321.69 N.
- ΣVx = 4,000 N; ΣVy = 0; Σ(x Vy - y Vx) = -400,000 N·mm.
- With As = 113.1 mm² per bolt, single shear plane, maximum nominal shear stress = 20.53 MPa.
- Simplified von Mises screening stress = 35.56 MPa; using nominal class 8.8 screening proof value 580 MPa gives FOS ≈ 16.31.

This is a mathematical verification of the implemented elastic bolt-group model, not a code-compliant joint capacity result.

## Engineering limitations
- Nominal property-class strengths are not diameter-specific proof-stress tables. Confirm exact values against the current applicable product standard.
- The bolt-group method assumes equal bolt stiffness, linear elasticity and a rigid connection plate.
- Axial tension distribution uses a linear bolt-spring model. Contact redistribution after a bolt unloads is not solved; negative calculated bolt forces trigger a warning and are clipped to zero for the displayed screening result.
- No prying-action / T-stub calculation, flexible plate/contact analysis, preload, torque, joint separation, slip, thread stripping, plate bearing/tear-out, fatigue, or instantaneous-centre structural connection method is implemented.
- PDF export uses the browser print dialog; select Save as PDF.
- Custom properties are user supplied and must be traceable to a datasheet, test certificate or other approved source.
- The calculator does not claim compliance with ISO, VDI, NASA, ASME, ASTM or BIS standards.
