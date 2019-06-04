const cms = require('../../../cms');

function getVesselStatus(req, res) {
  res.json(cms.vessel.getStatus());
}

function vesselInit(router) {
  router.get('/vessel', getVesselStatus);
}

module.exports = vesselInit;
