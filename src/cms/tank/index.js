/**
 * A module for Tank
 * @module tank
 */
const vessel = require('../vessel');

/**
 * update tank level
 * @param {number} ullageRadar - ullage from tank
 */
function updateTankLevel(ullageRadar) {
  const { cfg } = this;
  const levelRadar = cfg.distance - ullageRadar;
  const ullageSensor = ullageRadar + cfg.DVManMsrPntToSns;

  this.ullage = ullageSensor - vessel.trimListCorrect(cfg.cDLFC, cfg.cDTFC);
  this.ullage_floatation_center = ullageSensor - vessel.trimListCorrect(cfg.cDLFC, cfg.cDTFC);
  this.level = levelRadar;
  this.level_floatation_center = levelRadar
    + vessel.trimListCorrect(cfg.cDLFC, cfg.cDTFC) - cfg.DBotManMsrPnt;
  this.level_at_ref = levelRadar + vessel.trimListCorrect(cfg.cDLR, cfg.cDTR) - cfg.DBotManMsrPnt;
}

/**
 * create tank object
 * @param {object} cfg - tank configuration object
 * @return {object} tank object
 */
function createTank(cfg) {
  const tank = {
    cfg,
    ullage: 0.0, // ullage at reference point
    ullage_floatation_center: 0.0, // ullage at floatation center
    level: 0.0, // level at sensor
    level_floatation_center: 0.0, // level at floatation center
    level_at_ref: 0.0, // level at reference point
    updateTankLevel,
  };

  //
  // FIXME
  // connect level channels
  //
  return tank;
}

module.exports = {
  createTank,
};
