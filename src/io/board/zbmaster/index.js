const ModbusRTU = require('modbus-serial');
const zbana = require('../zbana');
const zbhart = require('../zbhart');
const zb485 = require('../zb485');
const logger = require('../../../logger');

function pollZBBoard(zbmaster) {
  const board = zbmaster.boards[zbmaster.pollNdx];
  const master = zbmaster;

  master.modbus.setTimeout(board.cfg.timeout);

  board.counters.numReq += 1;

  board.executeSchedule(master.modbus).then((ret) => {
    if (ret === undefined && ret.skip === false) {
      board.counters.numSuccess += 1;
    } else {
      board.counters.numReq -= 1;
    }

    master.pollNdx = (master.pollNdx + 1) % master.boards.length;
    pollZBBoard(master);
  }).catch(() => {
    board.counters.numFail += 1;

    master.pollNdx = (master.pollNdx + 1) % master.boards.length;
    pollZBBoard(master);
  });
}

function ZBMaster(cfg) {
  this.cfg = cfg;
  this.boards = [];
  this.pollNdx = 0;
  let board = null;

  cfg.boards.forEach((bCfg) => {
    switch (bCfg.type) {
      case 'zbana':
        board = zbana.createBoard(this, bCfg);
        break;

      case 'zbhart':
        board = zbhart.createBoard(this, bCfg);
        break;

      case 'zb485':
        board = zb485.createBoard(this, bCfg);
        break;

      default:
        board = null;
        break;
    }

    if (board !== null) {
      board.counters = {
        numReq: 0,
        numSuccess: 0,
        numFail: 0,
      };
      this.boards.push(board);
    }
  });

  //
  // setup modbus master
  //
  const self = this;

  self.modbus = new ModbusRTU();
  self.modbus.connectRTUBuffered(cfg.transport.serial.port, {
    baudRate: cfg.transport.serial.baud,
    dataBits: cfg.transport.serial.dataBit,
    stopBits: cfg.transport.serial.stopBit === '1' ? 1 : 2,
    parity: cfg.transport.serial.parity,
  }).then(() => {
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
