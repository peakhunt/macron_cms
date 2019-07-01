const io = require('../io');

function cmdHandlerMBSlave(client) {
  const rtuSlaves = io.mbRTUSlaves;

  rtuSlaves.forEach((rs) => {
    client.write('=======================================\r\n');
    client.write(`port ${rs.cfg.transport.serial.port}\r\n`);
    client.write(`unitID ${rs.cfg.address}\r\n`);
    client.write(`numReq ${rs.modbus.numReq}\r\n`);
    client.write(`numRxTimeout ${rs.modbus.numRxTimeout}\r\n`);
    client.write(`numShortFrame ${rs.modbus.numShortFrame}\r\n`);
    client.write(`numCRCError ${rs.modbus.numCRCError}\r\n`);
    client.write(`numWrongUnitID ${rs.modbus.numWrongUnitID}\r\n`);
    client.write(`numIllegalFunc ${rs.modbus.numIllegalFunc}\r\n`);
  });
  client.write('\r\n');

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

function cmdHandlerMBMaster(client) {
  const rtuMasters = io.mbRTUMasters;

  rtuMasters.forEach((rm) => {
    client.write('=======================================\r\n');
    client.write(`port ${rm.cfg.transport.serial.port}\r\n`);
  });
  client.write('\r\n');

  const tcpMasters = io.mbTCPMasters;

  tcpMasters.forEach((tm) => {
    client.write('=======================================\r\n');
    client.write(`target ${tm.cfg.target.host}:${tm.cfg.target.port}\r\n`);
    client.write(`delay ${tm.cfg.delay}\r\n`);
    client.write(`reconnect timer ${tm.cfg.reconnectTmr}\r\n`);
    client.write(`timeout ${tm.cfg.timeout}\r\n`);
  });
  client.write('\r\n');
}

const _commands = {
  mbslaves: {
    desc: 'show modbus slave stats',
    handler: cmdHandlerMBSlave,
  },
  mbmasters: {
    desc: 'show modbus master stats',
    handler: cmdHandlerMBMaster,
  },
};

module.exports = {
  commands: _commands,
};
