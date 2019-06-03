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

function getAlarmStatusRange(req, res) {
  const start = parseInt(req.params.start, 10);
  const end = parseInt(req.params.end, 10);
  const list = core.alarm.getAlarmRange(start, end);
  const ret = {};

  list.forEach((alm) => {
    ret[alm.number] = alm.getStatus();
  });

  res.json(ret);
}

function alarmInit(router) {
  router.get('/alarm/:alarmId', getAlarmStatus);
  router.get('/alarmRange/:start/:end', getAlarmStatusRange);
}

module.exports = alarmInit;
