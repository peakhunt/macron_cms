const dateformat = require('dateformat');

function getAlarmStateStr(state) {
  switch (state) {
    case 0: return 'Inactive';
    case 1: return 'Active Pending';
    case 2: return 'Inactive Pending';
    case 3: return 'Active';
    default:
      break;
  }

  return 'Unknown';
}

function getAlarmTime(ts) {
  const time = new Date(ts);

  return dateformat(time, 'yyyy-mm-dd HH:MM:ss');
}

const alarmColors = {
  minor: 'yellow',
  major: 'orange',
  critical: 'red',
};

module.exports = {
  getAlarmStateStr,
  getAlarmTime,
  alarmColors,
};
