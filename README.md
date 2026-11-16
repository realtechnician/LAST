# Komera

A free, private web page that helps a person get through a strong sexual urge in about 5 minutes, and build steadier self-control over time. English and Kinyarwanda. No account, no tracking, works offline.

"Komera" means "be strong".

It is a self-help tool, not treatment.

## What is in this folder

You do not need to install anything. The page is plain HTML, CSS and JavaScript.

| File or folder | What it does |
|---|---|
| `index.html` | The page itself. It is almost empty: it loads the files below. |
| `css/style.css` | All colours, sizes and layout. Also the simple 2D gate and void used on slow phones. |
| `js/content.js` | **Every word on the page**, in English and Kinyarwanda: buttons, lessons, false thoughts, reminders, help text. Edit words here. |
| `js/app.js` | The main program: the screens, the 5-minute rescue, My plan, settings, sound. |
| `js/journey.js` | The walk through the void: the torch, the path, the threads of false thoughts, the lanterns. |
| `js/games.js` | The three games and the "ride the wave" breathing scene. |
| `js/scene3d.js` | The 3D gate and the 3D void. |
| `vendor/three.module.min.js` | Three.js, the 3D library, kept as a local file so the page needs no other website. Its licence is `vendor/THREE-LICENSE`. |
| `sw.js` | The "service worker". It keeps a copy of the page on the phone so it opens without internet. |
| `manifest.webmanifest`, `icon.svg` | Let people add the page to their home screen like an app. |
| `.nojekyll` | An empty file that tells GitHub Pages to publish the files exactly as they are. Do not delete it. |
| `research/REPORT.md` | The research report, with sources. |
| `research/PAGE_CONTENT.md`, `FALSE_THOUGHTS.md`, `REMINDERS.md` | The page's texts in readable form. These three are **made automatically** from `js/content.js`. |
| `tools/make-research-md.js` | The small script that makes those three files. |

## Before you publish: three checks

1. **Kinyarwanda.** It was written without a native speaker. In `js/content.js`, every line with `check: true` needs to be read and corrected by someone fluent. The same lines are marked `[CHECK]` in the `research/` files. When a line is right, delete its `check: true`.
2. **Helpline.** The Get help screen shows the number 114 with the word `[VERIFY]`. Call it and confirm what it offers. Then, in `js/content.js`, find `rwanda:` and remove `[VERIFY]` from the text, or remove the line. Publish only a number you have confirmed yourself.
3. **Research.** `research/REPORT.md` ends with a short table of facts marked `[VERIFY]`.

## How to publish it on GitHub Pages

1. Put these files in a GitHub repository (they are already in this one).
2. On GitHub, open the repository and go to **Settings**, then **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the branch that holds these files (for example `main`) and the folder **/ (root)**. Press **Save**.
5. Wait about a minute. The page address appears at the top of the same screen. It looks like `https://YOUR-NAME.github.io/REPOSITORY-NAME/`.

To go straight into the rescue, add `#rescue` to the address: `https://YOUR-NAME.github.io/REPOSITORY-NAME/#rescue`.

## How to change something

**Change words:** edit `js/content.js`. Each text has an `en` (English) and an `rw` (Kinyarwanda) version. If you have Node.js, run `node tools/make-research-md.js` afterwards so the `research/` files match.

**After any change:** open `sw.js` and change `komera-v1` to `komera-v2` (then `v3`, and so on). Phones that already saved the page will then fetch the new version.

**Add a reminder:** in `js/content.js`, find `C.reminders` and add a line like the others.

## How to try it on your own computer

The page must be opened through a small web server (opening `index.html` by double-click will not work, because browsers block some features for files).

If you have Python:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

Useful address endings for testing:

| Ending | What it does |
|---|---|
| `?simple` | Forces the simple 2D scene. |
| `?slow` | Pretends the phone is too slow, to see the automatic switch to the simple scene. |
| `?test` | Makes every activity 8 seconds long, so you can click through quickly. |
| `#rescue` | Opens straight into the rescue. |

## Privacy, exactly

- The page makes no network requests after it has loaded. There are no analytics, no cookies and no fonts or scripts from other websites.
- It saves one item in the phone's browser storage, called `komera.v1`. It holds the plan (up to three if-then plans and one "why" line) and the settings. Nothing else.
- It keeps no history, counts, streaks or logs. Urge ratings are used for the next step and then forgotten.
- "Delete everything saved" (in My plan and in Settings) removes that item in one tap.
- Links to studies open the study's own website. That is the only way anything leaves the page, and only when the person taps a link.

## What was tested

Tested in a phone-sized browser window (360 × 740) with an automated script:

- "Rescue now" can be used well under 2 seconds after opening.
- Mild path (wave), strong path (each of the three games), the second round, and the movement guide.
- My plan: add, edit, delete, the "why" line, and that both appear at the end of a rescue.
- One-tap language switch, lessons with sources, Get help, Practice, Settings, and one-tap delete.
- The walk: opening the gate by holding, lighting the path, showing and cutting all three threads, lanterns.
- Reduced motion (still scenes), the slow-phone switch from 3D to 2D, and working offline.
- No request leaves the site, and no cookies are set.

Not tested: a real low-cost Android phone. The automatic switch to the simple scene is based on measured speed, but please try the page on a real phone before sharing it widely.
