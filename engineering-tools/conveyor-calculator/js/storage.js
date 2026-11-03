const PROJECTS_KEY='open-conveyor-calculator.projects.v1';
const AUDIT_KEY='open-conveyor-calculator.audit.v1';
const $=id=>document.getElementById(id);
export function readProjectName(){return $('project-name').textContent.trim()||'Untitled conveyor';}
export function collectInputs(){
  return Object.fromEntries([...document.querySelectorAll('input[id],select[id],textarea[id]')]
    .map(element=>[element.id,element.value]));
}
export function collectDisplayedResults(){
  return Object.fromEntries([...document.querySelectorAll('.calc-card,.phase-result')]
    .filter(el=>el.id||el.classList.contains('calc-card')).map((el,i)=>[el.id||`calculation-${i+1}`,el.innerText.trim()]));
}
export function readProjects(){try{const data=JSON.parse(localStorage.getItem(PROJECTS_KEY)||'[]');return Array.isArray(data)?data:[];}catch{return [];}}
export function writeProjects(projects){localStorage.setItem(PROJECTS_KEY,JSON.stringify(projects));}
export function readAudit(){try{const data=JSON.parse(localStorage.getItem(AUDIT_KEY)||'[]');return Array.isArray(data)?data:[];}catch{return [];}}
export function writeAudit(items){localStorage.setItem(AUDIT_KEY,JSON.stringify(items));}
export function buildProject(){return {schemaVersion:'1.0',application:'Open Conveyor Engineering Calculator',applicationVersion:'0.1.0',
  projectName:readProjectName(),savedAt:new Date().toISOString(),formulaVersion:'0.1.0',inputs:collectInputs(),displayedResults:collectDisplayedResults()};}
