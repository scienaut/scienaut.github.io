# Bearing Design & Selection Calculator

Browser-based calculator for rolling-bearing equivalent loads, ISO 281 basic rating life and ISO 76 static load safety. Hosted as a static page on GitHub Pages.

## Scope in v1.0
- Catalogue-factor equivalent dynamic load: P = X Fr + Y Fa.
- Spherical roller load branch: Fa/Fr ≤ e: P = Fr + Y1 Fa; otherwise P = 0.67 Fr + Y2 Fa.
- Axial-only thrust-bearing load model.
- Basic rating life: L10 = (C/P)^p million revolutions; L10h = L10 × 10^6/(60 n).
- Reliability-only life adjustment: a1 × L10h.
- Equivalent static load and static safety: P0 = X0 Fr + Y0 Fa; s0 = C0/P0.
- Required dynamic rating for a target basic life.
- Expandable equation, substitution, intermediate result and unit trail.
- Three externally published numerical validation examples.

## Important engineering boundaries
The tool does not guess catalogue factors. X, Y, X0, Y0, e, Y1 and Y2 must be taken from the applicable manufacturer catalogue for the exact bearing and load case. The current release does not calculate ISO 281 aISO or full modified life Lnm, lubricant viscosity ratio, contamination, fits, clearance, thermal effects, minimum load, speed limit, misalignment or bearing arrangement reactions. It does not provide automatic bearing recommendations. Static safety must be compared with the application and manufacturer's required value; no universal pass threshold is hard-coded.

The spherical roller branch is implemented for the SKF-published example and must only be used where the selected bearing's manufacturer calculation method specifies that branch. Axial-only mode requires Fr = 0. Combined radial/axial loads are not supported for all thrust or needle-bearing types.

## Run tests
Requires Node.js:
```bash
node engineering-tools/bearing-calculator/tests/test.js
```

## External numerical verification
1. SKF Evolution, *Spherical roller bearings in fans*: https://evolution.skf.com/us/spherical-roller-bearings-in-fans-2/
2. Schaeffler Technical Pocket Guide, rating-life equations: https://www.schaeffler.com/remotemedien/media/_shared_media/08_media_library/01_publications/schaeffler_2/catalogue_1/downloads_6/stt_de_en.pdf
3. FeuTex, *Bearing Basic Rating Life* worked example: https://feutex.com/tools/bearing-basic-rating-life/

### Verification note
The SKF example's second case reproduces its reported P = 19,719 N and L10h ≈ 22,100 h within rounding. For its first case, the stated C = 210,000 N, P = 17,793 N, p = 10/3 and n = 2,000 RPM recompute to approximately 31,192.66 h, whereas the article reports 33,400 h. The calculator and tests retain the result from the stated equation and explicitly disclose the discrepancy. No hidden calibration is applied.
