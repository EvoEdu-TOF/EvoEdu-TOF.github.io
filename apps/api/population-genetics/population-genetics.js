(function (global, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    global.evoEduApis = global.evoEduApis || {};
    global.evoEduApis.populationGenetics = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function createSeededRng(seed) {
    let state = (seed >>> 0) || 123456789;
    function rng() {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 4294967296;
    }
    rng.getState = function () {
      return state >>> 0;
    };
    return rng;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function sampleBinomial(trials, probability, rng) {
    let count = 0;
    for (let i = 0; i < trials; i += 1) {
      if (rng() < probability) {
        count += 1;
      }
    }
    return count;
  }

  function normalizeFitness(value, fallback) {
    return Number.isFinite(value) ? value : fallback;
  }

  function alleleTrackerStep(p, params, meanFrequency, rng) {
    const fitnessAA = normalizeFitness(params.fitnessAA, 1);
    const fitnessAa = normalizeFitness(params.fitnessAa, 1);
    const fitnessaa = normalizeFitness(params.fitnessaa, 1);
    const u = clamp(params.mutationAtoA ?? 0, 0, 1);
    const v = clamp(params.mutationaToA ?? 0, 0, 1);
    const migrationRate = clamp(params.migrationRate ?? 0, 0, 1);
    const popSize = Math.max(1, Math.floor(params.populationSize ?? 100));

    const q = 1 - p;
    const wBar = (p * p * fitnessAA) + (2 * p * q * fitnessAa) + (q * q * fitnessaa);
    const afterSelection = wBar === 0 ? p : ((p * p * fitnessAA) + (p * q * fitnessAa)) / wBar;
    const afterMutation = clamp((afterSelection * (1 - u)) + ((1 - afterSelection) * v), 0, 1);
    const afterMigration = clamp(((1 - migrationRate) * afterMutation) + (migrationRate * meanFrequency), 0, 1);
    const sampled = sampleBinomial(popSize * 2, afterMigration, rng);
    return sampled / (popSize * 2);
  }

  function alleleTrackerReferenceStep(p, params, meanFrequency) {
    const fitnessAA = normalizeFitness(params.fitnessAA, 1);
    const fitnessAa = normalizeFitness(params.fitnessAa, 1);
    const fitnessaa = normalizeFitness(params.fitnessaa, 1);
    const u = clamp(params.mutationAtoA ?? 0, 0, 1);
    const v = clamp(params.mutationaToA ?? 0, 0, 1);
    const migrationRate = clamp(params.migrationRate ?? 0, 0, 1);

    const q = 1 - p;
    const wBar = (p * p * fitnessAA) + (2 * p * q * fitnessAa) + (q * q * fitnessaa);
    const afterSelection = wBar === 0 ? p : ((p * p * fitnessAA) + (p * q * fitnessAa)) / wBar;
    const afterMutation = clamp((afterSelection * (1 - u)) + ((1 - afterSelection) * v), 0, 1);
    return clamp(((1 - migrationRate) * afterMutation) + (migrationRate * meanFrequency), 0, 1);
  }

  function normalizeAlleleTrackerParams(params) {
    return {
      populationSize: Math.max(1, Math.floor(params.populationSize ?? params.popSize ?? 100)),
      numPop: Math.max(0, Math.floor(params.numPop ?? 4)),
      generations: Math.max(1, Math.floor(params.generations ?? params.genRun ?? 50)),
      initFreq: clamp(params.initFreq ?? 0.5, 0, 1),
      fitnessAA: normalizeFitness(params.fitnessAA ?? params.fitGenAA, 1),
      fitnessAa: normalizeFitness(params.fitnessAa ?? params.fitGenAa, 1),
      fitnessaa: normalizeFitness(params.fitnessaa ?? params.fitGenaa, 1),
      mutationAtoA: clamp(params.mutationAtoA ?? params.mutAa ?? 0, 0, 1),
      mutationaToA: clamp(params.mutationaToA ?? params.mutaA ?? 0, 0, 1),
      migrationRate: clamp(params.migrationRate ?? params.migRate ?? 0, 0, 1),
    };
  }

  function countResolvedFinitePops(row) {
    let fixedCount = 0;
    let lostCount = 0;
    for (let index = 1; index < row.length; index += 1) {
      if (row[index] >= 0.999999) {
        fixedCount += 1;
      } else if (row[index] <= 0.000001) {
        lostCount += 1;
      }
    }
    return { fixedCount, lostCount };
  }

  function runLegacyAlleleTracker(params) {
    const normalized = normalizeAlleleTrackerParams(params);
    const rng = createSeededRng(params.seed ?? 1);
    const history = [Array(normalized.numPop + 1).fill(normalized.initFreq)];

    for (let generation = 0; generation < normalized.generations; generation += 1) {
      const current = history[history.length - 1];
      const finiteMean = normalized.numPop
        ? current.slice(1).reduce((sum, value) => sum + value, 0) / normalized.numPop
        : current[0];
      const next = new Array(normalized.numPop + 1).fill(0);
      next[0] = alleleTrackerReferenceStep(current[0], normalized, finiteMean);
      for (let popIndex = 1; popIndex <= normalized.numPop; popIndex += 1) {
        next[popIndex] = alleleTrackerStep(current[popIndex], normalized, finiteMean, rng);
      }
      history.push(next);
    }

    const final = history[history.length - 1];
    const counts = countResolvedFinitePops(final);
    return {
      params: normalized,
      history,
      final,
      fixedCount: counts.fixedCount,
      lostCount: counts.lostCount,
      totalGenerations: history.length - 1,
      seed: params.seed ?? 1,
      rngState: rng.getState(),
    };
  }

  function continueLegacyAlleleTracker(options) {
    const history = Array.isArray(options.history) ? options.history.map((row) => row.slice()) : [];
    if (history.length < 2) {
      return runLegacyAlleleTracker(options);
    }

    const normalized = normalizeAlleleTrackerParams(options);
    const generations = Math.max(1, Math.floor(options.generations ?? options.continueGens ?? 1));
    const rng = createSeededRng(options.rngState ?? options.seed ?? 1);

    for (let generation = 0; generation < generations; generation += 1) {
      const current = history[history.length - 1];
      const finiteMean = normalized.numPop
        ? current.slice(1).reduce((sum, value) => sum + value, 0) / normalized.numPop
        : current[0];
      const next = new Array(normalized.numPop + 1).fill(0);
      next[0] = alleleTrackerReferenceStep(current[0], normalized, finiteMean);
      for (let popIndex = 1; popIndex <= normalized.numPop; popIndex += 1) {
        next[popIndex] = alleleTrackerStep(current[popIndex], normalized, finiteMean, rng);
      }
      history.push(next);
    }

    const final = history[history.length - 1];
    const counts = countResolvedFinitePops(final);
    return {
      params: normalized,
      history,
      final,
      fixedCount: counts.fixedCount,
      lostCount: counts.lostCount,
      totalGenerations: history.length - 1,
      seed: options.seed ?? 1,
      rngState: rng.getState(),
    };
  }

  function runAlleleTracker(params) {
    const rng = createSeededRng(params.seed ?? 1);
    const numPop = Math.max(1, Math.floor(params.numPop ?? 4));
    const generations = Math.max(1, Math.floor(params.generations ?? 50));
    const initFreq = clamp(params.initFreq ?? 0.5, 0, 1);
    let frequencies = Array(numPop).fill(initFreq);
    const history = [frequencies.slice()];

    for (let generation = 0; generation < generations; generation += 1) {
      const meanFrequency = frequencies.reduce((sum, value) => sum + value, 0) / frequencies.length;
      frequencies = frequencies.map((p) => alleleTrackerStep(p, params, meanFrequency, rng));
      history.push(frequencies.slice());
    }

    const final = history[history.length - 1];
    return {
      params: {
        populationSize: Math.max(1, Math.floor(params.populationSize ?? 100)),
        numPop,
        generations,
      },
      history,
      final,
      fixedCount: final.filter((value) => value >= 0.999999).length,
      lostCount: final.filter((value) => value <= 0.000001).length,
    };
  }

  function neighborsForCell(x, y, gridSize, dispersalDistance) {
    const cells = [];
    for (let dx = -dispersalDistance; dx <= dispersalDistance; dx += 1) {
      for (let dy = -dispersalDistance; dy <= dispersalDistance; dy += 1) {
        const nx = x + dx;
        const ny = y + dy;
        if (dx === 0 && dy === 0) {
          continue;
        }
        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
          cells.push([nx, ny]);
        }
      }
    }
    return cells;
  }

  function createInitialGrid(gridSize, rng) {
    return Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => (rng() < 0.5 ? 0 : 1))
    );
  }

  function summarizeGrid(grid, barrierCol) {
    let left0 = 0;
    let leftTotal = 0;
    let right0 = 0;
    let rightTotal = 0;
    for (let y = 0; y < grid.length; y += 1) {
      for (let x = 0; x < grid.length; x += 1) {
        const allele = grid[y][x];
        if (x < barrierCol) {
          leftTotal += 1;
          if (allele === 0) {
            left0 += 1;
          }
        } else {
          rightTotal += 1;
          if (allele === 0) {
            right0 += 1;
          }
        }
      }
    }
    return {
      leftAllele0: leftTotal ? left0 / leftTotal : 0,
      rightAllele0: rightTotal ? right0 / rightTotal : 0,
    };
  }

  function runGeneFlowMapper(params) {
    const rng = createSeededRng(params.seed ?? 1);
    const gridSize = Math.max(4, Math.floor(params.gridSize ?? 20));
    const generations = Math.max(1, Math.floor(params.generations ?? 25));
    const mutationRate = clamp(params.mutationRate ?? 0.001, 0, 1);
    const dispersalDistance = Math.max(1, Math.floor(params.dispersalDistance ?? 1));
    const barrierEnabled = Boolean(params.barrierEnabled ?? true);
    const barrierPosition = clamp(params.barrierPosition ?? 0.5, 0, 1);
    const barrierGeneFlowRate = clamp(params.barrierGeneFlowRate ?? 0.05, 0, 1);
    const barrierCol = Math.max(1, Math.min(gridSize - 1, Math.floor(barrierPosition * gridSize)));

    let grid = createInitialGrid(gridSize, rng);
    const summaries = [summarizeGrid(grid, barrierCol)];

    for (let generation = 0; generation < generations; generation += 1) {
      const next = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
      for (let y = 0; y < gridSize; y += 1) {
        for (let x = 0; x < gridSize; x += 1) {
          const neighbors = neighborsForCell(x, y, gridSize, dispersalDistance).filter(([nx]) => {
            if (!barrierEnabled) {
              return true;
            }
            const sameSide = (x < barrierCol) === (nx < barrierCol);
            return sameSide || rng() < barrierGeneFlowRate;
          });
          const source = neighbors.length
            ? neighbors[Math.floor(rng() * neighbors.length)]
            : [x, y];
          let allele = grid[source[1]][source[0]];
          if (rng() < mutationRate) {
            allele = allele === 0 ? 1 : 0;
          }
          next[y][x] = allele;
        }
      }
      grid = next;
      summaries.push(summarizeGrid(grid, barrierCol));
    }

    return {
      params: {
        gridSize,
        generations,
        mutationRate,
        dispersalDistance,
        barrierEnabled,
        barrierPosition,
        barrierGeneFlowRate,
      },
      barrierCol,
      summaries,
      finalSummary: summaries[summaries.length - 1],
    };
  }

  function multiplyMatrixVector(matrix, vector) {
    return matrix.map((row) =>
      row.reduce((sum, value, index) => sum + (value * vector[index]), 0)
    );
  }

  function createStageMatrix({ fecundity, survival, recurrence }) {
    const stages = fecundity.length;
    const matrix = Array.from({ length: stages }, () => Array(stages).fill(0));
    matrix[0] = fecundity.slice();
    for (let i = 1; i < stages; i += 1) {
      matrix[i][i - 1] = survival[i - 1] ?? 0;
      matrix[i][i] = recurrence[i - 1] ?? 0;
    }
    return matrix;
  }

  function runLifeCycleModeler(params) {
    const matrix = params.matrix || createStageMatrix({
      fecundity: params.fecundity || [0, 1.2, 0.5],
      survival: params.survival || [0.5, 0.7],
      recurrence: params.recurrence || [0, 0.2],
    });
    const steps = Math.max(1, Math.floor(params.steps ?? 12));
    let population = (params.population || [20, 12, 6]).slice();
    const history = [population.slice()];

    for (let step = 0; step < steps; step += 1) {
      population = multiplyMatrixVector(matrix, population);
      history.push(population.slice());
    }

    return {
      params: { steps, stages: population.length },
      matrix,
      history,
      totals: history.map((vector) => vector.reduce((sum, value) => sum + value, 0)),
      finalPopulation: history[history.length - 1],
    };
  }

  return {
    createSeededRng,
    alleleTracker: {
      runSimulation: runAlleleTracker,
      runLegacySimulation: runLegacyAlleleTracker,
      continueLegacySimulation: continueLegacyAlleleTracker,
    },
    geneFlowMapper: { runSimulation: runGeneFlowMapper },
    lifeCycleModeler: {
      createStageMatrix,
      multiplyMatrixVector,
      projectPopulation: runLifeCycleModeler,
    },
  };
});
