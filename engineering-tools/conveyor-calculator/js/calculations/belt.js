export function calculateBelt(input) {
  const {method,widthMm,thicknessMm,linearMass,arealMass,density,construction,loopLengthMm,sourceClass,sourceName,sourceUrl}=input;
  let massPerMetre=null, formula='', substitution='', classification=sourceClass==='manufacturer'?'MANUFACTURER DATA':'USER INPUT', missing=[];
  if(method==='manual'){
    formula="m' = entered linear mass"; substitution=`m' = ${linearMass ?? 'DATA REQUIRED'} kg/m`;
    if(!(linearMass>0))missing.push('belt mass per metre'); else massPerMetre=linearMass;
  } else if(method==='areal'){
    formula="m' = mA × W";
    if(!(arealMass>0))missing.push('manufacturer-published areal mass'); else {massPerMetre=arealMass*widthMm/1000;substitution=`m' = ${arealMass} kg/m² × ${widthMm/1000} m`;}
    classification=sourceClass==='manufacturer'?'MANUFACTURER DATA · VERIFICATION REQUIRED':'USER INPUT';
  } else {
    formula="m' = ρ × W × t";
    if(construction!=='Homogeneous')missing.push('homogeneous construction for density estimate');
    if(!(density>0))missing.push('material density');if(!(thicknessMm>0))missing.push('belt thickness');
    if(!missing.length){massPerMetre=density*(widthMm/1000)*(thicknessMm/1000);substitution=`m' = ${density} kg/m³ × ${widthMm/1000} m × ${thicknessMm/1000} m`;}
    classification='ENGINEERING ESTIMATE · USER PROVIDED PROPERTY';
  }
  if(sourceClass==='manufacturer'&&(!sourceName.trim()||!sourceUrl.trim()))missing.push('manufacturer name and datasheet URL/document reference');
  if(sourceClass==='manufacturer'&&sourceName.trim()&&sourceUrl.trim()&&!/^https?:\/\//i.test(sourceUrl.trim()))missing.push('valid manufacturer datasheet URL beginning http:// or https://');
  if(missing.length)return {complete:false,missing,method,formula,classification};
  const totalMassKg=massPerMetre*loopLengthMm/1000;
  return {complete:true,method,formula,substitution,classification,massPerMetre,totalMassKg,loopLengthMm};
}
