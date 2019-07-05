const cms = require('../cms');

function cmdHandlerTankList(client) {
  const tl = cms.getTankList();

  tl.forEach((tank, ndx) => {
    client.write(`tank ${ndx} - ${tank.cfg.name}\r\n`);
  });
  client.write('\r\n');
}

function cmdHandlerTankByName(client, cmd) {
  if (cmd.length !== 2) {
    client.write('invalid command\r\n');
    client.write(`${cmd[0]} tank-name\r\n`);
    client.write('\r\n');
    return;
  }

  const tank = cms.getTankByName(cmd[1]);

  if (tank === undefined) {
    client.write(`no tank named ${cmd[1]}\r\n`);
    client.write('\r\n');
    return;
  }

  client.write(`tank name   - ${tank.cfg.name}\r\n`);
  client.write(`ullageAtRef - ${tank.ullageAtRef}\r\n`);
  client.write(`ullageFC    - ${tank.ullageFC}\r\n`);
  client.write(`levelAtRef  - ${tank.levelAtRef}\r\n`);
  client.write(`levelFC     - ${tank.levelFC}\r\n`);

  tank.radars.forEach((r, ndx) => {
    client.write(`radar ${ndx} sensorFault - ${r.sensorFault}\r\n`);
    client.write(`radar ${ndx} ullageAtRef - ${r.ullageAtRef}\r\n`);
    client.write(`radar ${ndx} ullageFC    - ${r.ullageFC}\r\n`);
    client.write(`radar ${ndx} level       - ${r.level}\r\n`);
    client.write(`radar ${ndx} levelFC     - ${r.levelFC}\r\n`);
    client.write(`radar ${ndx} levelAtRef  - ${r.levelAtRef}\r\n`);
  });

  client.write('\r\n');
}

const _commands = {
  tanklist: {
    desc: 'show tanks configured',
    handler: cmdHandlerTankList,
  },
  tankbyname: {
    desc: 'show tank status by name',
    handler: cmdHandlerTankByName,
  },
  startsim: {
    desc: 'start tank simulation',
    handler: (client) => {
      client.write('starting tank simulation\r\n');
      cms.startSimulate();
      client.write('\r\n');
    },
  },
  stopsim: {
    desc: 'stop tank simulation',
    handler: (client) => {
      client.write('stopping tank simulation\r\n');
      cms.stopSimulate();
      client.write('\r\n');
    },
  },
};

module.exports = {
  commands: _commands,
};
