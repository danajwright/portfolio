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

// Default selection
activate(rows[0]);

rows.forEach(row => {
  row.addEventListener('mouseenter', () => activate(row));
});
