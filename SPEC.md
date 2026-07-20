# SPEC — "the reflow" (v0.16 series) · LOCKED per design sessions with Tyler

Project: single-file browser groovebox (working name CLIPDECK; rename parked — candidate MAGPIE).
This spec supersedes prior layout. Engine rules from BOOKMARK.md (v0.11 folder) still apply unless amended here.

## Locked model
- **8 channels, fixed types by position: 1–4 CLIP, 5–8 VOIC.** No type toggles, no "machine" jargon, no SMP label anywhere. Identity is geography. Future doors: 8+8 or flip-flop — do not build, do not block.
- **Voice channels OWN their patch.** No voice bank, no V1–V4 objects, no push. Select channel 5–8 → its synth pages. Patch reuse = explicit "copy voice →" affordance (later).
- **Clips keep a shelf** (many takes → few channels). Assignment = **drag clip card onto a clip channel**. Only gesture. Drop on occupied = replace source, pattern survives.
- **Two FX slots per channel, serial: SLOT1 → SLOT2.** Palette: NONE / CRSH / FLTR / DELY / VERB. Each slot: type selector + its module's controls + mix (equal-power). One ⇅ swap button. No parallel mode, no 4-card chain, no drag reorder. Chain compiler survives underneath; deep-delay DSP, live params, LFO dests, p-locks unchanged. FX bank presets become two-slot recipes; legacy chains migrate via "first two active modules in old order".
- **MIRR (Octatrack neighbor): any channel can mirror its left neighbor.** Mirror has no source; neighbor's post-chain output routes THROUGH mirror's slots+fader instead of to mix. Serial. Mirror's step grid grays out v1. Works on clip AND voice neighbors (4-in-series stacking idiom).
- **Resample = third capture source** beside DESK/MIC·: records master bus through the existing INPUT-gain print path, lands on shelf as a take. This is the identity loop (everything can be re-eaten).
- **FM drums bet:** worklet gains PENV/PDEC (pitch sweep semitones + decay) and NOIS/NDEC (filtered-noise level + own decay, summed at output, choke-aware). Ship KICK/SNAR/HATC/HATO patches. Tyler's ears rule on whether 4+4 holds; if drums fail, revisit grid before layout hardens.

## Layout (5 zones, top→bottom) — phase: REFLOW
1. **HEADER** (always visible): PTRN/STOP transport, segment BPM + TAP, SWNG, master meter + GR, SIMPLE⇄DECK. Global state only.
2. **SOURCES**: CAPTURE (DESK · MIC· · RSMP + IN/MON gains) + CLIP SHELF (drag cards). Nothing else (voice bank deleted).
3. **RACK**: 8 strips + MST strip. Strip: number, CLIP/VOIC/MIRR code, source name, M/S (solo is NEW), mini fader, length badge. Amber outline = selected. MIRR arrows between neighbors. Wraps 4×2 narrow.
4. **PATTERN**: selected channel's steps, pages P1/P2, LEN/GRID/SNAP/SEED, step inspector, ▸ Generators drawer.
5. **TRACK SCREEN** (dark paged panel, fmscreen style generalized, follows selection):
   - CLIP channel: [SRC·][FX··][MIX·]  (SRC = waveform/trim/slices/commit/preview)
   - VOIC channel: [SYN·][ENV·][AMP·][FX··][MIX·]
   - MIRR channel: [FX··][MIX·]
   Footer: timeline/song, export, settings.
- **Selection is the spine:** the screen shows what you touched. Click strip → its pages. Click clip card → SRC.

## Display language — phase: SEGMENT STYLING
- Dark screen panels house-wide; 4-letter codes official vocab:
  channels CLIP VOIC MIRR · fx CRSH FLTR DELY VERB NONE · transport PTRN STOP BNCE RSMP ·
  pages SRC· SYN· ENV· AMP· FX·· MIX· · steps TRIG NOTE RTRG COND GATE LOCK ·
  drums KICK SNAR HAT· TOM· · misc SEED SWNG GRID SNAP DESK MIC·
- Embed DSEG 7/14-seg font subset base64 (~15KB budget OK), unlit-segment ghost behind lit digits, styled-mono fallback.

## Simple mode
Header + Capture + Shelf + hidden single-channel rack. Person A never sees zones 3–5.

## Engine notes / costs (accepted)
- 8 chains lazy-build: empty channels cost nothing. FM channels with empty patterns skip node build at pattern start (steps added later need pattern restart — known).
- Track gain default 0.7 at 8 channels (was 0.85 at 2); limiter earns its keep.
- Engine-change stops transport (voice/clip replace on running channel = the one legit stop). Everything else stays uninterrupted (hot-swap/retime rules from v0.12.2).

## Build phases
1. **v0.16-alpha (engine conversion):** 8 typed channels + migration (old T1/T2 + voice bank → new grid), owned voices, two-slot FX (state, compiler, interim slot UI replacing cards), FM drum params + drum patches. Old layout retained. Harness-clean.
2. **v0.16-beta (reflow):** 5-zone layout per above; kill Assign button (drag only); solo; master strip; screen pages; fmscreen generalized.
3. **v0.16-rc:** segment styling pass (DSEG, codes everywhere), MIRR channels, RSMP capture.
4. **Ship-gate:** 5-strangers test on the NEW layout. Then rename decision.

## Migration (persisted state)
- Old tracks[0..1] slice → channels 1..2. Old fm tracks → first free voice channel (5+), carrying pattern/len/gain/mute; synth = upgradeVoice(voice bank entry). state.voices absorbed then dropped from saves. Old fx.chain → slots via first-two-active rule. Old factory presets normalize on load.

## Do-not-lose invariants (from project history)
bounce prints + resets FX · slices belong to clip · master once, live=offline · LFO dests exclusive, cross-mod downhill · live params for continuous / rebuild for structural / hot-swap for chains / retime for tempo · harness before every release · python edits assert every anchor (UTF-8 literals vs \u escapes — bitten twice).

## FX MODULES — LOCKED (design sessions cont.)
- **VERB — BigSky-style multi-algo.** One tank engine + config table, plus one granular engine, shared shell. Algos: ROOM/HALL/PLAT/CLOD/GRAN/SHIM/NONL. FRZE = cross-algo latch. Params: ALGO·DECY·PRED·TONE·MOD·SHIM·MIX(+FRZE). GRAN reinterprets: PRED=grain size, DECY=regeneration, MOD=spray, SHIM=octave grains, FRZE=stop capture keep spraying. Spillover via existing 2.5s hot-swap ring-out. Chips: Tight/Cathedral/Wash/Cloud/Gated/Bloom. fx.verb stays = mix; deep params in fx.vrb.
- **FLTR — single-channel Blades (MI).** TPT/Zavalishin SVF, saturated integrators (v0.12.1 discipline). FREQ·RESO(→self-osc)·MODE(continuous LP→BP→HP)·DRIV(pre-filter clean→OD→wavefold)·ENV(bipolar follower)·MIX. Type dropdown retired; migration LP=0/BP=.5/HP=1.
- **BOUM — OTO-style thickener** replacing CRSH. Chain: drive→FF compressor→shaper→tone→auto-makeup. DRIV·COMP·SPED·MODE(WARM/CRSH/FUZZ/BIT·)·BIAS·TONE·MIX (MIX=parallel comp). Legacy crunch→DRIV@WARM.
- Build order: VERB → FLTR → BOUM. Voicing rounds with Tyler's ears after each.

## MI INTEGRATION — see MI-BLUEPRINT.md (LOCKED, final Fable-5 session)
Model host shipped v0.20 (FM4/VA/SWARM + universal macros + model & macro locks). All further
MI-derived work — voice models (MODL/WTBL/GRTR/SPCH), FX entries (RING/CLDS/WRPS), and the
sequencer brain (MRBL déjà vu, GRID pattern manifold, TIDE slopes) — is specified in
MI-BLUEPRINT.md with per-module DSP notes, macro mappings, wave ordering, and license rules.
That document is the authority; do not re-derive.
