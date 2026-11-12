# Scienaut Robotics Kinematics & Dynamics V1.2 (motor/gearbox assessment)

Standalone portfolio tool: https://scienaut.github.io/robotics-kinematics/

## V1.0 scope
- 2R and 3R planar revolute serial arms.
- Forward kinematics and inverse kinematics (including elbow branch selection).
- Interactive XY robot drawing; in IK mode, drag the canvas to set the target.
- Quintic joint-space move profile and time-history plots for X/Y position, end-effector speed, joint torque, joint mechanical power and joint angular speed.
- Per-link total assembly mass, COM location and rotational inertia.
- Per-joint Coulomb friction coefficient, normal load, effective friction radius and viscous coefficient.
- Two-jaw gripper lumped mass, payload mass and payload CG offset.
- CSV time-history export and browser print / Save as PDF.
- Preliminary motor and gearbox assessment per joint: gear ratio, gearbox efficiency, motor continuous/peak torque, motor speed, motor rated mechanical power, gearbox continuous output torque and peak output torque checks.

## Dynamic model
The links are rigid planar bodies. The Lagrange equation is evaluated numerically:
  tau = M(q) qdd + C(q,qd) + G(q) + tau_friction
The mass matrix is assembled from link and tool centre-of-mass Jacobians and link centroidal inertias. Gravity is included. Coulomb friction is mu*N*r*sign(qdot); viscous friction is B*qdot. A zero link inertia input invokes a uniform slender-rod estimate I_COM=mL^2/12. Link total mass must include all items moving with that link (structure, fasteners, motor, gearbox, cables, sensors); avoid double counting.

## Important limitations
- Planar 2R/3R revolute arms only; no SCARA, Cartesian or general 6-DOF solver in this release.
- The gripper and payload are lumped at the tool. Jaw opening is a visual/input descriptor only; grasp/contact forces and jaw actuation are not solved.
- Quintic joint-space interpolation is used. No collision avoidance, joint-limit enforcement, actuator sizing, gearbox efficiency, motor electrical model, backlash, flexibility or trajectory time-optimality.
- Torque/power are ideal joint-side mechanical estimates. Verify mass properties, gravity direction, friction, gear ratios and operating constraints from the actual design before selecting motors or gearboxes.
- PDF export uses the browser print dialog; choose "Save as PDF".
- SI is the internal calculation basis. FPS display conversion is limited to the geometry/mass/friction inputs and readouts; CSV remains SI.


## V1.2 motor and gearbox assessment
For each joint, the calculator derives absolute peak and move-RMS joint torque from the sampled dynamic trajectory. It then estimates motor-side requirements using the entered reduction ratio \(i\) and gearbox efficiency \(\eta\):

- Motor torque estimate: \(T_m = T_j/(i\eta)\) for the assumed motoring direction.
- Motor speed: \(n_m = |\omega_j| i 60/(2\pi)\).
- Motor mechanical power RMS: move-RMS of joint mechanical power divided by gearbox efficiency.
- Gearbox output torque checks compare move-RMS and peak joint torque with the entered continuous and peak output ratings.
- A zero/blank manufacturer rating is reported as **NOT ASSESSED**, never as PASS.

### Interpretation limits
This is a preliminary drive-train screen, not a final component selection. The RMS calculation covers the entered move only; it does not establish thermal duty-cycle capability over a production cycle. It does not model gearbox input/output inertia, motor rotor inertia, acceleration reflected through gear ratio, motor/drive current limits, peak torque duration, thermal time constants, braking/regeneration efficiency, service factor, duty cycle, voltage/speed torque curves, gearhead life or manufacturer derating. Confirm all ratings and permitted loads against the selected manufacturer's datasheets. The efficiency-based motor torque estimate assumes motoring; regenerative/braking operation requires direction-dependent efficiency treatment.

## Independent calculation spot checks (V1.2 equations)
These simple unit checks are used to verify the conversion equations independently of the robot solver:

| Check | Inputs | Expected result |
|---|---|---|
| Motor torque conversion | Joint torque 10 N·m, ratio 50:1, efficiency 0.90 | 0.2222 N·m motor torque |
| Motor speed conversion | Joint speed 2 rad/s, ratio 50:1 | 954.93 rpm motor speed |
| Gearbox output | Joint torque 10 N·m | 10 N·m gearbox output torque requirement |
| RMS torque | Sample torques 3 and 4 N·m | 3.5355 N·m move-RMS torque |
| Mechanical power | 10 N·m × 2 rad/s | 20 W at joint, 22.22 W estimated motor mechanical input at 90% efficiency |

These are formula-level checks, not an independent validation of the full rigid-body dynamics engine. Continue to compare full trajectories against hand calculations and manufacturer data before hardware selection.


## V1.3 Advanced Analysis tab
The Advanced Analysis tab is an additional view in the same page. It reads the active robot geometry and the current commanded joint-space move from the main calculator; it does not create a separate kinematics or dynamics model.

### Included checks
- Sampled end-effector path envelope (minimum and maximum radial distance along the commanded path). This is not the full reachable workspace.
- User-defined minimum and maximum joint angles, checked at each Advanced Analysis trajectory sample.
- Minimum singular value of the planar translational XY Jacobian for both 2R and 3R arms. The numerical near-singular flag threshold is 1e-5 m/rad and is a screening indicator, not a universal design limit.
- Optional 2D capsule-envelope interference screening for non-adjacent links. Link lengths are taken from the main model; users enter each link's in-plane width. The minimum centreline segment distance is reduced by the two capsule radii to obtain signed surface clearance. Positive means separated, zero means touching, negative means envelope overlap.

### Optional geometry and graceful fallback
Link envelope widths are optional. If any width is blank, physical interference is marked **NOT ASSESSED**; the other Advanced Analysis checks still run. A 2R arm has no non-adjacent link pair, so this self-interference check is also reported as not applicable for 2R. Out-of-plane thickness can be entered for reference, but is not used by the planar collision model. No 3D collision, joint housing, bracket, cable, obstacle or adjacent-joint interface checks are claimed.

### Sampling and validation boundaries
The Advanced Analysis tab can resample the same quintic joint-space trajectory at 181, 361 or 721 time points. This is a numerical trajectory screen; finite sampling can miss a very short collision between samples. Increase resolution for critical motion and verify final clearances with a CAD assembly/interference tool. It does not alter the main dynamics result or its existing 181-point torque/power calculations.

### Formula checks for the advanced geometry routines
- Segment-to-segment distance: crossing segments return 0; parallel segments separated by 5 mm return 5 mm; collinear overlapping segments return 0.
- Capsule clearance: centreline distance 20 mm with radii 5 mm and 4 mm gives 11 mm surface clearance.
- 2R translational Jacobian: for 1 m + 1 m links, q2 = 0° is singular (minimum singular value 0); q2 = 90° is non-singular.
- Joint-limit checks use the sampled joint angles in degrees and compare inclusively against the entered minimum and maximum.
