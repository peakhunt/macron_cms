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

function alarmInit(router) {
  router.get('/alarm/:alarmId', getAlarmStatus);
}

module.exports = alarmInit;
