const ModbusRTU = require('modbus-serial');
const zbana = require('../zbana');
const zbhart = require('../zbhart');
const logger = require('../../../logger');

function ZBMaster(cfg) {
  this.cfg = cfg;
  this.boards = [];

  cfg.boards.forEach((bCfg) => {
    switch (bCfg.type) {
      case 'zbana':
        this.boards.push(zbana.createBoard(this, bCfg));
        break;

      case 'zbhart':
        this.boards.push(zbhart.createBoard(this, bCfg));
        break;

      default:
        break;
    }
  });

  //
  // setup modbus master
  //
  this.modbus = new ModbusRTU();
  this.modbus.connectRTU(cfg.transport.serial.port, {
    baudRate: cfg.transport.serial.baud,
    dataBits: cfg.transport.serial.dataBit,
    stopBits: cfg.transport.serial.stopBit === '1' ? 1 : 2,
    parity: cfg.transport.serial.parity,
  }).then(() => {
    //
    // FIXME start client polling
    //
  }).catch((err) => {
    // error
    logger.error(`failed to start ZBMaster ${err}`);
  });
}

ZBMaster.prototype = {
  constructor: ZBMaster,
};

/**
 * create I/O board master.
 * @param {object} cfg - I/O board master configuration
  cfg: {
    transport: {
      serial: {
        port: '/dev/ttyXXX',
        baud: 38400,
        dataBit: 8,
        stopBit: '1'|'1.5',
        parity: 'none'|'even'|'odd',
      },
    },
    poll: {
      timeout: 1000,
    },
    boards: [], // an array of board configuration
  }
 */
function createMaster(cfg) {
  const zbmaster = new ZBMaster(cfg);

  return zbmaster;
}

module.exports = {
  createMaster,
};
