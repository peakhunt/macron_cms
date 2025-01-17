const core = require('../core');

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

function cmdHandlerChannelValue(client, cmd) {
  if (cmd.length !== 3) {
    client.write('invalid command\r\n');
    client.write(`${cmd[0]} channel-number value\r\n`);
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

  let v;

  if (chnl.cfg.type === 'digital') {
    v = (cmd[2] === 'true');
  } else {
    v = parseFloat(cmd[2]);
  }
  chnl.engValue = v;
}

function cmdHandlerChannelSensor(client, cmd) {
  if (cmd.length !== 3) {
    client.write('invalid command\r\n');
    client.write(`${cmd[0]} channel-number true|false\r\n`);
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

  const v = (cmd[2] === 'true');
  chnl.sensorFault = v;
}

const _commands = {
  channel: {
    desc: 'show channel info',
    handler: cmdHandlerChannel,
  },
  channel_value: {
    desc: 'set channel value',
    handler: cmdHandlerChannelValue,
  },
  channel_sensor: {
    desc: 'set channel sensor fault status',
    handler: cmdHandlerChannelSensor,
  },
};

module.exports = {
  commands: _commands,
};
