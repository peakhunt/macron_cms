const assert = require('assert');
const channel = require('../src/core/channel');
const alarm = require('../src/core/alarm');

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
    type: 'sensor_fault',
    severity: 'minor',
    name: 'test sensor fault alarm on channel 11',
    delay: 0,
    channel: 11,
  },
};


describe('alarm', () => {
  // create channels
  for (let chnlNum in testChnlCfgs) {
    channel.createChannel(chnlNum, testChnlCfgs[chnlNum]);
  }

  for (let alarmNum in testAlarmCfgs) {
    alarm.createAlarm(alarmNum, testAlarmCfgs[alarmNum]);
  }

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
    chnl.value = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
    chnl.value = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    chnl.value = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    chnl.value = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive_Pending);
    chnl.value = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    chnl.value = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);

    chnl.value = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    chnl.value = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive_Pending);
    chnl.value = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    chnl.value = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
  });

  it('basic low alarm', (done) => {
    const chnl = channel.getChannel(11);
    const alm = alarm.getAlarm(3);


    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    chnl.value = -11.0;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
    alm.on('alarm', () => {
      assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
      done();
    });
    chnl.value = 0;
  });

  it('basic high alarm', () => {
    const chnl = channel.getChannel(11);
    const alm = alarm.getAlarm(4);

    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    chnl.value = 11.0;
    assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
    alm.ack();
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
    chnl.value = 0;
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

  it('time delay test1', (done) => {
    const chnl = channel.getChannel(10);
    const alm = alarm.getAlarm(2);

    chnl.value = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    setTimeout(() => {
      assert.equal(alm.state, alarm.alarmStateEnum.Active_Pending);
      alm.ack();
      assert.equal(alm.state, alarm.alarmStateEnum.Active);
      done();
    }, 1001);
  });

  it('time delay test2', (done) => {
    const chnl = channel.getChannel(10);
    const alm = alarm.getAlarm(2);

    chnl.value = false;
    assert.equal(alm.state, alarm.alarmStateEnum.Active);
    setTimeout(() => {
      assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
      done();
    }, 1001);
  });

  it('time delay test3', (done) => {
    const chnl = channel.getChannel(10);
    const alm = alarm.getAlarm(2);

    chnl.value = true;
    assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
    setTimeout(() => {
      chnl.value = false;
      assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
      setTimeout(() => {
        assert.equal(alm.state, alarm.alarmStateEnum.Inactive);
        done();
      }, 1005);
    }, 20);
  });
});
