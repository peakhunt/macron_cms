const cms = require('../../../cms');

function getTankStatus(req, res) {
  const tanks = [
  ];

  cms.getTankList().forEach((tank) => {
    tanks.push(tank.getTankStatus());
  });

  res.json(tanks);
}

function tankStatusInit(router) {
  router.get('/tank_status', getTankStatus);
}

module.exports = tankStatusInit;
