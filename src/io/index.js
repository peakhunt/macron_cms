const zbmaster = require('./board/zbmaster');

const zbmasterList = [];

/**
 * initialize I/O subsystem
 * @param {object} cfg - I/O configuration from system config
 cfg: {
  serial: [
  ],
  net: [
  ]
 }
 */
function initIO(cfg) {
  // serial
  cfg.serial.forEach((scfg) => {
    switch (scfg.type) {
      case 'zbSerialMaster':
        zbmasterList.push(zbmaster.createMaster(scfg));
        break;

      default:
        break;
    }
  });

  // net XXX none yet
}

module.exports = {
  initIO,
};
