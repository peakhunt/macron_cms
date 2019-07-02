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
  core.getChannel(tank.cfg.level.ullageAtRef.channel).engValue = vFixed;
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
  core.getChannel(tank.cfg.level.levelAtRef.channel).engValue = vFixed;
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
  core.getChannel(tank.cfg.level.ullageAtFC.channel).engValue = vFixed;
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
  core.getChannel(tank.cfg.level.levelAtFC.channel).engValue = vFixed;
}

function setTankPressure(tank, v) {
  const t = tank;
  const vFixed = common.toFloat(v, 2);

  t.pressure = vFixed;
  core.getChannel(tank.cfg.pressure.channel).engValue = vFixed;
}

function setTankTemperature(tank, v) {
  const t = tank;
  const vFixed = common.toFloat(v, 2);

  t.temperature = vFixed;
  core.getChannel(tank.cfg.temperature.channel).engValue = vFixed;
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

function updateTankPressure(tank) {
  let validSensors = 0;
  let sum = 0.0;

  tank.pressureSensors.forEach((pSensor) => {
    if (pSensor.sensorFault === false) {
      validSensors += 1;
      sum += pSensor.pressure;
    }
  });

  if (validSensors === 0) {
    core.getChannel(tank.cfg.pressure.channel).sensorFault = true;
    setTankPressure(tank, 0.0);
    return;
  }

  core.getChannel(tank.cfg.pressure.channel).sensorFault = false;
  setTankPressure(tank, sum / validSensors);
}

function updateTankTemperature(tank) {
  let validSensors = 0;
  let sum = 0.0;

  if (tank.cfg.temperature.algorithm === 'average') {
    tank.tempSensors.forEach((tSensor) => {
      if (tSensor.sensorFault === false) {
        validSensors += 1;
        sum += tSensor.temperature;
      }
    });

    if (validSensors === 0) {
      core.getChannel(tank.cfg.temperature.channel).sensorFault = true;
      setTankTemperature(tank, 0.0);
      return;
    }

    core.getChannel(tank.cfg.temperature.channel).sensorFault = false;
    setTankTemperature(tank, sum / validSensors);
  } else {
    const level = tank.levelFC;
    let wetSum = 0.0;
    let drySum = 0.0;
    let wetCnt = 0;
    let dryCnt = 0;
    let bottomTemp = 0.0;
    let bottomTempOK = false;
    let hwFailCnt = 0;

    tank.tempSensors.forEach((tSensor) => {
      if (tSensor.sensorFault === true) {
        hwFailCnt += 1;
        return;
      }

      if (tSensor.cfg.installedHeight < 0.5) {
        bottomTempOK = true;
        bottomTemp = tSensor.temperature;
      } else if (tSensor.cfg.installedHeight < level) {
        wetSum += tSensor.temperature;
        wetCnt += 1;
      } else {
        drySum += tSensor.temperature;
        dryCnt += 1;
      }
    });

    if (hwFailCnt === tank.tempSensors.length) {
      // all sensors are abd
      core.getChannel(tank.cfg.temperature.channel).sensorFault = true;
      setTankTemperature(tank, 0.0);
      return;
    }

    core.getChannel(tank.cfg.temperature.channel).sensorFault = false;

    let tmpTemp = 0.0;

    if (level > 0.0) {
      if (wetCnt > 0) {
        if ((wetCnt === 1) && bottomTempOK === true) {
          tmpTemp = (3 * wetSum + bottomTemp) / 4; // get weighted sum
        } else {
          tmpTemp = wetSum / wetCnt;
        }
      } else if (bottomTempOK) {
        tmpTemp = bottomTemp;
      } else if (dryCnt > 1) {
        tmpTemp = drySum / dryCnt;
      }
    } else if (bottomTempOK === true) {
      // level is almost 0 and bottom sensor is ok
      tmpTemp = bottomTemp;
    } else {
      // level is almost 0 and bottom sensor is not ok
      tmpTemp = drySum / dryCnt;
    }
    setTankTemperature(tank, tmpTemp);
  }
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
      const ullageRadar = chnl.engValue;
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

function getRadarStat(tank) {
  const radarStat = {
    radars: [],
    validRadarCount: 0,
  };

  tank.radars.forEach((r) => {
    if (r.sensorFault === false) {
      radarStat.validRadarCount += 1;
    }

    radarStat.radars.push({
      ullageAtRef: r.ullageAtRef,
      ullageFC: r.ullageFC,
      levelAtRef: r.levelAtRef,
      levelFC: r.levelFC,
      sensorFault: r.sensorFault,
    });
  });
  return radarStat;
}

/**
 * create tank pressure sensor instance and returns the array of
 * pressure sensors
 * @param {object} tank - tank object
 * @param {object} cfg - tank configuration
 * @return {array} array of tank pressure instance
 */
function createTankPressureInstance(tank, cfg) {
  const pressureSensors = [];
  let pSensor;

  cfg.pressure.sensors.forEach((pCfg) => {
    pSensor = {
      tank,
      sensorFault: false,
      pressure: 0.0,
    };
    pSensor.cfg = pCfg;
    pressureSensors.push(pSensor);

    // listen on channel value event
    core.listenOnChannelValue(pCfg.channel, (chnl) => {
      pSensor.pressure = chnl.engValue;
      updateTankPressure(tank);
    });

    // listen on channel sensor event
    core.listenOnChannelFault(pCfg.channel, (chnl) => {
      pSensor.sensorFault = chnl.sensorFault;
      updateTankPressure(tank);
    });
  });
  return pressureSensors;
}

/**
 * create tank temperature sensor instance and returns the array of
 * temperature sensors
 * @param {object} tank - tank object
 * @param {object} cfg - tank configuration
 * @return {array} array of tank pressure instance
 */
function createTankTempratureInstance(tank, cfg) {
  const tempSensors = [];
  let tSensor;

  cfg.temperature.sensors.forEach((tCfg) => {
    tSensor = {
      tank,
      sensorFault: false,
      temperature: 0.0,
    };
    tSensor.cfg = tCfg;
    tempSensors.push(tSensor);

    // listen on channel value event
    core.listenOnChannelValue(tCfg.channel, (chnl) => {
      tSensor.temperature = chnl.engValue;
      updateTankTemperature(tank);
    });

    // listen on channel sensor event
    core.listenOnChannelFault(tCfg.channel, (chnl) => {
      tSensor.sensorFault = chnl.sensorFault;
      updateTankTemperature(tank);
    });
  });
  return tempSensors;
}

function getTankStatus() {
  const tank = this;
  const stat = {
    name: tank.cfg.name,
    level: {
      ullageAtRef: tank.ullageAtRef,
      ullageFC: tank.ullageFC,
      levelAtRef: tank.levelAtRef,
      levelFC: tank.levelFC,
    },
    pressure: tank.pressure,
    temperature: tank.temperature,
  };

  stat.level.radarStat = getRadarStat(tank);

  return stat;
}

/**
 * create tank object
 * @param {object} cfg - tank configuration object with the following structure
 cfg: {
  name: 'XXX',
  level: {
    use: true,
    ullageAtRef: { // average ullage at reference point
      channel: XXX,
      alarms: [ XXX, XXX ]
    },
    levelAtRef: { // average level at reference point
      channel: XXX,
      alarms: [ XXX, XXX ]
    },
    ullageAtFC: { // average ullage at floatation center
      channel: XXX,
      alarms: [ XXX, XXX ]
    },
    levelAtFC: { // average level at floatation center
      channel: XXX,
      alarms: [ XXX, XXX ]
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
  pressure: {
    use: true,
    channel: XXX,
    alarms: [ XXX, XXX],
    sensors: [
      {
        "type": "gauge",
        "channel": XXX,
      },
      {
        "type": "absolute",
        "channel": XXX,
      }
    ]
  },
  temperature: {
    use: true,
    channel: XXX,
    algorithm: 'levelBased' | 'average',
    alarms: [ XXX, XXX],
    sensors: [
      {
        "installedHeight": 0,
        "channel": XXX,
      },
      {
        "installedHeight": 10,
        "channel": XXX,
      },
      {
        "installedHeight": 20,
        "channel": XXX,
      }
    ]
  }
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
    pressure: 0.0, // tank pressure
    temperature: 0.0, // tank temperature
  };

  tank.radars = createTankRadarInstance(tank, cfg);

  setUllageAtRef(tank, 0.0);
  setLevelAtRef(tank, 0.0);
  setUllageFC(tank, 0.0);
  setLevelFC(tank, 0.0);

  tank.pressureSensors = createTankPressureInstance(tank, cfg);

  tank.tempSensors = createTankTempratureInstance(tank, cfg);

  tank.getTankStatus = getTankStatus;

  return tank;
}

module.exports = {
  createTank,
};
