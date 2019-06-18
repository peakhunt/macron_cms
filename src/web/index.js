const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const logger = require('../logger');
const api = require('./api');

function webInit(cfg) {
  logger.info(`starting web interface on ${cfg.port}`);

  const app = express();

  // to prevent 304
  app.disable('etag');

  app.use(express.static('public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());
  app.use(bodyParser.json({ type: 'application/json' }));
  app.use(expressValidator());

  api.apiInit(app);

  app.listen(cfg.port, () => {
    logger.info('web interface startup complete');
  });
}

module.exports = {
  webInit,
};
