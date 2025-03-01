'use strict';

const removeSpaces = str => {
  return str.toString().replace(/\s+/g, '');
};

const removeSpecialCharacters = str => {
  return str.toString().replace(/[^a-zA-Z ]/g, '');
};

const capitalizeFirstLetter = str => {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
};

export { capitalizeFirstLetter, removeSpaces, removeSpecialCharacters };
