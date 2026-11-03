const svg = document.getElementById('conveyor-svg');
const $ = id => document.getElementById(id);
let running=false, direction=1, speed=0, offset=0, previous=0, frame=0;
let beltNodes=[];

export function setAnimationGeometry() {
  beltNodes=[...svg.querySelectorAll('[data-material-box="true"]')];
  drawAnimation();
}
function drawAnimation(){
  const startX=125, startY=274, angle=Number(document.getElementById('inclination').value||0)*Math.PI/180;
  const horizontal=630*Math.cos(angle), vertical=-630*Math.sin(angle), normalX=Math.sin(angle), normalY=Math.cos(angle);
  beltNodes.forEach((node,index)=>{
    const width=32, height=19, fraction=((.14+index*.115+direction*offset/630)%1+1)%1;
    const x=startX+horizontal*fraction, y=startY+vertical*fraction;
    node.setAttribute('x',x-width/2-normalX*28);
    node.setAttribute('y',y-height-normalY*28);
  });
}
function tick(now){
  if(!running)return;
  const dt=previous ? Math.min(.05,(now-previous)/1000):0;previous=now;
  offset=(offset+speed*dt*90)%630;drawAnimation();frame=requestAnimationFrame(tick);
}
export function configureAnimation({speedMps, rpm}){
  const slider=$('sim-speed');
  if(document.activeElement!==slider)slider.value=String(Math.min(2,speedMps));
  speed=Number(slider.value);
  $('sim-speed-value').textContent=`${speed.toFixed(2)} m/s`;
  $('sim-rpm').textContent=`${rpm.toFixed(1)} RPM`;
}
export function toggleAnimation(){
  running=!running;
  $('play-button').setAttribute('aria-pressed',String(running));
  $('play-button').innerHTML=running?'❚❚ <span>Pause</span>':'▶ <span>Start</span>';
  $('sim-status-text').textContent=running?'Running':'Paused';
  $('sim-status').classList.toggle('running',running);
  if(running){previous=0;frame=requestAnimationFrame(tick);}else cancelAnimationFrame(frame);
}
export function reverseDirection(){direction*=-1;}
export function resetAnimation(){offset=0;direction=1;drawAnimation();}
export function isRunning(){return running;}
