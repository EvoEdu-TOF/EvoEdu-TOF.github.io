const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('./population-genetics.js');

test('allele tracker API returns deterministic history for a given seed', () => {
  const first = api.alleleTracker.runSimulation({
    seed: 42,
    populationSize: 20,
    numPop: 3,
    generations: 5,
    initFreq: 0.5,
    fitnessAA: 1,
    fitnessAa: 1,
    fitnessaa: 1,
  });
  const second = api.alleleTracker.runSimulation({
    seed: 42,
    populationSize: 20,
    numPop: 3,
    generations: 5,
    initFreq: 0.5,
    fitnessAA: 1,
    fitnessAa: 1,
    fitnessaa: 1,
  });
  assert.deepEqual(first.history, second.history);
  assert.equal(first.history.length, 6);
  assert.equal(first.final.length, 3);
});

test('legacy allele tracker API returns reference plus finite populations', () => {
  const result = api.alleleTracker.runLegacySimulation({
    seed: 11,
    popSize: 20,
    numPop: 3,
    genRun: 4,
    initFreq: 0.5,
    fitGenAA: 1,
    fitGenAa: 1,
    fitGenaa: 1,
  });
  assert.equal(result.history.length, 5);
  assert.equal(result.history[0].length, 4);
  assert.equal(result.totalGenerations, 4);
  assert.ok(Number.isInteger(result.rngState));
});

test('legacy allele tracker continuation extends history and preserves prior rows', () => {
  const first = api.alleleTracker.runLegacySimulation({
    seed: 5,
    popSize: 20,
    numPop: 2,
    genRun: 3,
    initFreq: 0.5,
  });
  const continued = api.alleleTracker.continueLegacySimulation({
    history: first.history,
    rngState: first.rngState,
    seed: first.seed,
    popSize: 20,
    numPop: 2,
    generations: 2,
    initFreq: 0.5,
  });
  assert.equal(continued.history.length, 6);
  assert.deepEqual(continued.history.slice(0, 4), first.history);
  assert.equal(continued.totalGenerations, 5);
});

test('gene flow mapper API summarizes left and right allele frequencies', () => {
  const result = api.geneFlowMapper.runSimulation({
    seed: 7,
    gridSize: 10,
    generations: 4,
    barrierEnabled: true,
    barrierPosition: 0.5,
    barrierGeneFlowRate: 0.1,
  });
  assert.equal(result.summaries.length, 5);
  assert.ok(result.finalSummary.leftAllele0 >= 0 && result.finalSummary.leftAllele0 <= 1);
  assert.ok(result.finalSummary.rightAllele0 >= 0 && result.finalSummary.rightAllele0 <= 1);
});

test('life cycle modeler API projects populations from a stage matrix', () => {
  const matrix = api.lifeCycleModeler.createStageMatrix({
    fecundity: [0, 1.5, 0.5],
    survival: [0.6, 0.8],
    recurrence: [0.1, 0.2],
  });
  const result = api.lifeCycleModeler.projectPopulation({
    matrix,
    population: [10, 8, 4],
    steps: 3,
  });
  assert.equal(result.history.length, 4);
  assert.equal(result.matrix.length, 3);
  assert.equal(result.finalPopulation.length, 3);
  assert.ok(result.totals[0] > 0);
});
