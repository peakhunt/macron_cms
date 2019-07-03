const core = require('../../core');
const common = require('../../common');

const absRefSensorList = [];

let absPressure;
let absPressureChnl;

function updateAbsRefPressure() {
  let sum = 0.0;
  let cnt = 0;

  absRefSensorList.forEach((pSensor) => {
    if (pSensor.sensorFault === false) {
      sum += pSensor.pressure;
      cnt += 1;
    }
  });

  if (cnt === 0) {
    absPressure = 0.0;
    absPressureChnl.sensorFault = true;
    absPressureChnl.engValue = absPressure;
    return;
  }

  absPressureChnl.sensorFault = false;

  const vFixed = common.toFloat(sum / cnt, 2);

  absPressureChnl.engValue = vFixed;
}

function init(cfg) {
  let pSensor;

  absPressure = 0.0;
  absPressureChnl = null;

  if (cfg.use !== true) {
    return;
  }

  absPressureChnl = core.getChannel(cfg.channel);

  cfg.sensors.forEach((pCfg) => {
    pSensor = {
      cfg: pCfg,
      sensorFault: false,
      pressure: 0.0,
    };

    absRefSensorList.push(pSensor);

    // listen on channel value event
    core.listenOnChannelValue(pCfg.channel, (chnl) => {
      pSensor.pressure = chnl.engValue;
      updateAbsRefPressure();
    });

    // listen on channel sensor event
    core.listenOnChannelFault(pCfg.channel, (chnl) => {
      pSensor.sensorFault = chnl.sensorFault;
      updateAbsRefPressure();
    });
  });
}

module.exports = {
  init,
  getAbsPressure() {
    return absPressure;
  },
};
