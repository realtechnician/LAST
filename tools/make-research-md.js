// Writes research/PAGE_CONTENT.md, FALSE_THOUGHTS.md and REMINDERS.md
// from js/content.js, so the page and the research folder never disagree.
// Run from the project folder:  node tools/make-research-md.js
const fs = require('fs');
const path = require('path');
const C = require('../js/content.js');
const out = (name, text) => fs.writeFileSync(path.join(__dirname, '..', 'research', name), text);
const ck = (o) => (o.check ? ' [CHECK]' : '');
const cell = (s) => String(s).replace(/\|/g, '\\|');

const note =
  '> Generated from `js/content.js`. Edit that file, then run `node tools/make-research-md.js`.\n' +
  '> **[CHECK]** = Kinyarwanda written without a native speaker. It must be reviewed before publishing.\n' +
  '> **[VERIFY]** = a fact to confirm before publishing.\n\n';

/* ---- FALSE_THOUGHTS.md ---- */
let t = '# False thoughts and their truth replies\n\n' + note +
  'These are "permission-giving" thoughts: the short lies an urge tells to get a yes. ' +
  'Each has a short, true reply. The replies are reminders of the person\'s own choice, never a way to shame.\n\n';
C.thoughts.forEach((x, i) => {
  t += `## ${i + 1}. ${x.t.en}\n\n` +
    `- **Truth (English):** ${x.a.en}\n` +
    `- **Igitekerezo (Kinyarwanda):** ${x.t.rw}${ck(x)}\n` +
    `- **Ukuri (Kinyarwanda):** ${x.a.rw}${ck(x)}\n\n`;
});
out('FALSE_THOUGHTS.md', t);

/* ---- REMINDERS.md ---- */
let r = '# Reminders ("truth lines")\n\n' + note +
  'Reminders are values, not research findings. The page labels them "Reminders" and keeps them apart from the science. ' +
  'They speak about the choice and never insult the person.\n\n## The owner\'s three lines (exact)\n\n';
C.reminders.filter((x) => x.own).forEach((x, i) => {
  r += `${i + 1}. **${x.en}**\n   - Kinyarwanda: ${x.rw}${ck(x)}\n`;
  if (x.single) r += `   - Without a partner: **${x.single.en}**\n   - Kinyarwanda: ${x.single.rw}${ck(x)}\n`;
});
r += '\n## Thirty more, in the same voice\n\n| # | English | Kinyarwanda |\n|---|---|---|\n';
C.reminders.filter((x) => !x.own).forEach((x, i) => {
  r += `| ${i + 1} | ${cell(x.en)} | ${cell(x.rw)}${ck(x)} |\n`;
});
out('REMINDERS.md', r);

/* ---- PAGE_CONTENT.md ---- */
let p = '# Page content\n\n' + note;
const table = (rows) => '| English | Kinyarwanda |\n|---|---|\n' +
  rows.map((x) => `| ${cell(x.en)} | ${cell(x.rw)}${ck(x)} |`).join('\n') + '\n\n';

p += '## Buttons and short lines\n\n| Key | English | Kinyarwanda |\n|---|---|---|\n';
Object.keys(C.ui).forEach((k) => { const x = C.ui[k]; p += `| ${k} | ${cell(x.en)} | ${cell(x.rw)}${ck(x)} |\n`; });

p += '\n## Ride the wave: guide lines (one every 15 seconds)\n\n' + table(C.wave);
p += '## Movement guide (one step every 15 seconds)\n\n' + table(C.move);
p += '## One change of setting\n\n' + table(C.setting);

p += '## Example if-then plans\n\n| English | Kinyarwanda |\n|---|---|\n';
C.planExamples.forEach((x) => {
  p += `| If ${cell(x.i.en)}, then I ${cell(x.t.en)}. | Niba ${cell(x.i.rw)}, noneho ${cell(x.t.rw)}.${x.i.check ? ' [CHECK]' : ''} |\n`;
});

p += '\n## "Why this?" lines (each links to a source in REPORT.md)\n\n| Tool | English | Kinyarwanda | Sources |\n|---|---|---|---|\n';
Object.keys(C.whyTool).forEach((k) => { const x = C.whyTool[k]; p += `| ${k} | ${cell(x.en)} | ${cell(x.rw)}${ck(x)} | ${x.refs.map((n) => '[' + n + ']').join(' ')} |\n`; });

p += '\n## Lessons (about 2 minutes each)\n\n';
C.lessons.forEach((l, i) => {
  p += `### ${i + 1}. ${l.title.en}\n\n${l.body.en.join('\n\n')}\n\n` +
    `**Kinyarwanda: ${l.title.rw}**${ck(l)}\n\n${l.body.rw.join('\n\n')}\n\n` +
    `Sources in REPORT.md: ${l.refs.map((n) => '[' + n + ']').join(' ')}\n\n`;
});

const H = C.help;
p += '## Get help\n\n' + table([H.intro]);
p += `### ${H.whenTitle.en} / ${H.whenTitle.rw}\n\n` + table(H.when);
p += `### ${H.urgentTitle.en} / ${H.urgentTitle.rw}\n\n` + table(H.urgent);
p += table([H.moral]);
p += `### ${H.talkTitle.en} / ${H.talkTitle.rw}\n\n` + table(H.talk);
p += `### ${H.rwandaTitle.en} / ${H.rwandaTitle.rw}\n\n` + table(H.rwanda) + table([H.elsewhere]);
out('PAGE_CONTENT.md', p);

console.log('Wrote research/PAGE_CONTENT.md, FALSE_THOUGHTS.md, REMINDERS.md');
