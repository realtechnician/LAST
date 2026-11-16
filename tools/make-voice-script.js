// Writes audio/SCRIPT.md: every line the voice speaks, with the file name
// each recording must have. Made from js/content.js, so it always matches
// the words on the page. Run:  node tools/make-voice-script.js
const fs = require('fs'), path = require('path');
const C = require('../js/content.js');
const two = (n) => String(n).padStart(2, '0');
const u = C.ui;
const both = (o) => ({ en: o.en, rw: o.rw, check: !!o.check });
const join = (a, b) => ({ en: a.en + ' ' + b.en, rw: a.rw + ' ' + b.rw, check: !!(a.check || b.check) });

const sets = [
  { title: 'Set 1: the core', note: 'Record these first. With only this set, the gate, the whole rescue and the end of the path are spoken.',
    groups: [
      { name: 'The gate', how: 'Low, slow and certain. This is the first thing a person hears. Leave a short silence before and after.', lines: [['gate', both(u.gateLine)]] },
      { name: 'The rescue: questions and turns', how: 'Calm and direct, like a steady friend. No urgency, no pity.', lines: [
        ['rate-1', both(u.rateQ)], ['rate-2', both(u.rateAgainQ)], ['strong', both(u.pathStrong)], ['still-strong', both(u.stillStrong)]] },
      { name: 'Ride the wave (one line every 15 seconds)', how: 'The slowest and softest of all. Almost a whisper, with long pauses between sentences. Each recording should be under 10 seconds.',
        lines: C.wave.map((x, i) => ['wave-' + two(i + 1), both(x)]) },
      { name: 'Movement (one line every 15 seconds)', how: 'Brighter and a little quicker. Encouraging, like a coach who is on your side.',
        lines: C.move.map((x, i) => ['move-' + two(i + 1), both(x)]) },
      { name: 'The end of a rescue, and the end of the path', how: 'Warm and proud, but quiet. Let the last word land.', lines: [
        ['end', join(u.endTitle, u.endHonest)], ['path-open', join(u.pathOpen, u.finaleLine)]] }
    ] },
  { title: 'Set 2: the truths behind the threads', note: 'Spoken when the torch shows the truth behind a false thought. Only the truth is spoken, never the false thought.',
    groups: [{ name: 'Truths', how: 'Firm and plain. One breath each. These are facts, not arguments.',
      lines: C.thoughts.map((x, i) => ['truth-' + two(i + 1), { en: x.a.en, rw: x.a.rw, check: !!x.check }, x.t]) }] },
  { title: 'Set 3: the reminders', note: 'Spoken when a thread is cut, at the end of a rescue and at the end of the path.',
    groups: [{ name: 'Reminders', how: 'Strong and short, like a proverb. A small pause in the middle where there are two sentences.',
      lines: C.reminders.flatMap((x, i) => {
        const rows = [['reminder-' + two(i + 1), { en: x.en, rw: x.rw, check: !!x.check }]];
        if (x.single) rows.push(['reminder-' + two(i + 1) + '-single', { en: x.single.en, rw: x.single.rw, check: !!x.check }]);
        return rows;
      }) }] }
];

const cell = (s) => String(s).replace(/\|/g, '\\|');
let total = 0, md = `# Voice script

Every line the page can speak, with the exact file name each recording needs.
Made from \`js/content.js\` by \`tools/make-voice-script.js\`, so it always matches the words on the page.

## How it works

- Put English recordings in \`audio/en/\` and Kinyarwanda recordings in \`audio/rw/\`.
- Name each file exactly as shown, ending in \`.mp3\`. Example: \`audio/en/wave-03.mp3\`.
- The page looks for \`gate.mp3\` first. If that file is there, the voice is on for that language. Any other file that is missing is simply skipped, so you can upload one set at a time.
- The voice plays only when the person has turned sound on. The music steps back while it speaks.

## Recording with ElevenLabs

These are starting points. Trust your ear over these numbers.

1. **Pick one voice and use it for every line.** Look for a voice that is calm, warm, unhurried and a little low. Avoid voices that sound like an advert or a meditation app. Generate \`gate\` and \`wave-01\` with three or four voices before you choose.
2. **Settings:** a multilingual model, stability around 60 to 70 (so every line sounds like the same person), style at 0, speed around 0.9.
3. **Paste one line, generate, listen, download as MP3,** and rename the file to the name in the first column.
4. **For a longer pause** inside a line, you can type \`<break time="1.0s" />\` where you want it.
5. **Do not add music or effects.** The page adds a little room echo itself.

## Kinyarwanda

Record Kinyarwanda only after a native speaker has corrected the lines marked [CHECK]. Check also that your ElevenLabs model lists Kinyarwanda; if it does not, a person recording on a phone in a quiet room works just as well. The file names are the same, in \`audio/rw/\`.

## Uploading to GitHub

1. Open the repository on GitHub and go into the \`audio\` folder, then \`en\`.
2. Press **Add file**, then **Upload files**.
3. Drag all the MP3 files in, and press **Commit changes**.
4. Wait about two minutes, open the page, turn sound on, and hold the gate.

If you later replace a recording with a better one, also change the version name in \`sw.js\` (see the README), so phones fetch the new file.

`;
for (const set of sets) {
  const n = set.groups.reduce((k, g) => k + g.lines.length, 0);
  md += `---\n\n## ${set.title} (${n} recordings)\n\n${set.note}\n\n`;
  for (const g of set.groups) {
    const third = g.lines.some((l) => l[2]);
    md += `### ${g.name}\n\n**How to say it:** ${g.how}\n\n| File name | English | Kinyarwanda |${third ? ' Answers the thought |' : ''}\n|---|---|---|${third ? '---|' : ''}\n`;
    for (const [id, t, ctx] of g.lines) { total++; md += `| \`${id}.mp3\` | ${cell(t.en)} | ${cell(t.rw)}${t.check ? ' [CHECK]' : ''} |${third ? ' ' + cell(ctx.en) + ' |' : ''}\n`; }
    md += '\n';
  }
}
md = md.replace('Every line the page can speak,', `Every line the page can speak (${total} recordings for each language),`);
fs.writeFileSync(path.join(__dirname, '..', 'audio', 'SCRIPT.md'), md);
console.log('Wrote audio/SCRIPT.md with', total, 'lines');
