# Scienaut Robotics Kinematics & Dynamics V1.0

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
