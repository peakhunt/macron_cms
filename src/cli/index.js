const telnet = require('telnet');
const logger = require('../logger');
const pkg = require('../../package.json');
const channelCLI = require('./channelCLI');
const alarmCLI = require('./alarmCLI');
const ioCLI = require('./ioCLI');
const tankCLI = require('./tankCLI');
const loggerCLI = require('./loggerCLI');
const modbusCLI = require('./modbusCLI');

function cmdHandlerHelp(client) {
  // eslint-disable-next-line no-use-before-define
  Object.keys(_commands).forEach((c) => {
    // eslint-disable-next-line no-use-before-define
    client.write(`${c}\t - ${_commands[c].desc}\r\n`);
  });
  client.write('\r\n');
}

function cmdHandlerVersion(client) {
  client.write(`${pkg.name} - ${pkg.version}\r\n`);
  client.write('\r\n');
}

const _commands = {
  help: {
    desc: 'show help',
    handler: cmdHandlerHelp,
  },
  version: {
    desc: 'show program version',
    handler: cmdHandlerVersion,
  },
};

function cliPrompt(client) {
  client.write('CMS CLI>');
}

function executeCLICommand(client, input) {
  logger.info(`executing command |${input}|`);

  const re = /\s+|\t+/;
  const cmd = input.split(re);

  if (cmd[0] === '') {
    return;
  }

  const cmdDef = _commands[cmd[0]];

  if (cmdDef === undefined) {
    client.write(`Unknown command ${cmd[0]}\r\n`);
    return;
  }

  cmdDef.handler(client, cmd);
}

function onClientData(client, b) {
  const str = b.toString('ascii');
  const tClient = client;

  for (let i = 0; i < str.length; i += 1) {
    const c = str.charAt(i);

    if (c === '\r' || c === '\n') {
      // tClient.write('\r\n');

      executeCLICommand(tClient, tClient._ext_cmd);

      cliPrompt(tClient);

      tClient._ext_cmd = '';
    } else {
      tClient._ext_cmd += c;
      // client.write(c);
    }
  }
}

function serverHandler(client) {
  const tClient = client;

  tClient.do.transmit_binary();
  tClient.do.window_size();

  tClient.on('data', (b) => {
    onClientData(tClient, b);
  });

  tClient.write('connected macron CMS CLI\r\n');
  cliPrompt(tClient);

  tClient._ext_cmd = '';
}

function initCLI(cfg) {
  Object.assign(_commands,
    channelCLI.commands,
    alarmCLI.commands,
    ioCLI.commands,
    tankCLI.commands,
    loggerCLI.commands,
    modbusCLI.commands);
  telnet.createServer(serverHandler).listen(cfg.port);
}

module.exports = {
  initCLI,
};
