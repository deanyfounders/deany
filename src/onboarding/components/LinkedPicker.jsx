// LinkedPicker - the welcome hero. Two bidirectionally-linked scroll wheels
// ("Five minutes of {Topic} {Lesson}") over a three-tier difficulty toggle.
// Detents tick with Web Audio + vibration; the centered pair + tier seed
// onboarding silently. Refs (not React state) drive the scroll paint loop so
// flicks stay at 60fps; React state only changes on settle / tier switch.
//
// SSR: all window / AudioContext / navigator access is inside effects and
// handlers, never in render, so the SSR smoke test cannot touch them.
import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { TOPICS, LESSONS, TIERS, TIER_META } from '../content/pickerCatalog.js';
import { T, FONT } from '../kit/tokens.js';

// Layout effects only make sense on the client; fall back to useEffect on the
// server so the SSR smoke gate stays warning-free.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const ITEM = 40;                 // row height (comfier touch than the 38 demo)
const WHEEL_H = 200;             // ~5 visible rows
const PAD = (WHEEL_H - ITEM) / 2;
const LOCK_MS = 700;             // feedback-loop guard around programmatic scrolls
const SETTLE_MS = 140;           // debounce fallback for scrollend
const TICK_GAP = 30;             // min ms between ticks

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- tiny Web Audio tick engine (whisper-quiet, no assets) ------------------
function makeAudio() {
  let ctx = null, master = null, lastAt = 0;
  const ensure = () => {
    if (typeof window === 'undefined') return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;      // all envelopes below are pre-master
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const blip = (freq, peak, ms) => {
    const c = ctx; if (!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(peak, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + ms / 1000);
    osc.connect(g); g.connect(master);
    osc.start(now); osc.stop(now + (ms + 5) / 1000);
  };
  return {
    init: ensure,
    tick() {                        // user detent
      if (!ctx) return;
      const t = ctx.currentTime * 1000;
      if (t - lastAt < TICK_GAP) return;
      lastAt = t; blip(1800, 0.06, 30);
    },
    tock() { blip(900, 0.04, 40); }, // partner wheel answered
    toggle() { blip(1400, 0.05, 25); setTimeout(() => blip(1400, 0.05, 25), 60); },
    suspend() { if (ctx && ctx.state === 'running') ctx.suspend(); },
  };
}

// nearest triplicated index (of `real` in a list of length `len`) to `fromTri`.
function nearestTri(real, len, fromTri) {
  const cands = [real, real + len, real + 2 * len];
  let best = cands[0], bd = Infinity;
  for (const c of cands) { const d = Math.abs(c - fromTri); if (d < bd) { bd = d; best = c; } }
  return best;
}

export default function LinkedPicker({ onChange, soundEnabled = true }) {
  const [tier, setTier] = useState('foundations');
  const lessons = LESSONS[tier];
  const topics = TOPICS;

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const audio = useRef(null);
  const reduced = useRef(false);

  // per-wheel mutable scroll bookkeeping (never triggers React renders).
  // rowsEl caches the row nodes (re-queried only on mount / tier change) so the
  // paint loop never touches the DOM tree. anim holds the in-flight sync rAF id.
  const meta = useRef({
    left: { lockUntil: 0, lastIdx: 0, len: topics.length, settleT: null, lastTop: -1, rowsEl: null, anim: 0 },
    right: { lockUntil: 0, lastIdx: 0, len: lessons.length, settleT: null, lastTop: -1, rowsEl: null, anim: 0 },
  });
  const userTouched = useRef(false);
  const rafId = useRef(0);

  meta.current.right.len = lessons.length; // keep length fresh across tier changes

  const now = () => (typeof performance !== 'undefined' ? performance.now() : 0);

  const centeredTri = (el) => Math.round(el.scrollTop / ITEM);
  const realIdx = (tri, len) => ((tri % len) + len) % len;

  const emit = useCallback(() => {
    const l = leftRef.current, r = rightRef.current;
    if (!l || !r || !onChange) return;
    const ti = realIdx(centeredTri(l), topics.length);
    const li = realIdx(centeredTri(r), lessons.length);
    const topic = topics[ti];
    const lesson = lessons[li];
    onChange({
      topicId: topic.id,
      seed: topic.seed,
      lessonLabel: lesson.label,
      tier,
      touched: userTouched.current,
    });
  }, [onChange, topics, lessons, tier]);

  // Custom eased scroll for sync moves - constant-duration and buttery smooth at
  // any distance (native `smooth` is browser-timed and stutters over long spins).
  // Locks the wheel long enough to swallow the post-animation settle debounce.
  const animateTo = (el, key, targetTri) => {
    const m = meta.current[key];
    if (m.anim) { cancelAnimationFrame(m.anim); m.anim = 0; }
    const startTop = el.scrollTop;
    const endTop = targetTri * ITEM;
    const delta = endTop - startTop;
    if (Math.abs(delta) < 1) { emit(); return; }
    if (reduced.current) { m.lockUntil = now() + 200; el.scrollTop = endTop; normalizeWrap(el, key); emit(); return; }
    // Duration grows with distance (~1.6px/ms): a short detent settle is quick,
    // a long spin glides. Clamped 220-1150ms.
    const dur = Math.min(1150, Math.max(220, Math.abs(delta) * 1.6));
    m.lockUntil = now() + dur + 400;
    const t0 = now();
    // easeOutCubic - a decelerating glide to rest, like a picker settling.
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = () => {
      const p = Math.min(1, (now() - t0) / dur);
      el.scrollTop = startTop + delta * ease(p);
      if (p < 1) { m.anim = requestAnimationFrame(step); }
      else { m.anim = 0; el.scrollTop = endTop; normalizeWrap(el, key); emit(); }
    };
    m.anim = requestAnimationFrame(step);
  };

  // A random matching target that travels a PLEASANT distance - random among the
  // matching rows (any lesson, any copy) whose travel sits in a 5-18 row window,
  // so it visibly spins without blurring across the whole list.
  const spinTarget = (reals, len, fromTri) => {
    const MINT = 5, MAXT = 18;
    const all = [];
    for (const real of reals) for (let c = 0; c < 3; c++) all.push(real + c * len);
    const win = all.filter((t) => { const d = Math.abs(t - fromTri); return d >= MINT && d <= MAXT; });
    const pool = win.length ? win : all;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  // wrap the scroll position back into the middle copy, silently.
  const normalizeWrap = (el, key) => {
    const m = meta.current[key];
    const tri = centeredTri(el);
    if (tri < m.len) { el.scrollTop += m.len * ITEM; }
    else if (tri >= 2 * m.len) { el.scrollTop -= m.len * ITEM; }
    else return;
    m.lastTop = -1;                                 // force a repaint of the recentred copy
    m.lastIdx = Math.round(el.scrollTop / ITEM);    // avoid a phantom detent tick
  };

  const settleLeft = () => {
    const l = leftRef.current, r = rightRef.current;
    if (!l || !r) return;
    const m = meta.current.left;
    if (now() < m.lockUntil) return;          // our own move, ignore
    normalizeWrap(l, 'left');
    // Soft-snap the wheel the user released to its nearest detent (the iPhone
    // picker settle - there is no CSS snap), then sync the partner.
    const detent = Math.round(l.scrollTop / ITEM);
    if (Math.abs(l.scrollTop - detent * ITEM) > 0.5) animateTo(l, 'left', detent);
    const topicId = topics[realIdx(detent, topics.length)].id;
    const rTri = centeredTri(r);
    const rLi = realIdx(rTri, lessons.length);
    if (lessons[rLi].t === topicId) { emit(); return; } // already matches
    // Land on a RANDOM lesson of this topic, spun a random distance - not the
    // nearest. animateTo emits once it lands.
    const matches = [];
    lessons.forEach((row, j) => { if (row.t === topicId) matches.push(j); });
    animateTo(r, 'right', spinTarget(matches, lessons.length, rTri));
    if (soundEnabled && audio.current) setTimeout(() => audio.current.tock(), 300);
  };

  const settleRight = () => {
    const l = leftRef.current, r = rightRef.current;
    if (!l || !r) return;
    const m = meta.current.right;
    if (now() < m.lockUntil) return;
    normalizeWrap(r, 'right');
    // Soft-snap the released wheel to its nearest detent, then sync the partner.
    const detent = Math.round(r.scrollTop / ITEM);
    if (Math.abs(r.scrollTop - detent * ITEM) > 0.5) animateTo(r, 'right', detent);
    const topicId = lessons[realIdx(detent, lessons.length)].t;
    const lTri = centeredTri(l);
    const lTi = realIdx(lTri, topics.length);
    if (topics[lTi].id === topicId) { emit(); return; }
    const real = topics.findIndex(t => t.id === topicId);
    // On a user spin, send the left wheel a random distance to the matching
    // topic; during idle auto-roll keep it calm (nearest). animateTo emits.
    const target = userTouched.current ? spinTarget([real], topics.length, lTri) : nearestTri(real, topics.length, lTri);
    animateTo(l, 'left', target);
    if (soundEnabled && audio.current) setTimeout(() => audio.current.tock(), 300);
  };

  const onScroll = (key) => {
    const m = meta.current[key];
    if (m.settleT) clearTimeout(m.settleT);
    m.settleT = setTimeout(() => (key === 'left' ? settleLeft() : settleRight()), SETTLE_MS);
  };

  // ---- rAF paint pass: opacity + scale barrel, plus user-detent ticks --------
  useEffect(() => {
    reduced.current = prefersReduced();
    const paintWheel = (el, key) => {
      if (!el) return;
      const m = meta.current[key];
      const top = el.scrollTop;
      if (top === m.lastTop) return;          // nothing moved; skip DOM writes
      m.lastTop = top;
      const center = top + WHEEL_H / 2;
      // Cached node list - never query the DOM inside the frame loop.
      let rows = m.rowsEl;
      if (!rows || !rows.length) { rows = el.querySelectorAll('[data-row]'); m.rowsEl = rows; }
      // Only repaint the rows near the centre (the rest sit under the fade mask).
      const mid = Math.round(top / ITEM);
      const lo = Math.max(0, mid - 5), hi = Math.min(rows.length - 1, mid + 5);
      for (let i = lo; i <= hi; i++) {
        const node = rows[i];
        const dist = Math.abs((PAD + i * ITEM + ITEM / 2) - center);
        // Gentle falloff so words stay legible while spinning (was 0.22 / 110).
        node.style.opacity = String(Math.max(0.5, 1 - dist / 200));
        node.style.transform = `scale(${Math.max(0.9, 1 - dist / 700)})`;
      }
      // user-detent tick (only during genuine user scrolling, not locked moves)
      const tri = Math.round(top / ITEM);
      if (tri !== m.lastIdx) {
        const userScroll = userTouched.current && now() >= m.lockUntil;
        if (userScroll && typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(5);
        if (userScroll && soundEnabled && audio.current) audio.current.tick();
        m.lastIdx = tri;
      }
    };
    const loop = () => {
      paintWheel(leftRef.current, 'left');
      paintWheel(rightRef.current, 'right');
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
    // soundEnabled read fresh each frame via closure over the latest prop is fine
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundEnabled]);

  // ---- initial centering (mount) --------------------------------------------
  useIsoLayoutEffect(() => {
    const l = leftRef.current, r = rightRef.current;
    if (l) { l.scrollTop = topics.length * ITEM; meta.current.left.lastIdx = topics.length; meta.current.left.lastTop = -1; }
    if (r) { r.scrollTop = lessons.length * ITEM; meta.current.right.lastIdx = lessons.length; meta.current.right.lastTop = -1; }
    emit();
    // mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- idle auto-roll (right wheel, until first touch) -----------------------
  // Scroll WITHOUT locking so the right wheel's settle still fires and drags the
  // left wheel to the new topic. userTouched is false here, so no ticks/haptics.
  useEffect(() => {
    if (prefersReduced()) return;
    const id = setInterval(() => {
      if (userTouched.current) return;
      const r = rightRef.current; if (!r) return;
      r.scrollTo({ top: (centeredTri(r) + 1) * ITEM, behavior: 'smooth' });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // ---- first user gesture: init audio, cancel auto-roll ----------------------
  const onFirstGesture = () => {
    if (!audio.current) audio.current = makeAudio();
    if (soundEnabled && audio.current) audio.current.init();
    userTouched.current = true;
    // A touch takes over: kill any in-flight sync animation and its lock.
    for (const k of ['left', 'right']) {
      const m = meta.current[k];
      if (m.anim) { cancelAnimationFrame(m.anim); m.anim = 0; m.lockUntil = 0; }
    }
  };

  // ---- suspend audio when hidden --------------------------------------------
  useEffect(() => {
    const onVis = () => { if (document.hidden && audio.current) audio.current.suspend(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // ---- tier switch: hold topic, fade + rebuild right wheel -------------------
  const capturedTopic = useRef(null);
  const switchTier = (next) => {
    if (next === tier) return;
    onFirstGesture(); // a deliberate interaction
    if (soundEnabled && audio.current) audio.current.toggle();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    const l = leftRef.current;
    capturedTopic.current = l ? topics[realIdx(centeredTri(l), topics.length)].id : topics[0].id;
    const r = rightRef.current;
    if (r) { meta.current.right.lockUntil = now() + 400; r.style.transition = 'opacity .15s ease'; r.style.opacity = '0'; }
    setTier(next);
  };

  // after the new tier's rows render: jump to the held topic's nearest lesson,
  // paint, then fade back in. Never animate-scroll through the new list.
  useIsoLayoutEffect(() => {
    const r = rightRef.current;
    if (!r || capturedTopic.current == null) return;
    const list = LESSONS[tier];
    meta.current.right.len = list.length;
    meta.current.right.rowsEl = null;          // rows were replaced; drop stale cache
    const cur = centeredTri(r);
    const real = list.findIndex(x => x.t === capturedTopic.current);
    const target = real >= 0 ? nearestTri(real, list.length, cur) : cur;
    r.scrollTop = target * ITEM;               // instant
    meta.current.right.lastIdx = target;
    meta.current.right.lastTop = -1;           // force a repaint next frame
    requestAnimationFrame(() => { r.style.opacity = '1'; });
    capturedTopic.current = null;
    emit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  // ---- keyboard: one detent per Arrow on the focused wheel -------------------
  const onKey = (key) => (e) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    onFirstGesture();
    const el = (key === 'left' ? leftRef : rightRef).current;
    if (!el) return;
    const dir = e.key === 'ArrowDown' ? 1 : -1;
    el.scrollTo({ top: (centeredTri(el) + dir) * ITEM, behavior: reduced.current ? 'auto' : 'smooth' });
  };

  return (
    <div style={{ width: '100%', maxWidth: 340, margin: '0 auto' }} onPointerDown={onFirstGesture}>
      <style>{`.lp-wheel::-webkit-scrollbar{width:0;height:0;display:none}.lp-wheel{scrollbar-width:none;-ms-overflow-style:none}`}</style>
      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#8A94A8', marginBottom: 8 }}>
        Five minutes of
      </div>

      <div style={{ position: 'relative' }}>
        {/* center selection chrome */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: 8, right: 8, top: PAD - 1, height: ITEM + 2,
          borderRadius: 12, background: '#fff', border: `1px solid ${T.border}`, pointerEvents: 'none',
        }} />

        {/* wheels under a top/bottom fade mask */}
        <div style={{
          display: 'flex', alignItems: 'stretch', position: 'relative', height: WHEEL_H,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 26%, black 74%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 26%, black 74%, transparent)',
        }}>
          <Wheel
            side="left" refEl={leftRef} rows={topics} align="right" width="42%"
            render={(t) => ({ text: t.label, color: t.ink, weight: 600, size: 15 })}
            onScroll={() => onScroll('left')} onKeyDown={onKey('left')} ariaLabel="Topic"
          />
          <div style={{ width: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.inkHint, fontSize: 15 }}>·</div>
          <Wheel
            side="right" refEl={rightRef} rows={lessons} align="left" width="1"
            render={(l) => ({ text: l.label, color: '#3A4763', weight: 500, size: 13 })}
            onScroll={() => onScroll('right')} onKeyDown={onKey('right')} ariaLabel="Lesson"
          />
        </div>
      </div>

      {/* difficulty toggle */}
      <div role="group" aria-label="Difficulty" style={{
        display: 'flex', gap: 0, marginTop: 16, padding: 4, background: '#fff',
        border: `1px solid ${T.border}`, borderRadius: 14,
      }}>
        {TIERS.map((k) => {
          const active = tier === k;
          const meta2 = TIER_META[k];
          return (
            <button key={k} type="button" aria-pressed={active} onClick={() => switchTier(k)}
              style={{
                flex: 1, minHeight: 44, padding: '9px 4px', border: 'none', cursor: 'pointer',
                borderRadius: 10, fontFamily: FONT, fontSize: 12, fontWeight: 600,
                background: active ? meta2.color : 'transparent',
                color: active ? '#fff' : T.inkSecondary,
                transition: 'background .18s ease, color .18s ease',
                WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
              }}>
              {meta2.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// A single wheel: triplicated rows, scroll-snap, spacers, hidden scrollbar.
function Wheel({ refEl, rows, align, width, render, onScroll, onKeyDown, ariaLabel }) {
  const tripled = [...rows, ...rows, ...rows];
  return (
    <div
      ref={refEl}
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={0}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      className="lp-wheel"
      style={{
        flex: width === '1' ? 1 : `0 0 ${width}`, height: WHEEL_H, overflowY: 'scroll',
        overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', outline: 'none',
      }}
    >
      <div style={{ height: PAD }} />
      {tripled.map((row, i) => {
        const r = render(row);
        return (
          <div key={i} data-row role="option" style={{
            height: ITEM, display: 'flex', alignItems: 'center',
            justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
            padding: align === 'right' ? '0 4px 0 0' : '0 0 0 4px',
            willChange: 'opacity, transform',
          }}>
            <span style={{
              fontSize: r.size, fontWeight: r.weight, color: r.color, fontFamily: FONT,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
            }}>{r.text}</span>
          </div>
        );
      })}
      <div style={{ height: PAD }} />
    </div>
  );
}
