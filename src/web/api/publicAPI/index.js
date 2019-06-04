const hello = require('./hello');
const config = require('./config');
const tankStatus = require('./tankStatus');
const alarm = require('./alarm');
const channel = require('./channel');
const vessel = require('./vessel');

function init(router) {
  hello(router);
  config(router);
  tankStatus(router);
  alarm(router);
  channel(router);
  vessel(router);
}

module.exports = {
  init,
};
