import { calculateResistance } from './calculations/resistance.js';
const $=id=>document.getElementById(id);
const num=id=>{const v=$(id)?.valueAsNumber;return Number.isFinite(v)?v:null;};
const fmt=(n,d=2)=>Number.isFinite(n)?new Intl.NumberFormat('en',{maximumFractionDigits:d}).format(n):'—';
function sideMarkup(prefix,type){
  if(!type)return '<p class="support-empty">Select a support type to enter its resistance model.</p>';
  const source=`<div class="form-row"><label for="${prefix}-source-class">Data classification</label><select id="${prefix}-source-class"><option value="user">User input / measured</option><option value="manufacturer">Manufacturer reference (verify)</option></select></div><div class="form-row"><label for="${prefix}-source-ref">Source / measurement reference</label><input id="${prefix}-source-ref" type="text" placeholder="Needed for manufacturer source"></div>`;
  if(type==='idler')return `<div class="form-row"><label for="${prefix}-idler-mode">Idler resistance method</label><select id="${prefix}-idler-mode"><option value="coefficient">Equivalent running-resistance coefficient</option><option value="drag">Measured / manufacturer total drag</option></select></div><div class="form-row" id="${prefix}-parameter"></div>${source}`;
  return `<div class="form-row"><label for="${prefix}-skid-material">Skid material</label><select id="${prefix}-skid-material"><option>UHMWPE</option><option>SS304</option><option>Other / Custom</option></select></div><div class="form-row"><label for="${prefix}-parameter">Dynamic belt-to-skid friction μ</label><input id="${prefix}-parameter" type="number" min="0" step="any" placeholder="Supplier / test value"><small class="field-help">Use the actual contacting surfaces and conditions.</small></div><div class="form-row"><label for="${prefix}-strips">Number of skid strips</label><input id="${prefix}-strips" type="number" min="1" step="1"></div><div class="form-row"><label for="${prefix}-strip-width">Individual strip width <span class="unit">mm</span></label><input id="${prefix}-strip-width" type="number" min="0" step="any"></div><div class="form-row"><label for="${prefix}-contact-length">Effective contact length <span class="unit">mm</span></label><input id="${prefix}-contact-length" type="number" min="0" step="any"></div>${source}`;
}
function updateIdlerParameter(prefix){
  const target=$(`${prefix}-parameter`);if(!target)return;
  const coefficient=$(`${prefix}-idler-mode`).value==='coefficient';
  target.innerHTML=coefficient?`<label for="${prefix}-coefficient">Equivalent running-resistance coefficient fᵢ</label><input id="${prefix}-coefficient" type="number" min="0" step="any" placeholder="Enter sourced / measured value"><small class="field-help">Not a sliding-friction coefficient.</small>`:`<label for="${prefix}-drag">Total idler drag <span class="unit">N</span></label><input id="${prefix}-drag" type="number" min="0" step="any" placeholder="Measured or supplier-published total">`;
}
function readSide(prefix,type){
  if(type==='idler'){
    const mode=$(`${prefix}-idler-mode`)?.value??'coefficient';
    return {type,method:mode,coefficient:mode==='coefficient'?num(`${prefix}-coefficient`):null,dragN:mode==='drag'?num(`${prefix}-drag`):null,
      sourceClass:$(`${prefix}-source-class`)?.value??'user',reference:$(`${prefix}-source-ref`)?.value??''};
  }
  if(type==='skid')return {type,material:$(`${prefix}-skid-material`)?.value??'',coefficient:num(`${prefix}-parameter`),strips:num(`${prefix}-strips`),
    stripWidthMm:num(`${prefix}-strip-width`),contactLengthMm:num(`${prefix}-contact-length`),sourceClass:$(`${prefix}-source-class`)?.value??'user',reference:$(`${prefix}-source-ref`)?.value??''};
  return null;
}
function renderResult(){
  const belt=window.currentBeltMassPerM,payload=window.currentPayloadMassKg;
  const r=calculateResistance({centreDistanceMm:num('centre-distance'),inclinationDeg:num('inclination'),beltLinearMassKgM:belt,payloadKg:payload,
    speedMps:window.currentGeometry?.beltSpeedMps,carrying:readSide('carry',$('carry-support-type').value),returnSide:readSide('return',$('return-support-type').value),
    accessoryN:num('accessory-drag'),accelerationTimeS:num('acceleration-time'),direction:$('elevation-direction').value});
  window.currentResistance=r;
  if(window.refreshDrive)window.refreshDrive();
  const out=$('resistance-result');out.classList.toggle('incomplete',!r.complete||!Number.isFinite(r.peakN));
  if(!r.complete){out.innerHTML=`<div class="result-status">CALCULATION INCOMPLETE</div><p>Required: ${r.missing.join('; ')}.</p><p>Idler equivalent coefficients, skid friction coefficients, and support drag are not prefilled; enter values and source classification.</p>`;return;}
  const pressure=(side)=>Number.isFinite(side.pressurePa)?`<br>Contact area ${fmt(side.areaM2,4)} m² · pressure ${fmt(side.pressurePa/1000,2)} kPa`:'';
  const provenance=[readSide('carry',$('carry-support-type').value),readSide('return',$('return-support-type').value)].some(s=>s?.sourceClass==='manufacturer')?'Manufacturer reference entered · verification required':'USER INPUT';
  const peak=Number.isFinite(r.peakN)?`${fmt(r.peakN,2)} N`:'DATA REQUIRED (acceleration time)';
  out.innerHTML=`<div class="result-status">${provenance} · PRELIMINARY MODEL</div>
    <p><strong>Payload gravity:</strong> ${fmt(r.gravityN,2)} N &nbsp; <strong>Carrying resistance:</strong> ${fmt(r.carrying.forceN,2)} N</p>
    <p><strong>Return resistance:</strong> ${fmt(r.returnSide.forceN,2)} N &nbsp; <strong>Accessory:</strong> ${fmt(r.accessoryN,2)} N</p>
    <p><strong>Steady net pulling force:</strong> ${fmt(r.steadyN,2)} N &nbsp; <strong>Peak with acceleration:</strong> ${peak}</p>
    <p><strong>Moving translating mass:</strong> ${fmt(r.movingMassKg,3)} kg${Number.isFinite(r.accelerationMps2)?` · acceleration ${fmt(r.accelerationMps2,4)} m/s² · acceleration force ${fmt(r.accelerationN,2)} N`:''}</p>
    <p>${r.carrying.model}: <code>F = ${r.carrying.model.includes('idler')?'fᵢ':'μ'} × N</code>; N = ${fmt(r.carrying.normalN,2)} N${pressure(r.carrying)}</p>
    <p>${r.returnSide.model}: <code>F = ${r.returnSide.model.includes('idler')?'fᵢ':'μ'} × N</code>; N = ${fmt(r.returnSide.normalN,2)} N${pressure(r.returnSide)}</p>
    <p><strong>Support resistance power:</strong> ${fmt((r.carryingPowerW+r.returnPowerW)/1000,4)} kW. ${r.geometryAssumption}</p>
    ${Number.isFinite(r.peakN)?'':`<p class="field-error">Peak pulling force is incomplete: enter acceleration time. Steady resistance remains preliminary.</p>`}`;
}
export function renderResistance(){renderResult();}
export function initializeSupportUI(){
  const panel=$('support-resistance');
  for(const prefix of ['carry','return']){
    const typeId=prefix==='carry'?'carry-support-type':'return-support-type';
    $(typeId).addEventListener('change',()=>{const type=$(typeId).value;$(`${prefix}-support-fields`).innerHTML=sideMarkup(prefix,type);if(type==='idler')updateIdlerParameter(prefix);renderResult();});
  }
  panel.addEventListener('input',renderResult);
  panel.addEventListener('change',event=>{const prefix=event.target.id.startsWith('carry-')?'carry':event.target.id.startsWith('return-')?'return':null;
    if(prefix&&event.target.id===`${prefix}-idler-mode`)updateIdlerParameter(prefix);renderResult();});
  document.querySelector('.phase2-grid').addEventListener('input',renderResult);
  document.querySelector('.phase2-grid').addEventListener('change',renderResult);
  renderResult();
}
