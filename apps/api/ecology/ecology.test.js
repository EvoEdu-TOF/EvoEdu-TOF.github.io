const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('./ecology.js');

test('ecobalance API returns predator and prey history', () => {
  const result = api.ecobalance.runSimulation({
    initialPrey: 40,
    initialPredator: 9,
    steps: 12,
  });
  assert.equal(result.history.length, 13);
  assert.ok(result.final.prey >= 0);
  assert.ok(result.final.predator >= 0);
});

test('climate range shifter API tracks climate and range mismatch over time', () => {
  const result = api.climateRangeShifter.runSimulation({
    rangeCenter: 30,
    climateVelocity: 2,
    adaptationRate: 0.5,
    habitatBreadth: 20,
    generations: 10,
  });
  assert.equal(result.history.length, 11);
  assert.ok(result.final.climateCenter > result.final.rangeCenter);
  assert.ok(result.final.occupancy >= 0 && result.final.occupancy <= 1);
});
