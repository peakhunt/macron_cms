"use strict";
const util = require("util");
const events = require("events");
const EventEmitter = events.EventEmitter || events;
const SerialPort = require("serialport");
const modbusSerialDebug = require("debug")("modbus-serial");

const UNIT_ID = 255;

require("../utils/buffer_bit")();
var crc16 = require("../utils/crc16");

var handlers = require("./servertcp_handler");

function _callbackFactory(unitID, functionCode, rtuWriter) {
  return function cb(err, responseBuffer) {
    var crc;

    // If we have an error.
    if (err) {
      var errorCode = 0x04; // slave device failure
      if (!isNaN(err.modbusErrorCode)) {
        errorCode = err.modbusErrorCode;
      }

      // Set an error response
      functionCode = parseInt(functionCode) | 0x80;
      responseBuffer = Buffer.alloc(3 + 2);
      responseBuffer.writeUInt8(errorCode, 2);
    }

    // If we do not have a responseBuffer
    if (!responseBuffer) {
      return rtuWriter(null, responseBuffer);
    }

    // add unit number and function code
    responseBuffer.writeUInt8(unitID, 0);
    responseBuffer.writeUInt8(functionCode, 1);

    // Add crc
    crc = crc16(responseBuffer.slice(0, -2));
    responseBuffer.writeUInt16LE(crc, responseBuffer.length - 2);

    // Call callback function
    return rtuWriter(null, responseBuffer);
  };
}

function _parseModbusBuffer(reqFrame, vector, serverUnitID, rtuWriter) {
  var cb;

  if (reqFrame.length < 4) {
    return;
  }

  var unitID = reqFrame[0];
  var functionCode = reqFrame[1];
  var crc = reqFrame[reqFrame.length - 2] + reqFrame[reqFrame.length - 1] * 0x100;

  if (crc != crc16(reqFrame.slice(0, -2))) {
    return;
  }

  if (serverUnitID !== 255 && serverUnitID !== unitID) {
    return;
  }

  cb = _callbackFactory(unitID, functionCode, rtuWriter);

  switch (parseInt(functionCode)) {
    case 1:
    case 2:
      handlers.readCoilsOrInputDiscretes(reqFrame, vector, unitID, cb, functionCode);
      break;
    case 3:
      handlers.readMultipleRegisters(reqFrame, vector, unitID, cb);
      break;
    case 4:
      handlers.readInputRegisters(reqFrame, vector, unitID, cb);
      break;
    case 5:
      handlers.writeCoil(reqFrame, vector, unitID, cb);
      break;
    case 6:
      handlers.writeSingleRegister(reqFrame, vector, unitID, cb);
      break;
    case 15:
      handlers.forceMultipleCoils(reqFrame, vector, unitID, cb);
      break;
    case 16:
      handlers.writeMultipleRegisters(reqFrame, vector, unitID, cb);
      break;
    case 43:
      handlers.handleMEI(reqFrame, vector, unitID, cb);
      break;
    default:
      var errorCode = 0x01; // illegal function

      // set an error response
      functionCode = parseInt(functionCode) | 0x80;
      var responseBuffer = Buffer.alloc(3 + 2);
      responseBuffer.writeUInt8(errorCode, 2);
      cb({ modbusErrorCode: errorCode }, responseBuffer);
  }
}

var ServerRTU = function(vector, path, options) {
  var self = this;

  // options
  if (typeof(options) === "undefined") options = {};

  options.autoOpen = false;

  var recvBuffer = Buffer.from([]);
  const serverUnitID = options.unitID || UNIT_ID;

  // create the SerialPort
  this._client = new SerialPort(path, options);
  this._t35 = null;

  this._client.on("data", function onData(data) {
    recvBuffer = Buffer.concat([recvBuffer, data], recvBuffer.length + data.length);

    if (this._t35 !== null) {
      clearTimeout(this._t15);
    }

    var rtuWriter = function(err, responseBuffer) {
      if (err) {
        return;
      }

      // send data back
      if (responseBuffer) {
        // remove crc and add mbap
        // FIXME
        var outRtu = Buffer.alloc(responseBuffer.length + 6 - 2);

        outRtu.writeUInt16BE(transactionsId, 0);
        outRtu.writeUInt16BE(0, 2);
        outRtu.writeUInt16BE(responseBuffer.length - 2, 4);
        responseBuffer.copy(outRtu, 6);
        
        // write to port
        // FIXME
        this._client.write(outRtu);
      }
    };

    // XXX 5ms timeout would be enough as T35 for most cases
    this._t35 = setTimeout(() => {
      const reqFrame = Buffer.from([]);

      // copy contents and reset
      reqFrame.copy(recvBuffer);
      recvBuffer = Buffer.from([]);

      setTimeout(
        _parseModbusBuffer.bind(this,
          reqFrame,
          vector,
          serverUnitID,
          rtuWriter), 0);
    }, 5);
  });

  Object.defineProperty(this, "isOpen", {
    enumerable: true,
    get: function() {
      return this._client.isOpen;
    }
  });
  EventEmitter.call(this);
};
util.inherits(ServerRTU, EventEmitter);

ServerRTU.prototype.open = function(callback) {
  this._client.open(callback);
};

ServerRTU.prototype.close = function(callback) {
  this._client.close(callback);
};

module.exports = ServerRTU;
