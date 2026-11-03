import { degToRad, fmt } from './units.js';

const svg = document.getElementById('conveyor-svg');
const ns = 'http://www.w3.org/2000/svg';
function el(tag, attrs = {}, parent = svg) {
  const node = document.createElementNS(ns, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  parent.append(node); return node;
}
function text(x, y, value, attrs = {}) { const n = el('text', {x,y,fill:'#8fa0b2','font-size':11,'font-family':'DM Mono, monospace',...attrs}); n.textContent=value; return n; }
export function renderDiagram(input, result) {
  svg.replaceChildren();
  const title = el('title', {id:'svg-title'}); title.textContent = 'Parametric conveyor side elevation';
  const desc = el('desc', {id:'svg-desc'}); desc.textContent = `Schematic conveyor with ${fmt(input.centreDistanceMm,0)} millimetre centre distance and ${fmt(input.inclinationDeg,1)} degree inclination.`;
  for (let x=30; x<900; x+=36) for (let y=24; y<420; y+=36) el('circle',{cx:x,cy:y,r:0.75,fill:'#293645'});
  const angle = degToRad(input.inclinationDeg);
  const left={x:125,y:274}, span=630, right={x:left.x+span*Math.cos(angle),y:left.y-span*Math.sin(angle)};
  const normal={x:Math.sin(angle),y:Math.cos(angle)};
  const radius=Math.max(16,Math.min(27,input.driveDiameterMm/6));
  const beltOffset=radius+4;
  const upperA={x:left.x-normal.x*beltOffset,y:left.y-normal.y*beltOffset};
  const upperB={x:right.x-normal.x*beltOffset,y:right.y-normal.y*beltOffset};
  const lowerA={x:left.x+normal.x*beltOffset,y:left.y+normal.y*beltOffset};
  const lowerB={x:right.x+normal.x*beltOffset,y:right.y+normal.y*beltOffset};
  // Frame and support legs
  el('line',{x1:upperA.x,y1:upperA.y+10,x2:upperB.x,y2:upperB.y+10,stroke:'#506174','stroke-width':9,'stroke-linecap':'round'});
  for(const t of [.25,.74]){const x=left.x+(right.x-left.x)*t,y=left.y+(right.y-left.y)*t;el('path',{d:`M ${x} ${y+14} l -12 53 h 24 Z`,fill:'#253342',stroke:'#536679','stroke-width':1});}
  // belt loop
  el('path',{d:`M ${upperA.x} ${upperA.y} L ${upperB.x} ${upperB.y} A ${radius+4} ${radius+4} 0 0 1 ${lowerB.x} ${lowerB.y} L ${lowerA.x} ${lowerA.y} A ${radius+4} ${radius+4} 0 0 1 ${upperA.x} ${upperA.y}`,fill:'none',stroke:'#4b91ff','stroke-width':4,'stroke-linejoin':'round'});
  // Carrying idlers
  for(const t of [.2,.4,.6,.8]){const x=left.x+(right.x-left.x)*t,y=left.y+(right.y-left.y)*t;el('circle',{cx:x,cy:y,r:6,fill:'#17212c',stroke:'#98aabd','stroke-width':2});el('line',{x1:x,y1:y+7,x2:x,y2:y+16,stroke:'#718499','stroke-width':2});}
  // Return rollers
  for(const t of [.33,.67]){const x=left.x+(right.x-left.x)*t,y=left.y+(right.y-left.y)*t;const rx=x+normal.x*38,ry=y+normal.y*38;el('circle',{cx:rx,cy:ry,r:5,fill:'#17212c',stroke:'#8799aa','stroke-width':2});}
  // pulleys
  for(const [p,label] of [[left,'TAIL'],[right,'DRIVE']]){el('circle',{cx:p.x,cy:p.y,r:radius,fill:'#273646',stroke:'#b0c0d0','stroke-width':3});el('circle',{cx:p.x,cy:p.y,r:4,fill:'#7c91a7'});text(p.x,p.y+radius+18,label,{fill:'#a9bacb','font-size':9,'text-anchor':'middle'});}
  // Motor + gearbox schematic at drive end
  el('rect',{x:right.x+30,y:right.y-13,width:44,height:26,rx:4,fill:'#245282',stroke:'#5695d5'});text(right.x+52,right.y+4,'GB',{fill:'#dbeeff','font-size':9,'text-anchor':'middle'});
  el('rect',{x:right.x+78,y:right.y-19,width:53,height:38,rx:5,fill:'#1d344a',stroke:'#4f799e'});text(right.x+104,right.y+4,'MOTOR',{fill:'#a8c7e2','font-size':8,'text-anchor':'middle'});
  // Material boxes, rendered along belt path
  for(let i=0;i<5;i++){const t=.14+i*.115,x=left.x+(right.x-left.x)*t,y=left.y+(right.y-left.y)*t;el('rect',{x:x-16,y:y-beltOffset-22,width:32,height:19,rx:2,fill:'#b97835',stroke:'#edb66b','stroke-width':1,'data-material-box':'true'});}
  // Dimensions and angle
  const dimA={x:left.x,y:left.y+86},dimB={x:right.x,y:right.y+86};
  el('line',{x1:dimA.x,y1:dimA.y,x2:dimB.x,y2:dimB.y,stroke:'#516276','stroke-width':1,'stroke-dasharray':'4 4'});
  el('line',{x1:dimA.x,y1:dimA.y-5,x2:dimA.x,y2:dimA.y+5,stroke:'#8091a3','stroke-width':1});el('line',{x1:dimB.x,y1:dimB.y-5,x2:dimB.x,y2:dimB.y+5,stroke:'#8091a3','stroke-width':1});
  text((dimA.x+dimB.x)/2,(dimA.y+dimB.y)/2+17,`CENTRE DISTANCE  ${fmt(input.centreDistanceMm,0)} mm`,{'text-anchor':'middle','font-size':10});
  const rise={x:left.x-45,y:left.y},riseTop={x:right.x-45,y:right.y};el('line',{x1:rise.x,y1:rise.y,x2:riseTop.x,y2:riseTop.y,stroke:'#826fb0','stroke-width':1,'stroke-dasharray':'3 4'});text(rise.x-6,(rise.y+riseTop.y)/2,`RISE ${fmt(result.riseMm,0)} mm`,{fill:'#b7a5ed','text-anchor':'middle',transform:`rotate(-90 ${rise.x-6} ${(rise.y+riseTop.y)/2})`,'font-size':9});
  el('path',{d:`M ${left.x+42} ${left.y} A 42 42 0 0 0 ${left.x+42*Math.cos(angle)} ${left.y-42*Math.sin(angle)}`,fill:'none',stroke:'#e0ae5c','stroke-width':1.5});text(left.x+49,left.y-11,`${fmt(input.inclinationDeg,1)}°`,{fill:'#e0ae5c','font-size':10});
  text(35, 32, `V ${fmt(result.beltSpeedMps,3)} m/s`,{fill:'#75b5ff','font-size':10});
}
