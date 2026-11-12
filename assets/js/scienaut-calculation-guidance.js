(function () {
"use strict";
if (window.__scienautGuidanceLoaded) return;
window.__scienautGuidanceLoaded = true;
const path=location.pathname.toLowerCase();
const configs=[
{key:"bolt-fastener-design",title:"Bolt & Fastener Design",steps:[
["Analysis setup","Choose Basic or Detailed mode, unit system, required factor of safety and joint configuration.","#step1"],
["Fastener geometry","Select thread family and diameter. Verify tensile stress area from the thread series and shear area from the actual shear plane.","#step2"],
["Fastener material","Select the correct product property class or Custom. Verify strength against the exact standard, diameter range and certificate.","#step3"],
["Applied loading","Resolve axial tension, in-plane shear and moments into the displayed axes. Do not count an eccentric moment twice.","#step4"],
["Bolt group & eccentricity","Choose the real bolt layout and dimensions. Measure eccentricity from the group centroid to the load line and check its sign.","#step5"],
["Diagrams","Compare plan and side views with the real connection. Verify bolt numbering, force directions, centroid and eccentricity.","#step6"],
["Results & export","Calculate, inspect the governing bolt and each force component, then export CSV or print/save PDF.","#step7"],
["References & limitations","Check the applicable product standard and connection method. Review excluded effects before design release.","#step8"]]},
{key:"conveyor-calculator",title:"Conveyor Engineering",steps:[
["Geometry inputs","Enter pulley centre distance, inclination, vertical rise, belt width, drum diameters and drive speed. These establish the conveyor envelope and belt kinematics.","#geometry"],
["Geometry results & movement","Apply geometry and inspect the side elevation, calculated rise, direction and speed. The movement preview is not a dynamics solver.","#simulator"],
["Belt construction","Choose belt material and construction. Enter mass, thickness, width and supplier ratings from the actual belt datasheet.","#belt-payload"],
["Payload configuration","Enter bulk density, loading cross-section, fill factor and throughput assumptions. These determine carried mass per length and material flow.","#belt-payload"],
["Support & resistance","Define idler/support arrangement, spacing, rotating mass and resistance inputs. Use manufacturer data where available.","#support-resistance"],
["Drive, torque & power","Enter motor, gearbox and drive-drum data. Check belt speed, torque, power, traction and service assumptions.","#drive-system"],
["Mechanical checks","Review shaft, bearing and frame checks only after supplying actual loads, dimensions, properties and catalogue ratings.","#mechanical-design"],
["Project & references","Save inputs, export reports and review standards and source notes. Confirm editions and applicability.","#project-reports"]]},
{key:"shaft-design",title:"Shaft Design & Analysis",steps:[
["Analysis setup","Choose Basic for a uniform shaft/single-load screening or Detailed for stepped sections and multiple loads. Select units first.",null,"01 · Analysis setup"],
["Shaft geometry","Enter overall length, solid/hollow section and diameters. In Detailed mode define each step's start/end and section dimensions.","#inputs"],
["Bearing supports","Set radial support locations and axial locating assumption. Confirm support spacing, overhangs and physical bearing arrangement.",null,"03 · Bearing supports"],
["Point loads & moments","Add each load at its axial position with signed Fy, Fz, Fx and torque. Add bending couples separately; bending moments are not shaft torque.",null,"04 · Applied loads"],
["UDL & UVL","Add distributed-load intervals and signed intensities. UDL is constant; UVL varies linearly between endpoint intensities.","#distributedLoadPanel"],
["Material properties","Select an appropriate grade or enter custom E, G, yield, ultimate and fatigue properties from a traceable source.",null,"06 · Material properties"],
["Analysis options","Set strength/fatigue factors and stiffness limits. Request fatigue checks only when required fatigue data and loading are available.",null,"06 · Analysis options"],
["Results & verification","Review reactions, shear/moment/torque diagrams, stress, fatigue, deflection and twist. Check assumptions and export after verification.",null,"07 · Results"]]},
{key:"slider-crank",title:"Slider-Crank Mechanism",steps:[
["Geometry & operating inputs","Enter crank radius, speed, applied load, guide tilt, factor of safety, shock factor and friction factor. Use justified design inputs.",null,"Input Parameters"],
["Connecting-rod ratio","Compare rod-length ratios. Select based on packaging, side thrust, velocity and acceleration—not a label alone.",null,"Visualization Ratio"],
["Mechanism position","Move the crank-angle control through a full revolution. Check dead centres, slider travel and rod angularity.", "#mechanismPage"],
["Motion & load plots","Inspect displacement, velocity, acceleration, side thrust, friction and torque through the cycle. Confirm signs and peak locations.","#graphsPage"],
["Motor & gearbox","Use peak and mean torque plus target speed to assess drive selection. Verify motor curve, gearbox efficiency, thermal duty and peak capacity.","#motorPage"]]},
{key:"structural-member",title:"Structural Member Calculator",steps:[
["Section geometry","Choose SHS, RHS, CHS or open section and enter actual dimensions and thicknesses. Verify section properties against supplier data where relevant.",null,"Section"],
["Material & design factor","Choose material grade and factor of safety. Verify yield strength, modulus and density for the supplied product condition.",null,"Material"],
["Beam / column loading","Select support and load case, enter member length and load, and set effective-length factor K from actual end restraints.",null,"Beam / Column Load"],
["Welded frame inputs","Define frame shape/dimensions, applied frame load and allowable weld stress from the selected design basis.",null,"Welded Frame"],
["Calculate & inspect","Review bending stress, deflection, section properties, buckling load and design status. Check governing assumptions.","#summaryPage"],
["Compare & plot","Compare candidate sections and inspect graphs/frame results. Confirm dimensions, units and boundary conditions.","#comparePage"]]},
{key:"tolerance-stack-up",title:"1D Tolerance Stack-Up",steps:[
["Stack setup","Choose contributor count and functional output limits. Define output direction and unit before creating component rows.",null,"01 · Stack setup"],
["Component dimensions","For each contributor enter nominal size, upper/lower deviations and whether it adds to or subtracts from functional output.",null,"02 · Component dimensions"],
["Statistical process data","For RSS choose measured mean/sigma, raw measurements or explicit centred ±3σ estimate. Justify independence assumptions.",null,"02 · Component dimensions"],
["Calculate & interpret","Compare worst-case limits with functional limits. Review RSS mean, sigma, predicted distribution and fit status.","#results"],
["Standards & assumptions","Select drawing interpretation framework and record drawing edition/designation. Standards guidance does not replace drawing interpretation.",null,"04 · Standards guidance"]]}
];
const cfg=configs.find(c=>path.includes(c.key));if(!cfg)return;
const css=[
".scienaut-workflow{margin:14px 0 20px;padding:16px 18px;border:1px solid rgba(120,165,195,.28);border-radius:13px;background:linear-gradient(145deg,rgba(15,39,58,.98),rgba(7,22,36,.98));color:inherit;position:relative;z-index:4}",
".scienaut-shaft-layout{display:grid;grid-template-columns:270px minmax(0,1fr);gap:22px;align-items:start;width:min(1500px,calc(100% - 32px));margin:0 auto}",
".scienaut-shaft-sidebar{min-width:0;position:sticky;top:16px;max-height:calc(100vh - 32px);overflow-y:auto;scrollbar-width:thin}",
".scienaut-shaft-sidebar .scienaut-workflow{margin:0;padding:15px 12px}",
".scienaut-shaft-sidebar .scienaut-step-list{display:grid;grid-template-columns:1fr;gap:7px;margin-top:12px}",
".scienaut-shaft-sidebar .scienaut-step{min-height:0;padding:9px 8px}",
".scienaut-shaft-content{min-width:0;width:100%;max-width:1200px;margin:0 auto}",
".scienaut-shaft-content .shell{width:100%}",
"@media(max-width:900px){.scienaut-shaft-layout{grid-template-columns:220px minmax(0,1fr);gap:14px;width:calc(100% - 20px)}}",
"@media(max-width:680px){.scienaut-shaft-layout{display:flex;flex-direction:column;width:calc(100% - 20px)}.scienaut-shaft-sidebar{position:relative;top:auto;max-height:none;width:100%;overflow:visible}.scienaut-shaft-sidebar .scienaut-step-list{grid-template-columns:1fr 1fr}.scienaut-shaft-content{width:100%}}",
".scienaut-workflow h2{font-size:16px;margin:0 0 5px}.scienaut-workflow p{font-size:12px;line-height:1.55;opacity:.78;margin:0}",
".scienaut-step-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:8px;margin-top:13px}",
".scienaut-step{display:flex;gap:9px;align-items:flex-start;text-decoration:none!important;text-align:left;padding:10px;border:1px solid rgba(120,165,195,.22);border-radius:9px;background:rgba(4,17,29,.55);color:inherit!important;min-height:66px}",
".scienaut-step:hover,.scienaut-step:focus{border-color:#23d65b;background:rgba(21,69,53,.3);outline:none}.scienaut-step b{color:#23d65b;font-size:12px;flex:0 0 auto}.scienaut-step strong{display:block;font-size:12px;line-height:1.35}.scienaut-step small{display:block;font-size:10px;line-height:1.4;opacity:.72;margin-top:3px}",
".scienaut-field-help{display:block;font-size:10px;line-height:1.45;color:#91b5d1;margin-top:4px;max-width:70ch}",
".scienaut-help-dot{display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border:1px solid #6f9ab8;border-radius:50%;font-size:10px;font-weight:700;color:#a9d4f1;margin-left:5px;cursor:help;vertical-align:middle}",
".scienaut-tip{position:fixed;z-index:99999;max-width:min(340px,calc(100vw - 24px));padding:11px 13px;border:1px solid #3e6782;border-radius:9px;background:#061827;color:#edf6ff;box-shadow:0 10px 35px #0009;font-size:12px;line-height:1.5;pointer-events:none;display:none}.scienaut-tip strong{display:block;color:#36dc70;margin-bottom:3px}",
"[data-scienaut-anchor]{scroll-margin-top:24px}@media(max-width:650px){.scienaut-workflow{padding:12px}.scienaut-step-list{grid-template-columns:1fr 1fr}.scienaut-step{min-height:0;padding:8px}}@media(max-width:390px){.scienaut-step-list{grid-template-columns:1fr}}"
].join("\n");
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
function targetFor(step){if(step[2]){const x=document.querySelector(step[2]);if(x)return x;}if(step[3]){const q=step[3].toLowerCase();const h=[...document.querySelectorAll("h1,h2,h3,legend")].find(x=>x.textContent.trim().toLowerCase().includes(q));return h?.closest("section,fieldset,.panel,article")||h||null;}return null;}
const guide=document.createElement("section");guide.className="scienaut-workflow";guide.setAttribute("aria-label","Step-by-step calculation instructions");
const h=document.createElement("div");h.innerHTML="<h2>How to use "+cfg.title+"</h2><p>Follow the workflow in order. Hover over or focus an input parameter to see what value is needed and why it matters.</p>";guide.appendChild(h);
const nav=document.createElement("nav");nav.className="scienaut-step-list";nav.setAttribute("aria-label","Calculation steps");
cfg.steps.forEach((s,i)=>{const t=targetFor(s);if(t&&!t.id)t.id="scienaut-step-target-"+(i+1);if(t)t.setAttribute("data-scienaut-anchor","");const a=document.createElement("a");a.className="scienaut-step";a.href=t?"#"+t.id:"#";a.innerHTML="<b>"+String(i+1).padStart(2,"0")+"</b><span><strong>"+s[0]+"</strong><small>"+s[1]+"</small></span>";if(!t){a.setAttribute("aria-disabled","true");a.addEventListener("click",e=>e.preventDefault());}nav.appendChild(a);});guide.appendChild(nav);
const insertion=document.querySelector(".page-wrap")||document.querySelector("main")||document.querySelector(".workspace")||document.body.firstElementChild;
if(cfg.key==="shaft-design"){
 const main=document.querySelector("main");
 if(main){
  const layout=document.createElement("div");layout.className="scienaut-shaft-layout";
  const sidebar=document.createElement("aside");sidebar.className="scienaut-shaft-sidebar";sidebar.setAttribute("aria-label","Shaft calculator workflow");
  const content=document.createElement("div");content.className="scienaut-shaft-content";
  while(main.firstChild)content.appendChild(main.firstChild);
  sidebar.appendChild(guide);layout.append(sidebar,content);main.appendChild(layout);
 }
}else if(cfg.key!=="bolt-fastener-design"&&insertion)insertion.parentNode.insertBefore(guide,insertion);
const reasons={
fos:"Required factor of safety. It sets the strength margin against the selected material limit; choose it from the design basis, not as a material property.",
fosReq:"Required screening factor of safety. It is compared with the calculated margin and must come from the applicable design basis.",
length:"Member or shaft length. It defines the span and lever arms and strongly affects bending moment, deflection and stability.",
"centre-distance":"Distance between drive and tail pulley centres along the frame. It sets conveyor span and contributes to belt path geometry.",
inclination:"Conveyor inclination relative to horizontal. It affects vertical rise and the component of material weight acting along the belt.",
"entered-height":"Project vertical rise from the layout. It is compared with the rise calculated from centre distance and inclination.",
"belt-width":"Nominal belt width. It constrains usable material cross-section and must match the belt and pulley arrangement.",
"drive-diameter":"Drive drum diameter. Together with RPM it determines belt speed and influences torque and traction.",
"tail-diameter":"Tail drum diameter. It defines return-end geometry and must satisfy the belt supplier's minimum pulley diameter.",
"drum-rpm":"Drive drum rotational speed. Together with drum diameter it determines belt linear speed.",
crankRadius:"Crank radius from crankshaft centre to crank pin. It sets half the slider stroke; inline stroke equals twice the radius.",
rpm:"Crankshaft speed. It determines angular velocity and scales mechanism velocity and acceleration.",
totalLoad:"External slider/axial load used by the mechanism model. Use the design load and document its source and direction.",
tiltAngle:"Guide or piston-axis tilt relative to the mechanism reference. It changes side thrust and must match installation geometry.",
shockFactor:"Multiplier for nominal load to represent a documented shock/dynamic allowance. Select from duty or measured dynamics, not guesswork.",
frictionFactor:"Coefficient of friction for the assumed sliding pair. It depends on materials, lubrication, surface finish and operating condition.",
kFactor:"Effective-length factor K for Euler buckling. It represents end restraint and buckling mode; derive it from actual supports.",
depth:"Section depth/height. It controls area and second moment of area, therefore bending stiffness and stress.",
width:"Section width. It contributes to area, centroid and second moment of area.",
diameter:"Outside diameter of the circular hollow section. It controls area, section modulus and bending stiffness.",
thickness:"Wall or web thickness. It affects area, local slenderness, section modulus, mass and stiffness.",
flangeThickness:"Flange thickness. It contributes to section area, centroid and bending inertia.",
support:"Beam support/load case. It selects boundary conditions and load placement used by the beam equations.",
load:"Applied point load or total UDL, depending on selected case. It drives shear and bending demand.",
material:"Material grade. It supplies modulus, strength and/or density; verify product form and condition against its certificate.",
count:"Number of dimensional contributors in the tolerance chain. It determines how many component rows are created.",
reqMin:"Minimum acceptable functional output. It defines the lower functional boundary for worst-case and statistical checks.",
reqMax:"Maximum acceptable functional output. It defines the upper functional boundary for worst-case and statistical checks.",
at:"Thread tensile stress area. Use the value for the exact thread diameter and pitch; it is not generally the nominal shank area.",
as:"Effective area on one shear plane. Confirm whether the plane passes through shank or threaded portion.",
planes:"Number of effective shear planes. Select two only when the physical joint truly provides double shear.",
grip:"Clamped grip length through joined parts and washers. It influences bolt/joint stiffness in more detailed joint models.",
pz:"Axial tensile load normal to the bolt-group plane. It drives direct bolt tension.",
fx:"Applied in-plane shear along X. It is shared among bolts and contributes to eccentric moment when offset.",
fy:"Applied in-plane shear along Y. Its sign defines direction and it contributes to eccentric moment when offset.",
ex:"X offset from bolt-group centroid to applied load line. It combines with force components to create eccentric moment.",
ey:"Y offset from bolt-group centroid to applied load line. It combines with force components to create eccentric moment.",
od:"Shaft outer diameter. It controls bending and torsional section properties; stress is highly sensitive to diameter.",
id:"Shaft inner diameter. For a hollow shaft it reduces area and stiffness and must remain smaller than outer diameter.",
a:"Axial location of bearing A from the shaft reference end. It defines the support span and reaction lever arms.",
b:"Axial location of bearing B from the same reference end. Check spacing and order relative to support A.",
defLimit:"Optional allowable shaft deflection in selected length units. It is used for stiffness comparison, not to change calculated deflection."
};
function explain(label,id,el){if(reasons[id])return reasons[id];const x=(label+" "+id).toLowerCase();if(/diameter|radius|thickness|width|height|depth|length|distance|spacing|position|offset|eccentric|grip/.test(x))return "Enter the drawing-defined or measured geometry in the displayed unit. It defines dimensions, lever arms or section properties used by the model.";if(/load|force|weight|payload|mass|pressure/.test(x))return "Enter the design load for the stated operating case, with correct magnitude, unit and direction. Loads drive reactions, stresses and required capacity.";if(/moment|torque/.test(x))return "Enter the applied couple about the named axis. Its sign sets direction; it contributes to bending or torsional demand according to the model.";if(/material|grade|alloy/.test(x))return "Select the actual material grade/product condition or enter certified properties. Material data controls strength, stiffness and/or mass.";if(/modulus|young|elastic/.test(x))return "Enter elastic modulus from a traceable source. It controls elastic stiffness, deflection and/or twist.";if(/stress|yield|ultimate|proof|allowable|strength/.test(x))return "Enter strength or allowable from the applicable product standard, certificate or design basis. Confirm units and product scope.";if(/speed|rpm|frequency/.test(x))return "Enter operating speed for the design duty. It affects kinematics, dynamic loads, power or fatigue cycles.";if(/angle|inclination|tilt/.test(x))return "Enter the angle relative to the reference direction shown. It resolves geometry and/or force components.";if(/sigma|standard deviation|mean/.test(x))return "Enter process measurement statistics. Mean locates the distribution; standard deviation describes process spread.";if(/factor|fos|safety/.test(x))return "Enter the design factor required by your project or governing standard. It sets the margin for the relevant check.";if(el.tagName==="SELECT")return "Choose the option matching the actual component or design method. This selection controls the engineering model or reference data used.";return "Enter a project-specific value from the drawing, measurement, calculation basis or manufacturer datasheet. Check the displayed unit and sign convention.";
}
const tip=document.createElement("div");tip.className="scienaut-tip";tip.setAttribute("role","tooltip");document.body.appendChild(tip);let active=null;
function show(el){const label=el.dataset.scienautLabel||el.id||"Input parameter",value=el.value!==undefined&&el.value!==""?String(el.value):"Not entered",reason=el.dataset.scienautReason||"";const esc=x=>String(x).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));tip.innerHTML="<strong>"+esc(label)+"</strong><span>Current value: "+esc(value)+"</span><br>"+esc(reason);tip.style.display="block";const r=el.getBoundingClientRect(),w=Math.min(340,innerWidth-24),left=Math.max(12,Math.min(r.left,innerWidth-w-12)),top=r.bottom+165<innerHeight?r.bottom+8:Math.max(12,r.top-155);tip.style.left=left+"px";tip.style.top=top+"px";}
function hide(){tip.style.display="none";active=null;}
document.querySelectorAll("input,select,textarea").forEach(el=>{if(["hidden","button","submit","file"].includes(el.type))return;const lab=(el.id&&document.querySelector('label[for="'+CSS.escape(el.id)+'"]'))||el.closest("label")||el.parentElement?.querySelector("label");const label=lab?lab.textContent.replace(/\s+/g," ").trim():(el.getAttribute("aria-label")||el.name||el.id||"Input parameter"),reason=explain(label,el.id||el.name||"",el);el.dataset.scienautLabel=label;el.dataset.scienautReason=reason;el.setAttribute("aria-label",el.getAttribute("aria-label")||label+". "+reason);if(lab&&!lab.querySelector(".scienaut-help-dot")){const dot=document.createElement("span");dot.className="scienaut-help-dot";dot.textContent="i";dot.setAttribute("aria-hidden","true");dot.title=reason;lab.appendChild(dot);}const field=el.closest(".field,.form-row,.form-field,.form-group,.field-row")||el.parentElement;if(field&&!field.querySelector(".scienaut-field-help")){const help=document.createElement("small");help.className="scienaut-field-help";help.textContent="What to enter & why: "+reason;field.appendChild(help);}el.addEventListener("mouseenter",()=>{active=el;show(el);});el.addEventListener("mouseleave",hide);el.addEventListener("focus",()=>{active=el;show(el);});el.addEventListener("blur",hide);});
document.addEventListener("scroll",()=>{if(active)show(active);},true);
})();