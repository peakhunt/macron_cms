const ModbusRTU = require('modbus-serial');
const util = require('util');
const logger = require('../../../logger');
const common = require('../common');

const requestHandlers = {
  read: {
    inputs: common.readInputs,
    holdings: common.readHoldings,
    discretes: common.readDiscretes,
    coils: common.readCoils,
  },
  write: {
    holdings: common.writeHoldings,
    coils: common.writeCoils,
  },
};

function pollNext(master) {
  const self = master;
  const sched = self.cfg.schedules[self.pollNdx];

  self.pollNdx += 1;
  self.pollNdx %= self.cfg.schedules.length;

  self.client.setID(sched.slave);

  logger.info(`pollNext ${util.inspect(sched)}`);

  // eslint-disable-next-line no-use-before-define
  requestHandlers[sched.func][sched.register](master, sched, pollSuccessBack, pollErrorBack);
}

function pollSuccessBack(master, sched) {
  const self = master;
  const { delay } = self.cfg;

  logger.info(`pollSuccessBack ${util.inspect(sched)}`);

  self.delayTmr = setTimeout(() => {
    pollNext(master);
  }, delay);
}

function pollErrorBack(master, sched) {
  logger.error(`pollErrorBack ${util.inspect(sched)}`);
  pollNext(master);
}

function startPolling(master) {
  const self = master;

  self.client.setTimeout(self.cfg.timeout);
  self.pollNdx = 0;

  pollNext(master);
}

function startModbusMaster(master) {
  const self = master;
  const { serial } = self.cfg.transport;

  self.client = new ModbusRTU();

  self.client.connectRTUBuffered(serial.port, {
    baudRate: serial.baud,
    dataBits: serial.dataBit,
    stopBits: serial.stopBit === '1' ? 1 : 2,
    parity: serial.parity,
  }).then(() => {
    startPolling(self);
  }).catch((err) => {
    logger.error(`failed to start modbusRTUMaster ${serial.port} ${err}`);
  });
}

function stopModbusMaster(master) {
  const self = master;

  if (self.delayTmr !== null) {
    clearTimeout(self.delayTmr);
    self.delayTmr = null;
  }

  if (self.client !== null) {
    self.client.close();
    self.client = null;
  }
}

function ModbusRTUMaster(cfg) {
  const self = this;

  self.cfg = cfg;
  self.client = null;
  self.delayTmr = null;
  self.pollNdx = 0;
}

ModbusRTUMaster.prototype.startMaster = function _startMaster() {
  startModbusMaster(this);
};

ModbusRTUMaster.prototype.stopMaster = function _stopMaster() {
  stopModbusMaster(this);
};

function createModbusRTUMaster(cfg) {
  const modbusRTUMaster = new ModbusRTUMaster(cfg);

  return modbusRTUMaster;
}

module.exports = {
  createModbusRTUMaster,
};
