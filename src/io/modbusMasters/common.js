const logger = require('../../logger');

function readInputs(master, sched, successBack, errorBack) {
  const { addr, numRegs } = sched;
  const { client } = master;

  client.readInputRegisters(addr, numRegs)
    .then(() => {
      // FIXME handle data
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
    .then(() => {
      // FIXME handle data
      successBack(master, sched);
    })
    .catch((e) => {
      logger.error(`failed to read inputs ${e}, ${sched.slave}, ${addr}:${numRegs}`);
      errorBack(master, sched);
    });
}

function readDiscretes(master, sched, successBack, errorBack) {
  const { addr, numRegs } = sched;
  const { client } = master;

  client.readDiscreteInputs(addr, numRegs)
    .then(() => {
      // FIXME handle data
      successBack(master, sched);
    })
    .catch((e) => {
      logger.error(`failed to read inputs ${e}, ${sched.slave}, ${addr}:${numRegs}`);
      errorBack(master, sched);
    });
}

function readCoils(master, sched, successBack, errorBack) {
  const { addr, numRegs } = sched;
  const { client } = master;

  client.readCoils(addr, numRegs)
    .then(() => {
      // FIXME handle data
      successBack(master, sched);
    })
    .catch((e) => {
      logger.error(`failed to read inputs ${e}, ${sched.slave}, ${addr}:${numRegs}`);
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
