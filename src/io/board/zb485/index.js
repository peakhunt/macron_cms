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
  ReadStatusInput: 2,
};

function ZB485(master, cfg) {
  const self = this;

  self.master = master;
  self.cfg = cfg;
  self.slaves = [];
  self.state = ZB485StateEnum.Init;

  cfg.ports.forEach((pcfg, ndx) => {
    if (pcfg.use === true) {
      const slave = {
      };

      slave.cfg = pcfg;
      slave.port = (ndx + 1);
      slave.state = ANSGCNVStateEnum.Init;

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
