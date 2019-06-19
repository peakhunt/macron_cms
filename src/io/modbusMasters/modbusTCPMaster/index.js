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
  const { delay } = master.cfg.target;
  const sched = self.cfg.schedules[self.pollNdx];

  self.pollNdx += 1;
  self.pollNdx %= self.cfg.schedules.length;

  self.client.setID(sched.slave);

  logger.info(`pollNext ${util.inspect(sched)}`);

  self.delayTmr = setTimeout(() => {
    // eslint-disable-next-line no-use-before-define
    requestHandlers[sched.func][sched.register](master, sched, pollNext, restartMaster);
  }, delay);
}

function startPolling(master) {
  const self = master;
  const { timeout } = self.cfg.target;

  self.client.setTimeout(timeout);

  self.pollNdx = 0;

  pollNext(master);
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

  if (self.reconnTmr !== null) {
    clearTimeout(self.reconnTmr);
    self.reconnTmr = null;
  }
}

function startModbusMaster(master) {
  const self = master;
  const { host, port, reconnectTmr } = self.cfg.target;

  self.pollNdx = 0;
  self.client = new ModbusRTU();

  self.client.connectTCP(host, { port })
    .then(() => {
      logger.info(`connected to ${host}:${port}. start polling`);
      startPolling(self);
    })
    .catch((err) => {
      logger.error(`error ${err.stack}`);
      logger.error(`failed to connect to ${host}:${port} ${err}`);
      stopModbusMaster(self);

      self.reconnTmr = setTimeout(() => { startModbusMaster(self); }, reconnectTmr);
    });
}

function restartMaster(master) {
  stopModbusMaster(master);
  setTimeout(() => { startModbusMaster(master); }, 1000);
}

function ModbusTCPMaster(cfg) {
  const self = this;

  self.cfg = cfg;
  self.client = null;
  self.reconnTmr = null;
  self.delayTmr = null;
  self.pollNdx = 0;
}

ModbusTCPMaster.prototype.startMaster = function _startMaster() {
  startModbusMaster(this);
};

ModbusTCPMaster.prototype.stopMaster = function _stopMaster() {
  stopModbusMaster(this);
};

function createModbusTCPMaster(cfg) {
  const modbusTCPMaster = new ModbusTCPMaster(cfg);

  return modbusTCPMaster;
}

module.exports = {
  createModbusTCPMaster,
};
