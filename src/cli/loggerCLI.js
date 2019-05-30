const logger = require('../logger');

function cmdHandlerLoglevel(client, cmd) {
  if (cmd.length !== 2) {
    client.write(`current log level ${logger.getLevel()}\r\n`);
    client.write('\r\n');
    return;
  }

  logger.setLevel(cmd[1]);
  client.write(`set log level to ${cmd[1]}\r\n`);
  client.write('\r\n');
}

const _commands = {
  loglevel: {
    desc: 'show or set log level',
    handler: cmdHandlerLoglevel,
  },
};

module.exports = {
  commands: _commands,
};
