const assert = require('assert');
const channel = require('../src/core/channel');
const alarm = require('../src/core/alarm');

const testChnlCfgs = {
  1: {
    name: 'Channel #1',
    dir: 'in',
    type: 'digital',
  },
  2: {
    name: 'Channel #1',
    dir: 'in',
    type: 'analog',
    gain: 1.0,
    offset: 0.0,
  },
  3: {
    name: 'Channel #3',
    dir: 'in',
    type: 'analog',
    gain: 0.5,
    offset: 10,
  },
};


describe('channel', () => {
  // create channels
  for (let chnlNum in testChnlCfgs) {
    channel.createChannel(chnlNum, testChnlCfgs[chnlNum]);
  }

  it('channel creation', () => {
    assert.notEqual(channel.getChannel(1), undefined);
    assert.notEqual(channel.getChannel(2), undefined);

    let chnl;

    chnl = channel.getChannel(1);
    assert.equal(chnl.engValue, false);
    assert.equal(chnl.sensorValue, false);
    assert.equal(chnl.sensorFault, false);

    chnl.sensorValue = true;
    assert.equal(chnl.engValue, true);
    assert.equal(chnl.sensorValue, true);

    chnl = channel.getChannel(2);
    assert.equal(chnl.engValue, 0.0);
    assert.equal(chnl.sensorFault, false);
  });

  it('channel value event', (done) => {
    channel.getChannel(1).on('value', (chnl) => {
      assert.equal(chnl.engValue, true);
    });
    channel.getChannel(2).on('value', (chnl) => {
      assert.equal(chnl.engValue, 2.0);
      done();
    });

    channel.getChannel(1).engValue = true;
    channel.getChannel(2).engValue = 2.0;

    //
    // engVal = 0.5 * sensorVal + 10
    //
    // sensorVal = (engVal - 10) / 0.5
    //
    channel.getChannel(3).sensorValue = 100;
    assert.equal(channel.getChannel(3).engValue, 60);

    channel.getChannel(3).engValue = 30;
    assert.equal(channel.getChannel(3).sensorValue, 40);
  });

  it('channel sensor fault event', (done) => {
    channel.getChannel(1).on('sensorFault', (chnl) => {
      assert.equal(chnl.sensorFault, true);
    });
    channel.getChannel(2).on('sensorFault', (chnl) => {
      assert.equal(chnl.sensorFault, false);
      done();
    });

    channel.getChannel(1).sensorFault = true;
    channel.getChannel(2).sensorFault = false;
  });
});
