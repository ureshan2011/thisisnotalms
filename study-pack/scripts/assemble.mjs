/* Assemble authored Markdown lessons into print-ready HTML documents.
   Outputs (dist/html/):
     - <slug>.guide.html      per-lesson study guide
     - <slug>.revision.html   per-lesson revision sheet
     - master.html            combined study pack (cover + TOC + chapters + appendices)
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import container from 'markdown-it-container';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const TEMPLATE = path.join(ROOT, 'template');
const DIST_HTML = path.join(ROOT, 'dist', 'html');

const CALLOUTS = {
  definition: 'Definition',
  tip: 'Tip',
  warning: 'Warning',
  example: 'Worked Example',
  activity: 'Activity',
  answer: 'Answer',
  summary: 'Summary',
};

export function loadCourse() {
  return JSON.parse(fs.readFileSync(path.join(CONTENT, 'course.json'), 'utf8'));
}

/* Minimal frontmatter parser: `key: value` pairs plus `- ` list items. */
function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  let currentList = null;
  for (const rawLine of m[1].split('\n')) {
    const line = rawLine.replace(/\s+$/, '');
    if (!line.trim()) continue;
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && currentList) {
      meta[currentList].push(item[1]);
      continue;
    }
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) {
      const [, key, value] = kv;
      if (value === '') {
        meta[key] = [];
        currentList = key;
      } else {
        meta[key] = value;
        currentList = null;
      }
    }
  }
  return { meta, body: src.slice(m[0].length) };
}

function makeRenderer(idPrefix) {
  const md = new MarkdownIt({ html: true, typographer: true });
  md.use(anchor, {
    level: [2, 3],
    slugify: (s) =>
      idPrefix +
      String(s).trim().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
  });
  for (const [name, kicker] of Object.entries(CALLOUTS)) {
    md.use(container, name, {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          const custom = token.info.trim().slice(name.length).trim();
          const label = custom || kicker;
          return `<aside class="callout callout--${name}"><div class="callout-kicker">${md.utils.escapeHtml(label)}</div><div class="callout-body">\n`;
        }
        return '</div></aside>\n';
      },
    });
  }
  return md;
}

/* Replace <img src="diagrams/x.svg" alt="..."> with the inlined SVG in a <figure>. */
let figCounter = 0;
function inlineSvgs(html, { chapterNumber }) {
  let localFig = 0;
  return html.replace(
    /<p><img src="diagrams\/([^"]+\.svg)" alt="([^"]*)"\s*\/?><\/p>/g,
    (_, file, alt) => {
      const svgPath = path.join(CONTENT, 'diagrams', file);
      const svg = fs.readFileSync(svgPath, 'utf8').replace(/<\?xml[^>]*\?>\s*/, '');
      localFig += 1;
      const num = chapterNumber ? `${chapterNumber}.${localFig}` : String(++figCounter);
      const caption = alt
        ? `<figcaption><span class="fig-num">Figure ${num}.</span> ${alt}</figcaption>`
        : '';
      return `<figure class="diagram">${svg}${caption}</figure>`;
    }
  );
}

function chapterOpener(meta, course, { forMaster }) {
  const objectives = (meta.objectives || [])
    .map((o) => `<li>${o}</li>`)
    .join('\n');
  return `
<header class="chapter-opener" data-running-title="${meta.number}. ${meta.title}">
  <div class="co-band">
    <div class="co-kicker">${course.code} · ${course.title} · ${forMaster ? 'Chapter' : 'Lesson'} ${meta.number} of ${course.lessons.length}</div>
    <h1 class="co-title">${meta.title}</h1>
    <div class="co-subtitle">${meta.subtitle || ''}</div>
  </div>
  <div class="co-objectives">
    <div class="co-obj-kicker">Learning objectives — after this ${forMaster ? 'chapter' : 'lesson'} you can</div>
    <ol>${objectives}</ol>
  </div>
</header>`;
}

function renderTemplate(tokens) {
  let html = fs.readFileSync(path.join(TEMPLATE, 'page.html'), 'utf8');
  const css =
    fs.readFileSync(path.join(TEMPLATE, 'print.css'), 'utf8') +
    '\n' +
    fs.readFileSync(path.join(TEMPLATE, 'watermark.css'), 'utf8');
  const hooks = fs.readFileSync(path.join(TEMPLATE, 'hooks.js'), 'utf8');
  // Fonts are referenced relative to the template dir; output HTML lives in
  // dist/html, so rewrite to absolute file:// URLs.
  const fontsBase = pathToFileURL(path.join(TEMPLATE, 'fonts')).href;
  const replacements = {
    __CSS__: css.replaceAll("url('fonts/", `url('${fontsBase}/`),
    __HOOKS__: hooks,
    __POLYFILL_URL__: pathToFileURL(path.join(ROOT, 'vendor', 'paged.polyfill.js')).href,
    ...tokens,
  };
  for (const [key, value] of Object.entries(replacements)) {
    if (typeof value !== 'string') {
      throw new Error(`Template token ${key} is ${value} — refusing to interpolate junk into a PDF`);
    }
    html = html.split(key).join(value);
  }
  return html;
}

function loadLesson(course, lesson) {
  const file = `${lesson.slug}.md`;
  const src = fs.readFileSync(path.join(CONTENT, 'lessons', file), 'utf8');
  const { meta, body } = parseFrontmatter(src);
  meta.number = Number(meta.number ?? lesson.number);
  // A typo'd or missing frontmatter key would otherwise interpolate as the
  // literal string "undefined"/"NaN" into the chapter opener.
  if (!Number.isFinite(meta.number)) {
    throw new Error(`${file}: frontmatter "number" is missing or not a number`);
  }
  if (typeof meta.title !== 'string' || !meta.title.trim()) {
    throw new Error(`${file}: frontmatter "title" is missing or empty`);
  }
  if (!Array.isArray(meta.objectives) || meta.objectives.length === 0) {
    throw new Error(`${file}: frontmatter "objectives" list is missing or empty`);
  }
  return { meta, body };
}

/* Split a rendered chapter at its "Answer Key" heading (always the last
   section of a lesson) so the master pack can relocate answers into an
   appendix. */
function splitAnswerKey(html, idPrefix) {
  const marker = new RegExp(`<h2 id="${idPrefix}answer-key[^"]*"[^>]*>`);
  const m = html.match(marker);
  if (!m) return { main: html, answers: '' };
  return { main: html.slice(0, m.index), answers: html.slice(m.index) };
}

export function assemble(course, { only } = {}) {
  fs.mkdirSync(DIST_HTML, { recursive: true });
  const courseMeta = `${course.code} · ${course.title} · Academic Year ${course.academicYear}`;
  const baseTokens = {
    __FOOTER_LINE__: course.footerLine,
    __COURSE_META__: courseMeta,
    __WM_TEXT_JSON__: JSON.stringify(course.watermarkText),
  };
  const outputs = [];
  const chapters = [];

  for (const lesson of course.lessons) {
    if (only && Number(only) !== lesson.number) continue;
    const guidePath = path.join(CONTENT, 'lessons', `${lesson.slug}.md`);
    if (!fs.existsSync(guidePath)) {
      console.warn(`  [skip] no content yet for lesson ${lesson.number} (${lesson.slug})`);
      continue;
    }
    const { meta, body } = loadLesson(course, lesson);

    // --- individual study guide ---
    {
      const md = makeRenderer('');
      const contentHtml = inlineSvgs(md.render(body), { chapterNumber: meta.number });
      const bodyHtml =
        `<section class="chapter" id="lesson-${meta.number}">` +
        chapterOpener(meta, course, { forMaster: false }) +
        contentHtml +
        '</section>';
      const file = path.join(DIST_HTML, `${lesson.slug}.guide.html`);
      fs.writeFileSync(
        file,
        renderTemplate({
          ...baseTokens,
          __TITLE__: `${course.code} Lesson ${meta.number} — ${meta.title} — Study Guide`,
          __BODY__: bodyHtml,
        })
      );
      outputs.push({
        html: file,
        pdfName: `${course.code}-L0${meta.number}-${lesson.fileTitle}-Study-Guide.pdf`,
        kind: 'guide',
        lesson: meta.number,
      });
    }

    // --- revision sheet ---
    const revPath = path.join(CONTENT, 'lessons', `${lesson.slug}.revision.md`);
    if (fs.existsSync(revPath)) {
      const revSrc = fs.readFileSync(revPath, 'utf8');
      const { meta: revMeta, body: revBody } = parseFrontmatter(revSrc);
      const md = makeRenderer('');
      const contentHtml = inlineSvgs(md.render(revBody), { chapterNumber: null });
      const bodyHtml = `
<section class="revision-doc">
  <div class="rev-head">
    <div class="rh-title"><span class="rh-kicker">Revision sheet · ${course.code} Lesson ${meta.number}</span>${meta.title}</div>
    <div class="rh-meta">${course.author}<br>${course.series} · AY ${course.academicYear}</div>
  </div>
  <div class="rev-cols">${contentHtml}</div>
</section>`;
      const file = path.join(DIST_HTML, `${lesson.slug}.revision.html`);
      fs.writeFileSync(
        file,
        renderTemplate({
          ...baseTokens,
          __TITLE__: `${course.code} Lesson ${meta.number} — ${meta.title} — Revision Sheet`,
          __BODY__: bodyHtml,
        })
      );
      outputs.push({
        html: file,
        pdfName: `${course.code}-L0${meta.number}-${lesson.fileTitle}-Revision-Sheet.pdf`,
        kind: 'revision',
        lesson: meta.number,
        maxPages: Number(revMeta.maxPages || 2),
      });
    }

    chapters.push({ lesson, meta, body });
  }

  // --- master pack ---
  if (!only && chapters.length === course.lessons.length) {
    const tocEntries = [];
    const chapterHtml = [];
    const answersHtml = [];

    for (const { lesson, meta, body } of chapters) {
      const prefix = `ch${meta.number}-`;
      const md = makeRenderer(prefix);
      const rendered = inlineSvgs(md.render(body), { chapterNumber: meta.number });
      const { main, answers } = splitAnswerKey(rendered, prefix);
      const subEntries = [...main.matchAll(/<h2 id="([^"]+)"[^>]*>(.*?)<\/h2>/g)]
        .map(([, id, text]) => ({ id, text: text.replace(/<[^>]+>/g, '') }));
      tocEntries.push({
        id: `ch-${meta.number}`,
        number: meta.number,
        title: meta.title,
        subEntries,
      });
      chapterHtml.push(
        `<section class="chapter" id="ch-${meta.number}">` +
          chapterOpener(meta, course, { forMaster: true }) +
          main +
          '</section>'
      );
      if (answers) {
        answersHtml.push(
          `<h3>Chapter ${meta.number} — ${meta.title}</h3>` +
            answers.replace(/<h2[^>]*>.*?<\/h2>/, '')
        );
      }
    }

    // glossary
    let glossaryHtml = '';
    const glossaryPath = path.join(CONTENT, 'lessons', 'glossary.md');
    if (fs.existsSync(glossaryPath)) {
      const md = makeRenderer('gl-');
      const { body: glBody } = parseFrontmatter(fs.readFileSync(glossaryPath, 'utf8'));
      glossaryHtml = `<section class="chapter glossary" id="glossary">
<header class="chapter-opener" data-running-title="Appendix A · Glossary">
  <div class="co-band">
    <div class="co-kicker">${course.code} · Appendix A</div>
    <h1 class="co-title">Glossary of Key Terms</h1>
    <div class="co-subtitle">Every term you need for the final assessment, in one place.</div>
  </div>
</header>${md.render(glBody)}</section>`;
    }

    const answersSection = answersHtml.length
      ? `<section class="chapter practice" id="answer-appendix">
<header class="chapter-opener" data-running-title="Appendix B · Answer Key">
  <div class="co-band">
    <div class="co-kicker">${course.code} · Appendix B</div>
    <h1 class="co-title">Consolidated Answer Key</h1>
    <div class="co-subtitle">Attempt every practice set before checking your answers here.</div>
  </div>
</header>${answersHtml.join('\n')}</section>`
      : '';

    const toc = `<nav class="toc" id="toc"><h2>Contents</h2><ol>
${tocEntries
  .map(
    (e) =>
      `<li class="toc-l1"><a href="#${e.id}"><span class="toc-num">${e.number}</span>${e.title}</a></li>\n` +
      e.subEntries
        .slice(0, 6)
        .map((s) => `<li class="toc-l2"><a href="#${s.id}">${s.text}</a></li>`)
        .join('\n')
  )
  .join('\n')}
${glossaryHtml ? '<li class="toc-l1"><a href="#glossary"><span class="toc-num">A</span>Glossary of Key Terms</a></li>' : ''}
${answersSection ? '<li class="toc-l1"><a href="#answer-appendix"><span class="toc-num">B</span>Consolidated Answer Key</a></li>' : ''}
</ol></nav>`;

    const cover = buildCover(course);
    const file = path.join(DIST_HTML, 'master.html');
    fs.writeFileSync(
      file,
      renderTemplate({
        ...baseTokens,
        __TITLE__: `${course.code} — ${course.title} — Master Study Pack`,
        __BODY__: cover + toc + chapterHtml.join('\n') + glossaryHtml + answersSection,
      })
    );
    outputs.push({
      html: file,
      pdfName: `${course.masterFileName}.pdf`,
      kind: 'master',
    });
  } else if (!only) {
    console.warn(
      `  [warn] master pack skipped — ${chapters.length}/${course.lessons.length} lessons have content`
    );
  }

  return outputs;
}

function buildCover(course) {
  return `
<section class="cover">
  <div class="cover-head">
    <svg width="44" height="44" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#1b1b1b">
      <circle cx="24" cy="24" r="22.6" stroke-width="1.1"/>
      <circle cx="24" cy="24" r="20.2" stroke-width="0.4"/>
      <path d="M24 17.8 C20.4 15.6 15.6 15.6 12.4 17.4 V31.6 C15.6 29.8 20.4 29.8 24 32 C27.6 29.8 32.4 29.8 35.6 31.6 V17.4 C32.4 15.6 27.6 15.6 24 17.8 Z" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M24 17.8 V32" stroke-width="1.1"/>
      <path d="M16 21.2 C18 20.4 20.4 20.5 21.8 21.2 M16 24.4 C18 23.6 20.4 23.7 21.8 24.4 M26.2 21.2 C27.6 20.5 30 20.4 32 21.2 M26.2 24.4 C27.6 23.7 30 24.4 32 24.4" stroke-width="0.7" stroke-linecap="round"/>
    </svg>
    <div class="cover-series">${course.series}</div>
  </div>
  <div class="cover-mid">
    <div class="cover-code">${course.code} · Academic Year ${course.academicYear}</div>
    <div class="cover-title">${course.title} <span class="cover-kind">Master Study Pack</span></div>
    <div class="cover-sub">${course.subtitle}</div>
  </div>
  <div class="cover-foot">
    <strong>${course.author}</strong>
    <div class="cf-notice">${course.edition} · ${course.notice}<br>${course.copyrightLine}</div>
  </div>
</section>`;
}
