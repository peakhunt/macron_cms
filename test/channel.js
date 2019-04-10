const assert = require('assert');
const channel = require('../src/core/channel');

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
    assert.equal(chnl.value, false);
    assert.equal(chnl.sensorFault, false);

    chnl = channel.getChannel(2);
    assert.equal(chnl.value, 0.0);
    assert.equal(chnl.sensorFault, false);
  });

  it('channel value event', (done) => {
    channel.getChannel(1).on('value', (chnl) => {
      assert.equal(chnl.value, true);
    });
    channel.getChannel(2).on('value', (chnl) => {
      assert.equal(chnl.value, 2.0);
      done();
    });

    channel.getChannel(1).value = true;
    channel.getChannel(2).value = 2.0;
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
