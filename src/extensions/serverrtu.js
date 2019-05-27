const util = require('util');
const events = require('events');
const SerialPort = require('serialport');
const handlers = require('modbus-serial/servers/servertcp_handler');

const EventEmitter = events.EventEmitter || events;

const UNIT_ID = 255;

require('modbus-serial/utils/buffer_bit')();

const crc16 = require('modbus-serial/utils/crc16');

function _callbackFactory(unitID, functionCode, rtuWriter) {
  let fc = functionCode;

  return function cb(err, responseBuffer) {
    let rspBuf = responseBuffer;

    // If we have an error.
    if (err) {
      let errorCode = 0x04; // slave device failure
      if (!Number.isNaN(err.modbusErrorCode)) {
        errorCode = err.modbusErrorCode;
      }

      // Set an error response
      fc = parseInt(fc, 10) || 0x80;
      rspBuf = Buffer.alloc(3 + 2);
      rspBuf.writeUInt8(errorCode, 2);
    }

    // If we do not have a responseBuffer
    if (!rspBuf) {
      return rtuWriter(null, rspBuf);
    }

    // add unit number and function code
    rspBuf.writeUInt8(unitID, 0);
    rspBuf.writeUInt8(fc, 1);

    // Add crc
    const crc = crc16(rspBuf.slice(0, -2));
    rspBuf.writeUInt16LE(crc, rspBuf.length - 2);

    // Call callback function
    return rtuWriter(null, rspBuf);
  };
}

function _parseModbusBuffer(reqFrame, vector, serverUnitID, rtuWriter) {
  if (reqFrame.length < 4) {
    return;
  }

  const unitID = reqFrame[0];
  let functionCode = reqFrame[1];
  const crc = reqFrame[reqFrame.length - 2] + reqFrame[reqFrame.length - 1] * 0x100;

  if (crc !== crc16(reqFrame.slice(0, -2))) {
    return;
  }

  if (serverUnitID !== 255 && serverUnitID !== unitID) {
    /*
    console.log(` unit id check fail ${typeof serverUnitID} ${typeof unitID}`);
    console.log(` unit id check fail ${serverUnitID} ${unitID}`);
    */
    return;
  }
  const cb = _callbackFactory(unitID, functionCode, rtuWriter);
  const errorCode = 0x01; // illegal function
  let responseBuffer;

  switch (parseInt(functionCode, 10)) {
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
      // console.log('##### error case ####');

      // set an error response
      functionCode = parseInt(functionCode, 10) || 0x80;

      responseBuffer = Buffer.alloc(3 + 2);

      responseBuffer.writeUInt8(errorCode, 2);
      cb({ modbusErrorCode: errorCode }, responseBuffer);
  }
}

const ServerRTU = function serverRTU(vector, path, options) {
  const self = this;
  let opt = options;

  // options
  if (typeof opt === 'undefined') opt = {};

  opt.autoOpen = false;

  let recvBuffer = Buffer.from([]);
  const serverUnitID = opt.unitID || UNIT_ID;

  // create the SerialPort
  self._client = new SerialPort(path, opt);
  self._t35 = null;

  self._client.on('data', (data) => {
    recvBuffer = Buffer.concat([recvBuffer, data], recvBuffer.length + data.length);

    if (self._t35 !== null) {
      clearTimeout(self._t15);
    }

    const rtuWriter = (err, responseBuffer) => {
      if (err) {
        return;
      }

      // send data back
      if (responseBuffer) {
        self._client.write(responseBuffer);
      }
    };

    // XXX 5ms timeout would be enough as T35 for most cases
    self._t35 = setTimeout(() => {
      let reqFrame = Buffer.from([]);

      // copy contents and reset
      reqFrame = recvBuffer.slice();
      recvBuffer = Buffer.from([]);

      setTimeout(
        _parseModbusBuffer.bind(self,
          reqFrame,
          vector,
          serverUnitID,
          rtuWriter), 0,
      );
    }, 5);
  });

  Object.defineProperty(self, 'isOpen', {
    enumerable: true,
    get: () => self._client.isOpen,
  });
  EventEmitter.call(self);
};
util.inherits(ServerRTU, EventEmitter);

ServerRTU.prototype.open = (callback) => {
  this._client.open(callback);
};

ServerRTU.prototype.close = (callback) => {
  this._client.close(callback);
};

module.exports = ServerRTU;
