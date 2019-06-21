const assert = require('assert');
const channel = require('../src/core/channel');
const alarm = require('../src/core/alarm');
const sinon = require('sinon');

const testChnlCfgs = {
  10: {
    name: 'Channel #1',
    dir: 'in',
    type: 'digital',
  },
  11: {
    name: 'Channel #1',
    dir: 'in',
    type: 'analog',
    conv: {
      a: 1.0,
      b: 0.0,
    },
  },
};

const testAlarmCfgs = {
  1: {
    severity: 'minor',
    name: 'test digital alarm on channel 10',
    set: true,
    delay: 0,
    channel: 10,
  },
  2: {
    severity: 'minor',
    name: 'test digital alarm with delay on channel 10',
    set: true,
    delay: 1000,
    channel: 10,
  },
  3: {
    type: 'low',
    severity: 'minor',
    name: 'test low alarm on channel 11',
    set: -10.0,
    delay: 0,
    channel: 11,
  },
  4: {
    type: 'high',
    severity: 'minor',
    name: 'test high alarm on channel 11',
    set: 10.0,
    delay: 0,
    channel: 11,
  },
  5: {
    type: 'sensorFault',
    severity: 'minor',
    name: 'test sensor fault alarm on channel 11',
    delay: 0,
    channel: 11,
  },
};

describe('alarm', () => {
  var clock;

  before(function () {
    clock = sinon.useFakeTimers();
    // create channels
    for (let chnlNum in testChnlCfgs) {
      channel.createChannel(chnlNum, testChnlCfgs[chnlNum]);
    }

    for (let alarmNum in testAlarmCfgs) {
      alarm.createAlarm(alarmNum, testAlarmCfgs[alarmNum]);
    }
  });
  after(function () { clock.restore(); });

  // create alarms
  it('alarm creation', () => {
    assert.notEqual(alarm.getAlarm(1), undefined);
    assert.notEqual(alarm.getAlarm(2), undefined);
    assert.notEqual(alarm.getAlarm(3), undefined);
    assert.notEqual(alarm.getAlarm(4), undefined);
  });

  it('basic digital alarm', () => {
    const chnl = channel.getChannel(10);
    const alm = alarm.getAlarm(1);

    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    chnl.engValue = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
    chnl.engValue = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    chnl.engValue = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    chnl.engValue = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive_Pending);
    chnl.engValue = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    chnl.engValue = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);

    chnl.engValue = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    chnl.engValue = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive_Pending);
    chnl.engValue = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    chnl.engValue = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
  });

  it('basic low alarm', (done) => {
    const chnl = channel.getChannel(11);
    const alm = alarm.getAlarm(3);


    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    chnl.engValue = -11.0;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
    alm.on('alarm', () => {
      assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
      done();
    });
    chnl.engValue = 0;
  });

  it('basic high alarm', () => {
    const chnl = channel.getChannel(11);
    const alm = alarm.getAlarm(4);

    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    chnl.engValue = 11.0;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
    chnl.engValue = 0;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
  });

  it('sensor fault alarm', () => {
    const chnl = channel.getChannel(11);
    const alm = alarm.getAlarm(5);

    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    chnl.sensorFault = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
    chnl.sensorFault = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
  });

  it('time delay test1', () => {
    const chnl = channel.getChannel(10);
    const alm = alarm.getAlarm(2);

    chnl.engValue = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    clock.tick(1001);
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
  });

  it('time delay test2', () => {
    const chnl = channel.getChannel(10);
    const alm = alarm.getAlarm(2);

    chnl.engValue = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
    clock.tick(1001);
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
  });

  it('time delay test3', () => {
    const chnl = channel.getChannel(10);
    const alm = alarm.getAlarm(2);

    chnl.engValue = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    clock.tick(20);
    chnl.engValue = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    clock.tick(1005);
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
  });
});
