import assert from 'node:assert/strict';
import {calculateShaft} from '../js/calculations/shaft.js';
import {calculateBearing} from '../js/calculations/bearings.js';
import {calculateRhsBeam} from '../js/calculations/structural.js';
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const shaftInput={radialLoadN:1000,torqueNm:200,bearingSpanMm:500,overhangMm:100,outerDiameterMm:50,innerDiameterMm:20,
  elasticModulusGPa:200,shearModulusGPa:80,yieldStrengthMPa:250,Kt:1.5,Kfs:1.3,sourceClass:'user',reference:''};
const shaft=calculateShaft(shaftInput);assert.equal(shaft.complete,true);
const ro=.025,ri=.01,I=Math.PI/4*(ro**4-ri**4),J=Math.PI/2*(ro**4-ri**4),M=100;
near(shaft.leftReactionN,-200);near(shaft.rightReactionN,1200);near(shaft.bendingMomentNm,M);
near(shaft.bendingStressMPa,1.5*M*ro/I/1e6);near(shaft.shearStressMPa,1.3*200*ro/J/1e6);
near(shaft.yieldMargin,250/shaft.vonMisesMPa);assert.equal(calculateShaft({...shaftInput,innerDiameterMm:50}).complete,false);
assert.equal(calculateShaft({...shaftInput,sourceClass:'manufacturer',reference:''}).complete,false);

const bearing=calculateBearing({type:'ball',CN:10000,C0N:6000,FrN:1000,FaN:200,speedRpm:1000,X:1,Y:1.5,X0:.6,Y0:.5,reference:'User test record'});
assert.equal(bearing.complete,true);near(bearing.equivalentDynamicN,1300);near(bearing.equivalentStaticN,700);near(bearing.p,3);
near(bearing.lifeMillionRevs,(10000/1300)**3);near(bearing.lifeHours,1e6/(60*1000)*(10000/1300)**3);
const roller=calculateBearing({type:'roller',CN:10000,C0N:6000,FrN:1000,FaN:200,speedRpm:1000,X:1,Y:1.5,X0:.6,Y0:.5,reference:'User test record'});near(roller.p,10/3);
assert.equal(calculateBearing({type:'ball',CN:null,C0N:null,FrN:1000,FaN:0,speedRpm:1000,X:1,Y:0,X0:1,Y0:0,reference:''}).complete,false);

const beam=calculateRhsBeam({lineLoadNm:1000,spanMm:2000,widthMm:100,heightMm:100,wallMm:5,elasticModulusGPa:200,yieldStrengthMPa:250,reference:'User test section'});
assert.equal(beam.complete,true);near(beam.maximumMomentNm,500);assert.ok(beam.bendingStressMPa>0);assert.ok(beam.deflectionMm>0);
assert.equal(calculateRhsBeam({lineLoadNm:1000,spanMm:2000,widthMm:100,heightMm:100,wallMm:50,elasticModulusGPa:200,yieldStrengthMPa:250,reference:'test'}).complete,false);
console.log('Shaft, bearing and structural calculations: 22 assertions passed.');
