const core = require('../../core');
const logger = require('../../logger');
const ModbusRTU = require('../../extensions/serverrtu');

function ModbusRTUSlave(cfg) {
  const self = this;
  self.cfg = cfg;

  const vector = {
    /* eslint-disable no-unused-vars */
    getInputRegister: (addr, unitID, cb) => {
      const ioReg = self.cfg.registers.inputs[addr];

      if (ioReg === undefined) {
        logger.error(`modbusRTUSlave read ${self.cfg.address} unknown input register ${addr}`);
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
        logger.error(`modbusRTUSlave read ${self.cfg.address} unknown holding register ${addr}`);
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
        logger.error(`modbusRTUSlave read ${self.cfg.address} unknown coil register ${addr}`);
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
        logger.error(`modbusRTUSlave read ${self.cfg.address} unknown discrete register ${addr}`);
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
        logger.error(`modbusRTUSlave write ${self.cfg.address} unknown holding register ${addr}`);
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
        logger.error(`modbusRTUSlave write ${self.cfg.address} unknown coil register ${addr}`);
        cb({ modbusErrorCode: 0x02 });
        return;
      }

      core.getChannel(ioReg.channel).sensorValue = value;
      cb();
    },
  };

  const options = {
    unitID: cfg.address,
    baudRate: cfg.transport.serial.baud,
    dataBits: cfg.transport.serial.dataBit,
    stopBits: cfg.transport.serial.stopBit === '1' ? 1 : 2,
    parity: cfg.transport.serial.parity,
  };

  self.modbus = new ModbusRTU(vector, cfg.transport.serial.port, options);
  self.started = false;

  self.modbus.open(() => {
    self.started = true;
  });
}

function createModbusRTUSlave(cfg) {
  const modbusRTUSlave = new ModbusRTUSlave(cfg);

  return modbusRTUSlave;
}

module.exports = {
  createModbusRTUSlave,
};
