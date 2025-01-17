/**
 * A module for alarm
 * @module alarm
 */
const { EventEmitter } = require('events');
const { BinarySearchTree } = require('binary-search-tree');
const util = require('util');
const channel = require('../channel');
const common = require('../../common');

//
// module privates
//
const _alarms = {};
const _bstAlarms = new BinarySearchTree();
const _alarmStateEnum = {
  Inactive: 0,
  Active_Pending: 1,
  Inactive_Pending: 2,
  Active: 3,
};

const _alarmStateString = {
  0: 'Inactive',
  1: 'Active_Pending',
  2: 'Inactive_Pending',
  3: 'Active',
};

const _alarmEventEnum = {
  Clear: 0,
  Occur: 1,
  Ack: 2,
};

const _alarmDelayStateEnum = {
  Idle: 0,
  Occurring: 1,
  Clearing: 2,
};

const _alarmDelayStateString = {
  0: 'Idle',
  1: 'Occurring',
  2: 'Clearing',
};

let numActiveAlarms = 0;
let numUnackedAlarms = 0;

/**
 * change alarm state
 * @param {object} alarm - alarm object
 * @param {_alarmEventEnum} newState - new state
 */
function changeAlarmState(alarm, newState) {
  const a = alarm;

  if (a._state === newState) {
    return;
  }

  switch (newState) {
    case _alarmStateEnum.Inactive:
      if (a._state === _alarmStateEnum.Active) {
        numActiveAlarms -= 1;
      } else if (a._state === _alarmStateEnum.Inactive_Pending) {
        numActiveAlarms -= 1;
        numUnackedAlarms -= 1;
      }
      break;

    case _alarmStateEnum.Active_Pending:
      if (a._state === _alarmStateEnum.Inactive) {
        numActiveAlarms += 1;
        numUnackedAlarms += 1;
      }
      break;

    case _alarmStateEnum.Inactive_Pending:
      break;

    case _alarmStateEnum.Active:
      numUnackedAlarms -= 1;
      break;

    default:
      break;
  }

  a._state = newState;
  a.emit('alarm', a);
}

function setAlarmTimeToNow(alarm) {
  const a = alarm;

  a._alarm_time = common.getTimeMills();
}

/**
 * alarm state machine
 * @paarm {object} alarm - alarm object
 * @paarm {_alarmEventEnum} evt - alarm event
 */
function handleAlarmStateMachine(alarm, evt) {
  switch (alarm._state) {
    case _alarmStateEnum.Inactive:
      switch (evt) {
        case _alarmEventEnum.Occur:
          setAlarmTimeToNow(alarm);
          changeAlarmState(alarm, _alarmStateEnum.Active_Pending);
          break;

        /* istanbul ignore next */
        case _alarmEventEnum.Clear:
          break;

        /* istanbul ignore next */
        case _alarmEventEnum.Ack:
          break;

        /* istanbul ignore next */
        default:
          break;
      }
      break;

    case _alarmStateEnum.Active_Pending:
      switch (evt) {
        /* istanbul ignore next */
        case _alarmEventEnum.Occur:
          break;

        case _alarmEventEnum.Clear:
          changeAlarmState(alarm, _alarmStateEnum.Inactive_Pending);
          break;

        case _alarmEventEnum.Ack:
          changeAlarmState(alarm, _alarmStateEnum.Active);
          break;

        /* istanbul ignore next */
        default:
          break;
      }
      break;

    case _alarmStateEnum.Inactive_Pending:
      switch (evt) {
        case _alarmEventEnum.Occur:
          changeAlarmState(alarm, _alarmStateEnum.Active_Pending);
          break;

        /* istanbul ignore next */
        case _alarmEventEnum.Clear:
          break;

        case _alarmEventEnum.Ack:
          changeAlarmState(alarm, _alarmStateEnum.Inactive);
          break;

        /* istanbul ignore next */
        default:
          break;
      }
      break;

    case _alarmStateEnum.Active:
      switch (evt) {
        /* istanbul ignore next */
        case _alarmEventEnum.Occur:
          break;

        case _alarmEventEnum.Clear:
          changeAlarmState(alarm, _alarmStateEnum.Inactive);
          break;

        /* istanbul ignore next */
        case _alarmEventEnum.Ack:
          break;

        /* istanbul ignore next */
        default:
          break;
      }
      break;

    /* istanbul ignore next */
    default:
      break;
  }
}

/**
 * set timer and action for alarm time delay
 * @param {object} alarm - alarm object
 * @param {_alarmEventEnum} evt - alarm event
 */
function setAlarmDelay(alarm, evt) {
  const a = alarm;

  a._delay_timer = setTimeout(() => {
    a._delay_state = _alarmDelayStateEnum.Idle;
    a._delay_timer = null;
    handleAlarmStateMachine(a, evt);
  }, a.cfg.delay);
}

/**
 * handle alarm event and run alarm state machine
 * @paarm {object} alarm - alarm object
 * @paarm {_alarmEventEnum} evt - alarm event
 */
function handleAlarmEvent(alarm, evt) {
  const a = alarm;

  // ack is always handled without delay
  // no delay configuration as well
  if (a.cfg.delay === 0 || evt === _alarmEventEnum.Ack) {
    handleAlarmStateMachine(a, evt);
    return;
  }

  //
  // time delay state machine
  //
  switch (a._delay_state) {
    case _alarmDelayStateEnum.Idle:
      switch (evt) {
        case _alarmEventEnum.Clear:
          a._delay_state = _alarmDelayStateEnum.Clearing;
          setAlarmDelay(a, evt);
          break;

        case _alarmEventEnum.Occur:
          a._delay_state = _alarmDelayStateEnum.Occurring;
          setAlarmDelay(a, evt);
          break;

        /* istanbul ignore next */
        default:
          break;
      }
      break;

    case _alarmDelayStateEnum.Occurring:
      switch (evt) {
        case _alarmEventEnum.Clear:
          clearTimeout(a._delay_timer);
          a._delay_state = _alarmDelayStateEnum.Clearing;
          setAlarmDelay(a, evt);
          break;

        /* istanbul ignore next */
        case _alarmEventEnum.Occur:
          break;

        /* istanbul ignore next */
        default:
          break;
      }
      break;

    case _alarmDelayStateEnum.Clearing:
      switch (evt) {
        /* istanbul ignore next */
        case _alarmEventEnum.Clear:
          break;

        case _alarmEventEnum.Occur:
          clearTimeout(a._delay_timer);
          a._delay_state = _alarmDelayStateEnum.Occurring;
          setAlarmDelay(a, evt);
          break;

        /* istanbul ignore next */
        default:
          break;
      }
      break;

    /* istanbul ignore next */
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
    handleAlarmEvent(alarm, _alarmEventEnum.Occur);
  } else {
    handleAlarmEvent(alarm, _alarmEventEnum.Clear);
  }
}

/**
 * digital alarm handler
 * @paarm {object} alarm - alarm object
 */
function handleDigitalAlarm(alarm) {
  const chnl = alarm._channel;

  if (chnl.engValue === alarm.cfg.set) {
    handleAlarmEvent(alarm, _alarmEventEnum.Occur);
  } else {
    handleAlarmEvent(alarm, _alarmEventEnum.Clear);
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
      if (chnl.engValue >= alarm.cfg.set) {
        handleAlarmEvent(alarm, _alarmEventEnum.Occur);
      } else {
        handleAlarmEvent(alarm, _alarmEventEnum.Clear);
      }
      break;

    case 'low':
      if (chnl.engValue <= alarm.cfg.set) {
        handleAlarmEvent(alarm, _alarmEventEnum.Occur);
      } else {
        handleAlarmEvent(alarm, _alarmEventEnum.Clear);
      }
      break;

    /* istanbul ignore next */
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

  this._delay_state = _alarmDelayStateEnum.Idle;
  this._delay_timer = null;

  this._alarm_time = common.getTimeMills();

  const self = this;

  if (cfg.type === 'sensorFault') {
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
  get delayState() {
    return this._delay_state;
  },
  ack() {
    handleAlarmEvent(this, _alarmEventEnum.Ack);
  },
  getStatus() {
    return {
      state: this._state,
      time: this._alarm_time,
    };
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

  _bstAlarms.insert(parseInt(number, 10), alm);

  return alm;
}

module.exports = {
  alarmStateEnum: _alarmStateEnum,
  alarmStateString: _alarmStateString,
  alarmDelayStateString: _alarmDelayStateString,
  createAlarm,
  getAlarm: alarmNum => _alarms[alarmNum],
  getAlarmRange(start, end) {
    return _bstAlarms.betweenBounds({ $lte: end, $gte: start });
  },
  getAlarmStat() {
    return {
      numActiveAlarms,
      numUnackedAlarms,
    };
  },
};
