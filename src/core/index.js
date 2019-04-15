const alarm = require('./alarm');
const channel = require('./channel');

function init(channels, alarms) {
  // create channels
  Object.keys(channels).forEach((chnlNum) => {
    const chnlCfg = channels[chnlNum];
    channel.createChannel(chnlNum, chnlCfg);
  });

  // create alarms
  Object.keys(alarms).forEach((alarmNum) => {
    const alarmCfg = alarms[alarmNum];
    alarm.createAlarm(alarmNum, alarmCfg);
  });
}

module.exports = {
  alarm,
  channel,
  init,
  getAlarm: alarmNum => alarm.getAlarm(alarmNum),
  getChannel: chnlNum => channel.getChannel(chnlNum),
  listenOnChannelValue: (chnlNum, callback) => {
    channel.getChannel(chnlNum).on('value', (chnl) => {
      callback(chnl);
    });
  },
  listenOnChannelFault: (chnlNum, callback) => {
    channel.getChannel(chnlNum).on('sensorFault', (chnl) => {
      callback(chnl);
    });
  },
};
