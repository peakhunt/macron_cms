const assert = require('assert');
const ModbusRTUMock = require('./mocks/ModbusRTUMock');
const zbhart = require('../src/io/board/zbhart');
const core = require('../src/core');

const zbhartChnls = {
  15000: {
    name: 'ZBHART Comm Status',
    dir: 'in',
    type: 'digital',
  },
  15001: {
    name: 'ZBHART Port #1',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15002: {
    name: 'ZBHART Port #2',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15003: {
    name: 'ZBHART Port #3',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15004: {
    name: 'ZBHART Port #4',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15005: {
    name: 'ZBHART Port #5',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15006: {
    name: 'ZBHART Port #6',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15007: {
    name: 'ZBHART Port #7',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15008: {
    name: 'ZBHART Port #8',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15009: {
    name: 'ZBHART Port #9',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15010: {
    name: 'ZBHART Port #10',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15011: {
    name: 'ZBHART Port #11',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
  15012: {
    name: 'ZBHART Port #12',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1,
      b: 0,
    }
  },
};

const zbhartAlarms = {
};

const zbhartCfg = {
  type: 'zbhart',
  address: 11,
  commFault: 15000,
  ports: [
    {
      use: true,
      channel: 15001,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15002,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15003,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15004,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15005,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15006,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15007,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15008,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15009,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15010,
      sensorType: 'vega',
    },
    {
      use: true,
      channel: 15011,
      sensorType: 'vega',
    },
    {
      use: false,
      channel: -1,
      sensorType: 'pressureXXX',
    },
  ],
};

describe('zbhart', () => {
  core.init(zbhartChnls, zbhartAlarms);

  it('creating', (done) => {
    const board = zbhart.createBoard(null, zbhartCfg);
    const rtu = new ModbusRTUMock();

    assert.notEqual(board, null);
    assert.notEqual(board, undefined);
    assert.equal(board.cfg.address, 11);
    assert.notEqual(board.ioRegs, undefined);

    rtu.setFailure(false);
    board.executeSchedule(rtu).then(() => {
      rtu.setFailure(true);
      board.executeSchedule(rtu).catch(() => {
        rtu.setFailure(false);
        rtu.setFailure2(true);
        board.executeSchedule(rtu).catch(() => {
          done();
        });
      });
    }).catch(() => {
      assert.equal(true, false);
      done();
    });
  });
});
