/**
 * A module for vessel's common data for CMS
 * @module vefssel
 */

const core = require('../../core');
const refAbsPressure = require('./ref_abs_pressure');

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

function initTrimList(cfg) {
  trim = 0.0;
  list = 0.0;

  if (cfg.use !== true) return;

  // listen on trim value
  core.listenOnChannelValue(cfg.trim, (chnl) => {
    const t = chnl.engValue;

    trim = t * Math.PI / 180;
  });

  core.listenOnChannelFault(cfg.trim, () => {
    trim = 0.0;
  });

  // listen on list value
  core.listenOnChannelValue(cfg.list, (chnl) => {
    const l = chnl.engValue;

    list = l * Math.PI / 180;
  });

  core.listenOnChannelFault(cfg.list, () => {
    trim = 0.0;
  });
}

/**
 * init trim/list
 */
function init(cfg) {
  initTrimList(cfg.trimList);
  refAbsPressure.init(cfg.refAbsPressure);
}

module.exports = {
  init,
  trim: () => trim,
  list: () => list,
  updateTrimList,
  trimListCorrect,
  getStatus() {
    return {
      trim,
      list,
    };
  },
  refAbsPressure,
};
