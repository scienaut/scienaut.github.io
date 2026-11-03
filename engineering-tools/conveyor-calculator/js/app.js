import { defaultState, readInputs } from './state.js';
import { calculateGeometry } from './calculations/geometry.js';
import { validateGeometry } from './validation.js';
import { renderCalculations, renderSummary, renderValidation, attachTooltips, updateProjectName } from './ui.js';
import { renderDiagram } from './conveyor-diagram.js';
import { configureAnimation, setAnimationGeometry, toggleAnimation, reverseDirection, resetAnimation, isRunning } from './material-animation.js';
import { initializePhase2, renderPhase2 } from './phase2.js';
import { initializeSupportUI, renderResistance } from './support-ui.js';
import { initializeDriveUI } from './drive-ui.js';
import { initializeMechanicalUI } from './phase5-ui.js';
import { initializeReports } from './reports.js';

const form=document.getElementById('geometry-form');
function update(){
  if(!validateGeometry())return;
  const input=readInputs(), result=calculateGeometry(input);
  window.currentGeometry=result;
  renderSummary(input,result);renderCalculations(input,result);renderValidation(result,input.toleranceMm);renderDiagram(input,result);setAnimationGeometry();
  configureAnimation({speedMps:result.beltSpeedMps,rpm:input.driveRpm});
  renderPhase2();
  renderResistance();
}
function restoreDefaults(){
  for(const [id,value] of Object.entries({
    'centre-distance':defaultState.centreDistanceMm,'inclination':defaultState.inclinationDeg,'entered-height':defaultState.enteredHeightMm,
    'tolerance':defaultState.toleranceMm,'belt-width':defaultState.beltWidthMm,'drive-diameter':defaultState.driveDiameterMm,
    'tail-diameter':defaultState.tailDiameterMm,'drum-rpm':defaultState.driveRpm
  }))document.getElementById(id).value=String(value);
  if(isRunning())toggleAnimation();resetAnimation();document.getElementById('sim-speed').value='.47';document.getElementById('project-name').textContent=defaultState.projectName;update();
}
form.addEventListener('submit',event=>{event.preventDefault();update();});
form.addEventListener('input',event=>{if(event.target.matches('input'))update();});
document.getElementById('reset-button').addEventListener('click',restoreDefaults);
document.getElementById('play-button').addEventListener('click',toggleAnimation);
document.getElementById('reverse-button').addEventListener('click',reverseDirection);
document.getElementById('reset-sim-button').addEventListener('click',resetAnimation);
document.getElementById('sim-speed').addEventListener('input',()=>{const input=readInputs();const result=calculateGeometry(input);configureAnimation({speedMps:result.beltSpeedMps,rpm:input.driveRpm});});
document.getElementById('rename-button').addEventListener('click',()=>{
  const dialog=document.getElementById('project-dialog');const field=document.getElementById('project-name-input');field.value=document.getElementById('project-name').textContent;dialog.showModal();field.focus();
});
document.getElementById('project-dialog').addEventListener('close',()=>{
  if(document.getElementById('project-dialog').returnValue==='ok'){
    const name=document.getElementById('project-name-input').value.trim()||defaultState.projectName;
    updateProjectName(name);
  }
});
document.getElementById('main-nav').addEventListener('click',event=>{
  const link=event.target.closest('.nav-link');if(!link)return;
  document.querySelectorAll('.nav-link').forEach(node=>node.classList.toggle('active',node===link));
});
attachTooltips();initializePhase2();initializeSupportUI();initializeDriveUI();initializeMechanicalUI();initializeReports();update();
window.__conveyorAppStarted = true;
