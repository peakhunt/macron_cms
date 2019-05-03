const telnet = require('telnet');
const logger = require('../logger');
const pkg = require('../../package.json');

function cmdHandlerHello(client, cmd) {
  Object.keys(_commands).forEach((c) => {
    client.write(`${c}\t - ${_commands[c].desc}\r\n`);
  });
}

function cmdHandlerVersion(client, cmd) {
  client.write(`${pkg.name} - ${pkg.version}\r\n`);
}

const _commands = {
  help: {
    desc: 'show help',
    handler: cmdHandlerHello,
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

  if (cmd.length === 0) {
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
      tClient.write('\r\n');

      executeCLICommand(tClient, tClient._ext_cmd);

      tClient.write('\r\n');
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

function initCLI() {
  telnet.createServer(serverHandler).listen(10123);
}

module.exports = {
  initCLI,
};
