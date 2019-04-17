const assert = require('assert');
const util = require('../src/util');

describe('alarm', () => {
  it('deep copy', () => {
    const to1 = {
      name: 'zolla',
      value: 10,
      hello: {
        msg1: 'hello',
        msg2: 'world',
        val: 33.324,
      },
    };

    const to2 = util.deepCopy(to1);

    assert.equal(to1.name, to2.name);
    assert.equal(to1.value, to2.value);
    assert.equal(to1.hello.msg1, to2.hello.msg1);
    assert.equal(to1.hello.msg2, to2.hello.msg2);
    assert.equal(to1.hello.val, to2.hello.val);
  });
});
