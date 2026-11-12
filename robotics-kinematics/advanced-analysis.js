(function(){
'use strict';
const $=id=>document.getElementById(id);
const rad=d=>d*Math.PI/180;
let lastAdvanced=null;
function unitScale(){return $('units').value==='fps'?25.4:1;}
function count(){return Number($('robot').value);}
function makeInput(id,label,value,min='0',step='.1'){return '<div class="field"><label for="'+id+'">'+label+'</label><input id="'+id+'" type="number" min="'+min+'" step="'+step+'" value="'+value+'"></div>';}
function buildAdvancedInputs(){
 const c=count(),u=unitScale(),lenUnit=$('units').value==='fps'?'in':'mm',oldUnit=buildAdvancedInputs.lastUnit||u;
 const saved=Array.from({length:c},(_,i)=>({w:$('advWidth'+i)?.value??'',t:$('advThickness'+i)?.value??'',min:$('advMin'+i)?.value??'-180',max:$('advMax'+i)?.value??'180'}));
 $('advancedLinkInputs').innerHTML=Array.from({length:c},(_,i)=>'<div class="advanced-link"><h4>Link '+(i+1)+' · optional envelope</h4><div class="fieldgrid">'+makeInput('advWidth'+i,'In-plane width ('+lenUnit+')',saved[i].w===''?'':(Number(saved[i].w)*oldUnit/u).toString(), '0')+makeInput('advThickness'+i,'Out-of-plane thickness ('+lenUnit+')',saved[i].t===''?'':(Number(saved[i].t)*oldUnit/u).toString(), '0')+'</div><span class="hint">Leave blank to skip physical interference checks for this link.</span></div>').join('');
 $('advancedJointInputs').innerHTML=Array.from({length:c},(_,i)=>'<div class="advanced-link"><h4>Joint '+(i+1)+' · allowable range</h4><div class="fieldgrid">'+makeInput('advMin'+i,'Minimum angle (deg)',saved[i].min,'-360')+makeInput('advMax'+i,'Maximum angle (deg)',saved[i].max,'-360')+'</div></div>').join('');
 buildAdvancedInputs.lastUnit=u;
}
function fkPoints(q,g){return window.scienautRobotics.getForwardKinematics(q,g).pts;}
function minSegmentDistance(p1,p2,p3,p4){
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const on=(a,b,p)=>Math.min(a[0],b[0])-1e-12<=p[0]&&p[0]<=Math.max(a[0],b[0])+1e-12&&Math.min(a[1],b[1])-1e-12<=p[1]&&p[1]<=Math.max(a[1],b[1])+1e-12;
 const c1=cross(p1,p2,p3),c2=cross(p1,p2,p4),c3=cross(p3,p4,p1),c4=cross(p3,p4,p2);
 if(((c1<=0&&c2>=0)||(c1>=0&&c2<=0))&&((c3<=0&&c4>=0)||(c3>=0&&c4<=0))){
  if((c1*c2<0&&c3*c4<0)||(Math.abs(c1)<1e-12&&on(p1,p2,p3))||(Math.abs(c2)<1e-12&&on(p1,p2,p4))||(Math.abs(c3)<1e-12&&on(p3,p4,p1))||(Math.abs(c4)<1e-12&&on(p3,p4,p2)))return 0;
 }
 const pointSegment=(p,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy;if(den<1e-24)return Math.hypot(p[0]-a[0],p[1]-a[1]);const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/den));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy);};
 return Math.min(pointSegment(p1,p3,p4),pointSegment(p2,p3,p4),pointSegment(p3,p1,p2),pointSegment(p4,p1,p2));
}
function jacobianSigma(q,g){
 const c=q.length,pts=fkPoints(q,g),J=[];
 for(let i=0;i<2;i++)J.push(Array.from({length:c},(_,j)=>{let v=0;for(let k=j;k<c;k++)v+=i===0?-(pts[k+1][1]-pts[k][1]):(pts[k+1][0]-pts[k][0]);return v;}));
 if(c===3)J.push([1,1,1]);
 const a=J.map((row,i)=>J.map((other,j)=>row.reduce((sum,v,k)=>sum+v*other[k],0)));
 if(c===2){const tr=a[0][0]+a[1][1],det=a[0][0]*a[1][1]-a[0][1]*a[1][0],disc=Math.sqrt(Math.max(0,tr*tr-4*det));return Math.sqrt(Math.max(0,(tr-disc)/2));}
 // Symmetric 3x3 eigenvalues by Jacobi rotations; sigma_min = sqrt(min eigenvalue(J*J^T)).
 for(let iter=0;iter<24;iter++){
  let p=0,r=1,max=Math.abs(a[0][1]);
  for(const [i,j] of [[0,2],[1,2]])if(Math.abs(a[i][j])>max){max=Math.abs(a[i][j]);p=i;r=j;}
  if(max<1e-12)break;
  const theta=.5*Math.atan2(2*a[p][r],a[r][r]-a[p][p]),cs=Math.cos(theta),sn=Math.sin(theta);
  const app=cs*cs*a[p][p]-2*sn*cs*a[p][r]+sn*sn*a[r][r],arr=sn*sn*a[p][p]+2*sn*cs*a[p][r]+cs*cs*a[r][r];
  for(let k=0;k<3;k++)if(k!==p&&k!==r){const apk=cs*a[p][k]-sn*a[r][k],ark=sn*a[p][k]+cs*a[r][k];a[p][k]=a[k][p]=apk;a[r][k]=a[k][r]=ark;}
  a[p][p]=app;a[r][r]=arr;a[p][r]=a[r][p]=0;
 }
 return Math.sqrt(Math.max(0,Math.min(a[0][0],a[1][1],a[2][2])));
}
function readGeometry(c){
 const scale=unitScale()/1000;
 return Array.from({length:c},(_,i)=>{const raw=$('advWidth'+i).value.trim(),w=raw===''?null:Number(raw)*scale;if(w!==null&&(!Number.isFinite(w)||w<=0))throw Error('Link '+(i+1)+': in-plane width must be positive or left blank.');return{width:w,radius:w===null?null:w/2,thickness:$('advThickness'+i).value.trim()};});
}
function drawCanvas(id,series,options={}){
 const cv=$(id),ctx=cv.getContext('2d'),W=cv.width,H=cv.height,L=52,R=18,T=18,B=36;
 ctx.clearRect(0,0,W,H);ctx.fillStyle='#071522';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#29465c';ctx.fillStyle='#a9bfd3';ctx.font='12px sans-serif';
 if(!series.length){ctx.fillText('Run advanced analysis to generate this plot',L,H/2);return;}
 const all=series.flatMap(s=>s.values).filter(Number.isFinite);if(!all.length){ctx.fillText('No valid data available',L,H/2);return;}
 let xmin=options.xmin??0,xmax=options.xmax??(series[0].values.length-1),ymin=options.ymin??Math.min(0,...all),ymax=options.ymax??Math.max(0,...all);if(ymax-ymin<1e-12){ymax+=1;ymin-=1;}
 const X=i=>L+(W-L-R)*(i-xmin)/(xmax-xmin||1),Y=v=>T+(H-T-B)*(ymax-v)/(ymax-ymin);
 for(let k=0;k<=4;k++){const y=T+(H-T-B)*k/4;ctx.beginPath();ctx.moveTo(L,y);ctx.lineTo(W-R,y);ctx.stroke();ctx.fillText((ymax-(ymax-ymin)*k/4).toPrecision(3),4,y+4);}
 const colors=['#63adff','#12d640','#ffbd59','#ff7070'];
 series.forEach((s,j)=>{ctx.strokeStyle=colors[j%colors.length];ctx.lineWidth=2;ctx.beginPath();s.values.forEach((v,i)=>{const x=X(i),y=Y(v);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();});
 ctx.fillStyle='#a9bfd3';ctx.fillText(options.xLabel||'Sample / time',W/2-35,H-8);
}
function drawWorkspace(rows){
 const cv=$('advWorkspacePlot'),ctx=cv.getContext('2d'),W=cv.width,H=cv.height,L=45,R=18,T=18,B=35;
 ctx.clearRect(0,0,W,H);ctx.fillStyle='#071522';ctx.fillRect(0,0,W,H);
 const xs=rows.map(r=>r.p.x),ys=rows.map(r=>r.p.y),xmin=Math.min(...xs,0),xmax=Math.max(...xs,0),ymin=Math.min(...ys,0),ymax=Math.max(...ys,0),span=Math.max(xmax-xmin,ymax-ymin,1)*1.15,sx=(W-L-R)/span,sy=(H-T-B)/span,scale=Math.min(sx,sy),ox=L+(W-L-R-(xmax-xmin)*scale)/2-xmin*scale,oy=T+(H-T-B-(ymax-ymin)*scale)/2+ymax*scale;
 ctx.strokeStyle='#29465c';ctx.lineWidth=1;for(let k=0;k<=4;k++){const x=L+(W-L-R)*k/4,y=T+(H-T-B)*k/4;ctx.beginPath();ctx.moveTo(x,T);ctx.lineTo(x,H-B);ctx.stroke();ctx.beginPath();ctx.moveTo(L,y);ctx.lineTo(W-R,y);ctx.stroke();}
 ctx.strokeStyle='#12d640';ctx.lineWidth=3;ctx.beginPath();rows.forEach((r,i)=>{const x=ox+r.p.x*scale,y=oy-r.p.y*scale;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
 ctx.fillStyle='#63adff';ctx.beginPath();ctx.arc(ox+rows[0].p.x*scale,oy-rows[0].p.y*scale,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffbd59';ctx.beginPath();ctx.arc(ox+rows[rows.length-1].p.x*scale,oy-rows[rows.length-1].p.y*scale,5,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#a9bfd3';ctx.font='12px sans-serif';ctx.fillText('Start',12,18);ctx.fillStyle='#63adff';ctx.fillRect(48,9,9,9);ctx.fillStyle='#a9bfd3';ctx.fillText('End',68,18);ctx.fillStyle='#ffbd59';ctx.fillRect(94,9,9,9);
}
function run(){
 const api=window.scienautRobotics,res=api&&api.getResult();if(!res){$('advancedStatus').className='status warn';$('advancedStatus').textContent='Run Calculate & plot in Main analysis first.';return;}
 const c=api.getCount(),geo=readGeometry(c),clearance=Number($('advClearance').value),samples=Number($('advSamples').value);
 if(!Number.isFinite(clearance)||clearance<0)throw Error('Required clearance must be zero or greater.');
 const rows=res.rows,limits=Array.from({length:c},(_,i)=>({min:Number($('advMin'+i).value),max:Number($('advMax'+i).value)}));
 limits.forEach((v,i)=>{if(!Number.isFinite(v.min)||!Number.isFinite(v.max)||v.min>=v.max)throw Error('Joint '+(i+1)+': minimum angle must be below maximum angle.');});
 const indices=Array.from({length:samples},(_,i)=>Math.round(i*(rows.length-1)/(samples-1))),sampleRows=indices.map(i=>rows[i]),violations=[];
 sampleRows.forEach((r,k)=>r.q.forEach((q,j)=>{const a=q*180/Math.PI;if(a<limits[j].min-1e-8||a>limits[j].max+1e-8)violations.push({time:r.t,joint:j+1,angle:a,min:limits[j].min,max:limits[j].max});}));
 const sigma=sampleRows.map(r=>jacobianSigma(r.q,res.g)),singularThreshold=1e-5,nearSingular=sigma.filter(v=>v<singularThreshold).length;
 const radii=geo.map(x=>x.radius),canCheck=radii.every(v=>v!==null),clearances=[];
 if(canCheck&&c>=3){
  sampleRows.forEach(r=>{const pts=fkPoints(r.q,res.g);let min=Infinity,pair='';for(let i=0;i<c;i++)for(let j=i+2;j<c;j++){const d=minSegmentDistance(pts[i],pts[i+1],pts[j],pts[j+1])-radii[i]-radii[j];if(d<min){min=d;pair='Link '+(i+1)+' / Link '+(j+1);}}clearances.push({t:r.t,value:min,pair});});
 }else if(canCheck&&c===2){clearances.push({t:0,value:null,pair:'No non-adjacent link pair'});}
 const minClear=clearances.filter(x=>Number.isFinite(x.value)).reduce((a,b)=>!a||b.value<a.value?b:a,null);
 const minR=Math.min(...sampleRows.map(r=>Math.hypot(r.p.x,r.p.y))),maxR=Math.max(...sampleRows.map(r=>Math.hypot(r.p.x,r.p.y))),minSig=Math.min(...sigma);
 $('advRmin').textContent=(minR*1000).toFixed(1)+' mm';$('advRmax').textContent=(maxR*1000).toFixed(1)+' mm';$('advLimitCount').textContent=String(violations.length);$('advSigma').textContent=minSig.toExponential(3);
 drawWorkspace(sampleRows);drawCanvas('advSingularityPlot',[{values:sigma}],{xLabel:'Trajectory sample'});drawCanvas('advClearancePlot',clearances.length&&Number.isFinite(clearances[0].value)?[{values:clearances.map(x=>x.value*1000)}]:[],{xLabel:'Trajectory sample'});
 const lines=['<ul>','<li><b>Trajectory:</b> '+sampleRows.length+' sampled configurations across '+res.T.toFixed(3)+' s.</li>','<li><b>Path radial range:</b> '+(minR*1000).toFixed(2)+' to '+(maxR*1000).toFixed(2)+' mm. This is the path envelope, not the full reachable workspace.</li>','<li><b>Joint limits:</b> '+(violations.length?'<span style="color:#ffbd59">'+violations.length+' sampled violations detected.</span>':'No sampled joint-limit violations.')+'</li>','<li><b>Singularity:</b> minimum Jacobian singular value '+minSig.toExponential(4)+'. Values below '+singularThreshold+' are flagged as near-singular; this threshold is a numerical screening threshold, not a universal robot acceptance criterion.</li>'];
 if(violations.length){const v=violations[0];lines.push('<li>First sampled limit violation: Joint '+v.joint+' at '+v.time.toFixed(3)+' s, '+v.angle.toFixed(2)+'° (allowed '+v.min+'° to '+v.max+'°).</li>');}
 if(!canCheck)lines.push('<li><b>Physical interference:</b> NOT ASSESSED — enter an in-plane width for every link. Kinematics and other advanced checks remain available.</li>');
 else if(c===2)lines.push('<li><b>Physical interference:</b> NOT ASSESSED — the only two links are adjacent and share a joint; this 2D capsule check excludes adjacent-link pairs to avoid false joint-interface collisions.</li>');
 else if(minClear){const contact=minClear.value<0,margin=minClear.value*1000;lines.push('<li><b>Minimum non-adjacent link clearance:</b> '+margin.toFixed(2)+' mm ('+minClear.pair+'). '+(contact?'Envelope overlap detected.':margin<clearance?'Below required clearance.':'Above required clearance.')+'</li>');}
 else lines.push('<li><b>Physical interference:</b> no eligible non-adjacent pair was evaluated.</li>');
 lines.push('<li><b>Resolution limitation:</b> collision clearance was evaluated at '+sampleRows.length+' configurations. A short collision between samples may be missed; increase resolution and verify critical cases in CAD.</li>','<li><b>Geometry model:</b> 2D capsule envelopes based on entered in-plane width and existing link length. No 3D thickness, joint housings, brackets, cables, obstacles or self-contact at adjacent joints.</li>','</ul>');
 $('advancedReport').innerHTML=lines.join('');
 $('advancedStatus').className='status '+(violations.length||(minClear&&minClear.value*1000<clearance)?'warn':'ok');
 $('advancedStatus').textContent='Advanced analysis updated from the current Main analysis trajectory. '+(canCheck?'Optional envelope geometry supplied.':'No link envelope dimensions supplied; geometry-dependent checks are skipped.') ;
 lastAdvanced={minR,maxR,violations,minSig,minClear,canCheck,sampleCount:sampleRows.length};
}
function selectTab(which){
 const main=which==='main';$('primaryTabContent').classList.toggle('hidden',!main);$('advancedTabContent').classList.toggle('hidden',main);
 $('primaryTabButton').classList.toggle('active',main);$('advancedTabButton').classList.toggle('active',!main);
 $('primaryTabButton').setAttribute('aria-selected',String(main));$('advancedTabButton').setAttribute('aria-selected',String(!main));
 if(!main){if(window.scienautRobotics&&window.scienautRobotics.getResult())try{run();}catch(e){$('advancedStatus').className='status warn';$('advancedStatus').textContent=e.message;}}
}
$('primaryTabButton').addEventListener('click',()=>selectTab('main'));$('advancedTabButton').addEventListener('click',()=>selectTab('advanced'));
$('runAdvanced').addEventListener('click',()=>{try{run();}catch(e){$('advancedStatus').className='status warn';$('advancedStatus').textContent=e.message;}});
$('clearAdvancedGeometry').addEventListener('click',()=>{for(let i=0;i<count();i++){ $('advWidth'+i).value='';$('advThickness'+i).value='';}try{run();}catch(e){$('advancedStatus').textContent=e.message;}});
$('robot').addEventListener('change',buildAdvancedInputs);$('units').addEventListener('change',buildAdvancedInputs);
$('calculate').addEventListener('click',()=>{setTimeout(()=>{if(!$('advancedTabContent').classList.contains('hidden'))try{run();}catch(e){$('advancedStatus').className='status warn';$('advancedStatus').textContent=e.message;}},0);});
buildAdvancedInputs();
})();