import assert from 'node:assert/strict';
import { calculateDrive } from '../js/calculations/drive.js';
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const resistance={complete:true,steadyN:300,peakN:360};
const base={resistance,driveDiameterMm:200,drumRpm:50,speedMps:.5,motorRpm:1500,motorPowerKw:2,motorEfficiency:.9,gearboxEfficiency:.95,couplingEfficiency:.99,
  gearRatioMode:'automatic',manualRatio:null,drumFriction:.3,wrapAngleDeg:180,slackTensionN:1000,allowableWorkingTensionN:2000,
  beltTensileRatingNPerMm:100,beltWidthMm:400,driveDataSource:'user',driveDataReference:'',tractionSource:'user',tractionReference:''};
const r=calculateDrive(base);assert.equal(r.complete,true);near(r.steadyTorqueNm,30);near(r.peakTorqueNm,36);near(r.steadyMechanicalKw,.15);near(r.ratio,30);
near(r.motorRatedTorqueNm,2*9550/1500);near(r.ratedOutputTorqueNm,(2*9550/1500)*30*.95);near(r.motorInputKw,.15/(.9*.95*.99));
near(r.traction.effectiveForceN,360);near(r.traction.slackN,1000);near(r.traction.tightN,1360);near(r.traction.capacityN,(Math.exp(.3*Math.PI)-1)*1000);near(r.traction.workingUtilization,.68);
near(r.traction.breakingUtilization,1360/40000);
const theoretical=calculateDrive({...base,slackTensionN:null});near(theoretical.traction.slackN,360/(Math.exp(.3*Math.PI)-1));assert.equal(theoretical.traction.slackKnown,false);
const missingEta=calculateDrive({...base,motorEfficiency:null});assert.ok(missingEta.missing.includes('motor efficiency (0, 1]'));
const missingSource=calculateDrive({...base,driveDataSource:'manufacturer',driveDataReference:''});assert.ok(missingSource.missing.includes('motor / gearbox manufacturer datasheet reference'));
const missingTension=calculateDrive({...base,allowableWorkingTensionN:null});assert.equal(missingTension.traction.workingUtilization,null);
const downhill=calculateDrive({...base,resistance:{complete:true,steadyN:-100,peakN:-100}});assert.equal(downhill.traction,null);assert.ok(downhill.tractionMissing.some(x=>x.includes('positive pulling force')));
const noWrap=calculateDrive({...base,wrapAngleDeg:0});assert.equal(noWrap.traction,null);
console.log('Drive and traction calculations: 21 assertions passed.');
