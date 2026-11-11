# Scienaut Shaft Design & Analysis Calculator

Live URL: https://scienaut.github.io/engineering-tools/shaft-design/

## Features
- Basic Design Calculation and Detailed Engineering Calculations modes.
- SI and FPS input/display selection; internal calculation basis is N, mm and MPa.
- Solid and hollow circular shafts; detailed mode supports stepped sections.
- Multiple point loads in two transverse planes, axial load and torque.
- Two radial simple supports, reaction and bending-moment calculations.
- Bending, torsional and axial stress screening; von Mises stress and static FOS.
- Numerical Euler–Bernoulli deflection; piecewise torsional twist.
- Optional simplified Modified Goodman fatigue index.
- CSV export and browser print-to-PDF (choose Save as PDF).

## Material data policy
The dropdown is a searchable grade-designation reference. Indicative elastic moduli are provided for selected families. Strength and endurance values are deliberately left blank because they depend on grade, heat treatment, product form, size and temperature. Verify values against applicable ISO/BIS/ASTM specifications, ASM/MatWeb references, manufacturer datasheets or mill test certificates. Materials Project computational values are not certified design allowables.

## Limitations
Preliminary engineering tool, not a standards-compliance certification. Uses linear elasticity, small deflection, Euler–Bernoulli beam theory, point loads and two radial simple supports. No bearing-life, critical-speed, dynamic, gear-force, notch-sensitivity or full fatigue-life calculation. User must verify properties, stress concentration factors and design decisions independently.
