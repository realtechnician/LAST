// Makes the voice recordings with ElevenLabs, straight into audio/<language>/.
// It only makes files that are missing, so after changing a line in
// js/content.js, delete that line's .mp3 and run this again.
//
//   ELEVENLABS_API_KEY=your-key node tools/make-voice.js en
//
// The English voice is "Chris - Soothing". To use another voice, add its
// ElevenLabs voice id as a second word:  node tools/make-voice.js en <voice id>
const fs = require('fs'), path = require('path');
const { sets } = require('./make-voice-script.js');
const lang = process.argv[2] || 'en';
const voice = process.argv[3] || 'bTw8AqIDQenIK3kFqvhT';
// How fast each kind of line is read (1 is the voice's normal speed).
const speed = (id) => id.startsWith('wave') ? .82 : id.startsWith('move') ? 1 : id === 'gate' ? .85 : /^(end|path-open|reminder)/.test(id) ? .88 : /^(rate|strong|still)/.test(id) ? .92 : .9;
(async () => {
  const dir = path.join(__dirname, '..', 'audio', lang); let made = 0;
  for (const set of sets) for (const g of set.groups) for (const [id, t] of g.lines) {
    const file = path.join(dir, id + '.mp3');
    if (fs.existsSync(file)) continue;
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_96`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'xi-api-key': process.env.ELEVENLABS_API_KEY || '' },
      body: JSON.stringify({ text: t[lang], model_id: 'eleven_multilingual_v2', voice_settings: { stability: .65, similarity_boost: .75, style: 0, use_speaker_boost: true, speed: speed(id) } })
    });
    if (!r.ok) { console.log('failed:', id, r.status, (await r.text()).slice(0, 200)); continue; }
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); made++; console.log('made', id);
  }
  console.log(made ? `Done: ${made} new recordings in audio/${lang}/` : 'Nothing to make: every line already has a recording.');
})();
