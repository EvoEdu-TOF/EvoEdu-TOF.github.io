const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('./artificial-life.js');

test('shape evolver mutation is deterministic for a seed', () => {
  const genome = [5, 30, -30, 20, 20];
  const first = api.shapeEvolver.mutateGenome(genome, 0.7, 2, 11);
  const second = api.shapeEvolver.mutateGenome(genome, 0.7, 2, 11);
  assert.deepEqual(first, second);
});

test('cumulative selection returns generation history', () => {
  const result = api.cumulativeSelectionExplorer.runSimulation({ generations: 5, seed: 2 });
  assert.equal(result.history.length, 6);
  assert.ok(result.final.score >= 0);
});

test('grid world returns fitness history', () => {
  const result = api.gridWorldSurvival.runSimulation({ populationSize: 6, generations: 4, seed: 3 });
  assert.equal(result.history.length, 5);
  assert.ok(result.final.avgFitness >= 0);
});

test('route optimizer evaluates route distance', () => {
  const result = api.routeOptimizer.evaluateRoute({
    points: [{ x: 0, y: 0 }, { x: 3, y: 4 }],
    route: [0, 1],
  });
  assert.ok(result.distance > 0);
});

test('network builder returns a simple connected network', () => {
  const result = api.networkBuilder.buildNetwork({});
  assert.ok(result.totalLength > 0);
  assert.ok(result.edges.length > 0);
});
