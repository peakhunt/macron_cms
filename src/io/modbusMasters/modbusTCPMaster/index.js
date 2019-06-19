const modbus = require('modbus-serial');
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
    inputs: () => {
      // FIXME
    },
    holdings: () => {
      // FIXME
    },
    discretes: () => {
      // FIXME
    },
    coils: () => {
      // FIXME
    },
  },
};

function pollNext(master) {
  const self = master;
  const sched = self.cfg.schedules[self.pollNext];

  self.pollNext += 1;
  self.pollNext %= self.cfg.schedules.length;

  self.client.setID(sched.slave);

  // eslint-disable-next-line no-use-before-define
  requestHandlers[sched.func][sched.register](master, sched, pollNext, restartMaster);
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

  self.client = new modbus.ModbusRTU();

  self.client.connectTCP(host, { port })
    .then(() => {
      logger.info(`connected to ${host}:${port}. start polling`);
      startPolling(self);
    })
    .error((err) => {
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
