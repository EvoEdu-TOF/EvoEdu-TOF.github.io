const BIOMORPH_VERSION = "1.0.0";

const geneDefs = [
  { id: "g1", label: "Gene 1", min: -12, max: 12, text: "Rightward bend of the upper branch. Positive values pull tips outward; negative values fold them inward." },
  { id: "g2", label: "Gene 2", min: -12, max: 12, text: "Upward reach of the upper branch. It usually changes height and open-wing forms." },
  { id: "g3", label: "Gene 3", min: -12, max: 12, text: "Rightward bend of the middle branch. It often changes waist width and lateral appendages." },
  { id: "g4", label: "Gene 4", min: -12, max: 12, text: "Upward or downward pull on the middle branch. It can make hooks, petals, or compact masses." },
  { id: "g5", label: "Gene 5", min: -12, max: 12, text: "Rightward bend of the lower branch. It strongly affects leg-like or root-like spread." },
  { id: "g6", label: "Gene 6", min: -12, max: 12, text: "Vertical reach of the lower branch. Positive values make longer lower appendages." },
  { id: "g7", label: "Gene 7", min: -10, max: 10, text: "Curvature drift added at each recursive branching level." },
  { id: "g8", label: "Gene 8", min: -10, max: 10, text: "Segment taper and compression as branches get farther from the trunk." },
  { id: "g9", label: "Gene 9", min: 0, max: 10, text: "Branching depth. At 0 the phenotype is nearly a dot; higher values reveal more recursive structure." },
];

const presets = {
  dawkinsTree: [3, 6, 4, 4, 2, -5, 1, 2, 5],
  primevalDot: [3, 6, 4, 4, 2, -5, 1, 2, 0],
  insect: [7, 8, -4, 5, 8, -7, 3, 1, 7],
  willow: [-2, 9, -4, 7, -6, 6, -3, 4, 7],
  temple: [9, 1, 7, -4, 9, 2, -2, -1, 6],
};

const state = {
  parent: presets.dawkinsTree.slice(),
  previousParent: null,
  variants: [],
  selectedIndex: 0,
  generation: 0,
  mutationStep: 1,
  strokeWidth: 2,
  showAxes: false,
  history: [],
  currentMetrics: null,
  developmentTimer: null,
  developmentAnimating: false,
  evaluatorTimer: null,
  evaluatorRunning: false,
  evaluatorRemaining: 0,
  evaluatorTotal: 0,
  evaluatorId: "fractal",
};

const fitnessEvaluators = [
  {
    id: "fractal",
    label: "Higher fractal dimension",
    description: "Selects the child with the highest box-counting estimate of space-filling branch complexity.",
    score: (features) => features.fractalDimension,
  },
  {
    id: "entropy",
    label: "Higher Shannon entropy",
    description: "Selects the child whose strokes are most evenly distributed across an occupancy grid.",
    score: (features) => features.entropy,
  },
  {
    id: "fill",
    label: "Fill square viewport",
    description: "Selects the child whose bounding box is closest to a square while using more of the phenotype space.",
    score: (features) => features.fillScore,
  },
  {
    id: "tallness",
    label: "Tallness",
    description: "Selects taller, narrower phenotypes by maximizing height relative to width.",
    score: (features) => features.height / Math.max(1, features.width),
  },
  {
    id: "broadness",
    label: "Broadness",
    description: "Selects wider, lower phenotypes by maximizing width relative to height.",
    score: (features) => features.width / Math.max(1, features.height),
  },
  {
    id: "compactness",
    label: "Compactness",
    description: "Selects dense phenotypes with many segments in a smaller bounding area.",
    score: (features) => features.segments / Math.max(1, features.width * features.height),
  },
  {
    id: "appendages",
    label: "Appendage spread",
    description: "Selects forms with terminal branch tips spread farther from the centerline.",
    score: (features) => features.appendageSpread,
  },
  {
    id: "insect",
    label: "Insect-like silhouette",
    description: "Selects a compact central body with lateral appendage spread and moderate vertical balance.",
    score: (features) => features.insectScore,
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function geneLabel(index) {
  return geneDefs[index]?.label || `Gene ${index + 1}`;
}

function normalizedGenes(genes) {
  const source = Array.isArray(genes) ? genes : presets.dawkinsTree;
  return geneDefs.map((def, index) => {
    const value = Number(source[index] ?? presets.dawkinsTree[index] ?? 0);
    return clamp(Math.round(value), def.min, def.max);
  });
}

function mutateGene(genes, geneIndex, delta) {
  const next = genes.slice();
  const def = geneDefs[geneIndex];
  next[geneIndex] = clamp(next[geneIndex] + delta, def.min, def.max);
  return next;
}

function randomValidDelta(parent, geneIndex) {
  const def = geneDefs[geneIndex];
  const choices = [];
  if (parent[geneIndex] > def.min) choices.push(-1);
  if (parent[geneIndex] < def.max) choices.push(1);
  if (!choices.length) return 0;
  return choices[Math.floor(Math.random() * choices.length)];
}

function makeVariants(parent) {
  return geneDefs.map((def, geneIndex) => {
    const delta = randomValidDelta(parent, geneIndex);
    const genes = mutateGene(parent, geneIndex, delta);
    return {
      genes,
      mutation: {
        geneIndex,
        gene: def.label,
        prior: parent[geneIndex],
        current: genes[geneIndex],
        delta: genes[geneIndex] - parent[geneIndex],
      },
    };
  });
}

function rerollLitter() {
  stopEvaluator();
  generateLitter();
  renderAll();
}

function selectedEvaluator() {
  const select = document.querySelector("#fitness-evaluator");
  const id = select?.value || state.evaluatorId;
  return fitnessEvaluators.find((evaluator) => evaluator.id === id) || fitnessEvaluators[0];
}

function scoreVariants() {
  const evaluator = selectedEvaluator();
  return state.variants.map((variant, index) => ({
    index,
    variant,
    evaluator,
    score: evaluator.score(phenotypeFeatures(variant.genes)),
  })).sort((a, b) => b.score - a.score);
}

function renderEvaluatorInfo() {
  const evaluator = selectedEvaluator();
  state.evaluatorId = evaluator.id;
  const description = document.querySelector("#evaluator-description");
  if (description) description.textContent = evaluator.description;
  renderScoreTable();
}

function renderScoreTable(scores = scoreVariants()) {
  const body = document.querySelector("#score-table-body");
  if (!body) return;
  const bestIndex = scores[0]?.index;
  const byIndex = [...scores].sort((a, b) => a.index - b.index);
  body.innerHTML = byIndex.map((entry) => {
    const mutation = entry.variant.mutation;
    const position = `R${Math.floor(entry.index / 3) + 1}C${(entry.index % 3) + 1}`;
    const rowClass = entry.index === bestIndex ? " class=\"best-score\"" : "";
    return `<tr${rowClass}><td>${position}</td><td>${mutationTitle(mutation)}</td><td>${entry.score.toFixed(4)}</td></tr>`;
  }).join("");
}

function setEvaluatorStatus(text) {
  const status = document.querySelector("#evaluator-status");
  if (status) status.textContent = text;
}

function stopEvaluator(message = "No automated selection is running.") {
  if (state.evaluatorTimer) {
    window.clearTimeout(state.evaluatorTimer);
    state.evaluatorTimer = null;
  }
  state.evaluatorRunning = false;
  const runButton = document.querySelector("#run-evaluator");
  if (runButton) runButton.disabled = false;
  const stopButton = document.querySelector("#stop-evaluator");
  if (stopButton) stopButton.disabled = true;
  if (message) setEvaluatorStatus(message);
}

function mutationTitle(mutation) {
  if (mutation.geneIndex === -1) return "Parent";
  return `${mutation.gene} (${signed(mutation.delta)})`;
}

function mutationDetail(mutation) {
  if (mutation.geneIndex === -1) return "No gene change";
  return `${mutation.prior} -> ${mutation.current}`;
}

function mutationGridPosition(index) {
  return `row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}`;
}

function branchVectors(genes, level) {
  const taper = Math.max(0.25, 1 - level * 0.045 + genes[7] * 0.018);
  const drift = genes[6] * level * 0.18;
  return [
    { x: genes[0] * taper + drift, y: -(Math.abs(genes[1]) + 4) * taper },
    { x: genes[2] * taper - drift * 0.35, y: -genes[3] * taper },
    { x: genes[4] * taper + drift * 0.25, y: (Math.abs(genes[5]) + 3) * taper },
  ];
}

function developSegments(genes) {
  const depth = clamp(Math.round(genes[8]), 0, 10);
  const segments = [];
  const points = [{ x: 0, y: 0 }];
  const initialLength = 9 + Math.max(0, Math.abs(genes[1]) + Math.abs(genes[5])) * 0.25;

  function addSegment(x1, y1, x2, y2) {
    segments.push({ x1, y1, x2, y2 });
    points.push({ x: x2, y: y2 }, { x: -x2, y: y2 });
    if (x2 !== 0) segments.push({ x1: -x1, y1, x2: -x2, y2 });
  }

  function grow(x, y, level, scale, polarity, incoming) {
    if (level <= 0) {
      const dot = 1.4 + Math.abs(genes[7]) * 0.08;
      const length = Math.hypot(incoming.x, incoming.y) || 1;
      const ux = incoming.x / length;
      const uy = incoming.y / length;
      addSegment(x - ux * dot * 0.5, y - uy * dot * 0.5, x + ux * dot * 0.5, y + uy * dot * 0.5);
      return;
    }

    const vectors = branchVectors(genes, depth - level);
    vectors.forEach((vector, branchIndex) => {
      const branchScale = scale * (branchIndex === 1 ? 0.76 : 0.88);
      const x2 = x + polarity * vector.x * branchScale;
      const y2 = y + vector.y * branchScale;
      addSegment(x, y, x2, y2);
      const nextPolarity = branchIndex === 1 ? -polarity : polarity;
      grow(x2, y2, level - 1, branchScale * 0.74, nextPolarity, { x: x2 - x, y: y2 - y });
    });
  }

  if (depth === 0) {
    addSegment(-1.5, 0, 1.5, 0);
  } else {
    addSegment(0, initialLength * 0.9, 0, 0);
    grow(0, 0, depth, initialLength / 8, 1, { x: 0, y: -1 });
  }

  return { segments, points, depth };
}

function boundsForSegments(segments) {
  if (!segments.length) return { minX: -1, maxX: 1, minY: -1, maxY: 1, width: 2, height: 2 };
  const xs = [];
  const ys = [];
  segments.forEach((segment) => {
    xs.push(segment.x1, segment.x2);
    ys.push(segment.y1, segment.y2);
  });
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

function metricsFor(genes) {
  const developed = developSegments(genes);
  const bounds = boundsForSegments(developed.segments);
  const tips = new Set(developed.segments.map((segment) => `${segment.x2.toFixed(2)},${segment.y2.toFixed(2)}`));
  return {
    segments: developed.segments.length,
    depth: developed.depth,
    width: bounds.width,
    height: bounds.height,
    tips: tips.size,
    compactness: bounds.height ? bounds.width / bounds.height : bounds.width,
  };
}

function phenotypeFeatures(genes, gridSize = 32) {
  const { segments } = developSegments(genes);
  const bounds = boundsForSegments(segments);
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  const terminalPoints = [];

  function mark(x, y) {
    const gx = clamp(Math.floor(((x - bounds.minX) / bounds.width) * gridSize), 0, gridSize - 1);
    const gy = clamp(Math.floor(((y - bounds.minY) / bounds.height) * gridSize), 0, gridSize - 1);
    grid[gy][gx] += 1;
  }

  segments.forEach((segment) => {
    const length = Math.hypot(segment.x2 - segment.x1, segment.y2 - segment.y1);
    const samples = Math.max(2, Math.ceil(length * 2));
    for (let i = 0; i <= samples; i += 1) {
      const t = i / samples;
      mark(segment.x1 + (segment.x2 - segment.x1) * t, segment.y1 + (segment.y2 - segment.y1) * t);
    }
    terminalPoints.push({ x: segment.x2, y: segment.y2 });
  });

  const occupied = grid.flat().filter((value) => value > 0).length;
  const cells = gridSize * gridSize;
  const occupancy = occupied / cells;
  const entropy = occupancy > 0 && occupancy < 1
    ? -occupancy * Math.log2(occupancy) - (1 - occupancy) * Math.log2(1 - occupancy)
    : 0;
  const fractalDimension = estimateFractalDimension(grid);
  const squareFit = 1 - Math.abs(bounds.width - bounds.height) / Math.max(bounds.width, bounds.height, 1);
  const fillScore = squareFit * Math.min(1, occupancy * 5);
  const appendageSpread = terminalPoints.reduce((sum, point) => sum + Math.abs(point.x), 0) / Math.max(1, terminalPoints.length);
  const centerDensity = densityInRegion(grid, 0.38, 0.62, 0.25, 0.75);
  const sideDensity = densityInRegion(grid, 0, 0.28, 0.15, 0.85) + densityInRegion(grid, 0.72, 1, 0.15, 0.85);
  const insectScore = centerDensity * 0.9 + sideDensity * 0.7 + appendageSpread / Math.max(1, bounds.width) - Math.abs(bounds.width / Math.max(1, bounds.height) - 0.55);

  return {
    width: bounds.width,
    height: bounds.height,
    segments: segments.length,
    occupied,
    occupancy,
    entropy,
    fractalDimension,
    fillScore,
    appendageSpread,
    insectScore,
  };
}

function densityInRegion(grid, x0, x1, y0, y1) {
  const size = grid.length;
  let occupied = 0;
  let total = 0;
  const startX = Math.floor(x0 * size);
  const endX = Math.ceil(x1 * size);
  const startY = Math.floor(y0 * size);
  const endY = Math.ceil(y1 * size);
  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      total += 1;
      if (grid[y]?.[x] > 0) occupied += 1;
    }
  }
  return total ? occupied / total : 0;
}

function estimateFractalDimension(grid) {
  const size = grid.length;
  const measurements = [1, 2, 4, 8, 16]
    .filter((box) => box <= size)
    .map((box) => {
      let count = 0;
      for (let y = 0; y < size; y += box) {
        for (let x = 0; x < size; x += box) {
          let occupied = false;
          for (let yy = y; yy < Math.min(size, y + box) && !occupied; yy += 1) {
            for (let xx = x; xx < Math.min(size, x + box); xx += 1) {
              if (grid[yy][xx] > 0) {
                occupied = true;
                break;
              }
            }
          }
          if (occupied) count += 1;
        }
      }
      return { x: Math.log(1 / box), y: Math.log(Math.max(1, count)) };
    });

  const n = measurements.length;
  const sumX = measurements.reduce((sum, item) => sum + item.x, 0);
  const sumY = measurements.reduce((sum, item) => sum + item.y, 0);
  const sumXY = measurements.reduce((sum, item) => sum + item.x * item.y, 0);
  const sumXX = measurements.reduce((sum, item) => sum + item.x * item.x, 0);
  const denominator = n * sumXX - sumX * sumX;
  return denominator ? (n * sumXY - sumX * sumY) / denominator : 0;
}

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function renderBiomorph(canvas, genes, options = {}) {
  if (!canvas) return null;
  const { ctx, width, height } = setupCanvas(canvas);
  const { segments, depth } = developSegments(genes);
  const bounds = boundsForSegments(segments);
  const padding = options.padding ?? 20;
  const scale = Math.min((width - padding * 2) / bounds.width, (height - padding * 2) / bounds.height);
  const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  const offsetX = (width - bounds.width * safeScale) / 2 - bounds.minX * safeScale;
  const offsetY = (height - bounds.height * safeScale) / 2 - bounds.minY * safeScale;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = options.background || "#fbfcfa";
  ctx.fillRect(0, 0, width, height);

  if (options.axes || state.showAxes) {
    ctx.save();
    ctx.strokeStyle = "rgba(47, 95, 143, 0.25)";
    ctx.lineWidth = 1;
    const axisX = offsetX;
    ctx.beginPath();
    ctx.moveTo(axisX, 0);
    ctx.lineTo(axisX, height);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = options.stroke || "#17211c";
  ctx.lineWidth = options.strokeWidth ?? state.strokeWidth;
  const visibleSegments = Number.isInteger(options.segmentLimit) ? segments.slice(0, options.segmentLimit) : segments;
  visibleSegments.forEach((segment) => {
    ctx.beginPath();
    ctx.moveTo(offsetX + segment.x1 * safeScale, offsetY + segment.y1 * safeScale);
    ctx.lineTo(offsetX + segment.x2 * safeScale, offsetY + segment.y2 * safeScale);
    ctx.stroke();
  });
  ctx.restore();

  return { bounds, segments: segments.length, visibleSegments: visibleSegments.length, scale: safeScale, depth };
}

function buildGeneControls() {
  const container = document.querySelector("#gene-controls");
  if (!container) return;
  container.innerHTML = "";
  geneDefs.forEach((def, index) => {
    const group = document.createElement("div");
    group.className = "control-group";
    group.innerHTML = `
      <label for="${def.id}">${def.label}</label>
      <div class="control-line">
        <input id="${def.id}" type="range" min="${def.min}" max="${def.max}" step="1" />
        <output id="${def.id}-value"></output>
      </div>
    `;
    container.appendChild(group);
    group.querySelector("input").addEventListener("input", (event) => {
      stopEvaluator();
      state.parent[index] = Number(event.target.value);
      state.previousParent = null;
      state.generation = 0;
      generateLitter();
      renderAll();
    });
  });
}

function buildGeneExplanations() {
  const container = document.querySelector("#gene-explanations");
  if (!container) return;
  container.innerHTML = geneDefs.map((def) => `
    <div class="gene-row">
      <div class="gene-badge">${def.label.replace("Gene ", "G")}</div>
      <div><strong>${def.label}</strong><br><span>${def.text}</span></div>
    </div>
  `).join("");
}

function syncControls() {
  geneDefs.forEach((def, index) => {
    const input = document.querySelector(`#${def.id}`);
    const output = document.querySelector(`#${def.id}-value`);
    if (input) input.value = state.parent[index];
    if (output) output.textContent = state.parent[index];
  });
  const mutationStep = document.querySelector("#mutation-step");
  if (mutationStep) mutationStep.value = state.mutationStep;
  const mutationStepOutput = document.querySelector("#mutation-step-value");
  if (mutationStepOutput) mutationStepOutput.textContent = state.mutationStep;
  const strokeWidth = document.querySelector("#stroke-width");
  if (strokeWidth) strokeWidth.value = state.strokeWidth;
  const strokeWidthOutput = document.querySelector("#stroke-width-value");
  if (strokeWidthOutput) strokeWidthOutput.textContent = state.strokeWidth;
  const axes = document.querySelector("#show-axes");
  if (axes) axes.checked = state.showAxes;
}

function generateLitter() {
  stopDevelopmentAnimation(false);
  state.variants = makeVariants(state.parent);
  state.selectedIndex = Math.min(state.selectedIndex, state.variants.length - 1);
}

function stopDevelopmentAnimation(renderFinal = true) {
  if (state.developmentTimer) {
    window.clearInterval(state.developmentTimer);
    state.developmentTimer = null;
  }
  state.developmentAnimating = false;
  const button = document.querySelector("#show-development");
  if (button) {
    button.disabled = false;
    button.textContent = "Show Development";
  }
  if (renderFinal) renderParent();
}

function selectVariant(index) {
  const variant = state.variants[index];
  if (!variant) return;
  state.previousParent = {
    genes: state.parent.slice(),
    mutation: deepCopy(variant.mutation),
    metrics: metricsFor(state.parent),
  };
  state.parent = variant.genes.slice();
  state.generation += 1;
  state.history.unshift({
    generation: state.generation,
    mutation: deepCopy(variant.mutation),
    genes: state.parent.slice(),
    metrics: metricsFor(state.parent),
  });
  state.history = state.history.slice(0, 12);
  generateLitter();
  renderAll();
}

function runEvaluatorStep() {
  if (!state.evaluatorRunning) return;
  const scores = scoreVariants();
  renderScoreTable(scores);
  const winner = scores[0];
  if (!winner) {
    stopEvaluator("No offspring are available to score.");
    return;
  }

  const evaluator = selectedEvaluator();
  const mutation = winner.variant.mutation;
  setEvaluatorStatus(`Step ${state.evaluatorTotal - state.evaluatorRemaining + 1} of ${state.evaluatorTotal}: ${evaluator.label} selected ${mutationTitle(mutation)} with score ${winner.score.toFixed(4)}.`);
  selectVariant(winner.index);
  state.evaluatorRemaining -= 1;

  if (state.evaluatorRemaining <= 0) {
    stopEvaluator(`Automated selection complete after ${state.evaluatorTotal} step${state.evaluatorTotal === 1 ? "" : "s"}.`);
    renderScoreTable();
    return;
  }

  state.evaluatorTimer = window.setTimeout(runEvaluatorStep, 2000);
}

function startEvaluator() {
  stopDevelopmentAnimation(false);
  stopEvaluator("");
  const stepsInput = document.querySelector("#fitness-steps");
  const steps = clamp(Math.round(Number(stepsInput?.value || 10)), 1, 100);
  if (stepsInput) stepsInput.value = steps;
  state.evaluatorTotal = steps;
  state.evaluatorRemaining = steps;
  state.evaluatorRunning = true;
  const runButton = document.querySelector("#run-evaluator");
  if (runButton) runButton.disabled = true;
  const stopButton = document.querySelector("#stop-evaluator");
  if (stopButton) stopButton.disabled = false;
  const evaluator = selectedEvaluator();
  setEvaluatorStatus(`${evaluator.label} will run ${steps} step${steps === 1 ? "" : "s"} with a 2 second delay between selections.`);
  renderScoreTable();
  state.evaluatorTimer = window.setTimeout(runEvaluatorStep, 2000);
}

function renderVariants() {
  const grid = document.querySelector("#variant-grid");
  if (!grid) return;
  grid.innerHTML = "";
  state.variants.forEach((variant, index) => {
    const card = document.createElement("article");
    card.className = "biomorph-card";
    const mutation = variant.mutation;
    const title = mutationTitle(mutation);
    const detail = mutationDetail(mutation);
    card.innerHTML = `
      <div class="variant-meta"><strong>${title}</strong><span>${mutationGridPosition(index)}; ${detail}</span></div>
      <button type="button" aria-label="Select ${title}" data-index="${index}"><canvas></canvas></button>
      <div class="variant-meta"><span>${variant.genes.join(", ")}</span></div>
    `;
    card.querySelector("button").addEventListener("click", () => {
      stopEvaluator();
      selectVariant(index);
    });
    grid.appendChild(card);
    renderBiomorph(card.querySelector("canvas"), variant.genes, {
      strokeWidth: Math.max(1, state.strokeWidth - 0.25),
      stroke: mutation.delta < 0 ? "#2f5f8f" : mutation.delta > 0 ? "#b04835" : "#17211c",
      padding: 18,
    });
  });
}

function renderLegend() {
  const tbody = document.querySelector("#mutation-legend tbody");
  if (!tbody) return;
  tbody.innerHTML = state.variants.map((variant, index) => {
    const mutation = variant.mutation;
    const position = `R${Math.floor(index / 3) + 1}C${(index % 3) + 1}`;
    const gene = mutation.geneIndex === -1 ? "Parent" : mutation.gene;
    const prior = mutation.geneIndex === -1 ? "-" : mutation.prior;
    const current = mutation.geneIndex === -1 ? "-" : mutation.current;
    const delta = mutation.geneIndex === -1 ? "0" : signed(mutation.delta);
    return `<tr><td>${position}</td><td>${gene}</td><td>${prior}</td><td>${current}</td><td>${delta}</td></tr>`;
  }).join("");
}

function renderHistory() {
  const tbody = document.querySelector("#history-table tbody");
  if (!tbody) return;
  tbody.innerHTML = state.history.map((entry) => {
    const mutation = entry.mutation;
    const change = mutation.geneIndex === -1 ? "parent retained" : `${mutation.gene}: ${mutation.prior} -> ${mutation.current}`;
    return `<tr><td>${entry.generation}</td><td>${change}</td><td>${entry.metrics.segments}</td><td>${entry.metrics.width.toFixed(1)} x ${entry.metrics.height.toFixed(1)}</td></tr>`;
  }).join("");
}

function renderSummary() {
  const metrics = metricsFor(state.parent);
  state.currentMetrics = metrics;
  const fields = {
    generationMetric: state.generation,
    segmentMetric: metrics.segments,
    depthMetric: metrics.depth,
    spanMetric: `${metrics.width.toFixed(1)} x ${metrics.height.toFixed(1)}`,
    compactMetric: metrics.compactness.toFixed(2),
  };
  Object.entries(fields).forEach(([id, value]) => {
    const node = document.querySelector(`#${id}`);
    if (node) node.textContent = value;
  });

  const phenotypeNote = document.querySelector("#phenotype-note");
  if (phenotypeNote) {
    phenotypeNote.innerHTML = `The parent and each offspring use a 1:1 drawing area. Scale is recalculated from the full line-segment bounding box, so large phenotypes are reduced to fit instead of being cut off at the border.`;
  }

  const lastChange = document.querySelector("#last-change");
  if (lastChange) {
    if (!state.previousParent) {
      lastChange.textContent = "No selected mutation yet. Choose one of the nine children to make it the next parent.";
    } else {
      const mutation = state.previousParent.mutation;
      lastChange.textContent = `${mutation.gene} changed from ${mutation.prior} to ${mutation.current}; the displayed phenotype was regenerated from the new inherited gene values.`;
    }
  }
}

function renderParent() {
  const canvas = document.querySelector("#parent-canvas");
  const info = renderBiomorph(canvas, state.parent, { strokeWidth: state.strokeWidth, padding: 28 });
  const scaleNode = document.querySelector("#scale-pill");
  if (scaleNode && info) scaleNode.textContent = `fit scale ${info.scale.toFixed(2)}x`;
}

function showDevelopment() {
  const canvas = document.querySelector("#parent-canvas");
  const button = document.querySelector("#show-development");
  if (!canvas || state.developmentAnimating) return;

  stopDevelopmentAnimation(false);
  const totalSegments = developSegments(state.parent).segments.length;
  const totalFrames = Math.min(totalSegments, 48);
  let frame = 0;
  state.developmentAnimating = true;
  if (button) {
    button.disabled = true;
    button.textContent = "Developing...";
  }

  const drawFrame = () => {
    renderBiomorph(canvas, state.parent, {
      strokeWidth: state.strokeWidth,
      padding: 28,
      segmentLimit: Math.ceil((frame / totalFrames) * totalSegments),
    });
    frame += 1;
    if (frame > totalFrames) stopDevelopmentAnimation(false);
  };

  drawFrame();
  state.developmentTimer = window.setInterval(drawFrame, 200);
}

function renderExportText() {
  const textarea = document.querySelector("#config-text");
  if (!textarea) return;
  textarea.value = JSON.stringify(currentConfig(), null, 2);
}

function renderAll() {
  stopDevelopmentAnimation(false);
  syncControls();
  renderParent();
  renderVariants();
  renderLegend();
  renderHistory();
  renderSummary();
  renderEvaluatorInfo();
  renderExportText();
}

function currentConfig() {
  return {
    app: "evo-edu-biomorphs",
    version: BIOMORPH_VERSION,
    savedAt: new Date().toISOString(),
    generation: state.generation,
    genes: state.parent.slice(),
    mutationStep: state.mutationStep,
    litterMode: "three-by-three",
    strokeWidth: state.strokeWidth,
    showAxes: state.showAxes,
    history: deepCopy(state.history),
  };
}

function loadConfig(config) {
  stopEvaluator();
  const genes = config.genes || config.parent || config.params?.genes;
  state.parent = normalizedGenes(genes);
  state.generation = Number(config.generation || 0);
  state.mutationStep = 1;
  state.strokeWidth = clamp(Number(config.strokeWidth || 2), 1, 5);
  state.showAxes = Boolean(config.showAxes);
  state.history = Array.isArray(config.history) ? config.history.slice(0, 12) : [];
  state.previousParent = null;
  generateLitter();
  renderAll();
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function saveConfig() {
  download(`biomorph-gen${state.generation}.json`, JSON.stringify(currentConfig(), null, 2), "application/json");
}

function importFromText() {
  const textarea = document.querySelector("#config-text");
  if (!textarea) return;
  try {
    loadConfig(JSON.parse(textarea.value));
  } catch (error) {
    window.alert(`Configuration import failed: ${error.message}`);
  }
}

function saveCanvasPng() {
  const source = document.querySelector("#parent-canvas");
  if (!source) return;
  const link = document.createElement("a");
  link.download = `biomorph-gen${state.generation}.png`;
  link.href = source.toDataURL("image/png");
  link.click();
}

function svgForCurrent() {
  const { segments } = developSegments(state.parent);
  const bounds = boundsForSegments(segments);
  const padding = 24;
  const width = Math.max(320, bounds.width + padding * 2);
  const height = Math.max(320, bounds.height + padding * 2);
  const offsetX = (width - bounds.width) / 2 - bounds.minX;
  const offsetY = (height - bounds.height) / 2 - bounds.minY;
  const lines = segments.map((segment) => `<line x1="${(offsetX + segment.x1).toFixed(2)}" y1="${(offsetY + segment.y1).toFixed(2)}" x2="${(offsetX + segment.x2).toFixed(2)}" y2="${(offsetY + segment.y2).toFixed(2)}" />`).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width.toFixed(0)}" height="${height.toFixed(0)}" viewBox="0 0 ${width.toFixed(0)} ${height.toFixed(0)}">
  <rect width="100%" height="100%" fill="#fbfcfa"/>
  <g fill="none" stroke="#17211c" stroke-width="${state.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
${lines}
  </g>
</svg>
`;
}

function saveSvg() {
  download(`biomorph-gen${state.generation}.svg`, svgForCurrent(), "image/svg+xml");
}

function resetToPreset(name) {
  stopEvaluator();
  state.parent = normalizedGenes(presets[name] || presets.dawkinsTree);
  state.previousParent = null;
  state.generation = 0;
  state.history = [];
  generateLitter();
  renderAll();
}

function randomizeParent() {
  stopEvaluator();
  state.parent = geneDefs.map((def) => Math.floor(def.min + Math.random() * (def.max - def.min + 1)));
  state.parent[8] = clamp(Math.abs(state.parent[8]), 1, 8);
  state.previousParent = null;
  state.generation = 0;
  state.history = [];
  generateLitter();
  renderAll();
}

function wireControls() {
  const evaluatorSelect = document.querySelector("#fitness-evaluator");
  if (evaluatorSelect) {
    evaluatorSelect.innerHTML = fitnessEvaluators.map((evaluator) => `<option value="${evaluator.id}">${evaluator.label}</option>`).join("");
    evaluatorSelect.value = state.evaluatorId;
    evaluatorSelect.addEventListener("change", () => {
      stopEvaluator();
      renderEvaluatorInfo();
    });
  }
  const stopButton = document.querySelector("#stop-evaluator");
  if (stopButton) stopButton.disabled = true;
  document.querySelector("#mutation-step")?.addEventListener("input", (event) => {
    stopEvaluator();
    state.mutationStep = clamp(Number(event.target.value), 1, 3);
    generateLitter();
    renderAll();
  });
  document.querySelector("#stroke-width")?.addEventListener("input", (event) => {
    state.strokeWidth = clamp(Number(event.target.value), 1, 5);
    renderAll();
  });
  document.querySelector("#show-axes")?.addEventListener("change", (event) => {
    state.showAxes = event.target.checked;
    renderAll();
  });
  document.querySelector("#save-config")?.addEventListener("click", saveConfig);
  document.querySelector("#import-config")?.addEventListener("click", importFromText);
  document.querySelector("#save-png")?.addEventListener("click", saveCanvasPng);
  document.querySelector("#save-svg")?.addEventListener("click", saveSvg);
  document.querySelector("#show-development")?.addEventListener("click", showDevelopment);
  document.querySelector("#randomize")?.addEventListener("click", randomizeParent);
  document.querySelector("#reroll-litter")?.addEventListener("click", rerollLitter);
  document.querySelector("#show-evaluator")?.addEventListener("click", renderEvaluatorInfo);
  document.querySelector("#run-evaluator")?.addEventListener("click", startEvaluator);
  document.querySelector("#stop-evaluator")?.addEventListener("click", () => stopEvaluator("Automated selection stopped."));
  document.querySelector("#copy-config")?.addEventListener("click", async () => {
    const textarea = document.querySelector("#config-text");
    if (!textarea) return;
    await navigator.clipboard?.writeText(textarea.value);
  });
  document.querySelector("#config-file")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      loadConfig(JSON.parse(await file.text()));
    } catch (error) {
      window.alert(`Configuration file import failed: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  });
  document.querySelector("#load-file")?.addEventListener("click", () => document.querySelector("#config-file")?.click());
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => resetToPreset(button.dataset.preset));
  });
  window.addEventListener("resize", renderAll);
}

function init() {
  buildGeneControls();
  buildGeneExplanations();
  wireControls();
  generateLitter();
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
