/**
 * A module for Tank
 * @module tank
 */
const vessel = require('../vessel');
const core = require('../../core');
const common = require('../../common');

/**
 * set ullage at ref
 * @param {object} tank - tank object
 * @param {number} v - ullage value
 */
function setUllageAtRef(tank, v) {
  const t = tank;
  const vFixed = common.toFloat(v, 3);

  t.ullageAtRef = vFixed;
  core.getChannel(tank.cfg.level.ullageAtRef.channel).value = vFixed;
}

/**
 * set level at ref
 * @param {object} tank - tank object
 * @param {number} v - level value
 */
function setLevelAtRef(tank, v) {
  const t = tank;
  const vFixed = common.toFloat(v, 3);

  t.levelAtRef = vFixed;
  core.getChannel(tank.cfg.level.levelAtRef.channel).value = vFixed;
}

/**
 * set ullage at floatation center
 * @param {object} tank - tank object
 * @param {number} v - ullage value
 */
function setUllageFC(tank, v) {
  const t = tank;
  const vFixed = common.toFloat(v, 3);

  t.ullageFC = vFixed;
  core.getChannel(tank.cfg.level.ullageAtFC.channel).value = vFixed;
}

/**
 * set level at floatation center
 * @param {object} tank - tank object
 * @param {number} v - level value
 */
function setLevelFC(tank, v) {
  const t = tank;
  const vFixed = common.toFloat(v, 3);

  t.levelFC = vFixed;
  core.getChannel(tank.cfg.level.levelAtFC.channel).value = vFixed;
}

/**
 * update tank level
 * @param {number} ullageRadar - ullage from tank
 */
function updateTankLevel(tank) {
  let sumOfUllageAtRef = 0.0;
  let sumOfUllageFC = 0.0;
  let sumOfLevelAtRef = 0.0;
  let sumOfLevelFC = 0.0;
  let validRadarCount = 0;

  tank.radars.forEach((r) => {
    if (r.sensorFault === true) {
      return;
    }

    sumOfUllageAtRef += r.ullageAtRef;
    sumOfUllageFC += r.ullageFC;
    sumOfLevelAtRef += r.levelAtRef;
    sumOfLevelFC += r.levelFC;

    validRadarCount += 1;
  });

  if (validRadarCount > 0) {
    core.getChannel(tank.cfg.level.ullageAtRef.channel).sensorFault = false;
    core.getChannel(tank.cfg.level.levelAtRef.channel).sensorFault = false;
    core.getChannel(tank.cfg.level.ullageAtFC.channel).sensorFault = false;
    core.getChannel(tank.cfg.level.levelAtFC.channel).sensorFault = false;

    setUllageAtRef(tank, sumOfUllageAtRef / validRadarCount);
    setUllageFC(tank, sumOfUllageFC / validRadarCount);
    setLevelAtRef(tank, sumOfLevelAtRef / validRadarCount);
    setLevelFC(tank, sumOfLevelFC / validRadarCount);
  } else {
    setUllageAtRef(tank, 0.0);
    setUllageFC(tank, 0.0);
    setLevelAtRef(tank, 0.0);
    setLevelFC(tank, 0.0);

    core.getChannel(tank.cfg.level.ullageAtRef.channel).sensorFault = true;
    core.getChannel(tank.cfg.level.levelAtRef.channel).sensorFault = true;
    core.getChannel(tank.cfg.level.ullageAtFC.channel).sensorFault = true;
    core.getChannel(tank.cfg.level.levelAtFC.channel).sensorFault = true;
  }
}

function updateRadar(radar, ullageRadar) {
  const r = radar;
  const { radarCfg, tank } = r;
  const levelRadar = radarCfg.cfg.distance - ullageRadar;
  const ullageSensor = ullageRadar + radarCfg.cfg.DVManMsrPntToSns;

  r.ullageAtRef = ullageSensor - vessel.trimListCorrect(radarCfg.cfg.cDLR, radarCfg.cfg.cDTR);
  r.ullageFC = ullageSensor - vessel.trimListCorrect(radarCfg.cfg.cDLFC, radarCfg.cfg.cDTFC);
  r.level = levelRadar; // level at sensor point
  r.levelFC = levelRadar
    + vessel.trimListCorrect(radarCfg.cfg.cDLFC, radarCfg.cfg.cDTFC) - radarCfg.cfg.DBotManMsrPnt;
  r.levelAtRef = levelRadar
    + vessel.trimListCorrect(radarCfg.cfg.cDLR, radarCfg.cfg.cDTR) - radarCfg.cfg.DBotManMsrPnt;

  updateTankLevel(tank);
}

/**
 * create tank randar instance and returns the array of radars
 * @param {object} tank - tank object
 * @param {object} cfg - tank configuration
 * @return {array} array of tank radar instance
 */
function createTankRadarInstance(tank, cfg) {
  const radars = [];
  let radar;

  cfg.level.radars.forEach((radarCfg) => {
    radar = {
      tank,
      sensorFault: false,
      ullageAtRef: 0.0, // ullage at ref point
      ullageFC: 0.0, // ullage at floatation center
      levelFC: 0.0, // level at floatation center
      level: 0.0, // level at sensor point
      levelAtRef: 0.0, // level at ref point,
      updateRadar,
    };

    radar.radarCfg = radarCfg;
    radars.push(radar);

    // listen on channel value event
    core.listenOnChannelValue(radarCfg.channel, (chnl) => {
      const ullageRadar = chnl.value;
      updateRadar(radar, ullageRadar);
    });

    // listen on channel sensor event
    core.listenOnChannelFault(radarCfg.channel, (chnl) => {
      radar.sensorFault = chnl.sensorFault;
      updateTankLevel(tank);
    });
  });
  return radars;
}

/**
 * create tank object
 * @param {object} cfg - tank configuration object with the following structure
 cfg: {
  name: 'XXX',
  level: {
    ullageAtRef: { // average ullage at reference point
      channel: XXX,
      hiAlarm: XXX,
      loAlarm: XXX,
    },
    levelAtRef: { // average level at reference point
      channel: XXX,
      hiAlarm: XXX,
      loAlarm: XXX,
    },
    ullageAtFC: { // average ullage at floatation center
      channel: XXX,
      hiAlarm: XXX,
      loAlarm: XXX,
    },
    levelAtFC: { // average level at floatation center
      channel: XXX,
      hiAlarm: XXX,
      loAlarm: XXX,
    },
    tankLevelCfg: {
      DVUllRefToUTI: XXX,
      DBotUllRefPnt: XXX,
    },
    radars: [
      {
        channel: XXX,
        sensorAlarm: XXX,
        cfg: {
          cDLR,
          cDTR,
          cDLFC,
          cDTFC,
          distance: XXX,
          DBotManMsrPnt: XXX,
          DVManMsrPntToSns: XXX,
        },
      },
      ...
    ],
  },
 }
 * @return {object} tank object
 */
function createTank(cfg) {
  const tank = {
    cfg,
    ullageAtRef: 0.0, // ullage at reference point
    ullageFC: 0.0, // ullage at floatation center
    levelAtRef: 0.0, // level at reference point
    levelFC: 0.0, // level at floatation center
  };

  tank.radars = createTankRadarInstance(tank, cfg);

  setUllageAtRef(tank, 0.0);
  setLevelAtRef(tank, 0.0);
  setUllageFC(tank, 0.0);
  setLevelFC(tank, 0.0);

  return tank;
}

module.exports = {
  createTank,
};
