import { calculateDrive } from './calculations/drive.js';
const $=id=>document.getElementById(id);
const num=id=>{const v=$(id)?.valueAsNumber;return Number.isFinite(v)?v:null;};
const fmt=(n,d=3)=>Number.isFinite(n)?new Intl.NumberFormat('en',{maximumFractionDigits:d}).format(n):'—';
function calculate(){return calculateDrive({resistance:window.currentResistance,driveDiameterMm:num('drive-diameter'),drumRpm:num('drum-rpm'),
  speedMps:window.currentGeometry?.beltSpeedMps,motorRpm:num('motor-rpm'),motorPowerKw:num('motor-power'),motorEfficiency:num('motor-efficiency'),
  gearboxEfficiency:num('gearbox-efficiency'),couplingEfficiency:num('coupling-efficiency'),gearRatioMode:$('gear-ratio-mode').value,
  manualRatio:num('manual-ratio'),drumFriction:num('drive-friction'),wrapAngleDeg:num('wrap-angle'),slackTensionN:num('slack-tension'),
  allowableWorkingTensionN:num('belt-working-tension'),beltTensileRatingNPerMm:num('belt-tensile-rating'),beltWidthMm:num('belt-width'),
  driveDataSource:$('drive-data-source').value,driveDataReference:$('drive-data-reference').value,
  tractionSource:$('traction-source').value,tractionReference:$('traction-reference').value});}
function render(){
  if(!$('drive-result'))return;
  $('manual-ratio-row').hidden=$('gear-ratio-mode').value!=='manual';
  const r=calculate(),out=$('drive-result');window.currentDrive=r;if(window.refreshMechanical)window.refreshMechanical();out.classList.toggle('incomplete',!r.complete||!Number.isFinite(r.peakTorqueNm));
  const hasForce=Number.isFinite(r.steadyForceN);
  if(!hasForce){out.innerHTML=`<div class="result-status">CALCULATION INCOMPLETE</div><p>Required: ${r.missing.join('; ')}.</p>`;}
  else {
    const steadyInput=Number.isFinite(r.motorInputKw)?`${fmt(r.motorInputKw,4)} kW`:(r.steadyMechanicalKw<0?'BRAKING / REGENERATIVE DUTY REQUIRES SEPARATE ANALYSIS':'DATA REQUIRED (efficiencies)');
    const peakTorque=Number.isFinite(r.peakTorqueNm)?`${fmt(r.peakTorqueNm,3)} N·m`:'DATA REQUIRED (acceleration time)';
    const ratio=Number.isFinite(r.ratio)?`${fmt(r.ratio,4)}:1`:'DATA REQUIRED';
    const sourceStatus=$('drive-data-source').value==='manufacturer'?'MANUFACTURER DATA · VERIFICATION REQUIRED':'USER INPUT';
    out.innerHTML=`<div class="result-status">${sourceStatus} · LINEAR-LOAD DRIVE ESTIMATE · ROTATIONAL INERTIA OMITTED</div>
      <p><strong>Steady drive torque:</strong> ${fmt(r.steadyTorqueNm,3)} N·m &nbsp; <strong>Peak linear-load torque:</strong> ${peakTorque}</p>
      <p><strong>Steady mechanical power:</strong> ${fmt(r.steadyMechanicalKw,4)} kW &nbsp; <strong>Peak mechanical power:</strong> ${Number.isFinite(r.peakMechanicalKw)?`${fmt(r.peakMechanicalKw,4)} kW`:'DATA REQUIRED (acceleration time)'}</p>
      <p><strong>Required motor input power (steady):</strong> ${steadyInput} &nbsp; <strong>Peak motor input:</strong> ${Number.isFinite(r.peakInputKw)?`${fmt(r.peakInputKw,4)} kW`:'DATA REQUIRED'} &nbsp; <strong>Combined efficiency:</strong> ${Number.isFinite(r.totalEfficiency)?fmt(r.totalEfficiency,5):'DATA REQUIRED'}</p>
      <p><strong>Reduction ratio:</strong> ${ratio} &nbsp; <strong>Motor rated torque from entered rating:</strong> ${Number.isFinite(r.motorRatedTorqueNm)?`${fmt(r.motorRatedTorqueNm,3)} N·m`:'DATA REQUIRED'}</p>
      <p><strong>Rated gearbox output torque:</strong> ${Number.isFinite(r.ratedOutputTorqueNm)?`${fmt(r.ratedOutputTorqueNm,3)} N·m`:'DATA REQUIRED'}</p>
      <p><code>Tlinear = F × r</code>; <code>P = F × V</code>. Rotational inertia torque is excluded, so total drive torque and motor suitability remain incomplete.</p>`;
  }
  const traction=$('traction-result');traction.classList.toggle('incomplete',!r.traction);
  if(!r.traction){traction.innerHTML=`<div class="result-status">${r.tractionSource==='manufacturer'?'STANDARD / SUPPLIER REFERENCE REQUIRED':'CALCULATION INCOMPLETE'}</div><p>Required: ${r.tractionMissing.join('; ')}.</p><p>Unknown pretension is not substituted; downhill or non-positive pulling force is not treated as normal forward traction.</p>`;return;}
  const t=r.traction,source=r.tractionSource==='manufacturer'?'MANUFACTURER REFERENCE · VERIFICATION REQUIRED':'USER INPUT';
  const pretension=t.slackKnown?'Entered slack-side tension used.':'Theoretical minimum slack-side tension; actual pretension is unknown.';
  const margin=t.marginRatio>=1?'TRACTION CAPACITY ≥ REQUIRED FORCE':'TRACTION CAPACITY BELOW REQUIRED FORCE';
  traction.innerHTML=`<div class="result-status">${source} · ${margin}</div>
    <p><strong>Effective tension difference:</strong> ${fmt(t.effectiveForceN,2)} N (${r.effectiveForceBasis}) &nbsp; <strong>Capstan ratio:</strong> ${fmt(t.capstanRatio,4)} (= e<sup>μβ</sup>)</p>
    <p><strong>Slack-side tension:</strong> ${fmt(t.slackN,2)} N &nbsp; <strong>Tight-side tension:</strong> ${fmt(t.tightN,2)} N</p>
    <p><strong>Available traction difference:</strong> ${fmt(t.capacityN,2)} N &nbsp; <strong>Traction margin ratio:</strong> ${fmt(t.marginRatio,3)}</p>
    <p>${pretension} ${Number.isFinite(t.workingUtilization)?`Working-tension utilization: ${fmt(t.workingUtilization*100,2)}%.`:'Working-tension utilization: DATA REQUIRED (allowable working tension).'} ${Number.isFinite(t.breakingUtilization)?`Entered breaking-strength utilization: ${fmt(t.breakingUtilization*100,2)}% (not an allowable design limit).`:''} Belt tensile rating alone is not treated as allowable working tension.</p>
    <p><code>T1 − T2 = F</code>; <code>T1/T2 ≤ e^(μβ)</code>, β = ${fmt(r.wrapRad,4)} rad. Preliminary traction estimate only.</p>`;
}
export function renderDrive(){render();}
export function initializeDriveUI(){
  const panel=$('drive-system');panel.addEventListener('input',render);panel.addEventListener('change',render);
  window.refreshDrive=render;render();
}
