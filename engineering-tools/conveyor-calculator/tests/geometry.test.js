import assert from 'node:assert/strict';
import { calculateGeometry } from '../js/calculations/geometry.js';

const base={centreDistanceMm:5000,inclinationDeg:0,enteredHeightMm:0,toleranceMm:1,beltWidthMm:400,driveDiameterMm:150,tailDiameterMm:150,driveRpm:60};
const close=(actual,expected,tolerance=1e-8)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);

for(const deg of [0,30,45,75]){
  const r=calculateGeometry({...base,inclinationDeg:deg,enteredHeightMm:5000*Math.sin(deg*Math.PI/180)});
  close(r.riseMm,5000*Math.sin(deg*Math.PI/180));
  close(r.horizontalMm,5000*Math.cos(deg*Math.PI/180));
  assert.equal(r.geometryMatches,true);
}
const nominal=calculateGeometry(base);
close(nominal.beltSpeedMps,Math.PI*.15);
close(nominal.angularVelocityRadS,2*Math.PI);
close(nominal.approximateLoopLengthMm,10000+Math.PI*150);
assert.equal(calculateGeometry({...base,enteredHeightMm:20,toleranceMm:10}).geometryMatches,false);
console.log('Geometry calculations: 9 assertions passed.');
