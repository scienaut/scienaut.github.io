(function(root,factory){const api=factory();if(typeof module!=="undefined"&&module.exports)module.exports=api;if(root)root.BearingEngine=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const finiteNonNegative=(v,name)=>{const n=Number(v);if(!Number.isFinite(n)||n<0)throw new Error(name+" must be a finite number greater than or equal to zero.");return n;};
  function calculate(i){
    const Fr=finiteNonNegative(i.Fr,"Radial load Fr"),Fa=finiteNonNegative(i.Fa,"Axial load Fa");
    const C=finiteNonNegative(i.C,"Dynamic rating C"),C0=finiteNonNegative(i.C0,"Static rating C0");
    const n=finiteNonNegative(i.n,"Speed"),p=Number(i.p),a1=Number(i.a1);
    if(!(C>0))throw new Error("Dynamic rating C must be greater than zero.");
    if(!(C0>=0))throw new Error("Static rating C0 must be zero (not supplied) or greater than zero.");
    if(!(n>0))throw new Error("Operating speed must be greater than zero to calculate life in hours.");
    if(!(Number.isFinite(p)&&p>0))throw new Error("Life exponent p must be greater than zero.");
    if(!(Number.isFinite(a1)&&a1>0&&a1<=1))throw new Error("Reliability factor a1 must be greater than zero and no greater than 1.");
    let P,P0,loadSteps=[];
    if(i.method==="axial"){
      if(Fr!==0)throw new Error("Axial-only thrust bearing mode requires Fr = 0 N. Select a radial bearing model if radial load is present.");
      P=Fa;P0=Fa;
      loadSteps.push({title:"Equivalent dynamic axial load",equation:"P = Fa",substitution:"P = "+fmt(Fa)+" N",result:P,unit:"N",note:"Axial-only thrust bearing model. Confirm this load model is suitable for the selected thrust bearing."});
      loadSteps.push({title:"Equivalent static axial load",equation:"P0 = Fa",substitution:"P0 = "+fmt(Fa)+" N",result:P0,unit:"N"});
    }else if(i.method==="spherical"){
      const e=finiteNonNegative(i.e,"Threshold factor e"),Y1=finiteNonNegative(i.Y1,"Factor Y1"),Y2=finiteNonNegative(i.Y2,"Factor Y2");
      if(!(Fr>0))throw new Error("Spherical roller combined-load calculation requires Fr greater than zero.");
      const ratio=Fa/Fr,branch=ratio<=e?"below-or-equal":"above";
      P=branch==="below-or-equal"?Fr+Y1*Fa:0.67*Fr+Y2*Fa;
      loadSteps.push({title:"Axial-to-radial load ratio",equation:"Fa / Fr",substitution:fmt(Fa)+" / "+fmt(Fr),result:ratio,unit:"—",note:"Compare with catalogue threshold e = "+fmt(e)+". Selected branch: "+(branch==="below-or-equal"?"Fa/Fr ≤ e":"Fa/Fr > e") +"."});
      loadSteps.push({title:"Equivalent dynamic load",equation:branch==="below-or-equal"?"P = Fr + Y1 × Fa":"P = 0.67 × Fr + Y2 × Fa",substitution:branch==="below-or-equal"?"P = "+fmt(Fr)+" + "+fmt(Y1)+" × "+fmt(Fa):"P = 0.67 × "+fmt(Fr)+" + "+fmt(Y2)+" × "+fmt(Fa),result:P,unit:"N",note:"Spherical roller bearing factors must be taken from the applicable bearing catalogue."});
      const X0=finiteNonNegative(i.X0,"Static factor X0"),Y0=finiteNonNegative(i.Y0,"Static factor Y0");
      P0=X0*Fr+Y0*Fa;
      loadSteps.push({title:"Equivalent static load",equation:"P0 = X0 × Fr + Y0 × Fa",substitution:"P0 = "+fmt(X0)+" × "+fmt(Fr)+" + "+fmt(Y0)+" × "+fmt(Fa),result:P0,unit:"N",note:"Static factors are supplied by the user from the bearing data source."});
    }else{
      const X=finiteNonNegative(i.X,"Dynamic factor X"),Y=finiteNonNegative(i.Y,"Dynamic factor Y");
      const X0=finiteNonNegative(i.X0,"Static factor X0"),Y0=finiteNonNegative(i.Y0,"Static factor Y0");
      P=X*Fr+Y*Fa;P0=X0*Fr+Y0*Fa;
      loadSteps.push({title:"Equivalent dynamic load",equation:"P = X × Fr + Y × Fa",substitution:"P = "+fmt(X)+" × "+fmt(Fr)+" + "+fmt(Y)+" × "+fmt(Fa),result:P,unit:"N",note:"X and Y must be selected using the exact bearing catalogue method, including any e and Fa/C0 criteria."});
      loadSteps.push({title:"Equivalent static load",equation:"P0 = X0 × Fr + Y0 × Fa",substitution:"P0 = "+fmt(X0)+" × "+fmt(Fr)+" + "+fmt(Y0)+" × "+fmt(Fa),result:P0,unit:"N",note:"X0 and Y0 are bearing-specific static factors."});
    }
    if(!(P>0))throw new Error("Equivalent dynamic load P is zero. Enter a non-zero load and verify the load factors.");
    
    const ratio=C/P,L10=Math.pow(ratio,p),L10h=L10*1e6/(60*n),Lna=a1*L10h;
    const s0=(C0>0&&P0>0)?C0/P0:null;
    const target=finiteNonNegative(i.targetLife,"Required life");
    const requiredRevs=target*60*n/1e6;
    const Creq=requiredRevs>0?P*Math.pow(requiredRevs,1/p):0;
    const steps=[...loadSteps,
      {title:"Basic rating life",equation:"L10 = (C / P)^p",substitution:"L10 = ("+fmt(C)+" / "+fmt(P)+")^"+fmt(p),result:L10,unit:"million revolutions",note:"ISO 281 basic rating life. p = 3 for ball bearings and p = 10/3 for roller bearings."},
      {title:"Basic rating life in hours",equation:"L10h = L10 × 10^6 / (60 × n)",substitution:"L10h = "+fmt(L10)+" × 10^6 / (60 × "+fmt(n)+")",result:L10h,unit:"h"},
      {title:"Reliability-adjusted life (a1 only)",equation:"Lna = a1 × L10h",substitution:"Lna = "+fmt(a1)+" × "+fmt(L10h),result:Lna,unit:"h",note:"This is the a1 reliability adjustment only. It is not the full ISO 281 modified rating life Lnm because aISO is not evaluated."},
      {title:"Static safety factor",equation:"s0 = C0 / P0",substitution:C0>0&&P0>0?"s0 = "+fmt(C0)+" / "+fmt(P0):"Static rating C0 or static load P0 not supplied",result:s0===null?0:s0,unit:s0===null?"not evaluated":"—",note:s0===null?"Static safety cannot be evaluated until the exact catalogue C0 and static factors are supplied.":"Compare against the application-specific minimum recommended by the bearing manufacturer; no universal pass threshold is imposed."},
      {title:"Required dynamic rating",equation:"Creq = P × (60 × n × Lrequired / 10^6)^(1/p)",substitution:"Creq = "+fmt(P)+" × (60 × "+fmt(n)+" × "+fmt(target)+" / 10^6)^(1 / "+fmt(p)+")",result:Creq,unit:"N",note:"Minimum basic dynamic rating for the entered load and target L10 life; no reliability or aISO adjustment is included."}
    ];
    const warnings=[];
    if(P>C)warnings.push({kind:"error",text:"Equivalent dynamic load P exceeds dynamic rating C. Check the bearing data and design immediately."});
    if(target>0&&L10h<target)warnings.push({kind:"warn",text:"Calculated L10h is below the required life. Consider a higher C rating, lower load or revised bearing arrangement."});
    else if(target>0)warnings.push({kind:"success",text:"Basic L10h meets or exceeds the entered required life. This is a fatigue-life comparison only."});
    else warnings.push({kind:"warn",text:"No required life entered; target-life compliance has not been evaluated."});
    if(ratio<1)warnings.push({kind:"error",text:"C/P is below 1. The basic rating-life result is not a credible selection basis; review the rating and load."});
    if(i.method!=="axial"&&Fa>0&&((i.method==="xy"&&Number(i.Y)===0)))warnings.push({kind:"warn",text:"Axial load is non-zero but Y = 0. Confirm the catalogue explicitly permits this; otherwise axial load is being ignored in P."});
    if(s0!==null&&s0<1)warnings.push({kind:"error",text:"Static equivalent load exceeds the basic static rating (s0 < 1). Static suitability is not demonstrated."});
    if(s0===null)warnings.push({kind:"warn",text:"Static safety is not evaluated: supply C0 and valid static factors from the bearing catalogue."});
    if(!i.source)warnings.push({kind:"warn",text:"No source recorded for the bearing ratings or factors. Add manufacturer, catalogue and page/reference."});
    if(!i.aISO)warnings.push({kind:"warn",text:"Full ISO 281 modified life Lnm is not calculated. Lubrication, contamination, viscosity ratio and aISO remain outside this release."});
    return {P,P0,C,C0,n,p,a1,L10,L10h,Lna,s0,Creq,target,steps,warnings,loadRatio:ratio,lifePass:target>0?L10h>=target:null};
  }
  function fmt(v){return Number(v).toLocaleString("en-US",{maximumFractionDigits:6});}
  return {calculate,fmt};
});