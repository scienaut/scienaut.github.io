const G=9.80665; // conventional standard gravity, m/s²
const finiteNonnegative=x=>Number.isFinite(x)&&x>=0;

function sideResistance(side,name,normalN,missing){
  if(!side?.type){missing.push(`${name} support arrangement`);return null;}
  if(side.sourceClass==='manufacturer'&&!side.reference.trim())missing.push(`${name} support manufacturer / measurement reference`);
  if(side.type==='idler'){
    if(side.method==='coefficient'){
      if(!finiteNonnegative(side.coefficient))missing.push(`${name} idler equivalent running-resistance coefficient`);
      return finiteNonnegative(side.coefficient)?{forceN:side.coefficient*normalN,normalN,model:'Equivalent idler running resistance',coefficient:side.coefficient}:null;
    }
    if(!finiteNonnegative(side.dragN))missing.push(`${name} measured or manufacturer idler drag`);
    return finiteNonnegative(side.dragN)?{forceN:side.dragN,normalN,model:'Entered total idler drag'}:null;
  }
  if(side.type==='skid'){
    if(!finiteNonnegative(side.coefficient))missing.push(`${name} belt-to-skid dynamic friction coefficient`);
    if(!(Number.isInteger(side.strips)&&side.strips>0))missing.push(`${name} skid strip count`);
    if(!(side.stripWidthMm>0))missing.push(`${name} skid strip width`);
    if(!(side.contactLengthMm>0))missing.push(`${name} effective skid contact length`);
    if(!finiteNonnegative(side.coefficient)||!(Number.isInteger(side.strips)&&side.strips>0)||!(side.stripWidthMm>0)||!(side.contactLengthMm>0))return null;
    const areaM2=side.strips*(side.stripWidthMm/1000)*(side.contactLengthMm/1000);
    return {forceN:side.coefficient*normalN,normalN,model:'Belt-to-skid sliding friction',coefficient:side.coefficient,areaM2,pressurePa:normalN/areaM2};
  }
  missing.push(`${name} supported by idlers or skid plate`);return null;
}

export function calculateResistance(input){
  const missing=[];
  const {centreDistanceMm,inclinationDeg,beltLinearMassKgM,payloadKg,speedMps,carrying,returnSide,accessoryN,accelerationTimeS,direction}=input;
  if(!(centreDistanceMm>0))missing.push('conveyor centre distance');
  if(!(Number.isFinite(beltLinearMassKgM)&&beltLinearMassKgM>0))missing.push('belt linear mass');
  if(!(Number.isFinite(payloadKg)&&payloadKg>=0))missing.push('authoritative payload mass');
  if(!(Number.isFinite(speedMps)&&speedMps>=0))missing.push('belt speed');
  if(!finiteNonnegative(accessoryN))missing.push('additional accessory resistance (enter 0 if none)');
  if(inclinationDeg>0&&!['uphill','downhill'].includes(direction))missing.push('payload travel direction on incline');
  const theta=inclinationDeg*Math.PI/180,runM=centreDistanceMm/1000;
  const beltRunMassKg=Number.isFinite(beltLinearMassKgM)?beltLinearMassKgM*runM:null;
  const carryNormalN=beltRunMassKg==null||!Number.isFinite(payloadKg)?null:(beltRunMassKg+payloadKg)*G*Math.cos(theta);
  const returnNormalN=beltRunMassKg==null?null:beltRunMassKg*G*Math.cos(theta);
  const carry=sideResistance(carrying,'Carrying',carryNormalN??0,missing);
  const ret=sideResistance(returnSide,'Return',returnNormalN??0,missing);
  const uniqueMissing=[...new Set(missing)];
  if(uniqueMissing.length)return {complete:false,missing:uniqueMissing};
  const gravityMagnitudeN=payloadKg*G*Math.sin(theta);
  const gravityN=inclinationDeg===0?0:direction==='uphill'?gravityMagnitudeN:-gravityMagnitudeN;
  const steadyN=gravityN+carry.forceN+ret.forceN+accessoryN;
  const movingMassKg=beltLinearMassKgM*(2*runM)+payloadKg;
  const accelerationReady=Number.isFinite(accelerationTimeS)&&accelerationTimeS>0;
  const accelerationMps2=accelerationReady?speedMps/accelerationTimeS:null;
  const accelerationN=accelerationReady?movingMassKg*accelerationMps2:null;
  const peakN=accelerationReady?steadyN+accelerationN:null;
  return {complete:true,missing:accelerationReady?[]:['acceleration time for peak pulling force'],gravityMagnitudeN,gravityN,
    carrying:carry,returnSide:ret,accessoryN,steadyN,movingMassKg,accelerationMps2,accelerationN,peakN,
    carryingPowerW:carry.forceN*speedMps,returnPowerW:ret.forceN*speedMps,totalSteadyPowerW:steadyN*speedMps,
    geometryAssumption:'Payload is treated as traveling uphill/downhill as selected; belt-run mass is split equally between carrying and return runs.'};
}
