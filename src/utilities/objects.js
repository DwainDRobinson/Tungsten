const isObjectEmpty = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj).length === 0
    : true;

const deepClone = obj => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return undefined;
  }
};

const deepEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (!bKeys.includes(key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
};

export { deepClone, deepEqual, isObjectEmpty };
