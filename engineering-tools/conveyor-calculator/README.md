# Open Conveyor Engineering Calculator

**Interactive Mechanical Design, Belt Resistance, Drive Selection and Engineering Calculations.**

An open, browser-based project for transparent, preliminary conveyor calculations. The current milestone includes geometry, belt-mass and payload inputs, simplified support resistance, an SVG side elevation, a belt movement visualization, preliminary mechanical checks, and local project reports.

## Current status: Phases 1–6 foundation

Implemented now:

- Responsive dark engineering dashboard and navigation.
- User-entered centre distance, inclination, height, geometry tolerance, belt width, drum diameters and drive RPM.
- Geometry validation, including the specified 0°–75° inclination range.
- Calculated rise, horizontal projection, drive circumference, speed, angular velocity and approximate loop length.
- Height comparison that preserves the user-entered height.
- Calculation cards with equations, substituted values, units and keyboard/mouse explanations.
- Parametric SVG side elevation and material-box movement controls.
- Project display name editing, saved with local projects.
- Manual linear-mass, manufacturer areal-mass and homogeneous-density belt-mass methods.
- Belt source classification and manufacturer name / datasheet reference fields.
- Mutually exclusive payload modes for total payload, linear loading and throughput.
- Loaded-length, payload-weight, equivalent-throughput and box-geometry calculations.
- Missing belt and payload data states instead of invented engineering properties.
- Independent carrying-side and return-side idler or skid support arrangements.
- Separate idler running-resistance, measured drag, and belt-to-skid friction models.
- Gravity, support, accessory and acceleration forces, with skid contact area and pressure.
- Source classification and missing-reference checks for support inputs.
- Linear-load drive torque and power, efficiency chain, speed-based gear ratio, and rated output torque calculations.
- Capstan traction check with theoretical minimum slack tension when pretension is not entered.
- Explicit omission of rotational inertia torque and thermal motor selection.
- Static overhung shaft stress, deflection, twist and reaction estimates from entered properties.
- Bearing L10 life and static ratio from entered ratings, loads and manufacturer factors.
- RHS / SHS simply-supported beam stress, deflection and yield ratio from entered data.
- Save and reopen projects in browser local storage.
- Export a JSON project with inputs, displayed results and audit snapshots.
- Record local calculation audit snapshots and prepare a print-ready engineering report that the browser can save as PDF.
- Native Node tests for geometry, belt mass, payload, resistance, drive, traction and mechanical calculations.

Not implemented yet: verified material property databases, rotating inertia, full motor/gearbox selection and thermal duty checks, fatigue, bearing fits and lubrication, detailed frame stability and weld checks. The PDF is generated through the browser print dialog; no automated PDF library is bundled.

## Run locally

Do not open `index.html` directly from File Explorer. The browser blocks ES module imports from `file://`, so the form appears but calculations and the diagram stay blank. The page now displays a startup warning in that case.

On Windows, double-click `START-WINDOWS.bat`. It starts the local server in a separate console window and opens the calculator in your browser. Keep the server window open while using the app; close it when finished.

Or, with Node.js installed, open a terminal in this directory and run:

```sh
npm run dev
```

Then open <http://localhost:8000>. The application uses no backend and is suitable for GitHub Pages when published from this directory.

## Run calculation tests

Requires Node.js:

```sh
npm test
```

## Geometry methodology

- Rise: `H = L sin(θ)`
- Horizontal projection: `X = L cos(θ)`
- Drum circumference: `C = πD`
- Belt speed: `V = πDN/60`
- Angular velocity: `ω = 2πN/60`
- Approximate belt loop length: `Lb ≈ 2L + π(Ddrive + Dtail)/2`

SI units are used internally. The loop-length expression is an approximation and does not model take-up travel or detailed pulley routing. Belt speed assumes no slip at the drive drum. The SVG and animation are visualizations, not manufacturing drawings or validated dynamics simulations.

## Engineering data and limitations

Geometry calculations use explicit project inputs and standard geometric relationships. Belt mass requires a manual value, user-entered supplier areal mass, or an explicitly selected homogeneous-density estimate. Support and drive calculations require user-entered friction coefficients, drag values, efficiencies and wrap angle; no universal SS304, UHMWPE, idler or belt-to-drum coefficient is supplied. Manufacturer sources entered by the user are marked verification required and are not independently checked by the app. Resistance calculations use simplified models and are not an ISO/CEMA implementation. Drive torque omits rotating inertia. Shaft, bearing and structural calculations are limited to the stated simple load models and entered data. Results are preliminary, not certified or approved engineering designs.

The Engineering References panel links to ISO 5048, ISO 14890, ISO 281, ISO 76, the CEMA Belt Book listing, and SKF, Schaeffler and NSK bearing resources. Edition/status notes were checked on 2026-11-03. The app labels the scope of each source and does not claim conformance to standards it has not implemented.

## Roadmap

1. Foundation: dashboard, geometry, diagram and visualization.
2. Belt and payload: traceable mass inputs and loading modes.
3. Support and resistance: idlers, skid plates, friction and acceleration.
4. Drive: torque, power, motor, gearbox, belt tension and traction.
5. Mechanical design: preliminary shaft, bearing rating-life and simple section checks. Fatigue, fits, lubrication and detailed frame stability are still planned.
6. Project storage, audit trail, reports, tests and deployment guidance.

## Screenshots

The live dashboard and module views are generated from the current inputs. To capture an up-to-date screenshot, start the local server, open the dashboard, and use the browser's screenshot or snipping tool. Screenshots are not embedded here because results change with project inputs.

## Version history

- **0.1.0** — Phases 1–6 foundation: geometry, belt and payload inputs, simplified support and drive calculations, preliminary mechanical checks, local projects, audit snapshots and print-ready reports.

## GitHub Pages

Publish this directory as the Pages source (repository root or `/docs`, depending on repository layout). All assets use relative paths. The app has no build step or secrets. For a repository subpath, relative asset/module paths continue to work.

## License

See `LICENSE`. Choose a license before public distribution.
