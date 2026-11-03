export function calculateRhsBeam(input){
  const missing=[],{lineLoadNm,spanMm,widthMm,heightMm,wallMm,elasticModulusGPa,yieldStrengthMPa,reference}=input;
  for(const [v,name] of [[lineLoadNm,'uniform line load'],[spanMm,'support span'],[widthMm,'section width'],[heightMm,'section height'],[wallMm,'wall thickness'],[elasticModulusGPa,'elastic modulus'],[yieldStrengthMPa,'yield strength']])if(!(Number.isFinite(v)&&v>0))missing.push(name);
  if(!reference?.trim())missing.push('material grade and section property reference');
  if(missing.length)return {complete:false,missing};
  if(2*wallMm>=Math.min(widthMm,heightMm))return {complete:false,missing:['wall thickness must leave a positive hollow section']};
  const b=widthMm/1000,h=heightMm/1000,t=wallMm/1000,L=spanMm/1000,E=elasticModulusGPa*1e9;
  const bi=b-2*t,hi=h-2*t,I=(b*h**3-bi*hi**3)/12,Z=I/(h/2),M=lineLoadNm*L**2/8,stress=M/Z,deflection=5*lineLoadNm*L**4/(384*E*I);
  return {complete:true,I,Z,maximumMomentNm:M,bendingStressMPa:stress/1e6,deflectionMm:deflection*1000,
    yieldMargin:yieldStrengthMPa/(stress/1e6),limitation:'Simply supported RHS / SHS under uniform vertical load. Local buckling, axial load, lateral stability, legs, welds, joints and support settlement are not checked.'};
}
