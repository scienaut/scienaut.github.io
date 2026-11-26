# Bearing Finder & Engineering Analysis

Browser-based bearing calculator and dimensional comparison interface for Scienaut Engineering Tools. Hosted on GitHub Pages; the front end uses native HTML, CSS, JavaScript and SVG with no paid APIs or runtime libraries.

## Current capabilities
- Parametric 2D axial-section SVG for a deep-groove ball-bearing schematic, annotated with d, D, B, D2, d1, r1 and r2.
- Dimensional candidate filter for required bore, outside diameter and width.
- Manual entry of manufacturer-verified catalogue candidates and comparison of their dimensions and C/C0 values.
- Equivalent dynamic load using supplied catalogue X/Y factors.
- Spherical roller branch using supplied e/Y1/Y2 factors where the chosen manufacturer method specifies it.
- Axial-only thrust-bearing load branch.
- ISO 281 basic rating life and hours conversion.
- ISO 76 equivalent static load and static safety calculation using supplied X0/Y0 factors.
- Reliability factor a1 only, with explicit disclosure that this is not the full ISO 281 aISO modified-life method.
- Expandable equations, substitutions, validation cases, references and procurement review checklist.

## Important limitations
This is not a live multi-manufacturer search engine. GitHub Pages is a static host and cannot securely provide server-side scraping or bypass manufacturer CORS/access controls. The candidate list is populated by the user from verified catalogues; no catalogue model, C/C0 rating, speed limit, X/Y factor or bearing geometry is invented. Online product links and catalogue retrieval must be verified by the user.

The sectional illustration is schematic. d, D and B are principal dimensions; D2, d1 and r1/r2 are reference dimensions that must be taken from the exact manufacturer's drawing. Raceways, balls, cages and seals are not manufacturing-accurate CAD geometry.

The current calculation engine does not infer load factors, calculate full ISO 281 aISO, validate permissible speed, fits, clearance, minimum load, lubrication viscosity ratio, contamination factor, thermal behaviour, misalignment, preload or bearing arrangement reactions. Peak loading and variable duty cycles require a separately validated load spectrum and static/dynamic evaluation. A dimensional match is not proof of suitability.

## Numerical verification
Run:
```bash
node engineering-tools/bearing-calculator/tests/test.js
```
The test suite includes the published FeuTex ball-bearing life example and SKF spherical-roller worked cases. The first SKF worked example does not reproduce its published life from the stated inputs and equation; the tool and test suite deliberately disclose that discrepancy rather than calibrating the result.

## References
1. ISO 281:2007 – https://committee.iso.org/standard/38102.html?browse=ics
2. ISO 76 – https://www.iso.org/search.html?q=ISO%2076
3. NSK, Dynamic load ratings and fatigue life – https://www.nsk.com/tools-resources/abc-bearings/dynamic-load-ratings-and-fatigue-life/
4. SKF Rolling Bearings – https://www.skf.com/group/products/rolling-bearings
5. SKF Evolution worked example – https://evolution.skf.com/us/spherical-roller-bearings-in-fans-2/
6. FeuTex worked example – https://feutex.com/tools/bearing-basic-rating-life/

## Engineering review
Review bearing selection against the actual application, manufacturer catalogue revision, shaft/housing fits, load spectrum, speed, lubrication, temperature, installation, safety and organisational design process. Obtain engineering and procurement approvals before ordering or installation.
