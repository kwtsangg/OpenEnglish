// app.js — UI wiring
import { translateText } from "./rules.js";

const elInput = document.getElementById("input");
const elOutput = document.getElementById("output");
const translateBtn = document.getElementById("translateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const strictMode = document.getElementById("strictMode");
const showSteps = document.getElementById("showSteps");
const stepsPanel = document.getElementById("stepsPanel");
const stepsEl = document.getElementById("steps");

function setStepsVisible(visible) {
  stepsPanel.hidden = !visible;
}

function renderSteps(stepBlocks) {
  stepsEl.innerHTML = "";
  stepBlocks.forEach((block, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "step-item";

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = `Sentence ${idx + 1}: ${block.sentence}`;

    const value = document.createElement("div");
    value.className = "value";
    value.textContent = block.steps.join("\n");

    wrap.appendChild(label);
    wrap.appendChild(value);
    stepsEl.appendChild(wrap);
  });
}

function doTranslate() {
  const input = elInput.value || "";
  const res = translateText(input, { strictMode: !!strictMode.checked });
  elOutput.value = res.output;

  const show = !!showSteps.checked;
  setStepsVisible(show);
  if (show) renderSteps(res.steps);
}

translateBtn.addEventListener("click", doTranslate);

clearBtn.addEventListener("click", () => {
  elInput.value = "";
  elOutput.value = "";
  renderSteps([]);
});

copyBtn.addEventListener("click", async () => {
  const text = elOutput.value || "";
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    elOutput.focus();
    elOutput.select();
    document.execCommand("copy");
  }
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 900);
});

showSteps.addEventListener("change", () => {
  setStepsVisible(!!showSteps.checked);
  if (showSteps.checked) doTranslate();
});

elInput.addEventListener("keydown", (e) => {
  const isMac = navigator.platform.toLowerCase().includes("mac");
  const combo = isMac ? (e.metaKey && e.key === "Enter") : (e.ctrlKey && e.key === "Enter");
  if (combo) {
    e.preventDefault();
    doTranslate();
  }
});

// Initial run
doTranslate();
