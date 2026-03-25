const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const htmlSource = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const cssSource  = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
const jsSource   = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');

function setup() {
  const dom = new JSDOM(htmlSource, { runScripts: 'outside-only' });
  dom.window.eval(jsSource);
  return { doc: dom.window.document, win: dom.window };
}

// ─── HTML Structure ───────────────────────────────────────────────────────────

describe('HTML structure', () => {
  let doc;
  beforeAll(() => ({ doc } = setup()));

  test('has 13 project rows', () => {
    expect(doc.querySelectorAll('.project-row').length).toBe(13);
  });

  test('project rows are indexed 0–12', () => {
    const indices = [...doc.querySelectorAll('.project-row')].map(r => r.dataset.index);
    expect(indices).toEqual(['0','1','2','3','4','5','6','7','8','9','10','11','12']);
  });

  test('has 13 preview images indexed 0–12', () => {
    const imgs = [...doc.querySelectorAll('.preview-img')];
    expect(imgs.length).toBe(13);
    imgs.forEach((img, i) => expect(img.dataset.index).toBe(String(i)));
  });

  test('all projects have a non-empty title', () => {
    doc.querySelectorAll('.project-row').forEach(row => {
      const title = row.querySelector('.project-title');
      expect(title).not.toBeNull();
      expect(title.textContent.trim()).not.toBe('');
    });
  });

  test('all projects have a non-empty brief', () => {
    doc.querySelectorAll('.project-row').forEach(row => {
      const brief = row.querySelector('.project-brief');
      expect(brief).not.toBeNull();
      expect(brief.textContent.trim()).not.toBe('');
    });
  });

  test('DAOism (index 5) has date 2022', () => {
    const meta = doc.querySelector('.project-row[data-index="5"] .project-meta');
    expect(meta.textContent).toContain('2022');
  });

  test('DAOism (index 5) does not show date 2023', () => {
    const meta = doc.querySelector('.project-row[data-index="5"] .project-meta');
    expect(meta.textContent).not.toContain('2023');
  });

  test('avatar image exists', () => {
    expect(doc.querySelector('.avatar')).not.toBeNull();
  });

  test('about section exists', () => {
    expect(doc.querySelector('#about')).not.toBeNull();
  });

  test('connect section has 5 social links', () => {
    expect(doc.querySelectorAll('#connect .social-link').length).toBe(5);
  });
});

// ─── CSS ─────────────────────────────────────────────────────────────────────

describe('CSS', () => {
  test('no dark overlay filter on preview images', () => {
    expect(cssSource).not.toMatch(/filter:\s*brightness/);
  });
});

// ─── JS Behaviour ─────────────────────────────────────────────────────────────

describe('JS behaviour', () => {
  let doc, win;
  beforeEach(() => ({ doc, win } = setup()));

  test('project 0 is active by default', () => {
    expect(doc.querySelector('.project-row[data-index="0"]').classList.contains('row-active')).toBe(true);
    expect(doc.querySelector('.preview-img[data-index="0"]').classList.contains('is-visible')).toBe(true);
  });

  test('no other row or image is active by default', () => {
    [...doc.querySelectorAll('.project-row')].slice(1).forEach(r =>
      expect(r.classList.contains('row-active')).toBe(false)
    );
    [...doc.querySelectorAll('.preview-img')].slice(1).forEach(img =>
      expect(img.classList.contains('is-visible')).toBe(false)
    );
  });

  test('mouseenter on row 3 activates row 3 and its image', () => {
    doc.querySelector('.project-row[data-index="3"]')
      .dispatchEvent(new win.MouseEvent('mouseenter'));

    expect(doc.querySelector('.project-row[data-index="3"]').classList.contains('row-active')).toBe(true);
    expect(doc.querySelector('.preview-img[data-index="3"]').classList.contains('is-visible')).toBe(true);
  });

  test('mouseenter on row 3 deactivates the previously active row and image', () => {
    doc.querySelector('.project-row[data-index="3"]')
      .dispatchEvent(new win.MouseEvent('mouseenter'));

    expect(doc.querySelector('.project-row[data-index="0"]').classList.contains('row-active')).toBe(false);
    expect(doc.querySelector('.preview-img[data-index="0"]').classList.contains('is-visible')).toBe(false);
  });

  test('only one row is active at a time', () => {
    doc.querySelector('.project-row[data-index="7"]')
      .dispatchEvent(new win.MouseEvent('mouseenter'));

    const activeRows = [...doc.querySelectorAll('.project-row')].filter(r =>
      r.classList.contains('row-active')
    );
    const visibleImgs = [...doc.querySelectorAll('.preview-img')].filter(img =>
      img.classList.contains('is-visible')
    );
    expect(activeRows.length).toBe(1);
    expect(visibleImgs.length).toBe(1);
  });

  test('mouseleave does not deactivate the active row', () => {
    doc.querySelector('.project-row[data-index="3"]')
      .dispatchEvent(new win.MouseEvent('mouseenter'));
    doc.querySelector('.project-row[data-index="3"]')
      .dispatchEvent(new win.MouseEvent('mouseleave'));

    expect(doc.querySelector('.project-row[data-index="3"]').classList.contains('row-active')).toBe(true);
    expect(doc.querySelector('.preview-img[data-index="3"]').classList.contains('is-visible')).toBe(true);
  });
});
