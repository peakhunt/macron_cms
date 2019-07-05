module.exports = {
  toFloat: (v, numDec) => parseFloat(v.toFixed(numDec)),
  deepCopy: obj => JSON.parse(JSON.stringify(obj)),
  getTimeMills: () => Date.now(),
  getRandom: (min, max) => Math.random() * (max - min) + min,
};
