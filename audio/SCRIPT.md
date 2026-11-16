# Voice script

Every line the page can speak (81 recordings for each language), with the exact file name each recording needs.
Made from `js/content.js` by `tools/make-voice-script.js`, so it always matches the words on the page.

## How it works

- Put English recordings in `audio/en/` and Kinyarwanda recordings in `audio/rw/`.
- Name each file exactly as shown, ending in `.mp3`. Example: `audio/en/wave-03.mp3`.
- The page looks for `gate.mp3` first. If that file is there, the voice is on for that language. Any other file that is missing is simply skipped, so you can upload one set at a time.
- The voice plays only when the person has turned sound on. The music steps back while it speaks.

## Recording with ElevenLabs

These are starting points. Trust your ear over these numbers.

1. **Pick one voice and use it for every line.** Look for a voice that is calm, warm, unhurried and a little low. Avoid voices that sound like an advert or a meditation app. Generate `gate` and `wave-01` with three or four voices before you choose.
2. **Settings:** a multilingual model, stability around 60 to 70 (so every line sounds like the same person), style at 0, speed around 0.9.
3. **Paste one line, generate, listen, download as MP3,** and rename the file to the name in the first column.
4. **For a longer pause** inside a line, you can type `<break time="1.0s" />` where you want it.
5. **Do not add music or effects.** The page adds a little room echo itself.

## Kinyarwanda

Record Kinyarwanda only after a native speaker has corrected the lines marked [CHECK]. Check also that your ElevenLabs model lists Kinyarwanda; if it does not, a person recording on a phone in a quiet room works just as well. The file names are the same, in `audio/rw/`.

## Uploading to GitHub

1. Open the repository on GitHub and go into the `audio` folder, then `en`.
2. Press **Add file**, then **Upload files**.
3. Drag all the MP3 files in, and press **Commit changes**.
4. Wait about two minutes, open the page, turn sound on, and hold the gate.

If you later replace a recording with a better one, also change the version name in `sw.js` (see the README), so phones fetch the new file.

---

## Set 1: the core (27 recordings)

Record these first. With only this set, the gate, the whole rescue and the end of the path are spoken.

### The gate

**How to say it:** Low, slow and certain. This is the first thing a person hears. Leave a short silence before and after.

| File name | English | Kinyarwanda |
|---|---|---|
| `gate.mp3` | Only you can open this. | Ni wowe wenyine ushobora gukingura. |

### The rescue: questions and turns

**How to say it:** Calm and direct, like a steady friend. No urgency, no pity.

| File name | English | Kinyarwanda |
|---|---|---|
| `rate-1.mp3` | How strong is the urge right now? | Ubu irari rifite imbaraga zingana iki? |
| `rate-2.mp3` | And now? How strong is it? | Ubu se? Rifite imbaraga zingana iki? |
| `strong.mp3` | Strong. Give your eyes and hands a job for 3 minutes. | Rirakomeye. Ha amaso n'intoki byawe akazi mu minota 3. [CHECK] |
| `still-strong.mp3` | Still strong. That happens. One more round, something different. | Riracyakomeye. Bibaho. Indi nshuro imwe, ikindi kintu. [CHECK] |

### Ride the wave (one line every 15 seconds)

**How to say it:** The slowest and softest of all. Almost a whisper, with long pauses between sentences. Each recording should be under 10 seconds.

| File name | English | Kinyarwanda |
|---|---|---|
| `wave-01.mp3` | Let the urge be here. You do not have to do anything about it. | Reka irari ribe rihari. Nta cyo ugomba kurikoraho. |
| `wave-02.mp3` | Breathe in as the wave rises. Out as it falls. | Injiza umwuka umuraba uzamuka. Uwusohore umanuka. |
| `wave-03.mp3` | Where do you feel it in your body? Only notice. | Uryumva he mu mubiri wawe? Bibone gusa. |
| `wave-04.mp3` | Is it tight, warm, restless? Give it a name. | Ni ukwikanyaga, ubushyuhe, kudatuza? Bihe izina. [CHECK] |
| `wave-05.mp3` | You are not pushing it away. You are watching it. | Nturi kurisunika. Uri kuryitegereza. |
| `wave-06.mp3` | The wave may grow. That is what waves do. | Umuraba ushobora gukura. Ni ko imiraba imera. |
| `wave-07.mp3` | Stay on top of it. Breathe. | Guma hejuru yawo. Humeka. |
| `wave-08.mp3` | Notice: it changes. It is not the same as a minute ago. | Bibone: birahinduka. Ntibikimeze nk'uko byari bimeze mu munota ushize. |
| `wave-09.mp3` | A thought may say "go on". It is only a thought. | Igitekerezo gishobora kuvuga ngo "komeza". Ni igitekerezo gusa. |
| `wave-10.mp3` | You are still here. You have not obeyed it. | Uracyari hano. Ntiwaryumviye. |
| `wave-11.mp3` | Let it pass at its own speed. | Reka rihite ku muvuduko waryo. |
| `wave-12.mp3` | You did not fight. You stayed. That is the skill. | Ntiwarwanye. Wagumyeho. Ubwo ni bwo bushobozi. [CHECK] |

### Movement (one line every 15 seconds)

**How to say it:** Brighter and a little quicker. Encouraging, like a coach who is on your side.

| File name | English | Kinyarwanda |
|---|---|---|
| `move-01.mp3` | Stand up. | Haguruka. |
| `move-02.mp3` | Walk to the door, or to another room. | Genda ugere ku muryango, cyangwa mu kindi cyumba. |
| `move-03.mp3` | Shake out your hands and arms. | Zunguza ibiganza n'amaboko. |
| `move-04.mp3` | March on the spot. Knees high. | Tambuka uhagaze hamwe. Zamura amavi. [CHECK] |
| `move-05.mp3` | Reach both arms up. Breathe in. | Zamura amaboko yombi. Injiza umwuka. |
| `move-06.mp3` | Sit down and stand up, ten times, slowly. | Icara uhaguruke, inshuro icumi, buhoro. |
| `move-07.mp3` | Roll your shoulders back. | Zengurutsa intugu uzisubiza inyuma. [CHECK] |
| `move-08.mp3` | Drink a glass of water if you can. | Nywa ikirahure cy'amazi niba bishoboka. |

### The end of a rescue, and the end of the path

**How to say it:** Warm and proud, but quiet. Let the last word land.

| File name | English | Kinyarwanda |
|---|---|---|
| `end.mp3` | You stayed. That is the skill. The urge may come back. You now know you can get through it. | Wagumyeho. Ubwo ni bwo bushobozi. Irari rishobora kugaruka. Ubu uzi ko ushobora kurinyuramo. [CHECK] |
| `path-open.mp3` | The path is open. You saw each lie for what it was. Every part of this place is open to you now. | Inzira irafunguye. Wabonye buri kinyoma uko kiri. Ubu buri gice cy'aha kiragufunguriwe. [CHECK] |

---

## Set 2: the truths behind the threads (20 recordings)

Spoken when the torch shows the truth behind a false thought. Only the truth is spoken, never the false thought.

### Truths

**How to say it:** Firm and plain. One breath each. These are facts, not arguments.

| File name | English | Kinyarwanda | Answers the thought |
|---|---|---|---|
| `truth-01.mp3` | Once is how it always starts. This one counts. | Byose bitangira ari rimwe. Iri na ryo rirabarwa. [CHECK] | Just once won't matter. |
| `truth-02.mp3` | I will know. That is enough. | Jyewe nzabimenya. Birahagije. | Nobody will know. |
| `truth-03.mp3` | I deserve something good. This is not it. | Nkwiye ikintu cyiza. Iki si cyo. [CHECK] | I deserve this after today. |
| `truth-04.mp3` | Tomorrow will say the same. I start now. | Ejo na ho hazavuga gutyo. Ntangiye ubu. [CHECK] | I'll start tomorrow. |
| `truth-05.mp3` | I don't have to fight it. I only have to let it pass. | Singomba kubirwanya. Ngomba gusa kureka bigahita. [CHECK] | I can't fight this. |
| `truth-06.mp3` | Looking is where it begins. I can look away. | Kureba ni ho bitangirira. Nshobora kureba ahandi. | It's only looking. |
| `truth-07.mp3` | One slip is one slip. The next choice is still mine. | Kugwa rimwe ni rimwe. Amahitamo akurikira aracyari ayanjye. [CHECK] | I've already slipped, so it doesn't matter now. |
| `truth-08.mp3` | Urges rise and fall. This one will too. | Irari rirazamuka rikamanuka. N'iri ni ko bizagenda. [CHECK] | This urge won't go away until I give in. |
| `truth-09.mp3` | Maybe. I chose something else. | Birashoboka. Jyewe nahisemo ikindi. | Everyone does it. |
| `truth-10.mp3` | It moves me away from who I want to be. | Bintandukanya n'uwo nshaka kuba we. [CHECK] | It's not hurting anyone. |
| `truth-11.mp3` | There are other ways to rest. This one costs me tomorrow. | Hari ubundi buryo bwo kuruhuka. Ubu bwo buzanyishyuza ejo. [CHECK] | I need this to relax. |
| `truth-12.mp3` | It says that every time. | Ni ko bivuga buri gihe. [CHECK] | This time is different. |
| `truth-13.mp3` | Five minutes is all I need to let it pass instead. | Iminota itanu ni yo nkeneye ngo bihite. [CHECK] | Just five minutes. |
| `truth-14.mp3` | Trust is built from what happens unseen. | Icyizere cyubakwa n'ibikorwa bitaboneka. [CHECK] | My partner would never find out. |
| `truth-15.mp3` | The stress is real. This will not take it away. | Guhangayika ni ukuri. Ariko ibi ntibizabikuraho. [CHECK] | I'm too stressed to resist. |
| `truth-16.mp3` | It fills a minute and leaves the loneliness. I can reach a real person. | Byuzuza umunota umwe, irungu rigasigara. Nshobora kuvugisha umuntu nyawe. [CHECK] | I'm lonely, and this will help. |
| `truth-17.mp3` | The reward for keeping my word is being someone who keeps it. | Igihembo cyo kubahiriza ijambo ni ukuba umuntu uryubahiriza. [CHECK] | I've done well for so long. I've earned it. |
| `truth-18.mp3` | A thought is not who I am. What I choose is. | Igitekerezo si jyewe. Icyo mpisemo ni cyo jyewe. [CHECK] | This is just who I am. |
| `truth-19.mp3` | The easiest place to stop is here. | Aho guhagarara byoroshye ni hano. [CHECK] | I'll stop before it goes too far. |
| `truth-20.mp3` | The feeling is natural. What I do with it is my choice. | Ibyiyumvo ni kamere. Icyo mbikoresha ni amahitamo yanjye. [CHECK] | It's natural, so why resist? |

---

## Set 3: the reminders (34 recordings)

Spoken when a thread is cut, at the end of a rescue and at the end of the path.

### Reminders

**How to say it:** Strong and short, like a proverb. A small pause in the middle where there are two sentences.

| File name | English | Kinyarwanda |
|---|---|---|
| `reminder-01.mp3` | There are thousands like that, but none is like your partner. | Abameze batyo ni ibihumbi, ariko nta n'umwe umeze nk'umukunzi wawe. [CHECK] |
| `reminder-01-single.mp3` | There are thousands like that, but none is like the one you're waiting for. | Abameze batyo ni ibihumbi, ariko nta n'umwe umeze nk'uwo utegereje. [CHECK] |
| `reminder-02.mp3` | Wandering eyes are cheap eyes. | Amaso azerera ni amaso ahendutse. [CHECK] |
| `reminder-03.mp3` | There's nothing unique in wanting more people. Self-love is gold. | Kwifuza abantu benshi nta gishya kirimo. Kwikunda ni zahabu. [CHECK] |
| `reminder-04.mp3` | Anyone can want. Few can choose. | Kwifuza bishoborwa na bose. Guhitamo bishoborwa na bake. [CHECK] |
| `reminder-05.mp3` | A promise kept in the dark is worth the most. | Isezerano ryubahirijwe mu ibanga ni ryo rifite agaciro kanini. [CHECK] |
| `reminder-06.mp3` | What is easy to get is easy to forget. | Ikiboneka vuba cyibagirana vuba. [CHECK] |
| `reminder-07.mp3` | The urge shouts. Your word stands. | Irari rirasakuza. Ijambo ryawe rirahagarara. [CHECK] |
| `reminder-08.mp3` | One person, fully, is worth more than many, halfway. | Umuntu umwe wuzuye aruta benshi b'igice. [CHECK] |
| `reminder-09.mp3` | Chasing is common. Staying is rare. | Kwiruka inyuma y'abantu birasanzwe. Kuguma ni gake. [CHECK] |
| `reminder-10.mp3` | A glance costs nothing. A second look has a price. | Kureba rimwe nta cyo bitwara. Kongera kureba bifite igiciro. [CHECK] |
| `reminder-11.mp3` | Loyalty is not a cage. It is a choice made again. | Ubudahemuka si akazu. Ni amahitamo usubiramo. [CHECK] |
| `reminder-12.mp3` | The urge offers minutes. Your choice builds years. | Irari ritanga iminota. Amahitamo yawe yubaka imyaka. [CHECK] |
| `reminder-13.mp3` | What you protect grows in value. | Icyo urinda kiyongera agaciro. [CHECK] |
| `reminder-14.mp3` | Nobody is watching. That is exactly when it counts. | Nta wukureba. Ni bwo bifite agaciro nyako. [CHECK] |
| `reminder-15.mp3` | Hunger for more never says "enough". | Inzara yo gushaka ibindi ntijya ivuga ngo "birahagije". [CHECK] |
| `reminder-16.mp3` | Being trusted is worth more than being thrilled. | Kwizerwa biruta gushimishwa akanya gato. [CHECK] |
| `reminder-17.mp3` | A calm mind is a rich house. | Umutima utuje ni inzu ikize. [CHECK] |
| `reminder-18.mp3` | A treasure is something you guard. | Ubutunzi ni ikintu urinda. [CHECK] |
| `reminder-19.mp3` | You are not the urge. You are the one who decides. | Nturi irari. Uri ufata icyemezo. [CHECK] |
| `reminder-20.mp3` | Cheap thrills come with a long bill. | Ibyishimo bihendutse bizana umwenda muremure. [CHECK] |
| `reminder-21.mp3` | Depth beats number. | Ubujyakuzimu buruta umubare. [CHECK] |
| `reminder-22.mp3` | The strongest "no" is quiet. | "Oya" ikomeye kurusha izindi ni ituje. [CHECK] |
| `reminder-23.mp3` | What you walk past today thanks you tomorrow. | Icyo wirengagije uyu munsi kizagushimira ejo. [CHECK] |
| `reminder-24.mp3` | Respect for yourself is not for sale. | Kwiyubaha ntibigurishwa. [CHECK] |
| `reminder-25.mp3` | Attention is love. Spend it at home. | Kwita ku muntu ni urukundo. Bikoreshe iwawe. [CHECK] |
| `reminder-26.mp3` | A wave is loud, and then it is gone. | Umuraba urasakuza, hanyuma ukagenda. [CHECK] |
| `reminder-27.mp3` | Keep your word to yourself first. | Banza wubahirize ijambo wihaye. [CHECK] |
| `reminder-28.mp3` | New is not better. New is only new. | Igishya si cyo cyiza. Igishya ni gishya gusa. [CHECK] |
| `reminder-29.mp3` | Faithfulness is built in small moments like this one. | Ubudahemuka bwubakwa mu tuntu duto nk'aka kanya. [CHECK] |
| `reminder-30.mp3` | Wanting is not needing. | Kwifuza si ugukenera. |
| `reminder-31.mp3` | The eyes can pass. The heart can stay. | Amaso ashobora guhita. Umutima ushobora kuguma. [CHECK] |
| `reminder-32.mp3` | Peace tonight is worth more than a thrill now. | Amahoro y'iri joro aruta ibyishimo by'akanya. [CHECK] |
| `reminder-33.mp3` | You have passed this way before, and you came through. | Wanyuze aha mbere, kandi warahavuye. [CHECK] |

