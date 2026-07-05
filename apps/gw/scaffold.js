// === Preview Scaffold for Grid-World Evolution JS ===

let config = {
  mutationRate: 0.05,
  populationSize: 10,
  displayTiming: 500,
};

let population = [];
let generation = 0;
let running = false;
let paused = false;
let intervalId = null;

// === UI Bindings ===
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const resetBtn = document.getElementById("resetBtn");
const mutationSlider = document.getElementById("mutationRate");
const popSizeInput = document.getElementById("populationSize");
const timingInput = document.getElementById("displayTiming");

const exportSettingsBtn = document.getElementById("exportSettingsBtn");
const importSettingsBtn = document.getElementById("importSettingsBtn");
const importSettingsFile = document.getElementById("importSettingsFile");
const exportDataBtn = document.getElementById("exportDataBtn");

// === Event Listeners ===
startBtn.onclick = () => startEvolution();
pauseBtn.onclick = () => pauseEvolution();
resumeBtn.onclick = () => resumeEvolution();
resetBtn.onclick = () => resetEvolution();

mutationSlider.oninput = (e) => config.mutationRate = parseFloat(e.target.value);
popSizeInput.onchange = (e) => config.populationSize = parseInt(e.target.value);
timingInput.onchange = (e) => config.displayTiming = parseInt(e.target.value);

exportSettingsBtn.onclick = () => exportSettings();
importSettingsBtn.onclick = () => importSettingsFile.click();
importSettingsFile.onchange = (e) => importSettings(e);
exportDataBtn.onclick = () => exportResults();

// === Core Functions ===
function startEvolution() {
  if (running) return;
  running = true;
  paused = false;
  generation = 0;
  initializePopulation();
  intervalId = setInterval(stepEvolution, config.displayTiming);
}

function pauseEvolution() {
  if (!running || paused) return;
  clearInterval(intervalId);
  paused = true;
  pauseBtn.style.display = "none";
  resumeBtn.style.display = "inline-block";
}

function resumeEvolution() {
  if (!running || !paused) return;
  intervalId = setInterval(stepEvolution, config.displayTiming);
  paused = false;
  pauseBtn.style.display = "inline-block";
  resumeBtn.style.display = "none";
}

function resetEvolution() {
  clearInterval(intervalId);
  running = false;
  paused = false;
  generation = 0;
  population = [];
  updateUI();
}

function initializePopulation() {
  population = Array.from({ length: config.populationSize }, () => createRandomAgent());
  updateUI();
}

function stepEvolution() {
  // Placeholder: evaluate, select, reproduce, mutate
  generation++;
  updateUI();
}

function updateUI() {
  document.getElementById("generation").textContent = generation;
  document.getElementById("avgFitness").textContent = "--";
  document.getElementById("bestGenome").textContent = "--";
  drawGrid();
}

function drawGrid() {
  const canvas = document.getElementById("gridCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Placeholder: draw agents, food, hazards
}

function createRandomAgent() {
  return {
    genome: Array.from({ length: 5 }, () => Math.floor(Math.random() * 4)),
    fitness: 0
  };
}

function exportSettings() {
  const settings = JSON.stringify(config, null, 2);
  downloadFile(settings, "gridworld_settings.json", "application/json");
}

function importSettings(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      Object.assign(config, imported);
      mutationSlider.value = config.mutationRate;
      popSizeInput.value = config.populationSize;
      timingInput.value = config.displayTiming;
    } catch (err) {
      alert("Invalid JSON settings file.");
    }
  };
  reader.readAsText(file);
}

function exportResults() {
  const rows = ["generation,avg_fitness,best_genome"];
  // Placeholder: Add actual data
  rows.push(`${generation},--,--`);
  const csv = rows.join("\n");
  downloadFile(csv, "gridworld_results.csv", "text/csv");
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
