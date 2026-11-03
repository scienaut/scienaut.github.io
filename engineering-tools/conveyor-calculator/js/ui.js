import { fmt } from './units.js';

const $ = id => document.getElementById(id);

export function renderSummary(input, result) {
  $('metric-length').innerHTML = `${fmt(input.centreDistanceMm, 0)} <small>mm</small>`;
  $('metric-angle').innerHTML = `${fmt(input.inclinationDeg, 1)} <small>°</small>`;
  $('metric-rise').innerHTML = `${fmt(result.riseMm, 1)} <small>mm</small>`;
  $('metric-speed').innerHTML = `${fmt(result.beltSpeedMps, 3)} <small>m/s</small>`;
}

export function renderCalculations(input, result) {
  const mismatch = result.geometryMatches ? 'MATCH' : 'MISMATCH';
  const cards = [
    ['Calculated vertical rise', 'H = L × sin(θ)', `H = ${fmt(input.centreDistanceMm, 1)} × sin(${fmt(input.inclinationDeg, 2)}°)`, `${fmt(result.riseMm, 2)} mm`, 'Uses pulley centre distance along the inclined frame and the entered inclination. The entered vertical height is retained separately for verification.'],
    ['Horizontal projection', 'X = L × cos(θ)', `X = ${fmt(input.centreDistanceMm, 1)} × cos(${fmt(input.inclinationDeg, 2)}°)`, `${fmt(result.horizontalMm, 2)} mm`, 'The horizontal projection and vertical rise resolve the centre distance into orthogonal components.'],
    ['Drive drum circumference', 'C = π × D', `C = π × ${fmt(input.driveDiameterMm, 2)} mm`, `${fmt(result.driveCircumferenceMm, 2)} mm`, 'Drum circumference is the belt travel per drum revolution, assuming no slip.'],
    ['Belt linear velocity', 'V = π × D × N / 60', `V = π × ${fmt(input.driveDiameterMm / 1000, 4)} × ${fmt(input.driveRpm, 2)} / 60`, `${fmt(result.beltSpeedMps, 4)} m/s · ${fmt(result.beltSpeedMMin, 2)} m/min`, 'Converts drive drum rotation into belt speed. It is used by throughput, power and animation calculations.'],
    ['Drum angular velocity', 'ω = 2πN / 60', `ω = 2π × ${fmt(input.driveRpm, 2)} / 60`, `${fmt(result.angularVelocityRadS, 4)} rad/s`, 'Converts revolutions per minute to radians per second for rotational calculations.'],
    ['Height verification', 'ΔH = Hentered − Hcalculated', `ΔH = ${fmt(input.enteredHeightMm, 2)} − ${fmt(result.riseMm, 2)}; tolerance ±${fmt(input.toleranceMm, 2)} mm`, `${fmt(result.heightDifferenceMm, 2)} mm · ${mismatch}`, 'Compares the user-entered height to calculated rise without changing either value. A mismatch outside the selected tolerance needs review.'],
    ['Approximate belt loop length', 'Lb ≈ 2L + π(Ddrive + Dtail)/2', `Lb ≈ 2 × ${fmt(input.centreDistanceMm, 1)} + π × (${fmt(input.driveDiameterMm, 1)} + ${fmt(input.tailDiameterMm, 1)}) / 2`, `${fmt(result.approximateLoopLengthMm, 1)} mm`, 'Preliminary equal-centre-span approximation for two pulleys. Take-up travel, unequal geometry and routing are not modeled.']
  ];
  $('geometry-results').innerHTML = cards.map(([name, eq, substitution, value, explanation]) => `
    <article class="calc-card"><div class="calc-title"><span class="calc-info" tabindex="0" data-tip="${explanation}">${name}</span><span>${name === 'Height verification' ? 'VALIDATION' : 'CALCULATED'}</span></div><div class="calc-value">${value}</div><div class="calc-equation">${eq}</div><div class="calc-substitution">${substitution}</div></article>`).join('');
}

export function renderValidation(result, tolerance) {
  const row = $('entered-height').closest('.form-row');
  const error = row.querySelector('.field-error');
  if (result.geometryMatches) {
    error.textContent = `Within ±${fmt(tolerance, 2)} mm tolerance.`;
    error.style.color = '#65d6a7';
  } else {
    error.textContent = `Height differs by ${fmt(Math.abs(result.heightDifferenceMm), 2)} mm; review geometry.`;
    error.style.color = '#ff7d7d';
  }
}

export function attachTooltips() {
  const tooltip = $('tooltip');
  const show = target => {
    tooltip.textContent = target.dataset.tip;
    tooltip.hidden = false;
    const rect = target.getBoundingClientRect();
    tooltip.style.left = `${Math.min(window.innerWidth - 260, Math.max(8, rect.left))}px`;
    tooltip.style.top = `${Math.max(8, rect.bottom + 7)}px`;
  };
  document.addEventListener('mouseover', event => { const t = event.target.closest('[data-tip]'); if (t) show(t); });
  document.addEventListener('mouseout', event => { if (event.target.closest('[data-tip]')) tooltip.hidden = true; });
  document.addEventListener('focusin', event => { const t = event.target.closest('[data-tip]'); if (t) show(t); });
  document.addEventListener('focusout', event => { if (event.target.closest('[data-tip]')) tooltip.hidden = true; });
  document.addEventListener('click', event => { const t = event.target.closest('[data-tip]'); if (t) show(t); else tooltip.hidden = true; });
}

export function updateProjectName(name) { $('project-name').textContent = name; }
