# AUDIT — v0.20 full-stack listening pass
Work top to bottom. For anything that fails or offends: note WHAT you did, WHAT you heard, and a severity 1–5. Ranked list at the end is the deliverable.

## 0 · Smoke + migration (5 min)
- [ ] Fresh load: 8 channels visible, vertical rows, each with its default color. No console errors (F12).
- [ ] If you had an old session: old clips/patterns landed on CH1–2, nothing stranded. Colors cycle on dot-click and persist after reload.
- [ ] Record a desktop take and a mic take. Meters move, INPUT gain prints, MON behaves (no doubling on tab share).
- [ ] Selecting CH5–8 shows the voice screen with MODL page first; CH1–4 doesn't.

## 1 · Transport truth (10 min) — the v0.12.2 promises
- [ ] Start a clip pattern on CH1. While playing: change BPM, tap tempo, swing, division → pattern NEVER resets to step 1; synced delay/LFOs glide.
- [ ] Change pattern length mid-play (polymeter vs a second channel). Seamless.
- [ ] Swap FX slot contents mid-play → old sound rings out ~2.5s under the new one (spillover), no restart.
- [ ] Voice channel with empty pattern: press play FIRST, add steps AFTER → notes sound immediately (the bug you caught — confirm dead).

## 2 · FM drums — THE 4+4 VERDICT (15 min)
This gate decides whether fixed clip/voice geography holds. Build a beat using only CH5–8:
- [ ] Kick chip: punch? sweep speed? Does PENV/PDEC get you from 808 boom to techno click?
- [ ] Snare chip: does NOIS+body read as a snare or as "sine plus static"?
- [ ] Hat· / Hat+: crisp enough? Choke behavior between closed/open via gate-cut?
- [ ] VERDICT: could you gig a drum section from these four channels? YES → 4+4 stands. NO → we revisit the grid before the reflow hardens.

## 3 · Models + the locks (15 min)
- [ ] Analog chip: sweep HARM (unison→fifth spread), TIMB (clean→fold), MRPH (saw→square→pulse). Rule: NO dead zones — every position musical. Flag any dud region with its value.
- [ ] Swarm chip: same three sweeps. Does high HARM shimmer or just detune-mush?
- [ ] FM4 + macros: on a Bass patch, do HARM/TIMB/MRPH overlay musically or fight the patch?
- [ ] MODEL LOCK: VA bassline, select one step, switch MODL to SWARM → that step only. Then a step to FM4. Clean switches, no clicks, correct in bounce.
- [ ] MACRO LOCKS: lock MRPH high on two steps, TIMB low on one. Amber cells, ● values, P badges, dblclick clears.

## 4 · FLTR — Blades (10 min)
- [ ] RESO sweep on a loop: where does self-osc actually start? Should be intentional at the very top, not ambushing at 70%.
- [ ] MODE sweep at moderate reso: listen for the BP dip mid-morph (known suspect).
- [ ] DRIV full: fold usable or fizz? Fold + high reso = the money zone, judge it.
- [ ] ENV +: auto-wah on a drum loop. ENV −: ducking. Follower speed feel.
- [ ] The ping trick: reso ~95%, gate-cut steps, freq p-locks per step → pitched percussion?

## 5 · VERB — per algorithm (20 min, one dry source throughout)
- [ ] ROOM: tight? metallic ring? (known suspect #1)
- [ ] HALL: bloom speed, darkness of tail.
- [ ] PLAT: density — grainy or smooth?
- [ ] CLOD: does MOD at 70% wash or warble-seasick?
- [ ] GRAN: PRED as grain size across its range; MOD spray; SHIM octave grains; FRZE → play under the frozen cloud. Density feel (known suspect #2).
- [ ] SHIM: bloom-and-settle, not avalanche; shimmer level at 60%.
- [ ] NONL: FM snare through it, gate release speed — instant 80s or flappy?
- [ ] FRZE latch on 2–3 algos; algo switch mid-tail = spillover.
- [ ] All six chips land somewhere immediately usable.

## 6 · HEAT (10 min)
- [ ] COMP sweep at SPED low (glue) and high (pump) on the FM kick pattern. Does it breathe or just get quiet?
- [ ] Modes at DRIV 60%: WARM vs CRSH vs FUZZ characters distinct? BIT· tracking DRIV usefully?
- [ ] BIAS ± : audible even-harmonic thickening or nothing?
- [ ] Parallel comp: COMP high, Mix ~55% on drums. The NYC trick — judge it.
- [ ] Auto-makeup: sweep everything — output level stays in the same postal code?

## 7 · Combinations (15 min) — nobody has ever heard these
- [ ] HEAT → VERB(ROOM) on the drum bus channels.
- [ ] FLTR(reso 80) → DELY(Runaway): filter feeding runaway feedback — controllable with the fb knob per v0.12.1?
- [ ] SWARM → VERB(GRAN) + FRZE, then play a model-locked pattern under it. The demo.
- [ ] VA + FLTR env-wah + HEAT parallel comp: the funk test.
- [ ] All 8 channels playing, hot delays on two: summing clean? Master GR sane? CPU (playback glitches)?

## 8 · Print parity (10 min) — the master-once rule
- [ ] Bounce a clip-channel pattern with two slots active + locks → bounced clip sounds like what you heard (tails included).
- [ ] Bounce a voice channel with model locks → same.
- [ ] Per-clip ⤓ raw vs master export sanity.
- [ ] Timeline: add two items with different fx, stitch, export → crossfades + per-item fx correct.

## 9 · Regression quickies (10 min)
- [ ] P-locks (freq/vol/dMix) on clip channel under swing.
- [ ] Undo: pattern edits, commit trim, clip delete (track unassign restores).
- [ ] Reload: tracks/patterns/colors/voices/locks persist. Project save→load round-trip.
- [ ] Simple mode still sane for Person A.
- [ ] FX bank: save a two-slot recipe to a U slot, load it back. Factory chips still land.

## Deliverable
Ranked ugly-list (worst first): item · what you did · what you heard · severity 1–5.
Voicing numbers are cheap to turn; architecture held is the win condition.
