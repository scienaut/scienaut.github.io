const validEfficiency=x=>Number.isFinite(x)&&x>0&&x<=1;
export function calculateDrive(input){
  const missing=[];
  const {resistance,driveDiameterMm,drumRpm,motorRpm,motorPowerKw,motorEfficiency,gearboxEfficiency,couplingEfficiency,gearRatioMode,manualRatio,
    drumFriction,wrapAngleDeg,slackTensionN,allowableWorkingTensionN,tractionSource,tractionReference}=input;
  const {driveDataSource='user',driveDataReference=''}=input;
  if(!resistance?.complete)missing.push('complete steady resistance result');
  if(!(driveDiameterMm>0))missing.push('drive drum diameter');
  const radiusM=driveDiameterMm/2000;
  const steadyForceN=resistance?.steadyN;
  const peakForceN=Number.isFinite(resistance?.peakN)?resistance.peakN:null;
  const steadyTorqueNm=Number.isFinite(steadyForceN)?steadyForceN*radiusM:null;
  const peakTorqueNm=Number.isFinite(peakForceN)?peakForceN*radiusM:null;
  const speedMps=input.speedMps;
  const steadyMechanicalKw=Number.isFinite(steadyForceN)&&Number.isFinite(speedMps)?steadyForceN*speedMps/1000:null;
  const peakMechanicalKw=Number.isFinite(peakForceN)&&Number.isFinite(speedMps)?peakForceN*speedMps/1000:null;
  if(!validEfficiency(motorEfficiency))missing.push('motor efficiency (0, 1]');
  if(!validEfficiency(gearboxEfficiency))missing.push('gearbox efficiency (0, 1]');
  if(!validEfficiency(couplingEfficiency))missing.push('coupling efficiency (0, 1]');
  if(driveDataSource==='manufacturer'&&!driveDataReference.trim())missing.push('motor / gearbox manufacturer datasheet reference');
  const totalEfficiency=validEfficiency(motorEfficiency)&&validEfficiency(gearboxEfficiency)&&validEfficiency(couplingEfficiency)?motorEfficiency*gearboxEfficiency*couplingEfficiency:null;
  const motorInputKw=Number.isFinite(steadyMechanicalKw)&&steadyMechanicalKw>=0&&totalEfficiency?steadyMechanicalKw/totalEfficiency:null;
  const peakInputKw=Number.isFinite(peakMechanicalKw)&&peakMechanicalKw>=0&&totalEfficiency?peakMechanicalKw/totalEfficiency:null;
  let ratio=null;
  if(gearRatioMode==='manual'){
    if(!(manualRatio>0))missing.push('manual gear reduction ratio');else ratio=manualRatio;
  }else{
    if(!(motorRpm>0))missing.push('motor rated speed for gear ratio');if(!(drumRpm>0))missing.push('non-zero drive drum speed');
    if(motorRpm>0&&drumRpm>0)ratio=motorRpm/drumRpm;
  }
  const motorRatedTorqueNm=motorPowerKw>0&&motorRpm>0?motorPowerKw*9550/motorRpm:null;
  const ratedOutputTorqueNm=motorRatedTorqueNm&&ratio&&validEfficiency(gearboxEfficiency)?motorRatedTorqueNm*ratio*gearboxEfficiency:null;
  const wrapRad=Number.isFinite(wrapAngleDeg)?wrapAngleDeg*Math.PI/180:null;
  let traction=null,tractionMissing=[];
  if(!Number.isFinite(steadyForceN))tractionMissing.push('complete resistance force');
  if(!Number.isFinite(drumFriction)||drumFriction<0)tractionMissing.push('belt-to-drive-drum friction coefficient');
  if(!(Number.isFinite(wrapRad)&&wrapRad>0&&wrapAngleDeg<=360))tractionMissing.push('drive drum wrap angle (0°–360°)');
  if(tractionSource==='manufacturer'&&!tractionReference.trim())tractionMissing.push('manufacturer traction reference');
  const effectiveForceN=Number.isFinite(peakForceN)?peakForceN:steadyForceN;
  if(Number.isFinite(effectiveForceN)&&effectiveForceN<=0)tractionMissing.push('positive pulling force; downhill braking / reverse traction needs a separate model');
  if(!tractionMissing.length){
    const exponent=drumFriction*wrapRad;
    if(exponent===0)tractionMissing.push('positive friction × wrap product for theoretical traction');
    else if(exponent>700)tractionMissing.push('traction exponent outside reliable numerical range');
    else {
      const capstanRatio=Math.exp(exponent),minimumSlackN=effectiveForceN/(capstanRatio-1);
      const slackKnown=Number.isFinite(slackTensionN)&&slackTensionN>=0;
      const slackN=slackKnown?slackTensionN:minimumSlackN, tightN=slackN+effectiveForceN;
      traction={capstanRatio,minimumSlackN,slackN,tightN,effectiveForceN,slackKnown,
        capacityN:(capstanRatio-1)*slackN,marginRatio:((capstanRatio-1)*slackN)/effectiveForceN,
        workingUtilization:Number.isFinite(allowableWorkingTensionN)&&allowableWorkingTensionN>0?tightN/allowableWorkingTensionN:null,
        breakingUtilization:Number.isFinite(input.beltTensileRatingNPerMm)&&input.beltTensileRatingNPerMm>0&&input.beltWidthMm>0
          ?tightN/(input.beltTensileRatingNPerMm*input.beltWidthMm):null};
    }
  }
  return {complete:missing.length===0,missing,steadyForceN,peakForceN,steadyTorqueNm,peakTorqueNm,steadyMechanicalKw,peakMechanicalKw,
    totalEfficiency,motorInputKw,peakInputKw,motorRatedTorqueNm,ratio,ratedOutputTorqueNm,
    rotationalInertiaStatus:'DATA REQUIRED — rotational inertia torque is not included',
    traction,tractionMissing:[...new Set(tractionMissing)],tractionSource,wrapRad,driveDataSource,
    effectiveForceBasis:Number.isFinite(peakForceN)?'peak force including acceleration':'steady-state force (acceleration unavailable)'};
}
