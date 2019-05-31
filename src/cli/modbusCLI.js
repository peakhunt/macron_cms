const io = require('../io');

function cmdHandlerMBRTUSlave(client) {
  const rtuSlaves = io.mbRTUSlaves;

  rtuSlaves.forEach((rs) => {
    client.write('=======================================\r\n');
    client.write(`port ${rs.cfg.transport.serial.port}\r\n`);
    client.write(`numReq ${rs.modbus.numReq}\r\n`);
    client.write(`numRxTimeout ${rs.modbus.numRxTimeout}\r\n`);
    client.write(`numShortFrame ${rs.modbus.numShortFrame}\r\n`);
    client.write(`numCRCError ${rs.modbus.numCRCError}\r\n`);
    client.write(`numWrongUnitID ${rs.modbus.numWrongUnitID}\r\n`);
    client.write(`numIllegalFunc ${rs.modbus.numIllegalFunc}\r\n`);
  });
  client.write('\r\n');
}

function cmdHandlerMBTCPSlave(client) {
  const tcpSlaves = io.mbTCPSlaves;

  tcpSlaves.forEach((ts) => {
    client.write('=======================================\r\n');
    client.write(`server ${ts.cfg.transport.net.host}:${ts.cfg.transport.net.port}\r\n`);
    client.write(`unitID ${ts.cfg.address}\r\n`);
    /* eslint-disable no-unused-vars */
    ts.modbus.socks.forEach((v, sock) => {
      client.write(`connection ${sock.remoteAddress}:${sock.remotePort}\r\n`);
    });
  });
  client.write('\r\n');
}

const _commands = {
  mbrtuslaves: {
    desc: 'show modbus RTU slave stats',
    handler: cmdHandlerMBRTUSlave,
  },
  mbtcpslaves: {
    desc: 'show modbus TCP slave stats',
    handler: cmdHandlerMBTCPSlave,
  },
};

module.exports = {
  commands: _commands,
};
