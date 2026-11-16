/* All words shown on the page, in English (en) and Kinyarwanda (rw).
   This is the single source of truth: research/PAGE_CONTENT.md,
   FALSE_THOUGHTS.md and REMINDERS.md are generated from this file
   (run: node tools/make-research-md.js).

   check: true  -> the Kinyarwanda line needs a native speaker's review.
   verify: true -> a fact the page owner must confirm before publishing. */
(function (root) {
  var C = {};

  /* ---------- Buttons, labels, short lines ---------- */
  C.ui = {
    appName: { en: 'Komera', rw: 'Komera' },
    tagline: { en: 'Get through the urge. Keep your word.', rw: 'Tsinda irari. Komeza ijambo ryawe.', check: true },
    gateLine: { en: 'Only you can open this.', rw: 'Ni wowe wenyine ushobora gukingura.' },
    gateHold: { en: 'Press and hold to open', rw: 'Kanda ukomeze ufate kugira ngo ukingure', check: true },
    rescueNow: { en: 'Rescue now', rw: 'Ntabara nonaha' },
    skipGate: { en: 'Skip', rw: 'Simbuka' },
    privacyLine: { en: 'Private. Nothing leaves this phone. No account, no tracking.', rw: 'Ni ibanga. Nta kintu kiva kuri iyi telefoni. Nta konti, nta gukurikiranwa.' },
    notTherapy: { en: 'A self-help tool, not treatment.', rw: 'Ni igikoresho cyo kwifasha, si ubuvuzi.' },
    torchHint: { en: 'Move your finger. It is your light.', rw: 'Imura urutoki rwawe. Ni rwo rumuri rwawe.', check: true },
    threadHint: { en: 'Shine on a thread to see the truth. Swipe across to cut it.', rw: 'Murikira umugozi ubone ukuri. Wunyuzeho urutoki uwuce.', check: true },
    pathOpen: { en: 'The path is open.', rw: 'Inzira irafunguye.' },
    falseThought: { en: 'The thought', rw: 'Igitekerezo' },
    truth: { en: 'The truth', rw: 'Ukuri' },
    reminder: { en: 'Reminder', rw: 'Inyibutsa', check: true },
    reminders: { en: 'Reminders', rw: 'Inyibutsa', check: true },
    remindersNote: { en: 'Reminders are values, not research findings.', rw: 'Inyibutsa ni indangagaciro, si ibyavuye mu bushakashatsi.', check: true },

    navRescue: { en: 'Rescue', rw: 'Ubutabazi' },
    navPlan: { en: 'My plan', rw: 'Gahunda yanjye' },
    navLearn: { en: 'Learn', rw: 'Iga' },
    navPractice: { en: 'Practice', rw: 'Imyitozo' },
    navHelp: { en: 'Get help', rw: 'Shaka ubufasha' },
    navSettings: { en: 'Settings', rw: 'Igenamiterere' },

    back: { en: 'Back', rw: 'Subira inyuma' },
    close: { en: 'Close', rw: 'Funga' },
    next: { en: 'Continue', rw: 'Komeza' },
    start: { en: 'Start', rw: 'Tangira' },
    done: { en: 'Done', rw: 'Byarangiye' },
    skip: { en: 'Skip', rw: 'Simbuka' },
    save: { en: 'Save', rw: 'Bika' },
    edit: { en: 'Edit', rw: 'Hindura' },
    del: { en: 'Delete', rw: 'Siba' },
    add: { en: 'Add a plan', rw: 'Ongeraho gahunda' },
    why: { en: 'Why this?', rw: 'Kuki ibi?' },
    source: { en: 'Source', rw: 'Inkomoko' },
    seconds: { en: 's', rw: 's' },

    rateQ: { en: 'How strong is the urge right now?', rw: 'Ubu irari rifite imbaraga zingana iki?' },
    rateLow: { en: 'mild', rw: 'rike' },
    rateHigh: { en: 'very strong', rw: 'rikomeye cyane' },
    rateAgainQ: { en: 'And now? How strong is it?', rw: 'Ubu se? Rifite imbaraga zingana iki?' },
    pathStrong: { en: 'Strong. Give your eyes and hands a job for 3 minutes.', rw: 'Rirakomeye. Ha amaso n\'intoki byawe akazi mu minota 3.', check: true },
    pathMild: { en: 'Let us ride it out together for 3 minutes.', rw: 'Reka turigendereho hamwe mu minota 3.', check: true },
    chooseGame: { en: 'Choose one', rw: 'Hitamo kimwe' },
    gameFit: { en: 'Fit the shapes', rw: 'Panga ibishushanyo', check: true },
    gameFitHow: { en: 'Point to where each falling arc should land. Fill a ring.', rw: 'Erekana aho buri gice kigwa kigomba kujya. Uzuza uruziga.', check: true },
    gameSort: { en: 'Sort the lights', rw: 'Tandukanya amatara', check: true },
    gameSortHow: { en: 'Drag each light to the ring of its colour.', rw: 'Kurura buri tara urijyane mu ruziga rw\'ibara ryaryo.', check: true },
    gamePath: { en: 'Follow the path', rw: 'Kurikira inzira' },
    gamePathHow: { en: 'Keep your torch on the moving path.', rw: 'Gumisha urumuri rwawe ku nzira igenda.', check: true },
    gameTurn: { en: 'Turn', rw: 'Hindukiza' },
    gameDrop: { en: 'Drop', rw: 'Manura' },
    stillStrong: { en: 'Still strong. That happens. One more round, something different.', rw: 'Riracyakomeye. Bibaho. Indi nshuro imwe, ikindi kintu.', check: true },
    anotherGame: { en: 'Another game', rw: 'Undi mukino' },
    moveGuide: { en: 'Move for 2 minutes', rw: 'Inyeganyeze iminota 2', check: true },
    endTitle: { en: 'You stayed. That is the skill.', rw: 'Wagumyeho. Ubwo ni bwo bushobozi.', check: true },
    endHonest: { en: 'The urge may come back. You now know you can get through it.', rw: 'Irari rishobora kugaruka. Ubu uzi ko ushobora kurinyuramo.', check: true },
    stillAfter: { en: 'Still strong? Change where you are right now, and reach a person you trust.', rw: 'Riracyakomeye? Hindura aho uri nonaha, kandi uvugishe umuntu wizeye.', check: true },
    menu: { en: 'Menu', rw: 'Ibirimo', check: true },
    another: { en: 'Another', rw: 'Ikindi' },
    sources: { en: 'Sources', rw: 'Inkomoko' },
    lessons: { en: 'Lessons', rw: 'Amasomo' },
    yourPlan: { en: 'Your plan', rw: 'Gahunda yawe' },
    yourWhy: { en: 'Your why', rw: 'Impamvu yawe' },
    noPlanYet: { en: 'No plan yet. One sentence now makes next time easier.', rw: 'Nta gahunda urandika. Interuro imwe ubu izoroshya ubutaha.', check: true },
    makePlan: { en: 'Write one if-then plan', rw: 'Andika gahunda imwe ya "niba… noneho…"' },
    oneChange: { en: 'One change of setting, now', rw: 'Hindura ikintu kimwe aho uri, nonaha', check: true },
    finish: { en: 'Finish', rw: 'Soza' },
    breatheIn: { en: 'Breathe in', rw: 'Injiza umwuka' },
    breatheOut: { en: 'Breathe out', rw: 'Sohora umwuka' },

    planIntro: { en: 'Decide now, so the moment is easier. Up to three plans, and one line on why this matters to you. Saved only on this phone.', rw: 'Fata icyemezo ubu, kugira ngo cya gihe kizorohe. Gahunda zitarenze eshatu, n\'umurongo umwe uvuga impamvu ibi bigufitiye akamaro. Bibikwa kuri iyi telefoni gusa.', check: true },
    planIf: { en: 'If', rw: 'Niba' },
    planThen: { en: 'then I', rw: 'noneho' },
    planIfPh: { en: 'the moment (where, when, how I feel)', rw: 'igihe (aho ndi, isaha, uko merewe)' },
    planThenPh: { en: 'what I will do (takes seconds)', rw: 'icyo nzakora (gifata amasegonda)' },
    planExamples: { en: 'Examples (tap to use)', rw: 'Ingero (kanda ukoreshe)' },
    planFull: { en: 'Three plans is the limit. Fewer plans are easier to remember.', rw: 'Gahunda eshatu ni zo ntarengwa. Gahunda nke zoroha kwibuka.' },
    whyLabel: { en: 'Why this matters to me', rw: 'Impamvu ibi bimfitiye akamaro' },
    whyPh: { en: 'In your own words', rw: 'Mu magambo yawe bwite' },
    deleteAll: { en: 'Delete everything saved', rw: 'Siba ibyabitswe byose' },
    deleted: { en: 'Deleted. Nothing is saved on this phone now.', rw: 'Byasibwe. Ubu nta kintu kibitswe kuri iyi telefoni.' },
    saved: { en: 'Saved on this phone.', rw: 'Byabitswe kuri iyi telefoni.' },

    learnIntro: { en: 'Short lessons. About 2 minutes each.', rw: 'Amasomo magufi. Buri rimwe rifata nk\'iminota 2.' },
    practiceIntro: { en: 'Three calm minutes of riding the wave, for a quiet moment. Practising now makes the skill ready when a real urge comes.', rw: 'Iminota itatu ituje yo kugendera ku muraba, mu gihe utuje. Kwitoza ubu bituma ubushobozi buba bwiteguye igihe irari nyaryo rije.', check: true },
    practiceDone: { en: 'That is the whole skill: notice, breathe, stay.', rw: 'Ubwo ni bwo bushobozi bwose: kubona, guhumeka, kuguma.', check: true },

    setLang: { en: 'Language', rw: 'Ururimi' },
    setSound: { en: 'Music and sound', rw: 'Umuziki n\'ijwi', check: true },
    setMotion: { en: 'Reduced motion (still scenes)', rw: 'Gabanya ibinyeganyega (amashusho ahagaze)', check: true },
    setSimple: { en: 'Simple graphics (for slow phones)', rw: 'Amashusho yoroheje (kuri telefoni zitinda)', check: true },
    setSkipGate: { en: 'Skip the gate when I open the page', rw: 'Simbuka irembo igihe mfunguye urubuga', check: true },
    setSingle: { en: 'I do not have a partner now', rw: 'Ubu nta mukunzi mfite', check: true },
    on: { en: 'On', rw: 'Rirakora', check: true },
    off: { en: 'Off', rw: 'Rirazimye', check: true },
    setPrivacy: { en: 'This page saves only your plan and these settings, on this phone. It keeps no history, counts or streaks, and sends nothing anywhere.', rw: 'Uru rubuga rubika gusa gahunda yawe n\'iri genamiterere, kuri iyi telefoni. Nta mateka, imibare cyangwa urukurikirane rubika, kandi nta cyo rwohereza ahandi.', check: true },
    offlineReady: { en: 'Works offline.', rw: 'Rukora nta interineti.' }
  };

  /* ---------- The wave exercise: one line every 15 seconds ---------- */
  C.wave = [
    { en: 'Let the urge be here. You do not have to do anything about it.', rw: 'Reka irari ribe rihari. Nta cyo ugomba kurikoraho.' },
    { en: 'Breathe in as the wave rises. Out as it falls.', rw: 'Injiza umwuka umuraba uzamuka. Uwusohore umanuka.' },
    { en: 'Where do you feel it in your body? Only notice.', rw: 'Uryumva he mu mubiri wawe? Bibone gusa.' },
    { en: 'Is it tight, warm, restless? Give it a name.', rw: 'Ni ukwikanyaga, ubushyuhe, kudatuza? Bihe izina.', check: true },
    { en: 'You are not pushing it away. You are watching it.', rw: 'Nturi kurisunika. Uri kuryitegereza.' },
    { en: 'The wave may grow. That is what waves do.', rw: 'Umuraba ushobora gukura. Ni ko imiraba imera.' },
    { en: 'Stay on top of it. Breathe.', rw: 'Guma hejuru yawo. Humeka.' },
    { en: 'Notice: it changes. It is not the same as a minute ago.', rw: 'Bibone: birahinduka. Ntibikimeze nk\'uko byari bimeze mu munota ushize.' },
    { en: 'A thought may say "go on". It is only a thought.', rw: 'Igitekerezo gishobora kuvuga ngo "komeza". Ni igitekerezo gusa.' },
    { en: 'You are still here. You have not obeyed it.', rw: 'Uracyari hano. Ntiwaryumviye.' },
    { en: 'Let it pass at its own speed.', rw: 'Reka rihite ku muvuduko waryo.' },
    { en: 'You did not fight. You stayed. That is the skill.', rw: 'Ntiwarwanye. Wagumyeho. Ubwo ni bwo bushobozi.', check: true }
  ];

  /* ---------- Movement guide: one step every 15 seconds ---------- */
  C.move = [
    { en: 'Stand up.', rw: 'Haguruka.' },
    { en: 'Walk to the door, or to another room.', rw: 'Genda ugere ku muryango, cyangwa mu kindi cyumba.' },
    { en: 'Shake out your hands and arms.', rw: 'Zunguza ibiganza n\'amaboko.' },
    { en: 'March on the spot. Knees high.', rw: 'Tambuka uhagaze hamwe. Zamura amavi.', check: true },
    { en: 'Reach both arms up. Breathe in.', rw: 'Zamura amaboko yombi. Injiza umwuka.' },
    { en: 'Sit down and stand up, ten times, slowly.', rw: 'Icara uhaguruke, inshuro icumi, buhoro.' },
    { en: 'Roll your shoulders back.', rw: 'Zengurutsa intugu uzisubiza inyuma.', check: true },
    { en: 'Drink a glass of water if you can.', rw: 'Nywa ikirahure cy\'amazi niba bishoboka.' }
  ];

  /* ---------- One change of setting, offered at the end ---------- */
  C.setting = [
    { en: 'Leave the room.', rw: 'Sohoka mu cyumba.' },
    { en: 'Put the phone in another room.', rw: 'Shyira telefoni mu kindi cyumba.' },
    { en: 'Go where other people are.', rw: 'Jya aho abandi bantu bari.' },
    { en: 'Step outside for air.', rw: 'Sohoka ufate akayaga.' },
    { en: 'Wash your face with cold water.', rw: 'Karaba mu maso n\'amazi akonje.' }
  ];

  /* ---------- Example if-then plans (solitary and social moments) ---------- */
  C.planExamples = [
    { i: { en: 'I am in bed with my phone after 22:00', rw: 'ndi mu buriri mfite telefoni nyuma ya saa yine z\'ijoro' },
      t: { en: 'put it on the far side of the room', rw: 'nyishyira kure mu cyumba' } },
    { i: { en: 'I feel lonely in the evening', rw: 'numva mfite irungu nimugoroba' },
      t: { en: 'call or message a friend', rw: 'mpamagara cyangwa nandikira inshuti' } },
    { i: { en: 'a chat starts to turn flirty', rw: 'ikiganiro gitangiye kujya mu by\'urukundo', check: true },
      t: { en: 'end it and put the phone down', rw: 'ndagisoza ngashyira telefoni hasi' } },
    { i: { en: 'I am stressed after work', rw: 'mpangayitse nyuma y\'akazi' },
      t: { en: 'walk for ten minutes before going home', rw: 'ngenda n\'amaguru iminota icumi mbere yo gutaha' } },
    { i: { en: 'I am alone and bored', rw: 'ndi jyenyine kandi ndarambiwe' },
      t: { en: 'open this page first', rw: 'mbanza gufungura uru rubuga' } }
  ];

  /* ---------- Lessons ---------- */
  C.lessons = [
    {
      title: { en: 'How urges rise and fall', rw: 'Uko irari rizamuka rikamanuka' },
      body: {
        en: [
          'An urge often starts with a thought that arrives by itself: a picture, a memory, something you saw. You did not choose it, and it says nothing bad about you.',
          'It grows when the mind starts to picture it. The more detail you imagine, the stronger it feels. This is how all cravings work, not only this one.',
          'So an urge is like a wave. It rises, it reaches a top, and it falls. It can feel as if it will last until you give in. It will not.',
          'Nobody can promise how many minutes it takes. But when you stop feeding it with pictures, it gets weaker.',
          'That is why this page gives your eyes and hands something else to do. Not to run away, but to give the wave time to pass.'
        ],
        rw: [
          'Akenshi irari ritangirana n\'igitekerezo kiza cyonyine: ishusho, urwibutso, ikintu wabonye. Ntabwo wagihisemo, kandi ntibivuze ko uri mubi.',
          'Rirakura iyo ubwenge butangiye kubishushanya. Uko ubitekereza mu buryo burambuye, ni ko rikomera. Uko ni ko irari ryose rikora, si iri gusa.',
          'Irari rero ni nk\'umuraba. Rirazamuka, rikagera hejuru, hanyuma rikamanuka. Ushobora kumva ko rizakomeza kugeza urikurikije. Si ko biri.',
          'Nta wagusezeranya iminota bizafata. Ariko iyo uretse kurigaburira amashusho, riracika intege.',
          'Ni yo mpamvu uru rubuga ruha amaso n\'intoki byawe ikindi cyo gukora. Si uguhunga, ni uguha umuraba umwanya wo guhita.'
        ]
      },
      check: true, refs: [1, 3]
    },
    {
      title: { en: 'Common triggers', rw: 'Ibikunze kubyutsa irari' },
      body: {
        en: [
          'Urges rarely come from nowhere. They follow certain moments.',
          'People often name these: being tired, lonely, stressed or bored, and being alone with a phone late at night. For some it is a place, a person, or a conversation that starts to change direction.',
          'Your own list may be different. Think of the last two or three times. What was happening just before? Where were you? How did you feel?',
          'You do not need to keep a diary. You only need to know your two or three moments.',
          'Once you know them, you can prepare. Go to My plan and write one if-then plan for each.'
        ],
        rw: [
          'Irari ntirikunze kuza nta mpamvu. Rikurikira ibihe runaka.',
          'Abantu bakunze kuvuga ibi: umunaniro, irungu, guhangayika, kurambirwa, no kuba wenyine ufite telefoni mu ijoro. Kuri bamwe ni ahantu, umuntu, cyangwa ikiganiro gitangiye guhindura icyerekezo.',
          'Urutonde rwawe rushobora kuba rutandukanye. Tekereza ku nshuro ebyiri cyangwa eshatu ziheruka. Ni iki cyabaga mbere gato? Wari he? Wumvaga umeze ute?',
          'Ntukeneye kwandika buri kintu. Ukeneye gusa kumenya ibihe byawe bibiri cyangwa bitatu.',
          'Iyo ubimenye, ushobora kwitegura. Jya kuri Gahunda yanjye wandike gahunda imwe ya "niba… noneho…" kuri buri gihe.'
        ]
      },
      check: true, refs: [1, 8]
    },
    {
      title: { en: 'Why fighting a thought makes it louder', rw: 'Impamvu kurwanya igitekerezo bituma gikomera' },
      body: {
        en: [
          'Try not to think of a white bear for one minute. Most people think of it again and again. Researchers tested this, and found the thought can even come back stronger afterwards.',
          'The same can happen with an urge. Telling yourself "stop thinking about it" keeps it in the middle of your mind.',
          'What works better is to turn toward something else. Not "do not think of that", but "look at this".',
          'Or let the thought be there without doing what it says. A thought is not an order.',
          'So when an urge comes: do not argue with it, do not wrestle it. Name it, "this is an urge", and move your attention.'
        ],
        rw: [
          'Gerageza kumara umunota umwe udatekereza ku idubu ry\'umweru. Abantu benshi baritekereza kenshi. Abashakashatsi barabigerageje, basanga icyo gitekerezo gishobora kugaruka gifite imbaraga kurushaho.',
          'Ni ko bishobora kugenda no ku irari. Kwibwira ngo "reka kubitekereza" bituma biguma hagati mu bwenge.',
          'Igifasha kurushaho ni uguhindukirira ikindi kintu. Si "ntutekereze kuri kiriya", ahubwo ni "reba iki".',
          'Cyangwa ukareka igitekerezo kikaba gihari, ariko ntukore icyo kivuga. Igitekerezo si itegeko.',
          'Irari nirije rero: ntujye impaka na ryo, ntukirane na ryo. Ryite izina, uti "iri ni irari", maze wimure ibitekerezo byawe.'
        ]
      },
      check: true, refs: [4, 5]
    },
    {
      title: { en: 'Change your surroundings', rw: 'Hindura aho uri' },
      body: {
        en: [
          'People who seem to have strong self-control often simply meet fewer temptations. They arrange things in advance.',
          'It is easier to change the place than to win a fight in your head.',
          'Steps many people use: charge your phone outside the bedroom. Do not scroll in bed. Turn on a content filter. Keep the door open when you are alone with a screen.',
          'If a conversation or a meeting is heading somewhere you do not want, leave early. Earlier is always easier.',
          'Pick one change this week. A small change that you keep is worth more than a big one you drop.'
        ],
        rw: [
          'Abantu basa n\'abafite kwifata gukomeye, akenshi ni uko bahura n\'ibishuko bike. Bategura ibintu mbere.',
          'Guhindura ahantu biroroha kuruta gutsinda intambara mu mutwe.',
          'Intambwe abantu benshi bakoresha: shyira telefoni ku muriro hanze y\'icyumba uryamamo. Ntukayikoreshe uri mu buriri. Shyiraho akayunguruzo k\'ibyo ureba kuri interineti. Reka umuryango ufunguye iyo uri wenyine imbere ya ekara.',
          'Niba ikiganiro cyangwa guhura n\'umuntu bigana aho udashaka, genda hakiri kare. Kare buri gihe biroroha.',
          'Hitamo impinduka imwe muri iki cyumweru. Impinduka nto ukomeza iruta inini ureka.'
        ]
      },
      check: true, refs: [14]
    },
    {
      title: { en: 'After a slip', rw: 'Nyuma yo kugwa' },
      body: {
        en: [
          'A slip is one event. It is not who you are, and it does not erase what you built.',
          'The most dangerous thought after a slip is "I have ruined it, so it no longer matters". Researchers who study relapse found that this thought, and the shame behind it, is what turns one slip into many.',
          'So speak to yourself the way you would to a friend you respect. Firm, and kind.',
          'Ask one question: what was happening just before? That is your trigger. Write one if-then plan for it.',
          'Then do the next right thing, today. Not tomorrow, not Monday.',
          'If slips keep coming for months and it is hurting your life, that is a reason to talk to someone. See Get help.'
        ],
        rw: [
          'Kugwa ni ikintu kimwe cyabaye. Si cyo uri cyo, kandi ntibisiba ibyo wubatse.',
          'Igitekerezo kibi kurusha ibindi nyuma yo kugwa ni iki: "Nabyangije, ubu nta cyo bikimaze". Abashakashatsi basanze icyo gitekerezo, n\'ikimwaro kiri inyuma yacyo, ari byo bituma kugwa rimwe bihinduka kenshi.',
          'Ivugishe rero nk\'uko wavugisha inshuti wubaha. Ukomeye, ariko ufite impuhwe.',
          'Ibaze ikibazo kimwe: ni iki cyabaga mbere gato? Icyo ni cyo kikubyutsa irari. Cyandikire gahunda imwe ya "niba… noneho…".',
          'Hanyuma ukore igikwiye gikurikira, uyu munsi. Si ejo, si ku wa mbere.',
          'Niba kugwa bikomeje amezi menshi kandi byangiza ubuzima bwawe, iyo ni impamvu yo kuvugana n\'umuntu. Reba Shaka ubufasha.'
        ]
      },
      check: true, refs: [17]
    },
    {
      title: { en: 'What is known, and what is not', rw: 'Ibizwi n\'ibitazwi' },
      body: {
        en: [
          'This page uses tools from psychology research. Here is what that research does and does not show.',
          'A visual game: in one study, 3 minutes of a block-fitting game made cravings about one fifth weaker in daily life. The study was small and mixed many kinds of craving.',
          'Riding the wave: in a study with smokers it did not make urges smaller, but people smoked less in the days after.',
          'If-then plans: many studies show a small, reliable help in reaching goals.',
          'Most of this research was about food, alcohol and smoking, not sexual urges. Using it here is a reasonable step, not a proven one.',
          'This page is a self-help tool. It is not treatment, and it cannot promise that an urge will disappear.',
          'The Reminders are values, not science.'
        ],
        rw: [
          'Uru rubuga rukoresha uburyo buva mu bushakashatsi ku mitekerereze y\'abantu. Dore icyo ubwo bushakashatsi bwerekana n\'icyo buterekana.',
          'Umukino w\'amaso: mu bushakashatsi bumwe, iminota 3 y\'umukino wo gupanga ibishushanyo yagabanyije imbaraga z\'irari hafi kimwe cya gatanu mu buzima busanzwe. Ubwo bushakashatsi bwari buto kandi bwavanze amoko menshi y\'irari.',
          'Kugendera ku muraba: mu bushakashatsi ku banywa itabi ntibyagabanyije irari, ariko abantu banyoye itabi rike mu minsi yakurikiyeho.',
          'Gahunda za "niba… noneho…": ubushakashatsi bwinshi bwerekana ko zifasha gato, ariko mu buryo bwizewe, kugera ku ntego.',
          'Ubwinshi muri ubu bushakashatsi bwari ku biryo, inzoga n\'itabi, si ku irari ry\'umubiri. Kubukoresha hano birumvikana, ariko ntibiremezwa.',
          'Uru rubuga ni igikoresho cyo kwifasha. Si ubuvuzi, kandi ntirushobora gusezeranya ko irari rizashira.',
          'Inyibutsa ni indangagaciro, si siyansi.'
        ]
      },
      check: true, refs: [6, 8, 15, 16]
    }
  ];

  /* ---------- "Why this?" lines: every tool links to a study ---------- */
  C.whyTool = {
    game: { en: 'In a study in daily life, 3 minutes of a visual block game made cravings about one fifth weaker. A visual task uses the same mental space as the pictures that feed an urge.', rw: 'Mu bushakashatsi bwakozwe mu buzima busanzwe, iminota 3 y\'umukino w\'amaso yagabanyije irari hafi kimwe cya gatanu. Umukino w\'amaso ukoresha umwanya wo mu bwenge umwe n\'uw\'amashusho agaburira irari.', check: true, refs: [6, 1] },
    wave: { en: 'In a study with smokers, riding the urge did not make it smaller, but people acted on it less in the following week.', rw: 'Mu bushakashatsi ku banywa itabi, kugendera ku irari ntibyarigabanyije, ariko abantu bararikurikije gake mu cyumweru cyakurikiyeho.', check: true, refs: [8] },
    move: { en: 'Short bouts of movement reduced cigarette craving across many studies. It has not been tested on sexual urges.', rw: 'Imyitozo migufi y\'umubiri yagabanyije irari ry\'itabi mu bushakashatsi bwinshi. Ntibirageragezwa ku irari ry\'umubiri.', check: true, refs: [13] },
    plan: { en: 'Deciding in advance, "if X, then I do Y", gives a small, reliable help in reaching goals across many studies.', rw: 'Gufata icyemezo mbere, "niba X, noneho nkora Y", bifasha gato ariko mu buryo bwizewe kugera ku ntego, nk\'uko ubushakashatsi bwinshi bubyerekana.', check: true, refs: [15, 16] },
    setting: { en: 'Changing the situation works earlier, and more easily, than resisting by willpower.', rw: 'Guhindura aho uri bikora kare, kandi byoroshye, kuruta kwihangana ku mbaraga gusa.', check: true, refs: [14] },
    thoughts: { en: 'Cognitive therapy for addictions teaches people to spot "permission-giving" thoughts and treat them as thoughts, not facts.', rw: 'Ubuvuzi bushingiye ku mitekerereze bwigisha abantu kumenya ibitekerezo "bitanga uruhushya" no kubifata nk\'ibitekerezo, atari ukuri.', check: true, refs: [22] }
  };

  /* ---------- Sources shown on the page (numbers match research/REPORT.md) ---------- */
  C.sources = {
    1: { t: 'Kavanagh, Andrade & May (2005). The elaborated intrusion theory of desire.', u: 'https://eprints.whiterose.ac.uk/id/eprint/509/' },
    3: { t: 'No primary study found for how many minutes an urge lasts. See the research report, section 1.2.', u: 'research/REPORT.md' },
    4: { t: 'Wegner et al. (1987), white bear study, summarised by the APA.', u: 'https://www.apa.org/monitor/2011/10/unwanted-thoughts' },
    5: { t: 'Erskine, Georgiou & Kvavilashvili (2010). I suppress, therefore I smoke.', u: 'https://uhra.herts.ac.uk/handle/2299/16612' },
    6: { t: 'Skorka-Brown, Andrade, Whalley & May (2015). Playing Tetris decreases drug and other cravings in real world settings.', u: 'https://pearl.plymouth.ac.uk/psy-research/49' },
    8: { t: 'Bowen & Marlatt (2009). Surfing the urge.', u: 'https://pubmed.ncbi.nlm.nih.gov/20025372/' },
    13: { t: 'Haasova et al. (2013). The acute effects of physical activity on cigarette cravings.', u: 'https://researchportal.plymouth.ac.uk/en/publications/the-acute-effects-of-physical-activity-on-cigarette-cravings-syst-2/' },
    14: { t: 'Duckworth, Gendler & Gross (2016). Situational strategies for self-control.', u: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4736542/' },
    15: { t: 'Gollwitzer & Sheeran (2006). Implementation intentions and goal achievement.', u: 'https://kops.uni-konstanz.de/entities/publication/2e749bfb-8533-437c-8203-7e788c910c5f' },
    16: { t: 'Later, larger analysis found a smaller effect. See the research report, section 3.1.', u: 'research/REPORT.md' },
    17: { t: 'Relapse prevention research on the "abstinence violation effect". See the research report, section 3.5.', u: 'research/REPORT.md' },
    18: { t: 'World Health Organization, ICD-11, 6C72 Compulsive sexual behaviour disorder.', u: 'https://icd.who.int/browse/2024-01/mms/en#1630268048' },
    22: { t: 'Beck Institute. Treating substance misuse disorders with CBT.', u: 'https://beckinstitute.org/blog/treating-substance-misuse-disorders-with-cbt/' }
  };

  /* ---------- Get help ---------- */
  C.help = {
    intro: { en: 'This page is a self-help tool. Sometimes that is not enough, and that is not a weakness.', rw: 'Uru rubuga ni igikoresho cyo kwifasha. Rimwe na rimwe ntibihagije, kandi ibyo si intege nke.', check: true },
    whenTitle: { en: 'Talk to a professional if', rw: 'Vugana n\'inzobere niba', check: true },
    when: [
      { en: 'it has felt out of control for months, and trying to change has not worked', rw: 'bimaze amezi byarakurenze, kandi kugerageza guhinduka nta cyo byatanze', check: true },
      { en: 'it continues although it harms your relationship, work, health, money or safety', rw: 'bikomeza nubwo byangiza umubano wawe, akazi, ubuzima, amafaranga cyangwa umutekano', check: true },
      { en: 'it continues although it gives you little or no satisfaction', rw: 'bikomeza nubwo nta byishimo bikiguha', check: true },
      { en: 'it comes with heavy sadness, anxiety, or heavy drinking or drug use', rw: 'bijyana n\'agahinda kenshi, guhangayika, cyangwa kunywa inzoga nyinshi cyangwa ibiyobyabwenge', check: true }
    ],
    urgentTitle: { en: 'Get help today if', rw: 'Shaka ubufasha uyu munsi niba', check: true },
    urgent: [
      { en: 'you have thoughts of harming yourself or ending your life', rw: 'ufite ibitekerezo byo kwigirira nabi cyangwa kwiyambura ubuzima', check: true },
      { en: 'you feel an urge toward anything that would harm another person, or that involves someone who does not or cannot agree, or a child', rw: 'wumva ushaka gukora ikintu cyababaza undi muntu, cyangwa kireba umuntu utabyemeye cyangwa udashobora kubyemera, cyangwa umwana', check: true }
    ],
    moral: { en: 'Feeling torn between what you do and what you believe is real pain, and it is common. It does not mean something is wrong with you. A counsellor, or a trusted faith leader who does not shame, can help.', rw: 'Kumva utandukanyijwe n\'ibyo ukora n\'ibyo wemera ni ububabare nyabwo, kandi burasanzwe. Ntibivuze ko hari ikibi kuri wowe. Umujyanama, cyangwa umuyobozi w\'idini wizeye utagutera ikimwaro, ashobora kugufasha.', check: true, refs: [18] },
    talkTitle: { en: 'How to talk to someone you trust', rw: 'Uko wavugana n\'umuntu wizeye' },
    talk: [
      { en: 'Choose one person who keeps things private and does not shame: a friend, your partner, a faith leader, a counsellor.', rw: 'Hitamo umuntu umwe ubika ibanga kandi udatera ikimwaro: inshuti, umukunzi wawe, umuyobozi w\'idini, umujyanama.', check: true },
      { en: 'Pick a calm time. Not in the middle of an argument, and not late at night.', rw: 'Hitamo igihe gituje. Si hagati mu ntonganya, si no mu gicuku.', check: true },
      { en: 'You can start with: "There is something I am working on, and I would like your support."', rw: 'Ushobora gutangira uti: "Hari ikintu ndimo gukoraho, kandi nifuza ko unshyigikira."', check: true },
      { en: 'Say what you need. For example: "Can I message you when it gets hard?"', rw: 'Vuga icyo ukeneye. Urugero: "Nshobora kukwandikira igihe bigoye?"', check: true },
      { en: 'You do not have to tell every detail. Saying it out loud to one person is already a step.', rw: 'Ntugomba kuvuga buri kantu. Kubivuga mu ijwi ku muntu umwe ni intambwe.', check: true }
    ],
    rwandaTitle: { en: 'In Rwanda', rw: 'Mu Rwanda' },
    rwanda: [
      { en: 'Rwanda Biomedical Centre call centre: 114 (listed as toll-free). [VERIFY: call this number and confirm what it offers before publishing.]', rw: 'Ikigo cy\'Igihugu cy\'Ubuzima (RBC), umurongo wa telefoni: 114 (bivugwa ko utishyurwa). [VERIFY]', verify: true, check: true },
      { en: 'Your nearest health centre or district hospital can refer you to mental health services. [VERIFY]', rw: 'Ikigo nderabuzima cyangwa ibitaro by\'akarere bikwegereye bishobora kukohereza kuri serivisi z\'ubuzima bwo mu mutwe. [VERIFY]', verify: true, check: true }
    ],
    elsewhere: { en: 'Elsewhere: a doctor, a licensed counsellor or psychologist, or your local emergency number.', rw: 'Ahandi: muganga, umujyanama cyangwa inzobere mu mitekerereze yemewe, cyangwa nimero y\'ubutabazi bwihuse y\'aho uri.', check: true }
  };

  /* ---------- False thoughts: the lie, and the truth behind it ---------- */
  C.thoughts = [
    { t: { en: 'Just once won\'t matter.', rw: 'Rimwe gusa nta cyo bitwaye.' }, a: { en: 'Once is how it always starts. This one counts.', rw: 'Byose bitangira ari rimwe. Iri na ryo rirabarwa.' }, check: true },
    { t: { en: 'Nobody will know.', rw: 'Nta wuzabimenya.' }, a: { en: 'I will know. That is enough.', rw: 'Jyewe nzabimenya. Birahagije.' } },
    { t: { en: 'I deserve this after today.', rw: 'Nyuma y\'uyu munsi, ndabikwiye.' }, a: { en: 'I deserve something good. This is not it.', rw: 'Nkwiye ikintu cyiza. Iki si cyo.' }, check: true },
    { t: { en: 'I\'ll start tomorrow.', rw: 'Nzatangira ejo.' }, a: { en: 'Tomorrow will say the same. I start now.', rw: 'Ejo na ho hazavuga gutyo. Ntangiye ubu.' }, check: true },
    { t: { en: 'I can\'t fight this.', rw: 'Sinshobora kubirwanya.' }, a: { en: 'I don\'t have to fight it. I only have to let it pass.', rw: 'Singomba kubirwanya. Ngomba gusa kureka bigahita.' }, check: true },
    { t: { en: 'It\'s only looking.', rw: 'Ni ukureba gusa.' }, a: { en: 'Looking is where it begins. I can look away.', rw: 'Kureba ni ho bitangirira. Nshobora kureba ahandi.' } },
    { t: { en: 'I\'ve already slipped, so it doesn\'t matter now.', rw: 'Namaze kugwa, ubu nta cyo bikimaze.' }, a: { en: 'One slip is one slip. The next choice is still mine.', rw: 'Kugwa rimwe ni rimwe. Amahitamo akurikira aracyari ayanjye.' }, check: true },
    { t: { en: 'This urge won\'t go away until I give in.', rw: 'Iri rari ntirizashira ntarikurikije.' }, a: { en: 'Urges rise and fall. This one will too.', rw: 'Irari rirazamuka rikamanuka. N\'iri ni ko bizagenda.' }, check: true },
    { t: { en: 'Everyone does it.', rw: 'Abantu bose barabikora.' }, a: { en: 'Maybe. I chose something else.', rw: 'Birashoboka. Jyewe nahisemo ikindi.' } },
    { t: { en: 'It\'s not hurting anyone.', rw: 'Nta we bibabaza.' }, a: { en: 'It moves me away from who I want to be.', rw: 'Bintandukanya n\'uwo nshaka kuba we.' }, check: true },
    { t: { en: 'I need this to relax.', rw: 'Ndabikeneye kugira ngo nduhuke.' }, a: { en: 'There are other ways to rest. This one costs me tomorrow.', rw: 'Hari ubundi buryo bwo kuruhuka. Ubu bwo buzanyishyuza ejo.' }, check: true },
    { t: { en: 'This time is different.', rw: 'Ubu bwo biratandukanye.' }, a: { en: 'It says that every time.', rw: 'Ni ko bivuga buri gihe.' }, check: true },
    { t: { en: 'Just five minutes.', rw: 'Iminota itanu gusa.' }, a: { en: 'Five minutes is all I need to let it pass instead.', rw: 'Iminota itanu ni yo nkeneye ngo bihite.' }, check: true },
    { t: { en: 'My partner would never find out.', rw: 'Umukunzi wanjye ntazigera abimenya.' }, a: { en: 'Trust is built from what happens unseen.', rw: 'Icyizere cyubakwa n\'ibikorwa bitaboneka.' }, check: true, partner: true },
    { t: { en: 'I\'m too stressed to resist.', rw: 'Ndahangayitse cyane, sinabasha kwihangana.' }, a: { en: 'The stress is real. This will not take it away.', rw: 'Guhangayika ni ukuri. Ariko ibi ntibizabikuraho.' }, check: true },
    { t: { en: 'I\'m lonely, and this will help.', rw: 'Mfite irungu, ibi biramfasha.' }, a: { en: 'It fills a minute and leaves the loneliness. I can reach a real person.', rw: 'Byuzuza umunota umwe, irungu rigasigara. Nshobora kuvugisha umuntu nyawe.' }, check: true },
    { t: { en: 'I\'ve done well for so long. I\'ve earned it.', rw: 'Maze igihe kirekire nitwara neza. Ndabikwiye.' }, a: { en: 'The reward for keeping my word is being someone who keeps it.', rw: 'Igihembo cyo kubahiriza ijambo ni ukuba umuntu uryubahiriza.' }, check: true },
    { t: { en: 'This is just who I am.', rw: 'Uku ni ko nteye.' }, a: { en: 'A thought is not who I am. What I choose is.', rw: 'Igitekerezo si jyewe. Icyo mpisemo ni cyo jyewe.' }, check: true },
    { t: { en: 'I\'ll stop before it goes too far.', rw: 'Nzahagarara bitararenga.' }, a: { en: 'The easiest place to stop is here.', rw: 'Aho guhagarara byoroshye ni hano.' }, check: true },
    { t: { en: 'It\'s natural, so why resist?', rw: 'Ni kamere, kuki nabirwanya?' }, a: { en: 'The feeling is natural. What I do with it is my choice.', rw: 'Ibyiyumvo ni kamere. Icyo mbikoresha ni amahitamo yanjye.' }, check: true }
  ];

  /* ---------- Reminders ("truth lines"). The first three are the owner's own. ---------- */
  C.reminders = [
    { own: true, en: 'There are thousands like that, but none is like your partner.', rw: 'Abameze batyo ni ibihumbi, ariko nta n\'umwe umeze nk\'umukunzi wawe.',
      single: { en: 'There are thousands like that, but none is like the one you\'re waiting for.', rw: 'Abameze batyo ni ibihumbi, ariko nta n\'umwe umeze nk\'uwo utegereje.' }, check: true },
    { own: true, en: 'Wandering eyes are cheap eyes.', rw: 'Amaso azerera ni amaso ahendutse.', check: true },
    { own: true, en: 'There\'s nothing unique in wanting more people. Self-love is gold.', rw: 'Kwifuza abantu benshi nta gishya kirimo. Kwikunda ni zahabu.', check: true },

    { en: 'Anyone can want. Few can choose.', rw: 'Kwifuza bishoborwa na bose. Guhitamo bishoborwa na bake.', check: true },
    { en: 'A promise kept in the dark is worth the most.', rw: 'Isezerano ryubahirijwe mu ibanga ni ryo rifite agaciro kanini.', check: true },
    { en: 'What is easy to get is easy to forget.', rw: 'Ikiboneka vuba cyibagirana vuba.', check: true },
    { en: 'The urge shouts. Your word stands.', rw: 'Irari rirasakuza. Ijambo ryawe rirahagarara.', check: true },
    { en: 'One person, fully, is worth more than many, halfway.', rw: 'Umuntu umwe wuzuye aruta benshi b\'igice.', check: true },
    { en: 'Chasing is common. Staying is rare.', rw: 'Kwiruka inyuma y\'abantu birasanzwe. Kuguma ni gake.', check: true },
    { en: 'A glance costs nothing. A second look has a price.', rw: 'Kureba rimwe nta cyo bitwara. Kongera kureba bifite igiciro.', check: true },
    { en: 'Loyalty is not a cage. It is a choice made again.', rw: 'Ubudahemuka si akazu. Ni amahitamo usubiramo.', check: true },
    { en: 'The urge offers minutes. Your choice builds years.', rw: 'Irari ritanga iminota. Amahitamo yawe yubaka imyaka.', check: true },
    { en: 'What you protect grows in value.', rw: 'Icyo urinda kiyongera agaciro.', check: true },
    { en: 'Nobody is watching. That is exactly when it counts.', rw: 'Nta wukureba. Ni bwo bifite agaciro nyako.', check: true },
    { en: 'Hunger for more never says "enough".', rw: 'Inzara yo gushaka ibindi ntijya ivuga ngo "birahagije".', check: true },
    { en: 'Being trusted is worth more than being thrilled.', rw: 'Kwizerwa biruta gushimishwa akanya gato.', check: true },
    { en: 'A calm mind is a rich house.', rw: 'Umutima utuje ni inzu ikize.', check: true },
    { en: 'A treasure is something you guard.', rw: 'Ubutunzi ni ikintu urinda.', check: true },
    { en: 'You are not the urge. You are the one who decides.', rw: 'Nturi irari. Uri ufata icyemezo.', check: true },
    { en: 'Cheap thrills come with a long bill.', rw: 'Ibyishimo bihendutse bizana umwenda muremure.', check: true },
    { en: 'Depth beats number.', rw: 'Ubujyakuzimu buruta umubare.', check: true },
    { en: 'The strongest "no" is quiet.', rw: '"Oya" ikomeye kurusha izindi ni ituje.', check: true },
    { en: 'What you walk past today thanks you tomorrow.', rw: 'Icyo wirengagije uyu munsi kizagushimira ejo.', check: true },
    { en: 'Respect for yourself is not for sale.', rw: 'Kwiyubaha ntibigurishwa.', check: true },
    { en: 'Attention is love. Spend it at home.', rw: 'Kwita ku muntu ni urukundo. Bikoreshe iwawe.', check: true, partner: true },
    { en: 'A wave is loud, and then it is gone.', rw: 'Umuraba urasakuza, hanyuma ukagenda.', check: true },
    { en: 'Keep your word to yourself first.', rw: 'Banza wubahirize ijambo wihaye.', check: true },
    { en: 'New is not better. New is only new.', rw: 'Igishya si cyo cyiza. Igishya ni gishya gusa.', check: true },
    { en: 'Faithfulness is built in small moments like this one.', rw: 'Ubudahemuka bwubakwa mu tuntu duto nk\'aka kanya.', check: true },
    { en: 'Wanting is not needing.', rw: 'Kwifuza si ugukenera.' },
    { en: 'The eyes can pass. The heart can stay.', rw: 'Amaso ashobora guhita. Umutima ushobora kuguma.', check: true },
    { en: 'Peace tonight is worth more than a thrill now.', rw: 'Amahoro y\'iri joro aruta ibyishimo by\'akanya.', check: true },
    { en: 'You have passed this way before, and you came through.', rw: 'Wanyuze aha mbere, kandi warahavuye.', check: true }
  ];

  root.CONTENT = C;
  if (typeof module !== 'undefined' && module.exports) module.exports = C;
})(typeof window !== 'undefined' ? window : globalThis);
