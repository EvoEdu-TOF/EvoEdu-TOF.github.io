(function (global, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    global.evoEduApis = global.evoEduApis || {};
    global.evoEduApis.artificialLife = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function createSeededRng(seed) {
    let state = (seed >>> 0) || 246813579;
    return function () {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function biomorphMutate(genome, rate, magnitude, seed) {
    const rng = createSeededRng(seed ?? 1);
    return genome.map((value) => {
      if (rng() >= rate) {
        return value;
      }
      return value + ((rng() - 0.5) * 2 * magnitude);
    });
  }

  function runCumulativeSelection(params) {
    const rng = createSeededRng(params.seed ?? 1);
    const target = String(params.target ?? 'METHINKS IT IS LIKE A WEASEL').toUpperCase();
    const mutationRate = Math.max(0, Math.min(100, Number(params.mutationRate ?? 5)));
    const generations = Math.max(1, Math.floor(params.generations ?? 25));
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    let candidate = String(params.start ?? '').toUpperCase().padEnd(target.length, 'A').slice(0, target.length);
    const history = [{ generation: 0, candidate, score: fitness(candidate, target) }];

    for (let generation = 1; generation <= generations; generation += 1) {
      candidate = candidate.split('').map((char, index) => {
        if (char === target[index]) {
          return char;
        }
        if (rng() * 100 < mutationRate) {
          return target[index];
        }
        return chars[Math.floor(rng() * chars.length)];
      }).join('');
      history.push({ generation, candidate, score: fitness(candidate, target) });
    }

    return { target, history, final: history[history.length - 1] };
  }

  function fitness(candidate, target) {
    let score = 0;
    for (let i = 0; i < target.length; i += 1) {
      if (candidate[i] === target[i]) {
        score += 1;
      }
    }
    return score;
  }

  function runGridWorld(params) {
    const rng = createSeededRng(params.seed ?? 1);
    const populationSize = Math.max(1, Math.floor(params.populationSize ?? 12));
    const generations = Math.max(1, Math.floor(params.generations ?? 10));
    const mutationRate = Math.max(0, Math.min(1, Number(params.mutationRate ?? 0.05)));
    let population = Array.from({ length: populationSize }, () => ({
      genome: Array.from({ length: 5 }, () => Math.floor(rng() * 4)),
      fitness: 0,
    }));
    const history = [];

    for (let generation = 0; generation <= generations; generation += 1) {
      population = population.map((agent) => {
        const fitnessScore = agent.genome.reduce((sum, gene) => sum + gene, 0);
        return { genome: agent.genome.slice(), fitness: fitnessScore };
      });
      const best = population.reduce((winner, agent) => agent.fitness > winner.fitness ? agent : winner, population[0]);
      const avgFitness = population.reduce((sum, agent) => sum + agent.fitness, 0) / population.length;
      history.push({ generation, avgFitness, bestGenome: best.genome.slice(), bestFitness: best.fitness });
      population = population.map(() => ({
        genome: best.genome.map((gene) => (rng() < mutationRate ? Math.floor(rng() * 4) : gene)),
        fitness: 0,
      }));
    }

    return { params: { populationSize, generations, mutationRate }, history, final: history[history.length - 1] };
  }

  function routeDistance(points, route) {
    let distance = 0;
    for (let i = 0; i < route.length; i += 1) {
      const current = points[route[i]];
      const next = points[route[route[(i + 1) % route.length]]];
      const dx = current.x - next.x;
      const dy = current.y - next.y;
      distance += Math.sqrt(dx * dx + dy * dy);
    }
    return distance;
  }

  function runRouteOptimizer(params) {
    const points = params.points || [
      { x: 0, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 3 }, { x: 4, y: 2 }
    ];
    const route = params.route || points.map((_, index) => index);
    return {
      points,
      route,
      distance: routeDistance(points, route),
    };
  }

  function runNetworkBuilder(params) {
    const points = params.points || [
      { x: 0, y: 0 }, { x: 3, y: 0 }, { x: 1, y: 2 }
    ];
    const edges = [];
    for (let i = 1; i < points.length; i += 1) {
      edges.push([i - 1, i]);
    }
    const length = edges.reduce((sum, [a, b]) => {
      const dx = points[a].x - points[b].x;
      const dy = points[a].y - points[b].y;
      return sum + Math.sqrt(dx * dx + dy * dy);
    }, 0);
    return { points, edges, totalLength: length };
  }

  return {
    shapeEvolver: { mutateGenome: biomorphMutate },
    cumulativeSelectionExplorer: { runSimulation: runCumulativeSelection },
    gridWorldSurvival: { runSimulation: runGridWorld },
    routeOptimizer: { evaluateRoute: runRouteOptimizer },
    networkBuilder: { buildNetwork: runNetworkBuilder },
  };
});
