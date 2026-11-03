import {buildProject,collectInputs,collectDisplayedResults,readAudit,writeAudit,readProjects,writeProjects,readProjectName} from './storage.js';
import {updateProjectName} from './ui.js';
const $=id=>document.getElementById(id);
function setStatus(message,error=false){$('project-status').textContent=message;$('project-status').classList.toggle('error',error);}
function refreshProjectList(selected=''){
  const select=$('saved-projects'),projects=readProjects();select.replaceChildren(new Option('Choose a saved project…',''));
  for(const project of projects){const option=new Option(project.projectName,project.projectName);option.selected=project.projectName===selected;select.add(option);}
}
function emitInput(element){element.dispatchEvent(new Event('input',{bubbles:true}));element.dispatchEvent(new Event('change',{bubbles:true}));}
function restoreInputs(inputMap){
  const first=['payload-mode','belt-mass-mode','carry-support-type','return-support-type','gear-ratio-mode'];
  for(const id of first){const e=$(id);if(e&&inputMap[id]!=null){e.value=inputMap[id];e.dispatchEvent(new Event('change',{bubbles:true}));}}
  for(const [id,value] of Object.entries(inputMap)){const e=$(id);if(e){e.value=value;}}
  for(const [id] of Object.entries(inputMap)){const e=$(id);if(e)emitInput(e);}
}
export function saveProject(){
  const project=buildProject(),projects=readProjects();
  project.auditSnapshots=readAudit().filter(item=>item.projectName===project.projectName);
  const index=projects.findIndex(item=>item.projectName===project.projectName);
  if(index>=0){project.auditSnapshots=projects[index].auditSnapshots??[];projects[index]=project;}else projects.push(project);
  writeProjects(projects);refreshProjectList(project.projectName);setStatus(`Saved “${project.projectName}” to this browser at ${new Date(project.savedAt).toLocaleString()}.`);
}
export function openProject(){
  const name=$('saved-projects').value;if(!name){setStatus('Choose a saved project first.',true);return;}
  const project=readProjects().find(item=>item.projectName===name);if(!project){setStatus('That saved project is unavailable.',true);refreshProjectList();return;}
  updateProjectName(project.projectName);restoreInputs(project.inputs??{});
  const audit=readAudit().filter(item=>item.projectName!==project.projectName).concat(project.auditSnapshots??[]);writeAudit(audit.slice(-100));
  setStatus(`Opened “${project.projectName}”.`);
}
function download(filename,content,type){
  const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function exportJson(){
  const project={...buildProject(),auditSnapshots:readAudit().filter(item=>item.projectName===readProjectName())};
  download(`${safeName(project.projectName)}-conveyor-calculations.json`,JSON.stringify(project,null,2),'application/json');
  setStatus('Exported project inputs, displayed calculations and audit snapshots as JSON.');
}
function safeName(name){return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'conveyor-project';}
function addText(parent,tag,text,className=''){
  const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;parent.append(el);return el;
}
function prepareReport(){
  const report=$('print-report');report.replaceChildren();report.hidden=false;
  const project=buildProject();
  addText(report,'h1','OPEN CONVEYOR ENGINEERING CALCULATOR');
  addText(report,'h2','Preliminary engineering calculation report');
  addText(report,'p',`Project: ${project.projectName} · Version ${project.applicationVersion} · Calculated: ${new Date().toLocaleString()}`,'report-meta');
  addText(report,'p','All outputs are preliminary. User-provided and manufacturer-reference data must be independently checked by a qualified engineer.','report-warning');
  const inputs=document.createElement('section');report.append(inputs);addText(inputs,'h2','Project inputs');
  const table=document.createElement('table'),body=document.createElement('tbody');table.append(body);inputs.append(table);
  for(const [id,value] of Object.entries(project.inputs)){
    const label=document.querySelector(`label[for="${CSS.escape(id)}"]`)?.innerText||id;
    const row=document.createElement('tr');addText(row,'th',label);addText(row,'td',value||'NOT ENTERED');body.append(row);
  }
  addText(report,'h2','Calculation outputs');
  const outputGroups=[['Geometry calculations',document.querySelector('#geometry-results')],['Belt mass',document.querySelector('#belt-result')],['Payload',document.querySelector('#payload-result')],['Support and resistance',document.querySelector('#resistance-result')],['Torque and power',document.querySelector('#drive-result')],['Belt traction',document.querySelector('#traction-result')],['Shaft',document.querySelector('#shaft-result')],['Bearing life',document.querySelector('#bearing-result')],['Structural check',document.querySelector('#structure-result')]];
  for(const [title,node] of outputGroups){const section=document.createElement('section');report.append(section);addText(section,'h3',title);
    if(title==='Geometry calculations')for(const card of node.querySelectorAll('.calc-card'))addText(section,'p',card.innerText.trim(),'report-calculation');
    else addText(section,'p',node.innerText.trim()||'CALCULATION INCOMPLETE');
  }
  const svg=document.querySelector('#conveyor-svg').cloneNode(true);const section=document.createElement('section');report.append(section);addText(section,'h2','Conveyor diagram');section.append(svg);
  addText(report,'h2','Audit snapshots');
  const audit=readAudit();if(!audit.length)addText(report,'p','No audit snapshots have been recorded.');
  for(const item of audit.slice(-20)){addText(report,'h3',item.timestamp);addText(report,'p',Object.entries(item.outputs).map(([k,v])=>`${k}: ${v}`).join(' · '));}
  addText(report,'p','Report produced by the browser. Source data and design applicability have not been independently verified.','report-warning');
}
export function printReport(){
  prepareReport();window.print();$('print-report').hidden=true;
}
export function recordAudit(){
  const project=buildProject(),items=readAudit();
  items.push({timestamp:new Date().toISOString(),projectName:project.projectName,formulaVersion:project.formulaVersion,inputs:collectInputs(),outputs:collectDisplayedResults()});
  writeAudit(items.slice(-100));
  const projects=readProjects(),index=projects.findIndex(item=>item.projectName===project.projectName);
  if(index>=0){projects[index].auditSnapshots=items.slice(-100);writeProjects(projects);}
  setStatus(`Recorded audit snapshot ${items.length} locally for “${project.projectName}”.`);
}
export function initializeReports(){
  $('save-project').addEventListener('click',saveProject);$('open-project').addEventListener('click',openProject);
  $('export-json').addEventListener('click',exportJson);$('print-report-button').addEventListener('click',printReport);
  $('audit-snapshot').addEventListener('click',recordAudit);refreshProjectList();
  $('print-report').hidden=true;
}
