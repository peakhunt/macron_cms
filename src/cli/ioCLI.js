const io = require('../io');

function printZBMaster(client, zbmaster, ndx) {
  client.write('=========================================\r\n');
  client.write(`index   \t - ${ndx}\r\n`);
  client.write(`type    \t - ${zbmaster.cfg.type}\r\n`);
  client.write(`port    \t - ${zbmaster.cfg.transport.serial.port}\r\n`);
  client.write(`baud    \t - ${zbmaster.cfg.transport.serial.baud}\r\n`);
  client.write(`dataBit \t - ${zbmaster.cfg.transport.serial.dataBit}\r\n`);
  client.write(`stopBit \t - ${zbmaster.cfg.transport.serial.stopBit}\r\n`);
  client.write(`parity  \t - ${zbmaster.cfg.transport.serial.parity}\r\n`);

  client.write('\r\n');
  zbmaster.boards.forEach((board) => {
    client.write(`board type - ${board.cfg.type},\taddress ${board.cfg.address},\ttimeout ${board.cfg.timeout}\r\n`);
  });
}

function cmdHandlerZBMasters(client) {
  io.zbMasters.forEach((zbmaster, ndx) => {
    printZBMaster(client, zbmaster, ndx);
  });

  client.write('\r\n');
}

function cmdHandlerZBIO(client, cmd) {
  if (cmd.length !== 3) {
    client.write('invalid command\r\n');
    client.write(`${cmd[0]} index board-address\r\n`);
    client.write('\r\n');
    return;
  }

  const index = parseInt(cmd[1], 10);
  const address = parseInt(cmd[2], 10);
  const zbmaster = io.zbMasters[index];
  let board = null;

  if (zbmaster === undefined) {
    client.write(`no zbmaster at index ${index}`);
    client.write('\r\n');
    return;
  }

  zbmaster.boards.forEach((b) => {
    if (b.cfg.address === address) {
      board = b;
    }
  });

  if (board === null) {
    client.write(`no board with address ${address}`);
    client.write('\r\n');
    return;
  }

  board.printIO(client);
  client.write(`comm stats  - Requests ${board.counters.numReq}`
               + `, Success ${board.counters.numSuccess}`
               + `, Fail ${board.counters.numFail}`);
  client.write('\r\n');
}

const _commands = {
  zbmasters: {
    desc: 'show zbmaster status',
    handler: cmdHandlerZBMasters,
  },
  zbio: {
    desc: 'show ZB I/O registers',
    handler: cmdHandlerZBIO,
  },
};

module.exports = {
  commands: _commands,
};
