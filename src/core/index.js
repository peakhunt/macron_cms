const alarm = require('./alarm');
const channel = require('./channel');

function init(channels, alarms) {
  // create channels
  for (let chnlNum in channels) {
    let chnlCfg;

    chnlCfg = channels[chnlNum];
    channel.createChannel(chnlNum, chnlCfg);
  }

  // create alarms
  for (let alarmNum in alarms) {
    let alarmCfg;

    alarmCfg = alarms[alarmNum];
    alarm.createAlarm(alarmNum, alarmCfg);
  }
}

module.exports = {
  alarm,
  channel,
  init,
  getAlarm: alarmNum => alarm.getAlarm(alarmNum),
  getChannel: chnlNum => channel.getChannel(chnlNum),
};
