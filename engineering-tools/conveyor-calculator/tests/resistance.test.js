import assert from 'node:assert/strict';
import { calculateResistance } from '../js/calculations/resistance.js';
const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const base={centreDistanceMm:5000,inclinationDeg:30,beltLinearMassKgM:2,payloadKg:100,speedMps:1,
  carrying:{type:'skid',coefficient:.1,strips:2,stripWidthMm:50,contactLengthMm:5000,sourceClass:'user',reference:''},
  returnSide:{type:'idler',method:'coefficient',coefficient:.02,sourceClass:'user',reference:''},accessoryN:10,accelerationTimeS:2,direction:'uphill'};
const r=calculateResistance(base);assert.equal(r.complete,true);
const g=9.80665, theta=Math.PI/6, carryNormal=(10+100)*g*Math.cos(theta), returnNormal=10*g*Math.cos(theta);
near(r.carrying.normalN,carryNormal);near(r.carrying.areaM2,.5);near(r.carrying.forceN,.1*carryNormal);near(r.carrying.pressurePa,carryNormal/.5);
near(r.returnSide.forceN,.02*returnNormal);near(r.gravityN,100*g*Math.sin(theta));near(r.movingMassKg,120);
near(r.accelerationMps2,.5);near(r.accelerationN,60);near(r.peakN,r.steadyN+60);
const drag=calculateResistance({...base,returnSide:{type:'idler',method:'drag',dragN:17,sourceClass:'user',reference:''}});
near(drag.returnSide.forceN,17);
const downhill=calculateResistance({...base,direction:'downhill'});near(downhill.gravityN,-100*g*Math.sin(theta));
const incomplete=calculateResistance({...base,carrying:{...base.carrying,coefficient:null}});assert.equal(incomplete.complete,false);assert.ok(incomplete.missing.includes('Carrying belt-to-skid dynamic friction coefficient'));
const missingRef=calculateResistance({...base,returnSide:{...base.returnSide,sourceClass:'manufacturer',reference:''}});assert.ok(missingRef.missing.includes('Return support manufacturer / measurement reference'));
const noAcceleration=calculateResistance({...base,accelerationTimeS:null});assert.equal(noAcceleration.complete,true);assert.equal(noAcceleration.peakN,null);assert.ok(noAcceleration.missing.includes('acceleration time for peak pulling force'));
console.log('Support and resistance calculations: 19 assertions passed.');
