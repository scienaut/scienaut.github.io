import { degToRad, mmToM } from '../units.js';

export function calculateGeometry(input) {
  const Lm = mmToM(input.centreDistanceMm);
  const theta = degToRad(input.inclinationDeg);
  const riseMm = input.centreDistanceMm * Math.sin(theta);
  const horizontalMm = input.centreDistanceMm * Math.cos(theta);
  const driveCircumferenceMm = Math.PI * input.driveDiameterMm;
  const beltSpeedMps = Math.PI * mmToM(input.driveDiameterMm) * input.driveRpm / 60;
  const angularVelocityRadS = 2 * Math.PI * input.driveRpm / 60;
  const approximateLoopLengthMm = 2 * input.centreDistanceMm + Math.PI * (input.driveDiameterMm + input.tailDiameterMm) / 2;
  const heightDifferenceMm = input.enteredHeightMm - riseMm;
  return {
    riseMm, horizontalMm, driveCircumferenceMm, beltSpeedMps,
    beltSpeedMMin: beltSpeedMps * 60, angularVelocityRadS,
    approximateLoopLengthMm, heightDifferenceMm,
    geometryMatches: Math.abs(heightDifferenceMm) <= input.toleranceMm,
    centreDistanceM: Lm
  };
}
