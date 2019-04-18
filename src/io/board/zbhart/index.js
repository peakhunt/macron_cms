const common = require('../../../common');

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
      name: 'PORT-1 distance',
      channel: -1,
    },
    1001: {
      name: 'PORT-1 level',
      channel: -1,
    },
    1002: {
      name: 'PORT-1 4-20mA current feedback',
      channel: -1,
    },
    1003: {
      name: 'PORT-2 distance',
      channel: -1,
    },
    1004: {
      name: 'PORT-2 level',
      channel: -1,
    },
    1005: {
      name: 'PORT-2 4-20mA current feedback',
      channel: -1,
    },
    1006: {
      name: 'PORT-3 distance',
      channel: -1,
    },
    1007: {
      name: 'PORT-3 level',
      channel: -1,
    },
    1008: {
      name: 'PORT-3 4-20mA current feedback',
      channel: -1,
    },
    1009: {
      name: 'PORT-4 distance',
      channel: -1,
    },
    1010: {
      name: 'PORT-4 level',
      channel: -1,
    },
    1011: {
      name: 'PORT-4 4-20mA current feedback',
      channel: -1,
    },
    1012: {
      name: 'PORT-5 distance',
      channel: -1,
    },
    1013: {
      name: 'PORT-5 level',
      channel: -1,
    },
    1014: {
      name: 'PORT-5 4-20mA current feedback',
      channel: -1,
    },
    1015: {
      name: 'PORT-6 distance',
      channel: -1,
    },
    1016: {
      name: 'PORT-6 level',
      channel: -1,
    },
    1017: {
      name: 'PORT-6 4-20mA current feedback',
      channel: -1,
    },
    1018: {
      name: 'PORT-7 distance',
      channel: -1,
    },
    1019: {
      name: 'PORT-7 level',
      channel: -1,
    },
    1020: {
      name: 'PORT-7 4-20mA current feedback',
      channel: -1,
    },
    1021: {
      name: 'PORT-8 distance',
      channel: -1,
    },
    1022: {
      name: 'PORT-8 level',
      channel: -1,
    },
    1023: {
      name: 'PORT-8 4-20mA current feedback',
      channel: -1,
    },
    1024: {
      name: 'PORT-9 distance',
      channel: -1,
    },
    1025: {
      name: 'PORT-9 level',
      channel: -1,
    },
    1026: {
      name: 'PORT-9 4-20mA current feedback',
      channel: -1,
    },
    1027: {
      name: 'PORT-10 distance',
      channel: -1,
    },
    1028: {
      name: 'PORT-10 level',
      channel: -1,
    },
    1029: {
      name: 'PORT-10 4-20mA current feedback',
      channel: -1,
    },
    1030: {
      name: 'PORT-11 distance',
      channel: -1,
    },
    1031: {
      name: 'PORT-11 level',
      channel: -1,
    },
    1032: {
      name: 'PORT-11 4-20mA current feedback',
      channel: -1,
    },
    1033: {
      name: 'PORT-12 distance',
      channel: -1,
    },
    1034: {
      name: 'PORT-12 level',
      channel: -1,
    },
    1035: {
      name: 'PORT-12 4-20mA current feedback',
      channel: -1,
    },
  },
};

function ZBHART(master, cfg) {
  this.master = master;
  this.cfg = cfg;
  this.ioRegs = common.deepCopy(modbusRegisters);
}

ZBHART.prototype = {
  constructor: ZBHART,
};

/**
 * create ZBHART I/O board object.
 * @param {object} master - ZBMaster instance
 * @param {object} cfg - ZBANA board configuration
 cfg: {
   type: 'zbhart',
   address: XXX,
   commFault: XXX,
   ports: [
     {
       channel: XXX,
       sensorType: 'vegaXXX'|'godaYYY',
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
  const zbhart = new ZBHART(master, cfg);

  return zbhart;
}

module.exports = {
  createBoard,
};
