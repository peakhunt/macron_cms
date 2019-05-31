
/* eslint-disable no-unused-vars */
function getTankStatus(req, res) {
}

function tankStatusInit(router) {
  router.get('/tank_status', getTankStatus);
}

module.exports = tankStatusInit;
