/**
 * A module for Tank
 * @module tank
 */
const vessel = require('../vessel');

/**
 * update tank level
 * @param {number} ullageRadar - ullage from tank
 */
function updateTankLevel(tank) {
  const t = tank;
  let sumOfUllageAtRef = 0.0;
  let sumOfUllageFC = 0.0;
  let sumOfLevelAtRef = 0.0;
  let sumOfLevelFC = 0.0;
  let validRadarCount = 0;

  t.radars.forEach((r) => {
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
    t.ullageAtRef = sumOfUllageAtRef / validRadarCount;
    t.ullageFC = sumOfUllageFC / validRadarCount;
    t.levelAtRef = sumOfLevelAtRef / validRadarCount;
    t.levelFC = sumOfLevelFC / validRadarCount;
  } else {
    t.ullageAtRef = 0.0;
    t.ullageFC = 0.0;
    t.levelAtRef = 0.0;
    t.levelFC = 0.0;
  }
}

function updateRadar(radar, ullageRadar) {
  const r = radar;
  const { radarCfg, tank } = r;
  const levelRadar = radarCfg.cfg.distance - ullageRadar;
  const ullageSensor = ullageRadar + radarCfg.cfg.DVManMsrPntToSns;

  r.ullageAtRef = ullageSensor - vessel.trimListCorrect(radarCfg.cfg.cDLR, radarCfg.cfg.cDTR);
  r.ullageFC = ullageSensor - vessel.trimListCorrect(radarCfg.cfg.cDLFC, radarCfg.cfg.cDTFC);
  r.level = levelRadar;
  r.levelFC = levelRadar
    + vessel.trimListCorrect(radarCfg.cfg.cDLFC, radarCfg.cfg.cDTFC) - radarCfg.cfg.DBotManMsrPnt;
  r.levelAtRef = levelRadar
    + vessel.trimListCorrect(radarCfg.cfg.cDLR, radarCfg.cfg.cDTR) - radarCfg.cfg.DBotManMsrPnt;

  updateTankLevel(tank);
}

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
  });
  return radars;
}

/**
 * create tank object
 * @param {object} cfg - tank configuration object with the following structure
 cfg: {
  name: 'XXX',
  level: {
    ullage: { // average ullage at reference point
      channel: XXX,
      hiAlarm: XXX,
      loAlarm: XXX,
    },
    level: { // average level at reference point
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

  //
  // FIXME
  // connect level channels
  //
  return tank;
}

module.exports = {
  createTank,
};
