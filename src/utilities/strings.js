'use strict';

const removeSpaces = str =>
  typeof str === 'string' ? str.replace(/\s+/g, '') : '';

const removeSpecialCharacters = str =>
  typeof str === 'string' ? str.replace(/[^a-zA-Z ]/g, '') : '';

const capitalizeFirstLetter = str =>
  typeof str === 'string' && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : '';

const capitalizeWords = str =>
  typeof str === 'string' ? str.replace(/\b\w/g, c => c.toUpperCase()) : '';

const toCamelCase = str => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/ (.)/g, (match, group1) => group1.toUpperCase())
    .replace(/ /g, '')
    .replace(/^(.)/, (match, group1) => group1.toLowerCase());
};

export {
  capitalizeFirstLetter,
  capitalizeWords,
  removeSpaces,
  removeSpecialCharacters,
  toCamelCase
};
