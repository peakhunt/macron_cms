/**
 * A module for alarm
 * @module alarm
 */
const { EventEmitter } = require('events');
const util = require('util');
const channel = require('../channel');

//
// module privates
//
const _alarms = {};
const _alarmStateEnum = {
  Inactive: 0,
  Active_Pending: 1,
  Inactive_Pending: 2,
  Active: 3,
};

const _alarmEventEnum = {
  Clear: 0,
  Occur: 1,
  Ack: 2,
};

/**
 * alarm state machine main entry point
 * @paarm {object} alarm - alarm object
 * @paarm {enum} evt - _alarmEventEnum
 */
function handleAlarmStateMachine(alarm, evt) {
  const a = alarm;

  // FIXME
  switch (evt) {
    case _alarmEventEnum.Clear:
      a._state = _alarmStateEnum.Inactive;
      break;
    case _alarmEventEnum.Occur:
      a._state = _alarmStateEnum.Active;
      break;

    case _alarmEventEnum.Ack:
    default:
      break;
  }
}

/**
 * sensor fault alarm handler
 * @paarm {object} alarm - alarm object
 */
function handleSensorFaultAlarm(alarm) {
  const chnl = alarm._channel;

  if (chnl.sensorFault === true) {
    handleAlarmStateMachine(alarm, _alarmEventEnum.Occur);
  } else {
    handleAlarmStateMachine(alarm, _alarmEventEnum.Clear);
  }
}

/**
 * digital alarm handler
 * @paarm {object} alarm - alarm object
 */
function handleDigitalAlarm(alarm) {
  const chnl = alarm._channel;

  if (chnl.value === alarm.cfg.set) {
    handleAlarmStateMachine(alarm, _alarmEventEnum.Occur);
  } else {
    handleAlarmStateMachine(alarm, _alarmEventEnum.Clear);
  }
}

/**
 * analog alarm handler
 * @paarm {object} alarm - alarm object
 */
function handleAnalogAlarm(alarm) {
  const chnl = alarm._channel;

  switch (alarm.cfg.type) {
    case 'high':
      if (chnl.value >= alarm.cfg.set) {
        handleAlarmStateMachine(alarm, _alarmEventEnum.Occur);
      } else {
        handleAlarmStateMachine(alarm, _alarmEventEnum.Clear);
      }
      break;

    case 'low':
      if (chnl.value <= alarm.cfg.set) {
        handleAlarmStateMachine(alarm, _alarmEventEnum.Occur);
      } else {
        handleAlarmStateMachine(alarm, _alarmEventEnum.Clear);
      }
      break;

    default:
      break;
  }
}

/**
 * alarm constructor
 * @paarm {number} number - alarm number
 * @param {object} cfg - alarm configuration object
   cfg: {
     type: 'low|high|sensor_fault',
     severity: 'minor|major|critical',
     name: 'XXX',
     set: number or 'on|off' for digital,
     delay: integer in ms,
     channel: related channel number
   }
 */
function Alarm(number, cfg) {
  EventEmitter.call(this);

  this.number = number;
  this.cfg = cfg;

  this._state = _alarmStateEnum.Inactive;
  this._channel = channel.getChannel(cfg.channel);

  const self = this;

  if (cfg.type === 'sensor_fault') {
    this._channel.on('sensorFault', () => {
      handleSensorFaultAlarm(self);
    });
  } else {
    this._channel.on('value', (chnl) => {
      if (chnl.cfg.type === 'digital') {
        handleDigitalAlarm(self);
      } else {
        handleAnalogAlarm(self);
      }
    });
  }
}

Alarm.prototype = {
  constructor: Alarm,
  get state() {
    return this._state;
  },
};

//
// declare that Alarm inherits from EventEmitter
//
util.inherits(Alarm, EventEmitter);

/**
 * create an alarm
 * @param {number} number - alarm number
 * @param {object} cfg - alarm configuration object
 * @return {object} alarm object
 */
function createAlarm(number, cfg) {
  const alm = new Alarm(number, cfg);

  _alarms[number] = alm;

  return alm;
}

module.exports = {
  alarmStateEnum: _alarmStateEnum,
  createAlarm,
  getAlarm: alarmNum => _alarms[alarmNum],
};
