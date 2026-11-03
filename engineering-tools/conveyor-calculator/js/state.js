export const defaultState = Object.freeze({
  projectName: 'Untitled conveyor', centreDistanceMm: 5000, inclinationDeg: 15,
  enteredHeightMm: 1294.1, toleranceMm: 10, beltWidthMm: 400,
  driveDiameterMm: 150, tailDiameterMm: 150, driveRpm: 60,
  running: false, direction: 1, visualSpeedMps: null
});

export function readInputs() {
  const number = id => document.getElementById(id).valueAsNumber;
  return {
    centreDistanceMm: number('centre-distance'), inclinationDeg: number('inclination'),
    enteredHeightMm: number('entered-height'), toleranceMm: number('tolerance'),
    beltWidthMm: number('belt-width'), driveDiameterMm: number('drive-diameter'),
    tailDiameterMm: number('tail-diameter'), driveRpm: number('drum-rpm')
  };
}
