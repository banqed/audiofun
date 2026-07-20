# ROADMAP — audit gate, next steps, and the hardware question

## Where the project stands (v0.20)
Architecture is built and harness-clean; **ears are behind code.** v0.13-era was the last
owner-tested build. Everything since — the 8-channel conversion, two-slot FX, the DSP trilogy
(VERB/FLTR/HEAT), the model system with model/macro locks — is unaudited. All DSP voicing
numbers (reverb tap positions, filter self-osc onset, compressor curves, model macro maps)
are educated first guesses awaiting a tuning round.

## Gate 1 — the audit (`AUDIT.md`, ~2h)
Run it top to bottom; deliverable is a ranked ugly-list (what you did · what you heard · severity 1–5).
Two items in it are **decisions, not bug hunts**:
- **FM drums verdict (§2):** if the four drum chips can't carry a gig, the fixed 4+4 clip/voice
  grid gets revisited *before* the reflow hardens around it (8+8 and flip-flop are the documented doors).
- **Combination tests (§7):** eight channels + hot delays is the CPU/summing stress test.
Voicing fixes are cheap (single constants, per-module tuning rounds). Architecture holding is the win.

## Gate 2 — the reflow (`SPEC.md`, phases 2–3)
The locked 5-zone layout: header transport · sources (capture incl. **RSMP** resample + clip shelf) ·
the 8-strip rack (+ master strip, + **solo**) · pattern · the dark paged track screen. Plus **MIRR**
neighbor channels and the segment-display styling pass (DSEG, 4-letter codes). Pure UI — zero
engine changes by design, so it can't break sound.

## Gate 3 — the MI waves (`MI-BLUEPRINT.md`)
Wave 1 is the sequencer brain (Marbles déjà vu, Grids pattern manifold) — highest
feature-per-line in the whole plan, zero DSP risk. Then MODL+RING (one shared resonator,
built once, used as both voice model and FX slot). Full ordering in the blueprint.

## Gate 4 — humans, then identity
- **The 5-strangers test** (owed since v0.5, deliberately deferred until the reflow so the new
  layout gets tested, not the old sediment). Watch them; don't help.
- **Rename** (candidate MAGPIE) and license choice land after strangers validate — name the thing
  people demonstrably want.
- Monetization stance on record: free viral utility; if ever, Koala-style one-time pro unlock; no accounts.

---

# HARDWARE — a real future, sequenced honestly
The codebase has been converging on "firmware that runs in Chrome" for months (hand-rolled
per-sample DSP in worklets, fixed channel grid, two-slot limit, 4-letter codes, p-locks). The
instinct is sound. The sequencing matters more than the ambition.

## What ports and what doesn't
**Ports nearly verbatim:** the five worklet processors — they're plain per-sample C-shaped loops
in JS costume. The sequencer model (absolute-step clock, lookahead, conditions, locks, retime math)
ports as pure logic. **Doesn't port:** the WebAudio graph plumbing (chains/gains/routing) — on
hardware that's rewritten as a mixing loop inside one audio callback, which is *simpler* than the
browser version (hot-swap exists because browsers make graphs awkward). The HTML UI is the big
rewrite unless kept as a web UI (Path A/B keep it).
**Discipline that keeps the door open (cheap, ongoing):** keep worklet DSP sections pure and
self-contained — no DOM refs, no closure state leaks into processors. They currently comply;
review on every DSP change.

## Path A — kiosk box (recommended first step)
Raspberry Pi CM4/5, touchscreen, Chromium kiosk running **the exact shipped index.html**, physical
knobs/pads via a microcontroller speaking MIDI. Real lineage (monome norns, Critter & Guitari),
near-zero engine work. **The enabling software piece pays for itself twice:** a WebMIDI mapping
layer (knob→any param, pads→steps) is both the hardware bridge *and* the most-requested browser
feature. Honest caveat: browser audio on a Pi ≈ 10–20 ms latency — fine for pattern workflow,
not finger-drumming tight.

## Path B — split brain
C++ audio engine (worklets ported; JUCE or bare ALSA) + the existing HTML UI over websocket.
How much modern boutique hardware actually works. The natural *second* step, taken only if
Path A's latency or CPU ceiling bites in practice.

## Path C — true instrument
Daisy Seed (Electrosmith) or Teensy 4.1: instant-on, <2 ms, battery, the full fantasy. The FM
voice + delay would sing; **the sampler half is where it gets hard** (clip storage/streaming,
waveform display vs. small-system constraints). Realistic first true-hardware SKU is therefore
**not the whole groovebox** — it's the voice+delay core as a small desktop synth box, with the
browser app remaining the full instrument. Small, shippable, road-tests the entire hardware muscle.

## The strategic caution, on the record
Hardware is a ~10× scope multiplier (enclosure, BOM, supply chain, firmware updates, support).
The browser app is the unfair advantage — zero install, a URL *is* the demo. **Sequence:**
finish the reflow → strangers test → WebMIDI layer → Path A prototype on the owner's own desk →
let that box decide whether Path B/C deserve a year. Evidence before injection molds.
