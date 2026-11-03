const finitePositive=x=>Number.isFinite(x)&&x>0;
export function calculateShaft(input){
  const missing=[],{radialLoadN,torqueNm,bearingSpanMm,overhangMm,outerDiameterMm,innerDiameterMm,elasticModulusGPa,shearModulusGPa,yieldStrengthMPa,Kt,Kfs,sourceClass,reference}=input;
  for(const [key,name] of [['radialLoadN','pulley radial load'],['torqueNm','shaft torque'],['bearingSpanMm','bearing spacing'],['outerDiameterMm','shaft outside diameter'],['elasticModulusGPa','elastic modulus'],['shearModulusGPa','shear modulus'],['yieldStrengthMPa','yield strength'],['Kt','bending concentration factor'],['Kfs','torsional concentration factor']])if(!finitePositive(input[key]))missing.push(name);
  if(!(Number.isFinite(overhangMm)&&overhangMm>0))missing.push('positive pulley overhang for this beam model');
  if(Number.isFinite(innerDiameterMm)&&innerDiameterMm<0)missing.push('non-negative bore diameter');
  if(sourceClass==='manufacturer'&&!reference?.trim())missing.push('shaft material / factor reference');
  if(missing.length)return {complete:false,missing};
  const ro=outerDiameterMm/2000,ri=(innerDiameterMm??0)/2000,L=bearingSpanMm/1000,e=overhangMm/1000;
  if(ri>=ro)return {complete:false,missing:['bore diameter smaller than outside diameter']};
  const I=Math.PI/4*(ro**4-ri**4),J=Math.PI/2*(ro**4-ri**4),c=ro,E=elasticModulusGPa*1e9,G=shearModulusGPa*1e9;
  const M=radialLoadN*e,T=torqueNm, sigma=Kt*M*c/I,tau=Kfs*T*c/J,vm=Math.sqrt(sigma**2+3*tau**2);
  const leftReactionN=-radialLoadN*e/L,rightReactionN=radialLoadN*(1+e/L);
  const deflectionM=radialLoadN*e**2*(L+e)/(3*E*I),twistRad=T*(L+e)/(G*J);
  return {complete:true,leftReactionN,rightReactionN,bendingMomentNm:M,inertiaM4:I,polarMomentM4:J,bendingStressMPa:sigma/1e6,
    shearStressMPa:tau/1e6,vonMisesMPa:vm/1e6,yieldMargin:yieldStrengthMPa/(vm/1e6),deflectionMm:deflectionM*1000,
    twistDeg:twistRad*180/Math.PI,limitation:'Static overhung-load check only. Fatigue, keyway, fit, critical speed, combined external loads and detailed shaft layout are not checked.'};
}
