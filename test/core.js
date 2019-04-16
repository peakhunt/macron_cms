const assert = require('assert');
const core = require('../src/core');

const testChnlCfgs = {
  100: {
    name: 'Channel #1',
    dir: 'in',
    type: 'digital',
  },
  101: {
    name: 'Channel #1',
    dir: 'in',
    type: 'analog',
    gain: 1.0,
    offset: 0.0,
  },
};

const testAlarmCfgs = {
  101: {
    severity: 'minor',
    name: 'test digital alarm on channel 10',
    set: true,
    delay: 0,
    channel: 100,
  },
  102: {
    severity: 'minor',
    name: 'test digital alarm with delay on channel 10',
    set: true,
    delay: 1000,
    channel: 100,
  },
  103: {
    type: 'low',
    severity: 'minor',
    name: 'test low alarm on channel 11',
    set: -10.0,
    delay: 0,
    channel: 101,
  },
  104: {
    type: 'high',
    severity: 'minor',
    name: 'test high alarm on channel 11',
    set: 10.0,
    delay: 0,
    channel: 101,
  },
  105: {
    type: 'sensor_fault',
    severity: 'minor',
    name: 'test sensor fault alarm on channel 11',
    delay: 0,
    channel: 101,
  },
};

describe('core', () => {
  it('init', (done) => {
    core.init(testChnlCfgs, testAlarmCfgs);

    assert.notEqual(core.getChannel(100), undefined);
    assert.notEqual(core.getChannel(101), undefined);

    assert.notEqual(core.getAlarm(101), undefined);
    assert.notEqual(core.getAlarm(102), undefined);
    assert.notEqual(core.getAlarm(103), undefined);
    assert.notEqual(core.getAlarm(104), undefined);
    assert.notEqual(core.getAlarm(105), undefined);

    core.listenOnChannelValue(100, (chnl) => {
      assert.equal(core.getChannel(100).value, true);
    });
    core.listenOnChannelFault(100, (chnl) => {
      assert.equal(core.getChannel(100).sensorFault, true);
      done();
    });
    core.getChannel(100).value = true;
    core.getChannel(100).sensorFault = true;
  });
});
