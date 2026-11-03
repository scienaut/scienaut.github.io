import {calculateShaft} from './calculations/shaft.js';
import {calculateBearing} from './calculations/bearings.js';
import {calculateRhsBeam} from './calculations/structural.js';
const $=id=>document.getElementById(id),n=id=>{const v=$(id)?.valueAsNumber;return Number.isFinite(v)?v:null;};
const fmt=(x,d=3)=>Number.isFinite(x)?new Intl.NumberFormat('en',{maximumFractionDigits:d}).format(x):'—';
function renderShaft(){
  const torque=n('shaft-torque')??window.currentDrive?.peakTorqueNm??null;
  const r=calculateShaft({radialLoadN:n('shaft-radial-load'),torqueNm:torque,bearingSpanMm:n('shaft-span'),overhangMm:n('shaft-overhang'),
    outerDiameterMm:n('shaft-od'),innerDiameterMm:n('shaft-id')??0,elasticModulusGPa:n('shaft-modulus'),shearModulusGPa:n('shaft-shear'),
    yieldStrengthMPa:n('shaft-yield'),Kt:n('shaft-kt'),Kfs:n('shaft-kfs'),sourceClass:$('shaft-source-class').value,reference:$('shaft-source-ref').value});
  const out=$('shaft-result');out.classList.toggle('incomplete',!r.complete);
  if(!r.complete){out.innerHTML=`<div class="result-status">CALCULATION INCOMPLETE</div><p>Required: ${r.missing.join('; ')}.</p>`;return;}
  out.innerHTML=`<div class="result-status">${$('shaft-source-class').value==='manufacturer'?'MANUFACTURER DATA · VERIFICATION REQUIRED':'USER INPUT'} · STATIC PRELIMINARY CHECK</div>
    <p><strong>Bearing reactions:</strong> left ${fmt(r.leftReactionN,2)} N · right ${fmt(r.rightReactionN,2)} N &nbsp; <strong>Max bending moment:</strong> ${fmt(r.bendingMomentNm,2)} N·m</p>
    <p><strong>Bending stress:</strong> ${fmt(r.bendingStressMPa,2)} MPa &nbsp; <strong>Torsional shear:</strong> ${fmt(r.shearStressMPa,2)} MPa &nbsp; <strong>Von Mises:</strong> ${fmt(r.vonMisesMPa,2)} MPa</p>
    <p><strong>Yield ratio:</strong> ${fmt(r.yieldMargin,3)} &nbsp; <strong>Overhang deflection:</strong> ${fmt(r.deflectionMm,4)} mm &nbsp; <strong>Twist:</strong> ${fmt(r.twistDeg,4)}°</p>
    <p>${r.limitation}</p>`;
}
function renderBearing(){
  const r=calculateBearing({type:$('bearing-type').value,CN:n('bearing-C'),C0N:n('bearing-C0'),FrN:n('bearing-Fr'),FaN:n('bearing-Fa'),speedRpm:n('bearing-speed'),
    X:n('bearing-X'),Y:n('bearing-Y'),X0:n('bearing-X0'),Y0:n('bearing-Y0'),reference:$('bearing-reference').value});
  const out=$('bearing-result');out.classList.toggle('incomplete',!r.complete);
  if(!r.complete){out.innerHTML=`<div class="result-status">SUPPLIER DATA REQUIRED / CALCULATION INCOMPLETE</div><p>Required: ${r.missing.join('; ')}.</p>`;return;}
  out.innerHTML=`<div class="result-status">${$('bearing-source-class').value==='manufacturer'?'MANUFACTURER DATA · VERIFICATION REQUIRED':'USER INPUT'} · PRELIMINARY</div>
    <p><strong>Equivalent dynamic load P:</strong> ${fmt(r.equivalentDynamicN,2)} N &nbsp; <strong>Equivalent static load P0:</strong> ${fmt(r.equivalentStaticN,2)} N</p>
    <p><strong>Basic rating life L10:</strong> ${fmt(r.lifeMillionRevs,3)} million revolutions · ${fmt(r.lifeHours,1)} h &nbsp; <strong>Static safety ratio:</strong> ${fmt(r.staticSafety,3)}</p>
    <p><code>P = XFr + YFa</code>; <code>L10h = 10⁶/(60n) × (C/P)^${fmt(r.p,4)}</code>. ${r.limitation}</p>`;
}
function renderStructure(){
  const r=calculateRhsBeam({lineLoadNm:n('frame-load'),spanMm:n('frame-span'),widthMm:n('frame-width'),heightMm:n('frame-height'),wallMm:n('frame-wall'),
    elasticModulusGPa:n('frame-modulus'),yieldStrengthMPa:n('frame-yield'),reference:$('frame-reference').value});
  const out=$('structure-result');out.classList.toggle('incomplete',!r.complete);
  if(!r.complete){out.innerHTML=`<div class="result-status">CALCULATION INCOMPLETE</div><p>Required: ${r.missing.join('; ')}.</p>`;return;}
  out.innerHTML=`<div class="result-status">${$('frame-source-class').value==='manufacturer'?'MANUFACTURER DATA · VERIFICATION REQUIRED':'USER INPUT'} · PRELIMINARY</div>
    <p><strong>Maximum bending moment:</strong> ${fmt(r.maximumMomentNm,2)} N·m &nbsp; <strong>Bending stress:</strong> ${fmt(r.bendingStressMPa,2)} MPa</p>
    <p><strong>Midspan deflection:</strong> ${fmt(r.deflectionMm,3)} mm &nbsp; <strong>Yield ratio:</strong> ${fmt(r.yieldMargin,3)}</p>
    <p><code>M = wL²/8</code>; <code>δ = 5wL⁴/(384EI)</code>. ${r.limitation}</p>`;
}
export function renderMechanical(){renderShaft();renderBearing();renderStructure();}
export function initializeMechanicalUI(){
  const section=$('mechanical-design');section.addEventListener('input',renderMechanical);section.addEventListener('change',renderMechanical);
  window.refreshMechanical=renderMechanical;renderMechanical();
}
