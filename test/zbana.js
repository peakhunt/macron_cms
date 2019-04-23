const assert = require('assert');
const ModbusRTUMock = require('./mocks/ModbusRTUMock');
const zbana = require('../src/io/board/zbana');
const core = require('../src/core');

const zbanaChnls = {
  5000: {
    name: 'ZBANA Comm Status',
    dir: 'in',
    type: 'digital',
  },
  5001: {
    name: 'ZBANA Port #1',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5002: {
    name: 'ZBANA Port #2',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5003: {
    name: 'ZBANA Port #3',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5004: {
    name: 'ZBANA Port #4',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5005: {
    name: 'ZBANA Port #5',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5006: {
    name: 'ZBANA Port #6',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5007: {
    name: 'ZBANA Port #7',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5008: {
    name: 'ZBANA Port #8',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5009: {
    name: 'ZBANA Port #9',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5010: {
    name: 'ZBANA Port #10',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5011: {
    name: 'ZBANA Port #11',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
  5012: {
    name: 'ZBANA Port #12',
    dir: 'in',
    type: 'analog',
    gain: 1,
    offset: 0,
  },
};

const zbanaAlarms = {
};

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
      channel: -1,
      sensorType: 'pressureXXX',
    },
  ],
};

describe('zbana', () => {
  core.init(zbanaChnls, zbanaAlarms);

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
