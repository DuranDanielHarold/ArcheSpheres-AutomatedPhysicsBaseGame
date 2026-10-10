'use strict';
// Normalize base class stats once all class registry files have populated DEF.
// ARM and MDEF are floored integers; every other fractional numeric stat is
// rounded to one decimal place. This intentionally changes runtime base stats.
Object.values(DEF).forEach(function (stats) {
  Object.keys(stats).forEach(function (key) {
    const value = stats[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) return;
    if (key === 'arm' || key === 'magDef') {
      stats[key] = Math.floor(value);
    } else if (!Number.isInteger(value)) {
      stats[key] = Math.round((value + Number.EPSILON) * 10) / 10;
    }
  });
});
