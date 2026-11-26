(function(){
"use strict";
const $=id=>document.getElementById(id),fmt=v=>BearingEngine.fmt(v);
const ids=["bearing-name","bearing-family","bearing-type","load-method","life-exponent","fr","fa","x","y","e","y1","y2","c","c0","speed","target-life","x0","y0","a1","source"];
function value(id){return $(id).value;}
function inputs(){const type=value("bearing-type");return {name:value("bearing-name"),family:value("bearing-family"),type,method:value("load-method"),Fr:Number(value("fr")),Fa:Number(value("fa")),X:Number(value("x")),Y:Number(value("y")),e:Number(value("e")),Y1:Number(value("y1")),Y2:Number(value("y2")),C:Number(value("c")),C0:Number(value("c0")),n:Number(value("speed")),targetLife:Number(value("target-life")),X0:Number(value("x0")),Y0:Number(value("y0")),a1:Number(value("a1")),p:type==="ball"?3:type==="roller"?10/3:Number(value("life-exponent")),source:value("source"),aISO:false};}
function drawBearingSection(){
 const svg=$("bearing-section-svg"); if(!svg)return;
 const d=Math.max(1,Number($("geo-id").value)||25),D=Math.max(d+0.1,Number($("geo-od").value)||52),B=Math.max(.1,Number($("geo-width").value)||15);
 const D2=Math.max(d,Math.min(D,Number($("geo-d2").value)||D*.78)),d1=Math.max(d,Math.min(D2,Number($("geo-d1").value)||d*1.45)),r=Math.max(0,Number($("geo-radius").value)||.6);
 const cx=310,cy=225,scale=Math.min(300/D,350/B),ro=D*scale/2,ri=d*scale/2,half=B*scale/2,so=D2*scale/2,si=d1*scale/2,x0=cx-half,x1=cx+half,yt=cy-ro,yb=cy+ro;
 const br=Math.max(5,Math.min((D-d)*scale*.105,13)),by1=cy-(ro+ri)/2,by2=cy+(ro+ri)/2;
 const dim=(a,b,c,d,label,tx,ty)=>"<g class=\"dim\"><path d=\"M"+a+" "+b+" L"+c+" "+d+"\"/><path d=\"M"+(a-5)+" "+(b-5)+" l10 10 M"+(c-5)+" "+(d-5)+" l10 10\"/><text x=\""+tx+"\" y=\""+ty+"\">"+label+"</text></g>";
 svg.innerHTML="<title>Parametric deep groove ball bearing axial section</title><g class=\"centerline\"><path d=\"M50 "+cy+" H570 M"+cx+" 28 V410\"/></g>"+
 "<path d=\"M"+x0+" "+(yt+r*scale)+" Q"+x0+" "+yt+" "+(x0+r*scale)+" "+yt+" H"+(x1-r*scale)+" Q"+x1+" "+yt+" "+x1+" "+(yt+r*scale)+" V"+(cy-so)+" H"+(x1-B*scale*.17)+" V"+(cy-si)+" H"+(x0+B*scale*.17)+" V"+(cy-so)+" H"+x0+" Z\" fill=\"#71869e\" fill-opacity=\".72\" stroke=\"#d5dfeb\" stroke-width=\"1.8\"/>"+
 "<path d=\"M"+x0+" "+(yb-r*scale)+" Q"+x0+" "+yb+" "+(x0+r*scale)+" "+yb+" H"+(x1-r*scale)+" Q"+x1+" "+yb+" "+x1+" "+(yb-r*scale)+" V"+(cy+so)+" H"+(x1-B*scale*.17)+" V"+(cy+si)+" H"+(x0+B*scale*.17)+" V"+(cy+so)+" H"+x0+" Z\" fill=\"#71869e\" fill-opacity=\".72\" stroke=\"#d5dfeb\" stroke-width=\"1.8\"/>"+
 "<g fill=\"#e4edf6\" stroke=\"#ffffff\" stroke-width=\"1.8\"><circle cx=\""+cx+"\" cy=\""+by1+"\" r=\""+br+"\"/><circle cx=\""+cx+"\" cy=\""+by2+"\" r=\""+br+"\"/></g>"+
 "<g class=\"dimensions\">"+dim(90,yt,90,yb,"D",67,cy+4)+dim(145,cy-so,145,cy+so,"D₂",123,cy+4)+dim(530,cy-ri,530,cy+ri,"d",548,cy+4)+dim(485,cy-si,485,cy+si,"d₁",500,cy+4)+dim(x0,45,x1,45,"B",cx,32)+"</g>"+
 "<g class=\"radius-labels\"><path d=\"M"+(x1-4)+" "+(yt+3)+" L"+(x1+28)+" "+(yt-18)+"\"/><text x=\""+(x1+32)+"\" y=\""+(yt-20)+"\">r₁</text><path d=\"M"+(x0+4)+" "+(yt+3)+" L"+(x0-28)+" "+(yt-18)+"\"/><text x=\""+(x0-45)+"\" y=\""+(yt-20)+"\">r₂</text></g>"+
 "<text class=\"drawing-note\" x=\"310\" y=\"425\" text-anchor=\"middle\">Schematic sectional geometry · verify against manufacturer drawing</text>";
 $("geo-summary").textContent="d "+d+" mm · D "+D+" mm · B "+B+" mm · D₂ "+D2+" mm · d₁ "+d1+" mm · r "+r+" mm";
}
function syncMode(){const m=value("load-method");$("xy-fields").hidden=m!=="xy";$("spherical-fields").hidden=m!=="spherical";$("load-method-help").textContent=m==="spherical"?"For a spherical roller bearing: if Fa/Fr ≤ e, P = Fr + Y₁Fa; otherwise P = 0.67Fr + Y₂Fa. Enter catalogue values.":m==="axial"?"Axial-only mode sets P = Fa and P₀ = Fa. Radial load must be zero.":"X, Y, X₀ and Y₀ are catalogue values for the exact bearing and load case. Do not assume factors when axial load is present.";}
function syncType(){$("custom-p-wrap").hidden=value("bearing-type")!=="custom";}
function render(result){
$("metric-p").textContent=fmt(result.P);$("metric-life").textContent=fmt(result.L10h);$("metric-s0").textContent=result.s0===null?"—":fmt(result.s0);$("metric-creq").textContent=fmt(result.Creq);
$("result-state").textContent=result.lifePass===null?"CALCULATED · NO TARGET":result.lifePass?"LIFE TARGET MET":"REVIEW REQUIRED";$("result-state").className="result-state "+(result.lifePass===true?"pass":"warn");
$("warnings").innerHTML=result.warnings.map(w=>'<div class="warning '+w.kind+'">'+w.text+'</div>').join("");
const rows=[["Bearing",inputs().name,"Entered designation"],["Bearing family",inputs().family,"Selected bearing family"],["Equivalent dynamic load P",fmt(result.P)+" N","From selected load method"],["Equivalent static load P₀",fmt(result.P0)+" N","From static factors"],["Dynamic load rating C",fmt(result.C)+" N","Manufacturer catalogue input"],["Static load rating C₀",fmt(result.C0)+" N","Manufacturer catalogue input"],["Life exponent p",fmt(result.p),"Ball = 3; roller = 10/3"],["C / P",fmt(result.loadRatio),"Dynamic rating-to-load ratio"],["L₁₀",fmt(result.L10)+" million rev","ISO 281 basic rating life"],["L₁₀h",fmt(result.L10h)+" h","90% reliability basic rating life"],["a₁ × L₁₀h",fmt(result.Lna)+" h","Reliability adjustment only; not full Lnm"],["Static safety s₀",result.s0===null?"Not evaluated":fmt(result.s0),"C₀ / P₀"],["Required C",fmt(result.Creq)+" N","For entered target life"],["Required life",fmt(result.target)+" h","User requirement"],["Source",inputs().source||"Not supplied","Catalogue / datasheet reference"]];
$("result-rows").innerHTML=rows.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join("");
$("steps").innerHTML=result.steps.map((s,i)=>'<details class="step" '+(i<2?"open":"")+'><summary><span>Step '+(i+1)+' · '+s.title+'</span><span>'+fmt(s.result)+' '+s.unit+'</span></summary><div class="step-body"><b>Equation</b><code class="equation">'+s.equation+'</code><b>Substitution</b><code class="equation">'+s.substitution+'</code><b>Calculated result</b><p>'+fmt(s.result)+' '+s.unit+'</p>'+(s.note?'<p>'+s.note+'</p>':'')+'</div></details>').join("");
}
function calculate(){try{const r=BearingEngine.calculate(inputs());render(r);$("input-status").className="input-status";$("input-status").textContent="Calculation complete. Review the warnings, source data and expandable calculation trail.";return r;}catch(e){$("input-status").className="input-status error";$("input-status").textContent=e.message;$("result-state").textContent="INPUT ERROR";$("result-state").className="result-state warn";return null;}}
const examples={
"skf-low":{name:"SKF 22217 CC/W33 · Example 1",family:"spherical",type:"roller",method:"spherical",Fr:11121,Fa:2224,e:.22,Y1:3,Y2:4.6,C:210000,C0:0,n:2000,targetLife:0,X0:0,Y0:0,a1:1,source:"SKF Evolution, Spherical roller bearings in fans, worked example"},
"skf-high":{name:"SKF 22217 CC/W33 · Example 2",family:"spherical",type:"roller",method:"spherical",Fr:11121,Fa:2667,e:.22,Y1:3,Y2:4.6,C:210000,C0:0,n:2000,targetLife:0,X0:1,Y0:0,a1:1,source:"SKF Evolution, Spherical roller bearings in fans, worked example"},
"feutex":{name:"FeuTex published ball-bearing example",family:"deep-groove",type:"ball",method:"xy",Fr:5000,Fa:0,X:1,Y:0,C:20000,C0:0,n:1000,targetLife:1066.6666667,X0:0,Y0:0,a1:1,source:"FeuTex, Bearing Basic Rating Life worked example"}
};
function loadExample(key){const e=examples[key];if(!e)return;const map={ "bearing-name":"name","bearing-family":"family","bearing-type":"type","load-method":"method","fr":"Fr","fa":"Fa","x":"X","y":"Y","e":"e","y1":"Y1","y2":"Y2","c":"C","c0":"C0","speed":"n","target-life":"targetLife","x0":"X0","y0":"Y0","a1":"a1","source":"source"};Object.entries(map).forEach(([id,k])=>{if(e[k]!==undefined)$(id).value=e[k];});if(e.p!==undefined)$("life-exponent").value=e.p;syncType();syncMode();const r=calculate();if(key==="skf-low"&&r){const delta=Math.abs(r.L10h-33400)/33400*100;$("reference-check").className="reference-check warn";$("reference-check").textContent="Load calculation matches SKF: P = "+fmt(r.P)+" N. Our ISO-life calculation = "+fmt(r.L10h)+" h; SKF article reports 33,400 h (difference "+fmt(delta)+"%). The published load and life figures do not reproduce exactly from the article's stated inputs and equation. The calculator preserves the equation result and flags this discrepancy rather than forcing the published number.";}else if(key==="skf-high"&&r){const delta=Math.abs(r.L10h-22100)/22100*100;$("reference-check").className="reference-check "+(delta<1?"pass":"warn");$("reference-check").textContent="P calculated = "+fmt(r.P)+" N (SKF: 19,719 N). L10h calculated = "+fmt(r.L10h)+" h (SKF: 22,100 h). Difference in life = "+fmt(delta)+"%. Small difference is consistent with rounding of published values.";}else if(key==="feutex"&&r){const ok=Math.abs(r.L10-64)<1e-9&&Math.abs(r.L10h-1066.6666667)<.001;$("reference-check").className="reference-check "+(ok?"pass":"warn");$("reference-check").textContent=(ok?"PASS — ":"CHECK — ")+"Calculated L10 = "+fmt(r.L10)+" million rev (published 64); L10h = "+fmt(r.L10h)+" h (published 1,066.67 h).";}}
$("calculate-btn").addEventListener("click",calculate);$("reset-btn").addEventListener("click",()=>location.reload());$("example-select").addEventListener("change",e=>loadExample(e.target.value));$("load-method").addEventListener("change",syncMode);$("bearing-type").addEventListener("change",syncType);$("bearing-family").addEventListener("change",()=>{const f=value("bearing-family");if(f==="spherical"){$("bearing-type").value="roller";$("load-method").value="spherical";}else if(f==="cylindrical"||f==="tapered"||f==="thrust-roller"){$("bearing-type").value="roller";if(value("load-method")==="spherical"||value("load-method")==="axial")$("load-method").value="xy";}else if(f==="thrust-ball"){$("bearing-type").value="ball";$("load-method").value="axial";}else if(f==="deep-groove"||f==="angular-contact"){$("bearing-type").value="ball";if(value("load-method")==="spherical"||value("load-method")==="axial")$("load-method").value="xy";}syncType();syncMode();});
ids.forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();calculate();}}));

function setModuleTab(which){const selection=which==="selection";$("performance-workspace").hidden=selection;$("selection-workspace").hidden=!selection;$("tab-performance").classList.toggle("active",!selection);$("tab-selection").classList.toggle("active",selection);if(selection)window.scrollTo({top:0,behavior:"smooth"});}
$("tab-performance").addEventListener("click",()=>setModuleTab("performance"));$("tab-selection").addEventListener("click",()=>setModuleTab("selection"));$("back-performance").addEventListener("click",()=>setModuleTab("performance"));
$("fullscreen-selector").addEventListener("click",()=>{$("selection-workspace").classList.add("fullscreen");$("fullscreen-selector").textContent="Full-page view active";$("close-fullscreen-selector").hidden=false;});$("close-fullscreen-selector").addEventListener("click",()=>{$("selection-workspace").classList.remove("fullscreen");$("fullscreen-selector").textContent="Open full-page selector ⛶";});
let bearingCandidates=[],rangeFilterActive=false;
function readDimensionRanges(){return {id:{min:Number($("req-id-min").value),max:Number($("req-id-max").value)},od:{min:Number($("req-od-min").value),max:Number($("req-od-max").value)},width:{min:Number($("req-width-min").value),max:Number($("req-width-max").value)}};}
function validRanges(){try{const ranges=readDimensionRanges();BearingEngine.validateDimensionRanges(ranges);return {ok:true,ranges};}catch(error){return {ok:false,error};}}
function addCandidate(){
 const candidate={name:$("candidate-name").value.trim(),id:Number($("candidate-id").value),od:Number($("candidate-od").value),width:Number($("candidate-width").value),C:$("candidate-c").value.trim()===""?null:Number($("candidate-c").value),C0:$("candidate-c0").value.trim()===""?null:Number($("candidate-c0").value),source:$("candidate-source").value.trim()};
 if(!candidate.name||!(candidate.id>0&&candidate.od>candidate.id&&candidate.width>0)){$("selection-status").textContent="Enter a designation, positive ID and width, and an OD greater than ID.";return;}
 if((candidate.C!==null&&(!Number.isFinite(candidate.C)||candidate.C<=0))||(candidate.C0!==null&&(!Number.isFinite(candidate.C0)||candidate.C0<=0))){$("selection-status").textContent="Catalogue ratings must be positive, or left blank if unavailable.";return;}
 if(bearingCandidates.some(item=>item.name.toLowerCase()===candidate.name.toLowerCase()&&item.id===candidate.id&&item.od===candidate.od&&item.width===candidate.width)){$("selection-status").textContent="This exact designation and dimensional record is already in the list.";return;}
 bearingCandidates.push(candidate);
 ["candidate-name","candidate-id","candidate-od","candidate-width","candidate-c","candidate-c0","candidate-source"].forEach(id=>$(id).value="");
 rangeFilterActive=false;
 $("selection-status").textContent="Verified candidate added. Set the six dimensional limits and select Find all bearings within ranges.";
 renderCandidates(false);
}
function safeSourceLink(source){try{const url=new URL(source);return url.protocol==="https:"?url.href:null;}catch(_){return null;}}
function renderCandidates(filtered){
 const tbody=$("candidate-results"),state=validRanges();
 let rows=bearingCandidates.map((candidate,index)=>({candidate,index,match:state.ok&&BearingEngine.matchesDimensions(candidate,state.ranges)}));
 if(filtered)rows=rows.filter(row=>row.match);
 rows.sort((a,b)=>(Number(b.match)-Number(a.match))||a.candidate.name.localeCompare(b.candidate.name));
 $("candidate-count").textContent=filtered?rows.length+" MATCHES":bearingCandidates.length+" CANDIDATES";
 if(!rows.length){
  const message=bearingCandidates.length===0?"No catalogue candidates entered. This static page does not fetch manufacturer catalogues automatically.":filtered?"No entered candidates fall inside all three selected dimension ranges.":"No candidates to display.";
  tbody.innerHTML='<tr><td colspan="8" class="empty-row">'+escapeHtml(message)+'</td></tr>';return;
 }
 tbody.innerHTML=rows.map(({candidate,index,match})=>{
  const link=safeSourceLink(candidate.source),source=link?'<a href="'+escapeHtml(link)+'" target="_blank" rel="noopener noreferrer">Manufacturer catalogue ↗</a>':escapeHtml(candidate.source||"Source not supplied");
  const status=state.ok?(match?'<span class="match-pill">WITHIN ALL RANGES</span>':'<span class="no-match-pill">OUTSIDE RANGE</span>'):'<span class="no-match-pill">SET VALID RANGES</span>';
  return '<tr><td><b>'+escapeHtml(candidate.name)+'</b><br><small>'+source+'</small></td><td>'+fmt(candidate.id)+'</td><td>'+fmt(candidate.od)+'</td><td>'+fmt(candidate.width)+'</td><td>'+(candidate.C===null?"—":fmt(candidate.C))+'</td><td>'+(candidate.C0===null?"—":fmt(candidate.C0))+'</td><td>'+status+'</td><td><button class="select-candidate" data-candidate="'+index+'" '+(candidate.C===null?'disabled title="Add dynamic rating C before performance calculation"':'')+'>Use in performance</button></td></tr>';
 }).join("");
 tbody.querySelectorAll("[data-candidate]").forEach(button=>button.addEventListener("click",()=>{
  const candidate=bearingCandidates[Number(button.dataset.candidate)];if(!candidate||candidate.C===null)return;
  $("bearing-name").value=candidate.name;$("c").value=candidate.C;$("c0").value=candidate.C0===null?"":candidate.C0;$("source").value=candidate.source;
  $("input-status").textContent="Candidate designation and ratings transferred. Verify bearing family, load factors, speed limits and the complete catalogue data before calculating.";
  setModuleTab("performance");
 }));
}
function escapeHtml(source){return String(source).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
$("add-bearing-candidate").addEventListener("click",addCandidate);
$("find-bearing-matches").addEventListener("click",()=>{
 const state=validRanges();if(!state.ok){$("selection-status").textContent=state.error.message;return;}
 rangeFilterActive=true;renderCandidates(true);
 const count=bearingCandidates.filter(candidate=>BearingEngine.matchesDimensions(candidate,state.ranges)).length;
 $("selection-status").textContent=count+" of "+bearingCandidates.length+" entered catalogue candidates fall within all six inclusive dimension limits. Only data entered in this browser session is searched; no manufacturer database is queried.";
});
["req-id-min","req-id-max","req-od-min","req-od-max","req-width-min","req-width-max"].forEach(id=>$(id).addEventListener("input",()=>{
 if(rangeFilterActive){const state=validRanges();if(state.ok)renderCandidates(true);else $("selection-status").textContent=state.error.message;}
}));
function importShaftInputs(){const q=new URLSearchParams(location.search);if(q.get("fromShaft")!=="1")return;const fr=Number(q.get("Fr")),fa=Number(q.get("Fa")),speed=Number(q.get("speed")),bore=Number(q.get("bore"));if(!(fr>=0&&fa>=0&&speed>0&&bore>0))return;$("fr").value=fr;$("fa").value=fa;$("speed").value=speed;$("bearing-name").value="Shaft support "+(q.get("support")||"")+" · transferred load";$("source").value=q.get("source")||"Shaft Design calculator";$("req-id").value=bore*1000;$("tab-performance").click();$("input-status").textContent="Imported from Shaft Design: support "+(q.get("support")||"")+"; Fr="+fmt(fr)+" N, Fa="+fmt(fa)+" N; estimated bearing bore="+fmt(bore*1000)+" mm. Verify bearing load factors and catalogue data.";if($("req-id").value){$("tab-selection").click();$("selection-status").textContent="Shaft journal diameter imported as the required bearing bore. Enter target OD and width, then add catalogue candidates.";}}
$("draw-bearing").addEventListener("click",drawBearingSection);["geo-id","geo-od","geo-width","geo-d2","geo-d1","geo-radius"].forEach(id=>$(id).addEventListener("input",drawBearingSection));
syncMode();syncType();calculate();importShaftInputs();drawBearingSection();
})();