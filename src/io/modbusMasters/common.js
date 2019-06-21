const logger = require('../../logger');
const core = require('../../core');

function getSlaveReg(master, slaveAddr, regAddr, regType) {
  const slave = master.cfg.slaves[slaveAddr];

  if (slave === undefined) {
    logger.error(`getSlaveReg no slave found ${master.cfg.type} ${regType} ${slaveAddr}:${regAddr}`);
    return undefined;
  }

  return slave.registers[regType][regAddr];
}

function readInputs(master, sched, successBack, errorBack) {
  const { addr, numRegs } = sched;
  const { client } = master;

  client.readInputRegisters(addr, numRegs)
    .then((d) => {
      for (let i = 0, regAddr = addr; i < d.data.length && i < numRegs; i += 1, regAddr += 1) {
        const r = d.data[i];
        const reg = getSlaveReg(master, sched.slave, regAddr, 'inputs');

        if (reg === undefined) {
          logger.error(`no input register ${master.cfg.type} ${sched.slave} ${regAddr}`);
          return;
        }

        const { conv } = reg;
        const v = r * conv.a + conv.b;

        // logger.error(`setting input register for ${sched.slave} ${reg.channel} to ${v}`);
        core.getChannel(reg.channel).sensorValue = v;
      }
      successBack(master, sched);
    })
    .catch((e) => {
      logger.error(`failed to read inputs ${e}, ${sched.slave}, ${addr}:${numRegs}`);
      errorBack(master, sched);
    });
}

function readHoldings(master, sched, successBack, errorBack) {
  const { addr, numRegs } = sched;
  const { client } = master;

  client.readHoldingRegisters(addr, numRegs)
    .then((d) => {
      for (let i = 0, regAddr = addr; i < d.data.length && i < numRegs; i += 1, regAddr += 1) {
        const r = d.data[i];
        const reg = getSlaveReg(master, sched.slave, regAddr, 'holdings');

        if (reg === undefined) {
          logger.error(`no holding register ${master.cfg.type} ${sched.slave} ${regAddr}`);
          return;
        }

        const { conv } = reg;
        const v = r * conv.a + conv.b;

        core.getChannel(reg.channel).setSensorValue = v;
      }
      successBack(master, sched);
    })
    .catch((e) => {
      logger.error(`failed to read holdings ${e}, ${sched.slave}, ${addr}:${numRegs}`);
      errorBack(master, sched);
    });
}

function readDiscretes(master, sched, successBack, errorBack) {
  const { addr, numRegs } = sched;
  const { client } = master;

  client.readDiscreteInputs(addr, numRegs)
    .then((d) => {
      for (let i = 0, regAddr = addr; i < d.data.length && i < numRegs; i += 1, regAddr += 1) {
        const v = d.data[i];
        const reg = getSlaveReg(master, sched.slave, regAddr, 'discretes');

        if (reg === undefined) {
          logger.error(`no discrets register ${master.cfg.type} ${sched.slave} ${regAddr}`);
          return;
        }
        core.getChannel(reg.channel).setSensorValue = v;
      }
      successBack(master, sched);
    })
    .catch((e) => {
      logger.error(`failed to read discretes ${e}, ${sched.slave}, ${addr}:${numRegs}`);
      errorBack(master, sched);
    });
}

function readCoils(master, sched, successBack, errorBack) {
  const { addr, numRegs } = sched;
  const { client } = master;

  client.readCoils(addr, numRegs)
    .then((d) => {
      for (let i = 0, regAddr = addr; i < d.data.length && i < numRegs; i += 1, regAddr += 1) {
        const v = d.data[i];
        const reg = getSlaveReg(master, sched.slave, regAddr, 'coils');

        if (reg === undefined) {
          logger.error(`no coil register ${master.cfg.type} ${sched.slave} ${regAddr}`);
          return;
        }

        core.getChannel(reg.channel).setSensorValue = v;
      }
      successBack(master, sched);
    })
    .catch((e) => {
      logger.error(`failed to read coils ${e}, ${sched.slave}, ${addr}:${numRegs}`);
      errorBack(master, sched);
    });
}

function writeHoldings() {
  // FIXME
}

function writeCoils() {
  // FIXME
}

module.exports = {
  readInputs,
  readHoldings,
  readDiscretes,
  readCoils,
  writeHoldings,
  writeCoils,
};
