const ModbusRTU = require('modbus-serial');
const zbana = require('../zbana');
const zbhart = require('../zbhart');
const logger = require('../../../logger');

function pollZBBoard(zbmaster) {
  const board = zbmaster.boards[zbmaster.pollNdx];
  const master = zbmaster;

  board.executeSchedule(master.modbus).then(() => {
    master.pollNdx = (master.pollNdx + 1) % master.boards.length;
    pollZBBoard(master);
  }).catch(() => {
    master.pollNdx = (master.pollNdx + 1) % master.boards.length;
    pollZBBoard(master);
  });
}

function ZBMaster(cfg) {
  this.cfg = cfg;
  this.boards = [];
  this.pollNdx = 0;

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
  const self = this;

  self.modbus = new ModbusRTU();
  self.modbus.connectRTU(cfg.transport.serial.port, {
    baudRate: cfg.transport.serial.baud,
    dataBits: cfg.transport.serial.dataBit,
    stopBits: cfg.transport.serial.stopBit === '1' ? 1 : 2,
    parity: cfg.transport.serial.parity,
  }).then(() => {
    self.modbus.setTimeout(cfg.poll.timeout);
    pollZBBoard(self);
  }).catch((err) => {
    //
    // error
    //
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
    type: 'zbSerialMaster',
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
