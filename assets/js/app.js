// Referencias
const rRange = document.getElementById("rRange");
const gRange = document.getElementById("gRange");
const bRange = document.getElementById("bRange");

const rVal = document.getElementById("rVal");
const gVal = document.getElementById("gVal");
const bVal = document.getElementById("bVal");

const rgbText = document.getElementById("rgbText");
const hexText = document.getElementById("hexText");

const colorBox = document.getElementById("colorBox");
const overlayHex = document.getElementById("overlayHex");
const overlayRgb = document.getElementById("overlayRgb");

const btnRandom = document.getElementById("btnRandom");
const btnReset = document.getElementById("btnReset");
const btnCopy = document.getElementById("btnCopy");
const copiedMsg = document.getElementById("copiedMsg");

// Inputs numéricos
const rInput = document.getElementById("rInput");
const gInput = document.getElementById("gInput");
const bInput = document.getElementById("bInput");

// Color Picker
const colorPicker = document.getElementById("colorPicker");

// Año footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Utilidades
function clampByte(n) {
  const x = Number(n);
  if (Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(255, Math.round(x)));
}

function toHex2(n) {
  return clampByte(n).toString(16).padStart(2, "0").toUpperCase();
}

function rgbToHex(r, g, b) {
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
}

function hexToRgb(hex) {
  const h = String(hex || "").trim();
  const match = /^#([0-9a-fA-F]{6})$/.exec(h);
  if (!match) return { r: 0, g: 0, b: 0 };

  const raw = match[1];
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);

  return { r, g, b };
}

function applyColor(r, g, b) {
  const rr = clampByte(r);
  const gg = clampByte(g);
  const bb = clampByte(b);

  // Badges
  rVal.textContent = rr;
  gVal.textContent = gg;
  bVal.textContent = bb;

  // Inputs
  rInput.value = rr;
  gInput.value = gg;
  bInput.value = bb;

  const rgb = `rgb(${rr}, ${gg}, ${bb})`;
  const hex = rgbToHex(rr, gg, bb);

  rgbText.textContent = rgb;
  hexText.textContent = hex;

  overlayRgb.textContent = rgb;
  overlayHex.textContent = hex;

  colorBox.style.backgroundColor = rgb;

  // Picker sincronizado
  colorPicker.value = hex;
}

function syncFromRanges() {
  applyColor(rRange.value, gRange.value, bRange.value);
}

function syncFromInputs() {
  const rr = clampByte(rInput.value);
  const gg = clampByte(gInput.value);
  const bb = clampByte(bInput.value);

  rRange.value = rr;
  gRange.value = gg;
  bRange.value = bb;

  applyColor(rr, gg, bb);
}

function syncFromPicker() {
  const { r, g, b } = hexToRgb(colorPicker.value);

  rRange.value = r;
  gRange.value = g;
  bRange.value = b;

  applyColor(r, g, b);
}

function setRanges(r, g, b) {
  rRange.value = clampByte(r);
  gRange.value = clampByte(g);
  bRange.value = clampByte(b);
  syncFromRanges();
}

// Eventos sliders
[rRange, gRange, bRange].forEach((el) => {
  el.addEventListener("input", syncFromRanges);
});

// Eventos inputs numéricos
[rInput, gInput, bInput].forEach((el) => {
  el.addEventListener("input", syncFromInputs);
  el.addEventListener("blur", () => {
    el.value = clampByte(el.value);
    syncFromInputs();
  });
});

// Evento picker
colorPicker.addEventListener("input", syncFromPicker);

// Botón aleatorio
btnRandom.addEventListener("click", () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  setRanges(r, g, b);
});

// Botón reiniciar
btnReset.addEventListener("click", () => {
  setRanges(0, 0, 0);
});

// Copiar HEX
btnCopy.addEventListener("click", async () => {
  try {
    const hex = hexText.textContent.trim();
    await navigator.clipboard.writeText(hex);

    copiedMsg.classList.remove("d-none");
    setTimeout(() => copiedMsg.classList.add("d-none"), 1200);
  } catch (err) {
    alert("No se pudo copiar automáticamente. Copia manualmente el HEX.");
  }
});

// Estado inicial
syncFromRanges();
