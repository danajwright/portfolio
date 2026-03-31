const rows = document.querySelectorAll('.project-row');
const imgs = document.querySelectorAll('.preview-img');

function activate(row) {
  const idx = row.dataset.index;
  rows.forEach(r => r.classList.remove('row-active'));
  imgs.forEach(img => img.classList.remove('is-visible'));
  row.classList.add('row-active');
  const target = document.querySelector(`.preview-img[data-index="${idx}"]`);
  if (target) target.classList.add('is-visible');
}

function deactivate() {
  rows.forEach(r => r.classList.remove('row-active'));
  imgs.forEach(img => img.classList.remove('is-visible'));
}

// Per-row lerp state
const state = new Map();
rows.forEach(row => {
  state.set(row, { targetX: 0, targetY: 0, currentX: 0, currentY: 0, raf: null });
});

function lerp(a, b, t) { return a + (b - a) * t; }

function tick(row) {
  const s = state.get(row);
  s.currentX = lerp(s.currentX, s.targetX, 0.12);
  s.currentY = lerp(s.currentY, s.targetY, 0.12);
  row.style.setProperty('--dx', `${s.currentX.toFixed(2)}px`);
  row.style.setProperty('--dy', `${s.currentY.toFixed(2)}px`);
  const dx = Math.abs(s.currentX - s.targetX);
  const dy = Math.abs(s.currentY - s.targetY);
  if (dx > 0.01 || dy > 0.01) {
    s.raf = requestAnimationFrame(() => tick(row));
  } else {
    s.raf = null;
  }
}

rows.forEach(row => {
  row.addEventListener('mouseenter', () => activate(row));
  row.addEventListener('mouseleave', deactivate);
  row.addEventListener('mousemove', (e) => {
    const rect = row.getBoundingClientRect();
    const s = state.get(row);
    s.targetX = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    s.targetY = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
    if (!s.raf) s.raf = requestAnimationFrame(() => tick(row));
  });
});
