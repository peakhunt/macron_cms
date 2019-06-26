const core = require('../../../core');

function getAlarmStatus(req, res) {
  const alarmId = parseInt(req.params.alarmId, 10);
  const alarm = core.getAlarm(alarmId);

  if (alarm === undefined) {
    res.status(422).send();
    return;
  }

  res.json(alarm.getStatus());
}

function ackAlarm(req, res) {
  const alarmId = parseInt(req.params.alarmId, 10);
  const alarm = core.getAlarm(alarmId);

  if (alarm === undefined) {
    res.status(422).send();
    return;
  }

  alarm.ack();

  const ret = {
    stat: core.alarm.getAlarmStat(),
    alarms: {
    },
  };

  ret.alarms[alarm.number] = alarm.getStatus();

  res.json(ret);
}

function getAlarmStatusRange(req, res) {
  const start = parseInt(req.params.start, 10);
  const end = parseInt(req.params.end, 10);
  const list = core.alarm.getAlarmRange(start, end);
  const ret = {
    stat: null,
    alarms: {
    },
  };

  ret.stat = core.alarm.getAlarmStat();

  list.forEach((alm) => {
    ret.alarms[alm.number] = alm.getStatus();
  });

  res.json(ret);
}

function alarmInit(router) {
  router.get('/alarm/:alarmId', getAlarmStatus);
  router.get('/alarmRange/:start/:end', getAlarmStatusRange);
  router.get('/alarm_ack/:alarmId', ackAlarm);
}

module.exports = alarmInit;
