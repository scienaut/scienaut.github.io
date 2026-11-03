import assert from 'node:assert/strict';
import { calculateBelt } from '../js/calculations/belt.js';
import { calculatePayload } from '../js/calculations/payload.js';
const near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);

const common={widthMm:400,loopLengthMm:10000,sourceClass:'user',sourceName:'',sourceUrl:'',construction:'Homogeneous'};
const manual=calculateBelt({...common,method:'manual',linearMass:3});
assert.equal(manual.complete,true);near(manual.totalMassKg,30);
const areal=calculateBelt({...common,method:'areal',arealMass:5});
assert.equal(areal.complete,true);near(areal.massPerMetre,2);near(areal.totalMassKg,20);
const homogeneous=calculateBelt({...common,method:'density',density:1200,thicknessMm:4});
assert.equal(homogeneous.complete,true);near(homogeneous.massPerMetre,1.92);
const reinforced=calculateBelt({...common,method:'density',construction:'Fabric reinforced',density:1200,thicknessMm:4});
assert.equal(reinforced.complete,false);assert.ok(reinforced.missing.includes('homogeneous construction for density estimate'));
const missing=calculateBelt({...common,method:'areal',arealMass:null,sourceClass:'manufacturer',sourceName:'',sourceUrl:''});
assert.equal(missing.complete,false);assert.ok(missing.missing.length>=2);

const base={centreDistanceMm:5000,loadedLengthMm:2000,beltWidthMm:400,boxCount:null,boxMass:null,boxLengthMm:null,boxWidthMm:null,boxSpacingMm:null,distribution:'uniform',speedMps:1};
const total=calculatePayload({...base,mode:'total',totalKg:40});assert.equal(total.complete,true);near(total.linearLoadingKgM,20);near(total.payloadKg,40);
const linear=calculatePayload({...base,mode:'linear',linearKgM:12});assert.equal(linear.complete,true);near(linear.payloadKg,24);
const throughput=calculatePayload({...base,mode:'throughput',throughputKgH:3600});assert.equal(throughput.complete,true);near(throughput.linearLoadingKgM,1);near(throughput.payloadKg,2);
const discrete=calculatePayload({...base,mode:'total',totalKg:40,distribution:'discrete',boxCount:3,boxMass:10,boxLengthMm:700,boxWidthMm:450,boxSpacingMm:200});assert.equal(discrete.complete,true);assert.ok(discrete.boxWarning);
const noLength=calculatePayload({...base,loadedLengthMm:null,mode:'total',totalKg:20});assert.equal(noLength.complete,false);
console.log('Belt and payload calculations: 24 assertions passed.');
