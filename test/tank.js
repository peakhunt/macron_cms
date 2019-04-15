const assert = require('assert');
const core = require('../src/core');
const tank = require('../src/cms/tank');
const vessel = require('../src/cms/vessel');

const sampleChannels = {
  1000: {
    name: 'ullage at ref',
    dir: 'out',
    type: 'analog',
  },
  2000: {
    name: 'level at ref',
    dir: 'out',
    type: 'analog',
  },
  3000: {
    name: 'ullage at fc',
    dir: 'out',
    type: 'analog',
  },
  4000: {
    name: 'level at fc',
    dir: 'out',
    type: 'analog',
  },
  10000: {
    name: 'radar input',
    dir: 'in',
    type: 'analog',
  },
};

const sampleAlarms = {
};

const tankCfg = {
  name: 'sample tank',
  level: {
    ullageAtRef: { // average ullage at reference point
      channel: 1000,
      hiAlarm: 1,
      loAlarm: 2,
    },
    levelAtRef: { // average level at reference point
      channel: 2000,
      hiAlarm: 3,
      loAlarm: 4,
    },
    ullageAtFC: { // average ullage at floatation center
      channel: 3000,
      hiAlarm: 5,
      loAlarm: 6,
    },
    levelAtFC: { // average level at floatation center
      channel: 4000,
      hiAlarm: 7,
      loAlarm: 8,
    },
    tankLevelCfg: {
      DVUllRefToUTI: 0,
      DBotUllRefPnt: 0,
    },
    radars: [
      {
        channel: 10000,
        sensorAlarm: 10,
        cfg: {
          cDLR: 0.0,
          cDTR: 0.0,
          cDLFC: 0.0,
          cDTFC: 0.0,
          distance: 10,
          DBotManMsrPnt: 0.0,
          DVManMsrPntToSns: 0.0,
        },
      },
    ],
  },
};

const tankCfg2 = {
  name: 'sample tank2',
  level: {
    ullageAtRef: { // average ullage at reference point
      channel: 1000,
      hiAlarm: 1,
      loAlarm: 2,
    },
    levelAtRef: { // average level at reference point
      channel: 2000,
      hiAlarm: 3,
      loAlarm: 4,
    },
    ullageAtFC: { // average ullage at floatation center
      channel: 3000,
      hiAlarm: 5,
      loAlarm: 6,
    },
    levelAtFC: { // average level at floatation center
      channel: 4000,
      hiAlarm: 7,
      loAlarm: 8,
    },
    tankLevelCfg: {
      DVUllRefToUTI: 0,
      DBotUllRefPnt: 0,
    },
    radars: [
      {
        channel: 10000,
        sensorAlarm: 10,
        cfg: {
          cDLR: 0.0,
          cDTR: 0.0,
          cDLFC: 0.0,
          cDTFC: 0.0,
          distance: 10,
          DBotManMsrPnt: 0.0,
          DVManMsrPntToSns: 0.0,
        },
      },
      {
        channel: 11,
        sensorAlarm: 11,
        cfg: {
          cDLR: 0.0,
          cDTR: 0.0,
          cDLFC: 0.0,
          cDTFC: 0.0,
          distance: 10,
          DBotManMsrPnt: 0.0,
          DVManMsrPntToSns: 0.0,
        },
      },
    ],
  },
};

describe('tank', () => {
  core.init(sampleChannels, sampleAlarms);

  it('tank creation', () => {
    let t;
    t = tank.createTank(tankCfg);

    assert.equal(t.cfg, tankCfg);
    assert.equal(t.radars.length, 1);
    assert.equal(t.ullageAtRef, 0.0);
    assert.equal(t.ullageFC, 0.0);
    assert.equal(t.levelAtRef, 0.0);
    assert.equal(t.levelFC, 0.0);
  });

  it('level update', () => {
    let t;
    t = tank.createTank(tankCfg);

    vessel.reset();

    t.radars[0].updateRadar(t.radars[0], 1.0);
    assert.equal(t.ullageAtRef, 1.0);
    assert.equal(t.ullageFC, 1.0);
    assert.equal(t.levelAtRef, 9.0);
    assert.equal(t.levelFC, 9.0);

    vessel.updateTrimList(10, -10);
    t.radars[0].updateRadar(t.radars[0], 1.0);
    assert.equal(t.ullageAtRef, 1.0);
    assert.equal(t.ullageFC, 1.0);
    assert.equal(t.levelAtRef, 9.0);
    assert.equal(t.levelFC, 9.0);
  });

  it('sensor fault', () => {
    let t;
    t = tank.createTank(tankCfg);

    vessel.reset();

    t.radars[0].sensorFault = true;
    t.radars[0].updateRadar(t.radars[0], 1.0);
    assert.equal(t.ullageAtRef, 0.0);
    assert.equal(t.ullageFC, 0.0);
    assert.equal(t.levelAtRef, 0.0);
    assert.equal(t.levelFC, 0.0);
  });

  it('multi radars', () => {
    let t;
    t = tank.createTank(tankCfg2);

    assert.equal(t.cfg, tankCfg2);
    assert.equal(t.radars.length, 2);
    assert.equal(t.ullageAtRef, 0.0);
    assert.equal(t.ullageFC, 0.0);
    assert.equal(t.levelAtRef, 0.0);
    assert.equal(t.levelFC, 0.0);

    t.radars[0].updateRadar(t.radars[0], 1.0);
    t.radars[1].updateRadar(t.radars[1], 1.0);
    assert.equal(t.ullageAtRef, 1.0);
    assert.equal(t.ullageFC, 1.0);
    assert.equal(t.levelAtRef, 9.0);
    assert.equal(t.levelFC, 9.0);
  });

  it('radar channel test', () => {
    let t;
    t = tank.createTank(tankCfg);

    vessel.reset();

    core.getChannel(10000).value = 4.0;
    assert.equal(t.ullageAtRef, 4.0);
    assert.equal(t.ullageFC, 4.0);
    assert.equal(t.levelAtRef, 6.0);
    assert.equal(t.levelFC, 6.0);

    assert.equal(core.getChannel(1000).value, 4.0);
    assert.equal(core.getChannel(2000).value, 6.0);
    assert.equal(core.getChannel(3000).value, 4.0);
    assert.equal(core.getChannel(4000).value, 6.0);

    core.getChannel(10000).sensorFault = true;
    assert.equal(core.getChannel(1000).value, 0.0);
    assert.equal(core.getChannel(2000).value, 0.0);
    assert.equal(core.getChannel(3000).value, 0.0);
    assert.equal(core.getChannel(4000).value, 0.0);

    core.getChannel(10000).sensorFault = false;
    core.getChannel(10000).value = 7.0;
    assert.equal(core.getChannel(1000).value, 7.0);
    assert.equal(core.getChannel(2000).value, 3.0);
    assert.equal(core.getChannel(3000).value, 7.0);
    assert.equal(core.getChannel(4000).value, 3.0);
  });
});
