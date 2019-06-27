function ZB485(master, cfg) {
  const self = this;

  self.master = master;
  self.cfg = cfg;
  self.slaves = [];

  cfg.ports.forEach((pcfg, ndx) => {
    if (pcfg.use === true) {
      const slave = {
      };

      slave.cfg = pcfg;
      slave.port = (ndx + 1);

      self.slaves.push(slave);
    }
  });
}

function createBoard(master, cfg) {
  const zb485 = new ZB485(master, cfg);

  return zb485;
}

module.exports = {
  createBoard,
};
