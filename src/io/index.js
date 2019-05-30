const zbmaster = require('./board/zbmaster');
const modbusRTUSlave = require('./modbusRTUSlave');
const modbusTCPSlave = require('./modbusTCPSlave');

const zbmasterList = [];
const modbusRTUSlaveList = [];
const modbusTCPSlaveList = [];

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

  cfg.net.forEach((ncfg) => {
    switch (ncfg.type) {
      case 'modbusTCPSlave':
        modbusTCPSlaveList.push(modbusTCPSlave.createModbusTCPSlave(ncfg));
        break;

      default:
        break;
    }
  });
}

module.exports = {
  initIO,
  zbMasters: zbmasterList,
  mbRTUSlaves: modbusRTUSlaveList,
  mbTCPSlaves: modbusTCPSlaveList,
};
