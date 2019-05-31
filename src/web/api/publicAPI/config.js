const config = require('../../../core/config');

function getConfig(req, res) {
  res.json(config.data);
}

function configInit(router) {
  router.get('/config', getConfig);
}

module.exports = configInit;
