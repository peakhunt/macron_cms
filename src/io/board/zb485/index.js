const logger = require('../../../logger');
const core = require('../../../core');

const ZB485StateEnum = {
  Init: 0,
  SensorTypeSetup: 1,
  PowerSetup: 2,
  ReadCommStatus: 3,
  ExecuteANSGCNV: 4,
};

const ANSGCNVStateEnum = {
  Init: 0,
  ChannelSetup: 1,
  ChannelSetupCommit: 2,
  ReadStatusInput: 3,
};

function ZB485(master, cfg) {
  const self = this;

  self.master = master;
  self.cfg = cfg;
  self.slaves = [];
  self.state = ZB485StateEnum.Init;
  self.next_slave_ndx = 0;

  cfg.ports.forEach((pcfg, ndx) => {
    const slave = {
      cfg: pcfg,
      port: ndx + 1,
      state: ANSGCNVStateEnum.Init,
      commStatus: false,
      channels: [
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
        { stat: 0, value: 0 },
      ],
    };

    self.slaves.push(slave);
  });
}

function setZB456State(zb485, state) {
  const self = zb485;

  self.state = state;

  if (self.state >= ZB485StateEnum.PowerSetup) {
    // communication ok
    core.getChannel(self.cfg.commFault).sensorValue = false;
  } else {
    // communication fail
    logger.info(`zb485 comm fault ${self.cfg.address} ${self.cfg.commFault}`);
    core.getChannel(self.cfg.commFault).sensorValue = true;

    // FIXME make all slaves comm fault???
  }
}

function setSlaveState(zb485, slave, state) {
  const s = slave;

  s.state = state;

  if (s.state >= ANSGCNVStateEnum.ChannelSetupCommit) {
    // communication ok
    core.getChannel(s.cfg.commFault).sensorValue = false;
  } else {
    // communication fail
    logger.info(`zb485 slave comm fault ${zb485.cfg.address}:${slave.port}`);
    core.getChannel(s.cfg.commFault).sensorValue = true;
  }
}

function pickNextSlave(zb485) {
  const self = zb485;
  let slave = null;

  for (let i = 0; i < 8; i += 1) {
    const ndx = (self.next_slave_ndx + i) % 8;

    if (self.slaves[ndx].cfg.use && self.slaves[ndx].commStatus === true) {
      slave = self.slaves[ndx];
      self.next_slave_ndx = (ndx + 1) % 8;
      break;
    }
  }
  return slave;
}

function ansgcnvChannelSetup(zb485, slave, modbus, resolve, reject) {
  const s = slave;
  const addr = s.port * 1000 + 350;
  const regs = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]; // all temperature

  modbus.writeRegisters(addr, regs)
    .then(() => {
      setSlaveState(zb485, s, ANSGCNVStateEnum.ChannelSetupCommit);
      resolve();
    })
    .catch((e) => {
      logger.info(`zb485 ansgcnvChannelSetup ${zb485.cfg.address} ${s.port} error ${e}`);
      setSlaveState(zb485, s, ANSGCNVStateEnum.Init);
      reject();
    });
}

function ansgcnvChannelSetupCommit(zb485, slave, modbus, resolve, reject) {
  const s = slave;
  const addr = s.port * 1000 + 370;
  const regs = [1]; // commit

  //
  // hack.
  // this can take a very long time
  //
  modbus.setTimeout(3000);

  modbus.writeRegisters(addr, regs)
    .then(() => {
      setSlaveState(zb485, s, ANSGCNVStateEnum.ReadStatusInput);
      resolve();
    })
    .catch((e) => {
      logger.info(`zb485 ansgcnvChannelSetupCommit ${zb485.cfg.address} ${s.port} error ${e}`);
      setSlaveState(zb485, s, ANSGCNVStateEnum.Init);
      reject();
    });
}

function ansgcnvReadStatusAndInput(zb485, slave, modbus, resolve, reject) {
  const self = zb485;
  const s = slave;
  const addr = s.port * 1000 + 0;

  modbus.readInputRegisters(addr, 28)
    .then((d) => {
      for (let i = 0; i < 14; i += 1) {
        const chnlCfg = slave.cfg.channels[i];

        if (chnlCfg.use === true) {
          const stat = d[i * 2 + 0];
          const data = d[i * 2 + 1];
          const chnl = core.getChannel(chnlCfg.channel);

          /* eslint-disable no-bitwise */
          if ((stat & 0x01) !== 0) {
            chnl.sensorFault = true; // conversion fail
          } else {
            chnl.sensorFault = false; // conversion ok
          }

          s.channels[i].stat = stat;
          s.channels[i].value = data;

          chnl.sensorValue = data / 100.0;
        }
      }
      resolve();
    })
    .catch((e) => {
      logger.info(`zb485 ansgcnvReadStatusAndInput ${zb485.cfg.address} ${s.port} error ${e}`);
      setZB456State(self, ZB485StateEnum.Init);
      setSlaveState(zb485, s, ANSGCNVStateEnum.Init);
      reject();
    });
}

function executeANSGCNV(zb485, modbus, resolve, reject) {
  const self = zb485;
  const slave = pickNextSlave(self);

  if (slave === null) {
    process.nextTick(() => resolve());
    return;
  }

  if (slave.state === ANSGCNVStateEnum.Init) {
    slave.state = ANSGCNVStateEnum.ChannelSetup;
  }

  switch (slave.state) {
    case ANSGCNVStateEnum.ChannelSetup:
      ansgcnvChannelSetup(self, slave, modbus, resolve, reject);
      break;

    case ANSGCNVStateEnum.ChannelSetupCommit:
      ansgcnvChannelSetupCommit(self, slave, modbus, resolve, reject);
      break;

    case ANSGCNVStateEnum.ReadStatusInput:
      ansgcnvReadStatusAndInput(self, slave, modbus, resolve, reject);
      break;

    default:
      break;
  }
}

function setupSensorType(zb485, modbus, resolve, reject) {
  const self = zb485;
  const regs = [0, 0, 0, 0, 0, 0, 0, 0]; // everything to AN-SGCNV

  modbus.writeRegisters(10000, regs)
    .then(() => {
      setZB456State(self, ZB485StateEnum.PowerSetup);
      resolve();
    })
    .catch((e) => {
      logger.info(`zb485 setupSensorType ${zb485.cfg.address} error ${e}`);
      setZB456State(self, ZB485StateEnum.Init);
      reject();
    });
}

function setupPower(zb485, modbus, resolve, reject) {
  const self = zb485;
  const regs = [];

  // build coil registers for power setup
  self.cfg.ports.forEach((pcfg) => {
    regs.push(pcfg.use);
  });

  modbus.writeCoils(10000, regs)
    .then(() => {
      setZB456State(self, ZB485StateEnum.ReadCommStatus);
      resolve();
    })
    .catch((e) => {
      logger.info(`zb485 setupPower ${zb485.cfg.address} error ${e}`);
      setZB456State(self, ZB485StateEnum.Init);
      reject();
    });
}

function readCommStatus(zb485, modbus, resolve, reject) {
  const self = zb485;

  modbus.readDiscreteInputs(10000, 8)
    .then((d) => {
      for (let i = 0; i < 8; i += 1) {
        self.slaves[i].commStatus = d[i];
      }
      setZB456State(self, ZB485StateEnum.ExecuteANSGCNV);
      resolve();
    })
    .catch((e) => {
      logger.info(`zb485 readCommStatus ${zb485.cfg.address} error ${e}`);
      setZB456State(self, ZB485StateEnum.Init);
      reject();
    });
}

function executeStateMachine(zb485, modbus, resolve, reject) {
  const self = zb485;

  modbus.setID(self.cfg.address);

  if (self.state === ZB485StateEnum.Init) {
    setZB456State(self, ZB485StateEnum.SensorTypeSetup);
  }

  switch (self.state) {
    case ZB485StateEnum.SensorTypeSetup:
      setupSensorType(self, modbus, resolve, reject);
      break;

    case ZB485StateEnum.PowerSetup:
      setupPower(self, modbus, resolve, reject);
      break;

    case ZB485StateEnum.ReadCommStatus:
      readCommStatus(self, modbus, resolve, reject);
      break;

    case ZB485StateEnum.ExecuteANSGCNV:
      executeANSGCNV(zb485, modbus, resolve, reject);
      break;

    default:
      break;
  }
}

ZB485.prototype = {
  constructor: ZB485,
  executeSchedule(modbus) {
    const self = this;

    return new Promise((resolve, reject) => {
      executeStateMachine(self, modbus, resolve, reject);
    });
  },
  printIO(client) {
    const board = this;

    client.write(`type        - ${board.cfg.type}\r\n`);
    client.write(`comm fault  - ${core.getChannel(board.cfg.commFault).engValue}\r\n`);
    board.slaves.forEach((slave, ndx) => {
      client.write(`port-${ndx + 1} use: ${slave.cfg.use}\r\n`);
      if (slave.cfg.use === true) {
        client.write(`    comm fault - ${core.getChannel(slave.cfg.commFault).engValue}\r\n`);
        slave.channels.forEach((c, cndx) => {
          client.write(`    ch-${cndx} stat: ${c.stat} value: ${c.value}\r\n`);
        });
      }
    });
  },
};

function createBoard(master, cfg) {
  const zb485 = new ZB485(master, cfg);

  return zb485;
}

module.exports = {
  createBoard,
};
