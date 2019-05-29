const zbmaster = require('./board/zbmaster');
const modbusRTUSlave = require('./modbusRTUSlave');

const zbmasterList = [];
const modbusRTUSlaveList = [];

/**
 * initialize I/O subsystem
 * @param {object} cfg - I/O configuration from system config
 cfg: {
  serial: [
  ],
  net: [
  ]
 }
 */
function initIO(cfg) {
  // serial
  cfg.serial.forEach((scfg) => {
    switch (scfg.type) {
      case 'zbSerialMaster':
        zbmasterList.push(zbmaster.createMaster(scfg));
        break;

      case 'modbusRTUSlave':
        modbusRTUSlaveList.push(modbusRTUSlave.createModbusRTUSlave(scfg));
        break;

      default:
        break;
    }
  });

  // net XXX none yet
}

module.exports = {
  initIO,
  zbMasters: zbmasterList,
};
