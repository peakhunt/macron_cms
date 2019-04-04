const assert = require('assert');
const vessel = require('../src/cms/vessel');

describe('vessel', () => {
  it('reset should reset trim list values to 0.0', () => {
    vessel.reset();
    assert.equal(vessel.trim(), 0.0);
    assert.equal(vessel.list(), 0.0);
  });
  it('update trim list', () => {
    const trimInAngle = 10,
          listInAngle = 10;
    const trimInRad = trimInAngle * Math.PI / 180,
          listInRad = listInAngle * Math.PI / 180;

    vessel.updateTrimList(trimInAngle, listInAngle);

    assert.equal(vessel.trim(), trimInRad);
    assert.equal(vessel.list(), listInRad);
  });
  it('correction value', () => {
    const l = 10.312,
          t = 4.132;
    const c = vessel.trimListCorrect(l, t);
    const expected = l * Math.tan(vessel.trim()) + t * Math.tan(vessel.list());

    assert.equal(c, expected);
  });
});
