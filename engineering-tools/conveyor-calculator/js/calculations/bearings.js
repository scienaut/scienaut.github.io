export function calculateBearing(input){
  const missing=[],{type,CN,C0N,FrN,FaN,speedRpm,X,Y,X0,Y0,reference}=input;
  for(const [v,name] of [[CN,'dynamic rating C'],[C0N,'static rating C0'],[FrN,'radial load'],[FaN,'axial load'],[speedRpm,'bearing speed'],[X,'dynamic factor X'],[Y,'dynamic factor Y'],[X0,'static factor X0'],[Y0,'static factor Y0']])if(!(Number.isFinite(v)&&v>=0))missing.push(name);
  if(!(CN>0))missing.push('positive dynamic rating');if(!(C0N>0))missing.push('positive static rating');if(!(speedRpm>0))missing.push('non-zero bearing speed');
  if(!reference?.trim())missing.push('bearing designation and manufacturer catalogue reference');
  if(missing.length)return {complete:false,missing:[...new Set(missing)]};
  const p=type==='roller'?10/3:3,P=X*FrN+Y*FaN,P0=X0*FrN+Y0*FaN;
  if(!(P>0))missing.push('positive equivalent dynamic load');if(!(P0>0))missing.push('positive equivalent static load');
  if(missing.length)return {complete:false,missing};
  const lifeMillionRevs=(CN/P)**p,lifeHours=1e6/(60*speedRpm)*lifeMillionRevs,staticSafety=C0N/P0;
  return {complete:true,p,equivalentDynamicN:P,equivalentStaticN:P0,lifeMillionRevs,lifeHours,staticSafety,
    limitation:'Uses entered X, Y, X0, Y0 factors and ratings. Lubrication, contamination, reliability adjustment, fit and temperature are not assessed.'};
}
