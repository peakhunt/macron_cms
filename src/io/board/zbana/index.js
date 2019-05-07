const common = require('../../../common');
const logger = require('../../../logger');
const core = require('../../../core');

const modbusRegisters = {
  coil: {
    1000: {
      name: 'PORT-01 Power',
      channel: -1,
    },
    1001: {
      name: 'PORT-02 Power',
      channel: -1,
    },
    1002: {
      name: 'PORT-03 Power',
      channel: -1,
    },
    1003: {
      name: 'PORT-04 Power',
      channel: -1,
    },
    1004: {
      name: 'PORT-05 Power',
      channel: -1,
    },
    1005: {
      name: 'PORT-06 Power',
      channel: -1,
    },
    1006: {
      name: 'PORT-07 Power',
      channel: -1,
    },
    1007: {
      name: 'PORT-08 Power',
      channel: -1,
    },
    1008: {
      name: 'PORT-09 Power',
      channel: -1,
    },
    1009: {
      name: 'PORT-10 Power',
      channel: -1,
    },
    1010: {
      name: 'PORT-11 Power',
      channel: -1,
    },
    1011: {
      name: 'PORT-12 Power',
      channel: -1,
    },
    10000: {
      name: 'Reset EEPROM content',
      channel: -1,
    },
  },
  discrete: {
    1000: {
      name: 'PORT-01 Status',
      channel: -1,
    },
    1001: {
      name: 'PORT-02 Status',
      channel: -1,
    },
    1002: {
      name: 'PORT-03 Status',
      channel: -1,
    },
    1003: {
      name: 'PORT-04 Status',
      channel: -1,
    },
    1004: {
      name: 'PORT-05 Status',
      channel: -1,
    },
    1005: {
      name: 'PORT-06 Status',
      channel: -1,
    },
    1006: {
      name: 'PORT-07 Status',
      channel: -1,
    },
    1007: {
      name: 'PORT-08 Status',
      channel: -1,
    },
    1008: {
      name: 'PORT-09 Status',
      channel: -1,
    },
    1009: {
      name: 'PORT-10 Status',
      channel: -1,
    },
    1010: {
      name: 'PORT-11 Status',
      channel: -1,
    },
    1011: {
      name: 'PORT-12 Status',
      channel: -1,
    },
  },
  input: {
    1000: {
      name: 'PORT-01 4-20mA Input',
      channel: -1,
    },
    1001: {
      name: 'PORT-02 4-20mA Input',
      channel: -1,
    },
    1002: {
      name: 'PORT-03 4-20mA Input',
      channel: -1,
    },
    1003: {
      name: 'PORT-04 4-20mA Input',
      channel: -1,
    },
    1004: {
      name: 'PORT-05 4-20mA Input',
      channel: -1,
    },
    1005: {
      name: 'PORT-06 4-20mA Input',
      channel: -1,
    },
    1006: {
      name: 'PORT-07 4-20mA Input',
      channel: -1,
    },
    1007: {
      name: 'PORT-08 4-20mA Input',
      channel: -1,
    },
    1008: {
      name: 'PORT-09 4-20mA Input',
      channel: -1,
    },
    1009: {
      name: 'PORT-10 4-20mA Input',
      channel: -1,
    },
    1010: {
      name: 'PORT-11 4-20mA Input',
      channel: -1,
    },
    1011: {
      name: 'PORT-12 4-20mA Input',
      channel: -1,
    },
  },
  holding: {
    1000: {
      name: 'PORT-01 Gain',
      channel: -1,
    },
    1001: {
      name: 'PORT-02 Gain',
      channel: -1,
    },
    1002: {
      name: 'PORT-03 Gain',
      channel: -1,
    },
    1003: {
      name: 'PORT-04 Gain',
      channel: -1,
    },
    1004: {
      name: 'PORT-05 Gain',
      channel: -1,
    },
    1005: {
      name: 'PORT-06 Gain',
      channel: -1,
    },
    1006: {
      name: 'PORT-07 Gain',
      channel: -1,
    },
    1007: {
      name: 'PORT-08 Gain',
      channel: -1,
    },
    1008: {
      name: 'PORT-09 Gain',
      channel: -1,
    },
    1009: {
      name: 'PORT-10 Gain',
      channel: -1,
    },
    1010: {
      name: 'PORT-11 Gain',
      channel: -1,
    },
    1011: {
      name: 'PORT-12 Gain',
      channel: -1,
    },
    1012: {
      name: 'PORT-01 Offset',
      channel: -1,
    },
    1013: {
      name: 'PORT-02 Offset',
      channel: -1,
    },
    1014: {
      name: 'PORT-03 Offset',
      channel: -1,
    },
    1015: {
      name: 'PORT-04 Offset',
      channel: -1,
    },
    1016: {
      name: 'PORT-05 Offset',
      channel: -1,
    },
    1017: {
      name: 'PORT-06 Offset',
      channel: -1,
    },
    1018: {
      name: 'PORT-07 Offset',
      channel: -1,
    },
    1019: {
      name: 'PORT-08 Offset',
      channel: -1,
    },
    1020: {
      name: 'PORT-09 Offset',
      channel: -1,
    },
    1021: {
      name: 'PORT-10 Offset',
      channel: -1,
    },
    1022: {
      name: 'PORT-11 Offset',
      channel: -1,
    },
    1023: {
      name: 'PORT-12 Offset',
      channel: -1,
    },
    1024: {
      name: 'PORT-01 Filter',
      channel: -1,
    },
    1025: {
      name: 'PORT-02 Filter',
      channel: -1,
    },
    1026: {
      name: 'PORT-03 Filter',
      channel: -1,
    },
    1027: {
      name: 'PORT-04 Filter',
      channel: -1,
    },
    1028: {
      name: 'PORT-05 Filter',
      channel: -1,
    },
    1029: {
      name: 'PORT-06 Filter',
      channel: -1,
    },
    1030: {
      name: 'PORT-07 Filter',
      channel: -1,
    },
    1031: {
      name: 'PORT-08 Filter',
      channel: -1,
    },
    1032: {
      name: 'PORT-09 Filter',
      channel: -1,
    },
    1033: {
      name: 'PORT-10 Filter',
      channel: -1,
    },
    1034: {
      name: 'PORT-11 Filter',
      channel: -1,
    },
    1035: {
      name: 'PORT-12 Filter',
      channel: -1,
    },
  },
};

function setSensorFault(chnlNum, status) {
  if (chnlNum === -1) {
    return;
  }

  core.getChannel(chnlNum).sensorFault = status;
}

function setCommStatus(chnlNum, status) {
  core.getChannel(chnlNum).sensorValue = status;
}

function ZBANA(master, cfg) {
  this.master = master;
  this.cfg = cfg;
  this.ioRegs = common.deepCopy(modbusRegisters);

  cfg.ports.forEach((pcfg, ndx) => {
    const addr = 1000 + ndx;

    this.ioRegs.input[addr].channel = pcfg.channel;
  });
}

function read420mAInput(zbana, modbus, resolve, reject) {
  modbus.readInputRegisters(1000, 12).then((b) => {
    setCommStatus(zbana.cfg.commFault, false);
    for (let i = 0; i < b.data.length; i += 1) {
      const v = b.data[i];
      const addr = 1000 + i;
      const reg = zbana.ioRegs.input[addr];

      // convert to mA value
      reg.value = v / 1000.0;

      if (reg.channel !== -1) {
        setSensorFault(reg.channel, false);
        core.getChannel(reg.channel).setSensorValue = reg.value;
      }
    }
    resolve();
  }).catch((err) => {
    // a. communication failure
    setCommStatus(zbana.cfg.commFault, true);

    // b. sensor fault
    zbana.cfg.ports.forEach((pcfg) => {
      setSensorFault(pcfg.channel, true);
    });

    logger.error(`zbana ${zbana.cfg.address} error ${err}`);
    reject();
  });
}

function executeNext(zbana, modbus, resolve, reject) {
  modbus.setID(zbana.cfg.address);
  read420mAInput(zbana, modbus, resolve, reject);
}

ZBANA.prototype = {
  constructor: ZBANA,
  executeSchedule(modbus) {
    const self = this;

    return new Promise((resolve, reject) => {
      executeNext(self, modbus, resolve, reject);
    });
  },
  printIO(client) {
    const board = this;

    client.write(`type        - ${board.cfg.type}\r\n`);
    client.write(`comm fault  - ${core.getChannel(board.cfg.commFault).engValue}\r\n`);

    Object.keys(board.ioRegs.input).forEach((regAddr) => {
      const reg = board.ioRegs.input[regAddr];

      client.write(`input reg   - ${regAddr}, ${reg.value}\r\n`);
    });
  },
};

/**
 * create ZBANA I/O board object.
 * @param {object} master - ZBMaster instance
 * @param {object} cfg - ZBANA board configuration
 cfg: {
   type: 'zbana',
   address: XXX,
   commFault: XXX,
   ports: [
     {
       channel: XXX,
       sensorType: 'pressure'|'etc',
     },
     {
       channel: XXX,
       sensorType: 'XXX',
     },
     ...
     {
       channel: XXX,
       sensorType: 'XXX',
     },
   ],
 }
 */
function createBoard(master, cfg) {
  const zbana = new ZBANA(master, cfg);

  return zbana;
}

module.exports = {
  createBoard,
};
