import { calculateBelt } from './calculations/belt.js';
import { calculatePayload } from './calculations/payload.js';
const $=id=>document.getElementById(id);
const number=id=>{const n=$(id).valueAsNumber;return Number.isFinite(n)?n:null;};
const fmt=(n,d=2)=>Number.isFinite(n)?new Intl.NumberFormat('en',{maximumFractionDigits:d}).format(n):'—';

function renderPayloadInputs(){
  const mode=$('payload-mode').value;
  const config={
    total:['Total payload currently carried','total-payload','kg','e.g. 250'],
    linear:['Linear material loading','linear-loading','kg/m','e.g. 12.5'],
    throughput:['Material throughput','throughput','kg/h','e.g. 1,800']
  }[mode];
  $('payload-mode-fields').innerHTML=`<div class="form-row"><label for="${config[1]}">${config[0]} <span class="unit">${config[2]}</span></label><input id="${config[1]}" type="number" min="0" step="any" placeholder="${config[3]}"><small class="field-error" aria-live="polite"></small></div>`;
  $('payload-mode-fields').dataset.mode=mode;
}
function readBelt(){return {
  method:$('belt-mass-mode').value,widthMm:number('belt-width'),thicknessMm:number('belt-thickness'),
  linearMass:number('belt-linear-mass'),arealMass:number('belt-areal-mass'),density:number('belt-density'),
  construction:$('belt-construction').value,loopLengthMm:window.currentGeometry?.approximateLoopLengthMm??null,
  sourceClass:$('belt-data-source').value,sourceName:$('belt-source-name').value,sourceUrl:$('belt-source-url').value
};}
function readPayload(){
  const mode=$('payload-mode').value, fieldId={total:'total-payload',linear:'linear-loading',throughput:'throughput'}[mode];
  const selected=number(fieldId), geometry=window.currentGeometry;
  return {mode,totalKg:mode==='total'?selected:null,linearKgM:mode==='linear'?selected:null,throughputKgH:mode==='throughput'?selected:null,
    speedMps:geometry?.beltSpeedMps??null,centreDistanceMm:number('centre-distance'),loadedLengthMm:number('loaded-length'),
    boxCount:number('box-count'),boxMass:number('box-mass'),boxLengthMm:number('box-length'),boxWidthMm:number('box-width'),
    beltWidthMm:number('belt-width'),boxSpacingMm:number('box-spacing'),distribution:$('material-distribution').value};
}
function resultHTML({status,body,warning='',incomplete=false}){
  return `<div class="result-status">${status}</div><p>${body}</p>${warning?`<p class="field-error">${warning}</p>`:''}<p>${incomplete?'No engineering result is displayed until required inputs are provided.':'Values shown are preliminary and traceable to the inputs and equations above.'}</p>`;
}
function renderBelt(){
  const r=calculateBelt(readBelt()), box=$('belt-result');
  window.currentBeltMassPerM=r.complete?r.massPerMetre:null;
  box.classList.toggle('incomplete',!r.complete);
  if(!r.complete){
    const requirement=r.method==='manual'?'USER INPUT REQUIRED':r.method==='areal'&&r.classification.startsWith('MANUFACTURER')?'SUPPLIER DATA REQUIRED':'DATA REQUIRED';
    box.innerHTML=resultHTML({status:`${requirement} / CALCULATION INCOMPLETE`,body:`Required: ${r.missing.join('; ')}. Enter a value and identify its source classification.`,incomplete:true});return;
  }
  box.innerHTML=`<div class="result-status">${r.classification}</div><p><strong>Linear belt mass:</strong> ${fmt(r.massPerMetre,4)} kg/m &nbsp; <strong>Approximate loop length:</strong> ${fmt(r.loopLengthMm,1)} mm</p><p><strong>Approximate total belt mass:</strong> ${fmt(r.totalMassKg,3)} kg</p><p><code>${r.formula}</code> &nbsp; ${r.substitution??''}</p><p>Loop-length approximation excludes take-up travel and detailed routing.</p>`;
}
function renderPayload(){
  const r=calculatePayload(readPayload()),box=$('payload-result');box.classList.toggle('incomplete',!r.complete);
  window.currentPayloadMassKg=r.complete?r.payloadKg:null;
  if(!r.complete){box.innerHTML=resultHTML({status:'CALCULATION INCOMPLETE',body:`Required: ${r.missing.join('; ')}. Payload modes are mutually exclusive; the selected mode is authoritative.`,warning:r.boxWarning,incomplete:true});return;}
  box.innerHTML=`<div class="result-status">USER INPUT → CALCULATED</div><p><strong>Linear loading:</strong> ${fmt(r.linearLoadingKgM,4)} kg/m &nbsp; <strong>Total payload:</strong> ${fmt(r.payloadKg,3)} kg</p><p><strong>Payload weight:</strong> ${fmt(r.payloadWeightN,2)} N &nbsp; <strong>Throughput:</strong> ${fmt(r.throughputKgH,2)} kg/h</p>${r.payloadPerBoxKg!=null?`<p><strong>Authoritative payload per entered box count:</strong> ${fmt(r.payloadPerBoxKg,3)} kg/box</p>`:''}<p><code>${r.formula}</code> &nbsp; ${r.substitution}</p>${r.boxWarning?`<p class="field-error">${r.boxWarning}</p>`:'<p>Box mass is only checked against the selected payload; it is not added a second time.</p>'}`;
}
export function renderPhase2(){renderBelt();renderPayload();}
export function initializePhase2(){
  renderPayloadInputs();
  document.querySelector('.phase2-grid').addEventListener('input',event=>{if(event.target.id==='payload-mode')return;renderPhase2();});
  document.querySelector('.phase2-grid').addEventListener('change',event=>{if(event.target.id==='payload-mode')renderPayloadInputs();renderPhase2();});
  renderPhase2();
}
