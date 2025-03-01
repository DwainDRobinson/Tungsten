'use strict';

const convertArgToBoolean = arg => {
  switch (arg) {
    case 'true':
    case 'yes':
    case '1':
    case 'on':
      return true;

    case 'false':
    case 'no':
    case '0':
    case null:
    case 'off':
    case undefined:
      return false;

    default:
      return !!arg;
  }
};

const isProductionEnvironment = () => {
  return process.env.NODE_ENV === 'production';
};

const isDevelopmentEnvironment = () => {
  return process.env.NODE_ENV === 'development';
};

export {
  convertArgToBoolean,
  isDevelopmentEnvironment,
  isProductionEnvironment
};
