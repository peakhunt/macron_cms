const modbus = require('modbus-serial');
const core = require('../../core');
const logger = require('../../logger');

function ModbusTCPSlave(cfg) {
  const self = this;
  self.cfg = cfg;

  const vector = {
    /* eslint-disable no-unused-vars */
    getInputRegister: (addr, unitID, cb) => {
      const ioReg = self.cfg.registers.inputs[addr];

      if (ioReg === undefined) {
        logger.error(`modbusTCPSlave read ${self.cfg.address} unknown input register ${addr}`);
        cb({ modbusErrorCode: 0x02 });
        return;
      }

      let value;

      switch (ioReg.value) {
        case 'value':
          value = core.getChannel(ioReg.channel).sensorValue;
          value = (value - ioReg.offset) / ioReg.gain;
          break;

        case 'status':
          value = core.getChannel(ioReg.channel).sensorFault;
          break;

        case 'alarm':
          value = core.getAlarm(ioReg.channel).state;
          break;

        default:
          value = 0;
          break;
      }
      cb(null, value);
    },
    /* eslint-disable no-unused-vars */
    getHoldingRegister: (addr, unitID, cb) => {
      const ioReg = self.cfg.registers.holdings[addr];

      if (ioReg === undefined) {
        logger.error(`modbusTCPSlave read ${self.cfg.address} unknown holding register ${addr}`);
        cb({ modbusErrorCode: 0x02 });
        return;
      }

      let value;

      switch (ioReg.value) {
        case 'value':
          value = core.getChannel(ioReg.channel).sensorValue;
          value = (value - ioReg.offset) / ioReg.gain;
          break;

        case 'status':
          value = core.getChannel(ioReg.channel).sensorFault;
          break;

        case 'alarm':
          value = core.getAlarm(ioReg.channel).state;
          break;

        default:
          value = 0;
          break;
      }
      cb(null, value);
    },
    /* eslint-disable no-unused-vars */
    getCoil: (addr, unitID, cb) => {
      const ioReg = self.cfg.registers.coils[addr];

      if (ioReg === undefined) {
        logger.error(`modbusTCPSlave read ${self.cfg.address} unknown coil register ${addr}`);
        cb({ modbusErrorCode: 0x02 });
        return;
      }

      let value;

      switch (ioReg.value) {
        case 'value':
          value = core.getChannel(ioReg.channel).sensorValue;
          break;

        case 'status':
          value = core.getChannel(ioReg.channel).sensorFault;
          break;

        default:
          value = false;
          break;
      }
      cb(null, value);
    },
    /* eslint-disable no-unused-vars */
    getDiscreteInput: (addr, unitID, cb) => {
      const ioReg = self.cfg.registers.coils[addr];

      if (ioReg === undefined) {
        logger.error(`modbusTCPSlave read ${self.cfg.address} unknown discrete register ${addr}`);
        cb({ modbusErrorCode: 0x02 });
        return;
      }

      let value;

      switch (ioReg.value) {
        case 'value':
          value = core.getChannel(ioReg.channel).sensorValue;
          break;

        case 'status':
          value = core.getChannel(ioReg.channel).sensorFault;
          break;

        default:
          value = false;
          break;
      }
      cb(null, value);
    },
    /* eslint-disable no-unused-vars */
    setRegister: (addr, value, unitID, cb) => {
      const ioReg = self.cfg.registers.holdings[addr];

      if (ioReg === undefined) {
        logger.error(`modbusTCPSlave write ${self.cfg.address} unknown holding register ${addr}`);
        cb({ modbusErrorCode: 0x02 });
        return;
      }

      const v = value * ioReg.gain + ioReg.offset;

      core.getChannel(ioReg.channel).sensorValue = v;

      cb();
    },
    /* eslint-disable no-unused-vars */
    setCoil: (addr, value, unitID, cb) => {
      const ioReg = self.cfg.registers.coils[addr];

      if (ioReg === undefined) {
        logger.error(`modbusTCPSlave write ${self.cfg.address} unknown coil register ${addr}`);
        cb({ modbusErrorCode: 0x02 });
        return;
      }

      core.getChannel(ioReg.channel).sensorValue = value;
      cb();
    },
  };

  self.modbus = new modbus.ServerTCP(vector, {
    host: self.cfg.transport.net.host,
    port: self.cfg.transport.net.port,
    unitID: self.cfg.address,
  });
}

function createModbusTCPSlave(cfg) {
  const modbusTCPSlave = new ModbusTCPSlave(cfg);

  return modbusTCPSlave;
}

module.exports = {
  createModbusTCPSlave,
};
