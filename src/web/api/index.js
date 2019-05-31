const express = require('express');
const publicAPI = require('./publicAPI');
const privateAPI = require('./privateAPI');

function apiInit(app) {
  const publicRouter = express.Router();
  const privateRouter = express.Router();

  publicAPI.init(publicRouter);
  privateAPI.init(privateRouter);

  app.use('/api/public', publicRouter);
  app.use('/api/private', privateRouter);
}

module.exports = {
  apiInit,
};
