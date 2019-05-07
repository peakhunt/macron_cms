// const vessel = require('./vessel');
const tank = require('./tank');

const tankList = [];

/**
 * initialize CMS
 * @param {object} cfg - system configuration
 cfg: {
  project: {
    tanks: {
      ...
    }
  }
 }
 */
function initCMS(cfg) {
  cfg.tanks.forEach((tcfg) => {
    tankList.push(tank.createTank(tcfg));
  });
}

module.exports = {
  initCMS,
  getTankList() {
    return tankList;
  },
  getTankByName(name) {
    for (let ndx = 0; ndx < tankList.length; ndx += 1) {
      if (tankList[ndx].cfg.name === name) {
        return tankList[ndx];
      }
    }
    return undefined;
  },
};
