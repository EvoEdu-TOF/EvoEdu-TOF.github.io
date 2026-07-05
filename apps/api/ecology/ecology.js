(function (global, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    global.evoEduApis = global.evoEduApis || {};
    global.evoEduApis.ecology = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function runEcoBalance(params) {
    const preyBirth = Number(params.preyBirth ?? 0.1);
    const predatorDeath = Number(params.predatorDeath ?? 0.1);
    const predationRate = Number(params.predationRate ?? 0.01);
    const conversionRate = Number(params.conversionRate ?? 0.01);
    const carryingCapacity = Math.max(1, Number(params.carryingCapacity ?? 100));
    const extinctionThreshold = Math.max(0, Number(params.extinctionThreshold ?? 1));
    const steps = Math.max(1, Math.floor(params.steps ?? 60));

    let prey = Math.max(0, Number(params.initialPrey ?? 40));
    let predator = Math.max(0, Number(params.initialPredator ?? 9));
    const history = [{ step: 0, prey, predator }];

    for (let step = 1; step <= steps; step += 1) {
      const nextPrey = Math.max(
        0,
        prey + preyBirth * prey * (1 - prey / carryingCapacity) - predationRate * prey * predator
      );
      const nextPredator = Math.max(
        0,
        predator + conversionRate * predationRate * prey * predator - predatorDeath * predator
      );
      prey = nextPrey < extinctionThreshold ? 0 : nextPrey;
      predator = nextPredator < extinctionThreshold ? 0 : nextPredator;
      history.push({ step, prey, predator });
    }

    return {
      params: {
        preyBirth,
        predatorDeath,
        predationRate,
        conversionRate,
        carryingCapacity,
        extinctionThreshold,
        steps,
      },
      history,
      final: history[history.length - 1],
    };
  }

  function runClimateRangeShifter(params) {
    const startCenter = Number(params.rangeCenter ?? 50);
    const climateVelocity = Number(params.climateVelocity ?? 1);
    const adaptationRate = clamp(Number(params.adaptationRate ?? 0.6), 0, 1.5);
    const habitatBreadth = Math.max(1, Number(params.habitatBreadth ?? 12));
    const generations = Math.max(1, Math.floor(params.generations ?? 30));

    let climateCenter = startCenter;
    let rangeCenter = startCenter;
    const history = [{
      generation: 0,
      climateCenter,
      rangeCenter,
      mismatch: 0,
      occupancy: 1,
    }];

    for (let generation = 1; generation <= generations; generation += 1) {
      climateCenter += climateVelocity;
      rangeCenter += climateVelocity * adaptationRate;
      const mismatch = Math.abs(climateCenter - rangeCenter);
      const occupancy = clamp(1 - mismatch / habitatBreadth, 0, 1);
      history.push({
        generation,
        climateCenter,
        rangeCenter,
        mismatch,
        occupancy,
      });
    }

    return {
      params: {
        startCenter,
        climateVelocity,
        adaptationRate,
        habitatBreadth,
        generations,
      },
      history,
      final: history[history.length - 1],
    };
  }

  return {
    ecobalance: { runSimulation: runEcoBalance },
    climateRangeShifter: { runSimulation: runClimateRangeShifter },
  };
});
