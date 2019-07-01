const zbmaster = require('./board/zbmaster');
const modbusRTUSlave = require('./modbusRTUSlave');
const modbusTCPSlave = require('./modbusTCPSlave');
const modbusTCPMaster = require('./modbusMasters/modbusTCPMaster');
const modbusRTUMaster = require('./modbusMasters/modbusRTUMaster');

const zbmasterList = [];
const modbusRTUSlaveList = [];
const modbusTCPSlaveList = [];
const modbusTCPMasterList = [];
const modbusRTUMasterList = [];

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

      case 'modbusRTUMaster':
        modbusRTUMasterList.push(modbusRTUMaster.createModbusRTUMaster(scfg));
        modbusRTUMasterList[modbusRTUMasterList.length - 1].startMaster();
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

      case 'modbusTCPMaster':
        modbusTCPMasterList.push(modbusTCPMaster.createModbusTCPMaster(ncfg));
        modbusTCPMasterList[modbusTCPMasterList.length - 1].startMaster();
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
  mbTCPMasters: modbusTCPMasterList,
  mbRTUMasters: modbusRTUMasterList,
};
