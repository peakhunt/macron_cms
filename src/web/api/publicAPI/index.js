const hello = require('./hello');
const config = require('./config');
const tankStatus = require('./tankStatus');

function init(router) {
  hello(router);
  config(router);
  tankStatus(router);
}

module.exports = {
  init,
};
