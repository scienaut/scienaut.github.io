"use strict";
const assert=require("node:assert/strict");
const {calculate}=require("../js/bearing-engine.js");
function close(actual,expected,tol,label){assert.ok(Math.abs(actual-expected)<=tol, label+": expected "+expected+", got "+actual);}
const skfLow=calculate({method:"spherical",Fr:11121,Fa:2224,e:.22,Y1:3,Y2:4.6,C:210000,C0:120000,n:2000,p:10/3,a1:1,targetLife:0,X0:.6,Y0:.5});
close(skfLow.P,17793,.001,"SKF case 1 equivalent load");
close(skfLow.L10h,31192.6645,.01,"SKF case 1 recomputed ISO life");
const skfHigh=calculate({method:"spherical",Fr:11121,Fa:2667,e:.22,Y1:3,Y2:4.6,C:210000,C0:120000,n:2000,p:10/3,a1:1,targetLife:0,X0:.6,Y0:.5});
close(skfHigh.P,19719.27,.001,"SKF case 2 equivalent load");
close(skfHigh.L10h,22143.5353,.01,"SKF case 2 recomputed ISO life");
const feu=calculate({method:"xy",Fr:5000,Fa:0,X:1,Y:0,X0:1,Y0:0,C:20000,C0:10000,n:1000,p:3,a1:1,targetLife:1066.6666667});
close(feu.L10,64,1e-10,"FeuTex L10");
close(feu.L10h,1066.6666667,1e-5,"FeuTex L10h");
assert.throws(()=>calculate({method:"xy",Fr:1,Fa:0,X:1,Y:0,X0:1,Y0:0,C:0,C0:1,n:1000,p:3,a1:1,targetLife:100}),/greater than zero/);
assert.throws(()=>calculate({method:"axial",Fr:5,Fa:10,C:100,C0:100,n:1000,p:3,a1:1,targetLife:100}),/requires Fr = 0/);
console.log("PASS: 8 bearing calculation and input-validation assertions.");
console.log("NOTE: SKF published example 1 reports 33,400 h; its stated inputs/equation recompute to 31,192.66 h. This discrepancy is intentionally not masked.");
