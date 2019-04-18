module.exports = {
  toFloat: (v, numDec) => parseFloat(v.toFixed(numDec)),
  deepCopy: obj => JSON.parse(JSON.stringify(obj)),
};
