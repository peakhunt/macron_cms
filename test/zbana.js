const assert = require('assert');
const ModbusRTUMock = require('./mocks/ModbusRTUMock');
const zbana = require('../src/io/board/zbana');

const zbanaCfg = {
  type: 'zbana',
  address: 10,
  commFault: 5000,
  ports: [
    {
      channel: 5001,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5002,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5003,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5004,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5005,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5006,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5007,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5008,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5009,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5010,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5011,
      sensorType: 'pressureXXX',
    },
    {
      channel: 5012,
      sensorType: 'pressureXXX',
    },
  ],
};

describe('zbana', () => {
  it('creating', (done) => {
    const board = zbana.createBoard(null, zbanaCfg);
    const rtu = new ModbusRTUMock();

    assert.notEqual(board, null);
    assert.notEqual(board, undefined);
    assert.equal(board.cfg.address, 10);
    assert.notEqual(board.ioRegs, undefined);

    board.executeSchedule(rtu).then(() => {
      rtu.setFailure(true);
      board.executeSchedule(rtu).catch(() => {
        done();
      });
    }).catch(() => {
      assert.equal(true, false);
      done();
    });
  });
});
