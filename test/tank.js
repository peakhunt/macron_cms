const assert = require('assert');
const tank = require('../src/cms/tank');
const vessel = require('../src/cms/vessel');

const tankCfg = {
  name: 'sample tank',
  distance: 10,
  DVManMsrPntToSns: 0.0,
  cDLFC: 0.0,
  cDTFC: 0.0,
  cDLR: 0.0,
  cDTR: 0.0,
  DBotManMsrPnt: 0.0
};

describe('tank', () => {
  it('tank creation', () => {
    let t;
    t = tank.createTank(tankCfg);

    assert.equal(t.cfg, tankCfg);
    assert.equal(t.ullage, 0.0);
    assert.equal(t.ullage_floatation_center, 0.0);
    assert.equal(t.level, 0.0);
    assert.equal(t.level_floatation_center, 0.0);
    assert.equal(t.level_at_ref, 0.0);
  });

  it('level update', () => {
    let t;
    t = tank.createTank(tankCfg);

    vessel.reset();

    t.updateTankLevel(1.0);
    assert.equal(t.ullage, 1.0);
    assert.equal(t.ullage_floatation_center, 1.0);
    assert.equal(t.level, 9.0);
    assert.equal(t.level_floatation_center, 9.0);
    assert.equal(t.level_at_ref, 9.0);

    vessel.updateTrimList(10, -10);
    t.updateTankLevel(1.0);
    assert.equal(t.ullage, 1.0);
    assert.equal(t.ullage_floatation_center, 1.0);
    assert.equal(t.level, 9.0);
    assert.equal(t.level_floatation_center, 9.0);
    assert.equal(t.level_at_ref, 9.0);
  });
});
