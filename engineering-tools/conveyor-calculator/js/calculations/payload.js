export function calculatePayload(input) {
  const {mode,totalKg,linearKgM,throughputKgH,speedMps,centreDistanceMm,loadedLengthMm,boxCount,boxMass,boxLengthMm,boxWidthMm,beltWidthMm,boxSpacingMm,distribution}=input;
  const effectiveLengthMm=loadedLengthMm;
  const lengthM=effectiveLengthMm/1000;
  let linearLoadingKgM=null,payloadKg=null,formula='',substitution='',missing=[];
  if(mode==='total'){
    formula='q = Mp / Lloaded';
    if(!(totalKg>0))missing.push('total payload currently carried');if(!(lengthM>0))missing.push('loaded conveyor length');
    if(!missing.length){payloadKg=totalKg;linearLoadingKgM=totalKg/lengthM;substitution=`q = ${totalKg} kg / ${lengthM} m`;}
  }else if(mode==='linear'){
    formula='Mp = q × Lloaded';
    if(!(linearKgM>0))missing.push('linear material loading');if(!(lengthM>0))missing.push('loaded conveyor length');
    if(!missing.length){linearLoadingKgM=linearKgM;payloadKg=linearKgM*lengthM;substitution=`Mp = ${linearKgM} kg/m × ${lengthM} m`;}
  }else{
    formula='q = Q / (3600 × V)';
    if(!(throughputKgH>0))missing.push('material throughput');if(!(speedMps>0))missing.push('non-zero belt speed');if(!(lengthM>0))missing.push('loaded conveyor length');
    if(!missing.length){linearLoadingKgM=throughputKgH/(3600*speedMps);payloadKg=linearLoadingKgM*lengthM;substitution=`q = ${throughputKgH} kg/h / (3600 × ${speedMps.toFixed(4)} m/s)`;}
  }
  let boxWarning='';
  if(distribution==='discrete'){
    if(boxCount!=null&&(!Number.isInteger(boxCount)||boxCount<1))boxWarning='Box count must be a positive whole number.';
    else if(boxCount>0&&boxLengthMm>0&&boxCount*boxLengthMm+(boxCount-1)*(boxSpacingMm??0)>effectiveLengthMm)boxWarning='Boxes and clear gaps exceed the loaded length.';
    else if(boxWidthMm>beltWidthMm&&boxWidthMm>0)boxWarning='Box width exceeds belt width.';
    else if(boxMass>0&&payloadKg>0&&boxCount>0&&Math.abs(boxCount*boxMass-payloadKg)>Math.max(0.01,payloadKg*.01))boxWarning='Box mass × count differs from the selected authoritative payload. Box mass is not added again.';
  }
  if(missing.length)return {complete:false,missing,mode,formula,boxWarning};
  const payloadWeightN=payloadKg*9.80665;
  return {complete:true,mode,formula,substitution,linearLoadingKgM,payloadKg,payloadWeightN,effectiveLengthMm,
    payloadPerBoxKg:boxCount>0?payloadKg/boxCount:null,
    throughputKgH:linearLoadingKgM*3600*speedMps,
    loadedBeltMassKg:payloadKg,boxWarning};
}
