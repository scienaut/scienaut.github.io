export const mmToM = value => value / 1000;
export const degToRad = value => value * Math.PI / 180;
export const radToDeg = value => value * 180 / Math.PI;
export const roundTo = (value, places = 2) => Number.isFinite(value) ? Number(value.toFixed(places)) : null;
export const fmt = (value, places = 2) => Number.isFinite(value)
  ? new Intl.NumberFormat('en', { maximumFractionDigits: places, minimumFractionDigits: 0 }).format(value)
  : '—';
