const ranges = {
  'centre-distance': [1, 100000, 'Enter a centre distance greater than 0 mm.'],
  inclination: [0, 75, 'Enter an inclination from 0° to 75°.'],
  'entered-height': [0, 100000, 'Enter a height of 0 mm or greater.'],
  tolerance: [0, 10000, 'Enter a tolerance of 0 mm or greater.'],
  'belt-width': [1, 10000, 'Enter a belt width greater than 0 mm.'],
  'drive-diameter': [1, 10000, 'Enter a drive drum diameter greater than 0 mm.'],
  'tail-diameter': [1, 10000, 'Enter a tail drum diameter greater than 0 mm.'],
  'drum-rpm': [0, 10000, 'Enter a drum speed from 0 to 10,000 RPM.']
};

export function validateGeometry() {
  let valid = true;
  for (const [id, [min, max, message]] of Object.entries(ranges)) {
    const input = document.getElementById(id);
    const error = input.closest('.form-row').querySelector('.field-error');
    const value = input.valueAsNumber;
    const bad = !Number.isFinite(value) || value < min || value > max;
    error.textContent = bad ? message : '';
    input.setAttribute('aria-invalid', String(bad));
    valid &&= !bad;
  }
  return valid;
}
