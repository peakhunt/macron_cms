const telnet = require('telnet');
const logger = require('../logger');
const pkg = require('../../package.json');
const core = require('../core');
const alarm = require('../core/alarm');

function cmdHandlerHello(client) {
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

function cmdHandlerChannel(client, cmd) {
  if (cmd.length !== 2) {
    client.write('invalid command\r\n');
    client.write(`${cmd[0]} channel-number\r\n`);
    client.write('\r\n');
    return;
  }

  const channelNum = parseInt(cmd[1], 10);
  const chnl = core.getChannel(channelNum);

  if (chnl === undefined) {
    client.write(`no channel ${channelNum}\r\n`);
    client.write('\r\n');
    return;
  }

  client.write(`number    \t - ${chnl.number}\r\n`);
  client.write(`type      \t - ${chnl.cfg.type}\r\n`);
  client.write(`eng value \t - ${chnl.engValue}\r\n`);
  client.write(`sns value \t - ${chnl.sensorValue}\r\n`);
  client.write(`sns fault \t - ${chnl.sensorFault}\r\n`);

  client.write('\r\n');
}

function cmdHandlerAlarm(client, cmd) {
  if (cmd.length !== 2) {
    client.write('invalid command\r\n');
    client.write(`${cmd[0]} alarm-number\r\n`);
    client.write('\r\n');
    return;
  }

  const alarmNum = parseInt(cmd[1], 10);
  const alm = core.getAlarm(alarmNum);

  if (alm === undefined) {
    client.write(`no alarm ${alarmNum}\r\n`);
    client.write('\r\n');
    return;
  }

  client.write(`number    \t - ${alm.number}\r\n`);
  client.write(`type      \t - ${alm.cfg.type === undefined ? 'digital' : alm.cfg.type}\r\n`);
  client.write(`severity  \t - ${alm.cfg.severity}\r\n`);
  client.write(`name      \t - ${alm.cfg.name}\r\n`);
  client.write(`channel   \t - ${alm.cfg.channel}\r\n`);
  client.write(`set       \t - ${alm.cfg.set}\r\n`);
  client.write(`delay     \t - ${alm.cfg.delay}\r\n`);
  client.write(`state     \t - ${alarm.alarmStateString[alm.state]}\r\n`);
  client.write(`dstate    \t - ${alarm.alarmDelayStateString[alm.delayState]}\r\n`);

  client.write('\r\n');
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
  channel: {
    desc: 'show channel info',
    handler: cmdHandlerChannel,
  },
  alarm: {
    desc: 'show alarm info',
    handler: cmdHandlerAlarm,
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

function initCLI() {
  telnet.createServer(serverHandler).listen(10123);
}

module.exports = {
  initCLI,
};
