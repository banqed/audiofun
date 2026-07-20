# CLIPDECK
*(working name — rename pending)*

A groovebox that lives in one HTML file. Record your desktop or mic, slice it, sequence it,
add synth voices, run it through hand-rolled DSP effects, and export — entirely in the browser.
No install, no accounts, no server, no build step. **`index.html` is the whole application.**

- 8 channels: **1–4 CLIP** (slice sampler) · **5–8 VOIC** (synth model host: 4-op FM + Plaits-derived analog/swarm)
- Elektron-style sequencer: 32 steps, per-channel length (polymeter), retrigs, conditions, swing, **parameter locks** — including per-step **model locks**
- Two FX slots per channel from a palette of custom AudioWorklet DSP: **HEAT** (comp/drive), **FLTR** (morphing SVF), **DELY** (character delay), **VERB** (7-algorithm reverb incl. granular)
- Master bus (comp + limiter), WAV export, project save/load, everything persists locally (IndexedDB)

## Requirements
**Chrome or Edge, desktop.** (Uses `getDisplayMedia` tab-audio capture and AudioWorklet.)
Firefox/Safari are untested and unsupported for capture.

## Run it locally
The app must be served over **http(s) — not opened as a `file://`** (screen capture, worklets,
and mic access require a secure context; `localhost` counts).

```bash
# from the repo folder — pick whichever you have:
python3 -m http.server 8000     # then open http://localhost:8000
# or
npx serve .
```

First-run tips:
1. Hit **REC**, choose **Desktop**, pick a *tab* and check **"Share tab audio"** (tab shares are
   auto-muted at the source and monitored through the app — screen shares can't be muted, so
   drop MON to 0 if you hear doubling). Or choose **Mic**.
2. Stop the take → it lands on the clip shelf and opens in the editor. Trim, set the slice **Grid**.
3. Press **▶ Pattern**. Click steps to select; the inspector edits slice/retrig/condition/gate/pitch.
   With a step selected, the amber sliders write **P-locks** to that step (double-click clears).
4. Click a channel **5–8**, hit a patch chip (Kick / Analog / Swarm…), program notes. The **MODL**
   page macros — and the model selector itself — are per-step lockable.
5. **Bounce → clip** prints the pattern (with FX) back onto the shelf. Re-slice your own output —
   that loop is the whole idea.

## Deploy
Push to GitHub → repo **Settings → Pages → Deploy from branch** → root. Done: the Pages URL serves
`index.html` directly. (The Node-version warning in GitHub's managed pages workflow is cosmetic.)

## Development
- Everything is in `index.html`: one IIFE + one AudioWorklet module containing five DSP processors
  (`cb-delay`, `fm-voice`, `bs-verb`, `ml-filt`, `ot-boum`). The header block inside `<script>`
  holds the architecture map, the invariants, and a system index matching the 25 searchable
  `=====` section banners. Read it before changing anything.
- **Before every release:** `node harness.js` (from beside `index.html`) — executes the whole IIFE
  against stubbed DOM/WebAudio and reports throws. It catches wiring/reference-order bugs, not
  sound bugs; your ears are the second gate. When it throws, distinguish stub gaps (add to the
  stub) from real bugs (fix the app).
- Conventions: one deep feature per version, version string in the header `<small>` tag, tag
  releases (`v0.20`…). Persisted-state shape changes require a migration path (see the
  `IndexedDB` section banner — several precedents in place).

### The invariants (violations have all bitten before)
Master applied **once**, live path == offline path · **bounce prints** the sound, then resets FX ·
slices belong to the **clip**, never the trim · any nonlinearity inside a feedback loop is
gain-normalized (`tanh(x·k)/k`) · continuous controls write **live params**; structural changes
**hot-swap** chains (the transport never stops); tempo changes **re-anchor the clock**.

## Documents
| file | what |
|---|---|
| `SPEC.md` | Locked forward contract: UI reflow, MIRR neighbor channels, resample capture, build phases |
| `MI-BLUEPRINT.md` | Mutable Instruments integration map (models, effects, sequencer brain) — authoritative |
| `AUDIT.md` | Full-stack listening checklist (v0.14+ is ears-unaudited) |
| `HISTORY.md` | Deep project history and the origin stories of the rules |
| `ROADMAP.md` | Audit gate, next steps, and the hardware paths (Pi kiosk → split brain → embedded) |

## Licensing
Synth models 1+ derive from **Mutable Instruments** (Émilie Gillet, MIT) — attributed in the
worklet headers; keep attributions when porting more (rules in `MI-BLUEPRINT.md`). The project's
own license is not yet chosen — owner's call.
