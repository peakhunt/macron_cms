/**
 * A module for vessel's common data for CMS
 * @module vefssel
 */

//
// trim/list data in radians
//
let trim = 0.0;
let list = 0.0;

/**
 * update trim and list value
 * @param {number} t - trim in angle
 * @param {number} l - list in angle
 */
function updateTrimList(t, l) {
  trim = t * Math.PI / 180;
  list = l * Math.PI / 180;
}

/**
 * calculate trim/list correction
 * @param {number} longitude - distance in longitude
 * @param {number} transverse - distance in transverse
 * @return {number} Trim/List correction
 */
function trimListCorrect(longitude, transverse) {
  return longitude * Math.tan(trim) + transverse * Math.tan(list);
}

/**
 * reset trim/list
 */
function reset() {
  trim = 0.0;
  list = 0.0;
}

module.exports = {
  reset,
  updateTrimList,
  trimListCorrect,
};
