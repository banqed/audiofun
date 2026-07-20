# MI-BLUEPRINT — Mutable Instruments integration map · LOCKED
Written v0.20, final Fable-5 session. This document is the authority for all MI-derived work.
Any session can execute any tier of this cold. Read SPEC.md first for the base architecture.

## Governing philosophy (established, do not relitigate)
Mutable's law: every knob position on every model is musical (hand-mapped perceptual macros, no dead zones).
Elektron's law: the sequencer is the instrument; state is sacred; depth lives in pages.
Our fusion: **because every macro position is musical, every p-lock is guaranteed musical.** Macros
(HARM·TIMB·MRPH) are the universal first page and the guaranteed lock trio; deep params are page 2;
**the model itself is lockable per step** (shipped v0.20 — the flagship neither company built).

## License & attribution (non-negotiable)
All MI code is MIT (Émilie Gillet). USE the DSP, CREDIT in the worklet header
("derived from Mutable Instruments <module>, Émilie Gillet, MIT"), NEVER use MI module names or
panel designs as our product identity. Our names are 4-letter codes. Port style: hand-port curated
units (keeps zero-toolchain single-file purity). WASM compile of full Plaits is the documented
alternative if hand-ports drift (+~200KB base64, build toolchain — avoid unless fidelity demands it).
Source of truth: github.com/pichenettes/eurorack (plaits/dsp, rings/dsp, clouds/dsp, marbles, stmlib).

## TIER 1 — Voice models (extend the v0.20 model host in fm-voice worklet)
Shipped: 0 FM4 (house) · 1 VA · 2 SWARM (both first-draft voicings — audit before adding more).
Port next, in order:

**3 MODL (Plaits string/modal → simplified Elements):** exciter (mallet strike = filtered noise burst
+ optional bow noise sustain) → modal resonator = bank of 5–8 parallel two-pole resonators
(SVF at f·partial ratios). HARM = inharmonicity (partial ratios morph harmonic→stiff-string→bell:
ratios[k] = k^(1+harm·0.15) style stretch). TIMB = brightness/exciter color (noise LP cutoff + partial
amplitude tilt). MRPH = damping/decay tilt (low partials ring vs high partials ring). Trig = strike.
Our gate-cut chokes the bank. THE most-wanted missing timbre; nothing else in the arsenal touches it.

**4 WTBL (wavetable):** 4×4 grid of 128-sample single-cycle tables (bake our own bank — analog,
digital, formant, chaotic rows; store as one Float32 base64 blob ~32KB). HARM = row, MRPH = column
(bilinear interp between 4 neighbors), TIMB = post lowpass or bit-mangle. Cheap, huge range.

**5 GRTR (Plaits particle/grain):** dust-triggered enveloped sine/noise grains through resonant filter.
HARM = grain pitch spread, TIMB = filter, MRPH = density/dust rate. Pairs absurdly with VERB GRAN.

**6 SPCH (Plaits speech, stretch goal):** LPC/SAM-style formant sequence; MRPH scrubs phoneme,
HARM = formant shift, TIMB = consonant intensity. Meme-grade demo value, real musical value.

Skip: Plaits drum models (our FM PENV/NOIS drums own that ground — Tyler's 4+4 verdict governs),
Braids (subsumed by Plaits), chord model (defer until poly).

## TIER 2 — FX palette entries (two-slot system, one worklet each)
**RING (Rings resonator):** the crown jewel of this tier. Audio-in modal/string resonator:
input → exciter shaping → resonator bank (same modal math as model 3 — SHARE THE DSP UNIT).
Modes: MODAL (parallel band bank) · STRG (Karplus-ish comb + damping + dispersion allpass) ·
SYMP (2–3 detuned sympathetic combs). Params: STRC (inharmonicity/comb tuning) · BRIT · DAMP ·
POS (excitation position = comb-filtered input) · MIX. **The Elektron move MI couldn't make: the
resonator is note-tracked** — on voice channels tune it from step.pitch; on clip channels give STRC
a freq p-lock. Clips through a played resonator = a sound category the app doesn't have.
**CLDS (Clouds/Beads granular):** real grain engine replacing/upgrading VERB's GRAN homage when
it graduates to its own slot: rolling buffer, 16+ windowed grains, POS·SIZE·DENS·TEX(window/overlap)·
PTCH(per-grain, quantizable to octaves/fifths)·FRZE·reverse-grain probability. VERB keeps GRAN as
the ambient wash; CLDS is the surgical texture instrument.
**WRPS (Warps meta-modulator, needs MIRR first):** two-input cross-mod: ring/XOR/comparator/
crossfold + tiny internal osc. Second input = left-neighbor channel (the MIRR routing reused).
Channel-pairs become intermodulating — very us.
Skip: Ripples/Shelves (FLTR is our filter), Streams (HEAT), Veils (mixer).

## TIER 3 — Sequencer intelligence (the deepest fit — MI generative brain × our lock system)
**MRBL (Marbles → the Generators drawer grows a mind):** replace one-shot Roll with a living
generator: DEJA VU knob 0–1 (0 = locked loop replays; 1 = fresh random every pass; between =
per-loop mutation probability (1−dv) per generated step). Implementation: generator owns a loop
buffer per channel; at each pattern-loop boundary in the tick (loop counter increments), mutate.
BIAS/SPREAD from Marbles map to our existing roll sliders; add SCALE quantizer for voice-channel
note generation (major/minor/pent/chromatic table). This turns patterns into organisms. Medium
build, enormous payoff, zero DSP — pure scheduler work.
**GRID (Grids → pattern starters become a manifold):** replace the 6 genre chips with a 2D pad
morphing a drum-pattern map + per-channel FILL density knobs. Port the actual Grids node table
(25 nodes × 3 instrument maps, in the repo as a data array — take it verbatim, it's the whole magic).
X/Y interpolates thresholds; FILL sets per-channel density against them. Casts onto CH5–8 drum
channels (or energy-ranked slices on CH1–4 per our starter convention). Starters become an
instrument you *play*.
**TIDE (Tides → LFO shapes v2):** our 4-LFO system gains slope-morph shape (one SHAPE knob:
ramp→tri→saw with curvature) replacing/augmenting the discrete shape list; unipolar/bipolar switch.
Small, tasteful.
**FRAM (Frames → scenes, far future):** keyframed morph across many params = scene slider.
Note only; big UI implications, belongs after the reflow settles.

## Sequencing into the roadmap (amends SPEC.md build phases)
Voicing audit (pending, AUDIT.md) → REFLOW (SPEC zones) → then MI waves:
  wave 1: MRBL déjà vu + GRID pad (sequencer brain — no DSP risk, feature-per-line champions)
  wave 2: model 3 MODL + RING (shared resonator DSP unit — build once, use twice)
  wave 3: WTBL + CLDS · wave 4: GRTR/SPCH/WRPS/TIDE as appetite dictates.
Every wave: harness before release · voicing round with Tyler's ears · attribution headers ·
macros hand-mapped until no dead zones · everything lockable is lockable.

## Standing invariants that govern all of the above
Loop-gain rule (tanh(x·k)/k in any feedback) · live params for continuous, hot-swap for structural ·
master once · bounce prints · macros = guaranteed-musical locks · 4-letter codes · single file, no toolchain.
