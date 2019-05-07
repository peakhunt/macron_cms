const core = require('../core');
const alarm = require('../core/alarm');

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
  alarm: {
    desc: 'show alarm info',
    handler: cmdHandlerAlarm,
  },
};

module.exports = {
  commands: _commands,
};
