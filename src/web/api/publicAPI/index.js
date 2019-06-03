const hello = require('./hello');
const config = require('./config');
const tankStatus = require('./tankStatus');
const alarm = require('./alarm');
const channel = require('./channel');

function init(router) {
  hello(router);
  config(router);
  tankStatus(router);
  alarm(router);
  channel(router);
}

module.exports = {
  init,
};
