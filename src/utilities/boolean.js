'use strict';

const convertArgToBoolean = arg => {
  if (typeof arg === 'boolean') return arg;
  if (typeof arg === 'number') return arg !== 0;
  if (typeof arg === 'string') {
    const val = arg.trim().toLowerCase();
    if (['true', 'yes', '1', 'on'].includes(val)) return true;
    if (['false', 'no', '0', 'off', ''].includes(val)) return false;
  }
  return !!arg;
};

const isProductionEnvironment = () => process.env.NODE_ENV === 'production';
const isDevelopmentEnvironment = () => process.env.NODE_ENV === 'development';
const isTestEnvironment = () => process.env.NODE_ENV === 'test';

export {
  convertArgToBoolean,
  isDevelopmentEnvironment,
  isProductionEnvironment,
  isTestEnvironment
};
