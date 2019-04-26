function ModbusRTUMock() {
  this.failure = false;
  this.failure2 = false;
  this.id = 0;
  this.u16Value = 0;
  this.boolValue = false;
}

ModbusRTUMock.prototype = {
  constructor: ModbusRTUMock,
  setFailure: (v) => {
    this.failure = v;
  },
  setFailure2: (v) => {
    this.failure2 = v;
  },
  setU16Value: (v) => {
    this.u16Value = v;
  },
  setBoolValue: (v) => {
    this.boolValue = v;
  },
  setID: (v) => {
    this.id = v;
  },
  readDiscreteInputs: (addr, numReg) => {
    const self = this;

    return new Promise((resolve, reject) => {
      process.nextTick(() =>{
        if (self.failure2) {
          reject();
        } else {
          const d = {
            data: [],
          };

          for (let i = 0; i < numReg; i++) {
            d.data.push(self.boolValue);
          }
          resolve(d);
        }
      });
    });
  },
  readInputRegisters: (addr, numReg) => {
    const self = this;

    return new Promise((resolve, reject) => {
      process.nextTick(() =>{
        if (self.failure) {
          reject();
        } else {
          const d = {
            data: [],
          };

          for (let i = 0; i < numReg; i++) {
            d.data.push(self.u16Value);
          }
          resolve(d);
        }
      });
    });
  }
};

module.exports = ModbusRTUMock;
