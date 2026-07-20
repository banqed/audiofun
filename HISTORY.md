# CLIPDECK — Project Bookmark (as of v0.11)

Single-file web app (`index.html`): record desktop/mic audio → slice → sequence → effect → export.
All client-side. Chrome/Edge. IndexedDB persistence. Deployed to GitHub Pages. TE-style hardware UI.

## Version state
- **v0.11 = current build** (chain release, harness-verified, NOT yet ear-tested by Tyler)
- **v0.10 = stable deploy** until v0.11 signed off
- Known-good lineage: v0.7 → v0.9.1 → v0.10. v0.8/v0.9 shipped broken (lessons below).

## Architecture (top to bottom of signal flow)
1. **Input stage**: INPUT gain (−24..+24 dB, printed into take via gain→MediaStreamDestination re-record, live-adjustable) + MON gain (listening level; shared tab is muted via suppressLocalAudioPlayback, app monitors through master). Stereo capture, AGC/EC/NS off, 256k Opus. Post-gain L/R meters. ST/M badges on clips.
2. **Clips shelf**: IndexedDB blobs, rename, delete (undoable), ⤓ per-clip raw export, project save/load (JSON, base64 blobs).
3. **Editor**: waveform, trim (magnet-snaps to slice edges), Commit trim (destructive crop + pattern remap, undoable), auto-trim on record.
4. **Sequencer**: 32-step pattern (length independent), per-step slice/retrig(2/3/4/8 + T=3)/conditions(%, n:m, FIRST)/gate(cut,ring)/pitch/pan/reverse/lock. Swing 50–75 (absolute-step scheduler; spans feed retrig/gate math). BPM + tap + transient estimate. Slices span FULL clip, transient-snapped grid. Roll generator (seeded, chaos macro, spread=pan). Pattern starters (Trap/DnB/House/Boombap/Halftime/Straight) cast onto slices ranked by energy.
5. **Voice strip** (fixed, not in chain): Speed (centered exp slider), Pitch (granular OLA), Pan, Fades, Volume.
6. **THE CHAIN (v0.11)**: 4 cards — Crunch, Filter, Delay, Reverb — drag-≡-reorder, ⏻ true bypass, →/⑂ serial-parallel per card. Serial = feeds next (equal-power internal dry/wet Mix). Parallel = taps main at its position, **returns at end of chain** (send level = Mix, linear). Connectors render routing; ● = fed serially. `normalizeChain()` shim: chainless fx (old presets/timeline) = crunch/filter serial + delay/reverb parallel = pre-v0.11 routing exactly. buildChain() is an async chain compiler; walker assigns refs (crunchWet/Dry/WS, filterNode/Wet/Dry, dlyNode/Wet/Dry, verbWet/Dry + modes) consumed by live handlers + LFO router.
7. **Delay card** (deep module, AudioWorklet 'cb-delay', blob URL, ensureWorklet WeakMap per ctx): whole feedback loop in DSP — fb to 110% w/ tanh clip in loop, one-pole tone in loop, dual-tap pitch shifter in loop (±12st), mod, freeze latch, ping-pong, sync incl 1/8d. Live worklet params (no restart). Kill message on stop (zombie fix). Chips: Tape/Shimmer/Runaway/Dub. No-worklet fallback = plain delay.
8. **LFOs**: 4 slots, shapes incl S&H (looped random-step buffer), free Hz or tempo divisions, exclusive destinations (UI-enforced), downhill cross-mod only (LFO1→2/3/4 rate). Dests: pan, filter, filtermix, volume, speed, dlymix/dlytime/dlyfb/dlytone, verb, crunch. Built per-chain inside buildChain (phase-locks to pattern/render start).
9. **Master bus**: comp (thr/ratio/makeup, GR readout) → limiter → out. ALL live paths → master.in; ALL exports → applyMasterOffline(). Exactly one connect(ctx.destination), inside rebuildMaster.
10. **FX preset bank**: 5 factory (Clean/Chipmunk/Telephone/Cave/Dub via lazy mkFactory) + 5 user slots (click empty=save, filled=load, right-click=overwrite; IndexedDB meta 'fxbank'). Serializes full fx incl. lfos, dly, chain.
11. **Timeline**: item snapshots (deep-copied fx incl chain), crossfade stitch, mix export.
12. **Modes**: Simple (record/trim/quick-FX/export; new-user default) / Deck (everything). Undo (20-deep, Ctrl+Z): pattern edits, Commit trim, clip delete.

## Core design rules (established, don't violate)
- Bounce prints the sound → FX chain resets after bounce.
- Slices belong to the clip, not the trim. Trim never remaps; Commit does.
- Master applied ONCE at the end, identically live and offline.
- LFO dests exclusive; cross-mod flows downhill only.
- One deep effect module per version. Card framework is the expansion path.
- Serial Mix = equal-power crossfade; parallel Mix = linear send.
- Live params for continuous controls; rebuild only for structural changes (dlyNeedsBuild pattern: node absent → one rebuild).

## Hard-won lessons
- **v0.9 no-audio**: TDZ crash (FACTORY called fxDefaults before declaration) killed the whole IIFE. Syntax checks don't catch reference-order bugs → **the harness** (`/tmp/harness.js` pattern: proxy DOM + fake WebAudio, execute IIFE, report throws) now runs before every release. Stub gaps (closest, querySelectorAll counts, window.addEventListener) are expected; distinguish stub gaps from real bugs.
- Python bulk edits: assert every anchor; a failed assert = nothing written (safe), but verify anchors against the actual file first.
- Node adoption pattern: controls with listeners move between containers via appendChild (listeners survive); parkParts() warehouse before innerHTML wipes.

## Deferred / roadmap (in rough priority)
- **v0.12: Reverb deep module** — size/decay (regenerated impulses), pre-delay, shimmer (reuse pitch trick), freeze; inherits card framework.
- Filter deep body: resonance, drive, envelope follower (auto-wah). Crunch deep body: algorithm select (soft/fold/bitcrush), bias.
- Duplicate card instances (dual delay) — door deliberately closed until asked.
- Tier-3 control-rate LFO dests (chance, swing — polled per step).
- Chain output meter. Per-LFO phase offset. Pattern banks A–D. URL pattern sharing. Tabs UI. Arm/release capture.
- Put it in front of ~5 strangers (still not done — highest-leverage next step).
- Monetization direction: free viral utility; Koala-style one-time pro unlock most plausible; no accounts.

## Environment notes
- GitHub Pages Node 20 deprecation warning = cosmetic (GitHub's managed pages workflow; their fix, not ours; custom workflows would use checkout@v5 + upload-artifact@v6).
- MON caveat: tab-share suppression works; screen-share ignores it → user drops MON to 0 if doubled.
- S&H LFO + freeze bounces are "a performance of the patch," not the exact one heard.

## File locations (this container session)
Every version at /mnt/user-data/outputs/clipdeck-vX.Y/index.html (v0.1 note: outputs/index.html). Harness at /tmp/harness.js.
