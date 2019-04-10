/**
 * A module for channel
 * @module channel
 */
const { EventEmitter } = require('events');
const util = require('util');

//
// module privates
//
const _channels = {};

/**
 * channel constructor
 * @paarm {number} number - channel number
 * @param {object} cfg - channel configuration object
 cfg: {
  name: 'XXX',
  dir: 'in|out|virtual',
  type: 'analog|digital',
  sensor: 'XXX' (optional, sensor type),
  io: 'XXX' (optional, io location),
 }
 */
function Channel(number, cfg) {
  EventEmitter.call(this);

  this.number = number;
  this.cfg = cfg;

  if (this.cfg.type === 'analog') {
    this._value = 0;
  } else {
    this._value = false;
  }

  this._sensorFault = false;
}

Channel.prototype = {
  constructor: Channel,
  get value() {
    return this._value;
  },
  set value(v) {
    this._value = v;
    this.emit('value', this);
  },
  get sensorFault() {
    return this._sensorFault;
  },
  set sensorFault(s) {
    this._sensorFault = s;
    this.emit('sensorFault', this);
  },
};

//
// declare that Channel inherits from EventEmitter
//
util.inherits(Channel, EventEmitter);

/**
 * create a channel
 * @param {number} number - channel number
 * @param {object} cfg - channel configuration object
 * @return {object} channel object
 */
function createChannel(number, cfg) {
  const chnl = new Channel(number, cfg);

  _channels[number] = chnl;

  return chnl;
}

module.exports = {
  createChannel,
  getChannel: chnlNum => _channels[chnlNum],
};
