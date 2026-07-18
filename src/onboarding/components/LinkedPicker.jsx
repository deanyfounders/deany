// LinkedPicker - the welcome hero. Two bidirectionally-linked iPhone-style wheel
// pickers ("Ten minutes of {Topic} {Lesson}") over a three-tier difficulty toggle.
//
// The movement is a hand-rolled inertial engine (pointer events + rAF), NOT a
// native scroll container. This gives true infinite looping with no wrap glitch
// at the ends, 1:1 dragging, momentum with friction, and a critically-damped
// settle. Live positions/velocities live in refs; React state only holds the
// tier and the settled selection, so the wheels never rerender mid-flick.
//
// Linking: the left wheel is Subjects, the right wheel is the flattened lesson
// list (each lesson tagged with its subject). Dragging the lesson wheel glides
// the subject wheel to the parent subject with a soft spring lag; settling the
// subject wheel glides the lesson wheel to that subject's remembered lesson. A
// single `active` owner ref prevents a sync feedback loop.
//
// SSR: all window / performance / navigator access is inside effects and
// handlers, never in render.
import React, { useEffect, useLayoutEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { TOPICS, LESSONS, TIERS, TIER_META } from '../content/pickerCatalog.js';
import { T, FONT } from '../kit/tokens.js';

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const ITEM = 40;                 // row height
const WHEEL_H = 200;             // ~5 visible rows
const PAD = (WHEEL_H - ITEM) / 2;
const RENDER = 5;                // slots rendered each side of centre
const ANGLE = 16;                // deg of cylinder tilt per row
const FRICTION = 1.9;            // inertia decay (per second, exponential)
const MIN_FLICK = 2.0;           // rows/sec: below this, settle immediately
const SETTLE_VEL = 2.2;          // rows/sec: inertia hands off to the spring
const K_SETTLE = 200, R_SETTLE = 0.82;   // user settle spring (tiny overshoot)
const K_FOLLOW = 110, R_FOLLOW = 0.92;   // linked-wheel follow spring (soft lag)

const now = () => (typeof performance !== 'undefined' ? performance.now() : 0);
const mod = (n, m) => ((n % m) + m) % m;
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Coerce a label (string or md()-style node array) to plain text for the wheel.
function labelText(l) {
  if (typeof l === 'string') return l;
  if (Array.isArray(l)) return l.map(labelText).join('');
  if (l && l.props && l.props.children != null) return labelText(l.props.children);
  return l == null ? '' : String(l);
}

// ── One infinite inertial wheel ─────────────────────────────────
const Wheel = forwardRef(function Wheel(
  { items, align, ariaLabel, onGrab, onLive, onSettle, defaultInk },
  api
) {
  const hostRef = useRef(null);
  const slots = useRef([]);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const reduced = useRef(false);

  const S = useRef({
    pos: 0, vel: 0, dragging: false, mode: 'idle', target: 0,
    kK: K_SETTLE, kR: R_SETTLE, raf: 0, lastT: 0, lastY: 0, lastMoveT: 0,
    samples: [], lastBase: 0,
  });

  const paint = useCallback(() => {
    const s = S.current;
    const list = itemsRef.current;
    const L = list.length;
    const base = Math.round(s.pos);
    const frac = s.pos - base;
    for (let o = -RENDER; o <= RENDER; o++) {
      const el = slots.current[o + RENDER];
      if (!el) continue;
      const d = o - frac;
      const ad = Math.abs(d);
      const angle = d * ANGLE;
      if (ad > RENDER + 0.5 || Math.abs(angle) >= 90) { el.style.opacity = '0'; continue; }
      const scale = Math.max(0.5, 1 - ad * 0.08);
      const opacity = Math.max(0.1, 1 - ad * 0.2);
      el.style.transform =
        `translate3d(0, ${d * ITEM}px, 0) perspective(760px) rotateX(${-angle}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
      const it = list[mod(base + o, L)];
      const txt = labelText(it.label);
      if (el.__txt !== txt) {
        el.firstChild.textContent = txt;
        el.firstChild.style.color = it.ink || defaultInk || '#3A4763';
        el.__txt = txt;
      }
    }
    if (base !== s.lastBase) {
      s.lastBase = base;
      if (onLive) onLive(mod(base, L));
    }
  }, [onLive, defaultInk]);

  const stop = useCallback(() => {
    const s = S.current;
    if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; }
  }, []);

  const tick = useCallback(() => {
    const s = S.current;
    const t = now();
    let dt = (t - s.lastT) / 1000;
    s.lastT = t;
    if (dt > 0.05) dt = 0.05;
    if (dt <= 0) dt = 0.016;

    if (!s.dragging) {
      if (s.mode === 'inertia') {
        s.pos += s.vel * dt;
        s.vel *= Math.exp(-FRICTION * dt);
        if (Math.abs(s.vel) < SETTLE_VEL) { s.mode = 'spring'; s.target = Math.round(s.pos); s.kK = K_SETTLE; s.kR = R_SETTLE; }
      } else if (s.mode === 'spring') {
        const c = 2 * Math.sqrt(s.kK) * s.kR;
        const a = -s.kK * (s.pos - s.target) - c * s.vel;
        s.vel += a * dt;
        s.pos += s.vel * dt;
        if (Math.abs(s.pos - s.target) < 0.0009 && Math.abs(s.vel) < 0.03) {
          s.pos = s.target; s.vel = 0; s.mode = 'idle';
          paint(); stop();
          if (onSettle) onSettle(mod(s.target, itemsRef.current.length));
          return;
        }
      } else {
        paint(); stop(); return;
      }
    }
    paint();
    s.raf = requestAnimationFrame(tick);
  }, [paint, stop, onSettle]);

  const run = useCallback(() => {
    const s = S.current;
    if (!s.raf) { s.lastT = now(); s.raf = requestAnimationFrame(tick); }
  }, [tick]);

  // ---- pointer / drag ----
  const onDown = useCallback((e) => {
    const s = S.current;
    try { hostRef.current.setPointerCapture(e.pointerId); } catch (_) {}
    stop();
    s.dragging = true; s.mode = 'drag'; s.vel = 0;
    s.lastY = e.clientY; s.lastMoveT = now(); s.samples = [];
    if (onGrab) onGrab();
    run();
  }, [onGrab, run, stop]);

  const onMove = useCallback((e) => {
    const s = S.current;
    if (!s.dragging) return;
    e.preventDefault();
    const t = now();
    const dy = e.clientY - s.lastY;
    s.lastY = e.clientY;
    s.pos -= dy / ITEM;
    let dt = (t - s.lastMoveT) / 1000;
    s.lastMoveT = t;
    if (dt > 0) {
      const v = (-dy / ITEM) / dt;
      s.samples.push(v);
      if (s.samples.length > 5) s.samples.shift();
    }
    paint();
  }, [paint]);

  const onUp = useCallback((e) => {
    const s = S.current;
    if (!s.dragging) return;
    s.dragging = false;
    try { hostRef.current.releasePointerCapture(e.pointerId); } catch (_) {}
    const v = s.samples.length ? s.samples.reduce((a, b) => a + b, 0) / s.samples.length : 0;
    s.vel = v;
    s.kK = K_SETTLE; s.kR = R_SETTLE;
    if (reduced.current || Math.abs(v) < MIN_FLICK) { s.mode = 'spring'; s.target = Math.round(s.pos); }
    else { s.mode = 'inertia'; }
    run();
  }, [run]);

  // ---- keyboard ----
  const onKey = useCallback((e) => {
    const s = S.current;
    const step = e.key === 'PageDown' ? 3 : e.key === 'PageUp' ? -3
      : e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!step && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    if (onGrab) onGrab();
    stop();
    s.mode = 'spring'; s.vel = 0; s.kK = K_SETTLE; s.kR = R_SETTLE;
    if (e.key === 'Home') s.target = Math.round(s.pos) - mod(Math.round(s.pos), itemsRef.current.length);
    else if (e.key === 'End') s.target = Math.round(s.pos) + (itemsRef.current.length - 1 - mod(Math.round(s.pos), itemsRef.current.length));
    else s.target = Math.round(s.pos) + step;
    run();
  }, [onGrab, run, stop]);

  useImperativeHandle(api, () => ({
    // Programmatic glide to a real index, shortest path, with a soft follow spring.
    glideTo(index, soft = true) {
      const s = S.current;
      if (s.dragging) return;
      const L = itemsRef.current.length;
      const diff = Math.round((s.pos - index) / L);
      s.target = index + diff * L;
      s.mode = 'spring';
      s.kK = soft ? K_FOLLOW : K_SETTLE;
      s.kR = soft ? R_FOLLOW : R_SETTLE;
      run();
    },
    setIndex(index) {
      const s = S.current;
      stop();
      s.pos = index; s.target = index; s.vel = 0; s.mode = 'idle'; s.lastBase = Math.round(index);
      paint();
    },
    getIndex() { return mod(Math.round(S.current.pos), itemsRef.current.length); },
    isDragging() { return S.current.dragging; },
    repaint() { paint(); },
  }), [paint, run, stop]);

  useIso(() => { reduced.current = reducedMotion(); paint(); return stop; /* eslint-disable-next-line */ }, []);

  const rows = [];
  for (let o = -RENDER; o <= RENDER; o++) rows.push(o);

  return (
    <div
      ref={hostRef}
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKey}
      style={{
        position: 'relative', flex: 1, height: WHEEL_H, outline: 'none',
        touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
        cursor: 'grab', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: PAD, left: 0, right: 0, height: ITEM, transformStyle: 'preserve-3d', pointerEvents: 'none' }}>
        {rows.map((o) => (
          <div
            key={o}
            ref={(el) => { slots.current[o + RENDER] = el; }}
            style={{
              position: 'absolute', left: 0, right: 0, height: ITEM,
              display: 'flex', alignItems: 'center',
              justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
              padding: align === 'right' ? '0 6px 0 0' : '0 0 0 6px',
              willChange: 'transform, opacity', backfaceVisibility: 'hidden',
            }}
          >
            <span style={{
              fontFamily: FONT, fontSize: align === 'right' ? 15 : 13,
              fontWeight: align === 'right' ? 600 : 500, whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
            }} />
          </div>
        ))}
      </div>
    </div>
  );
});

// ── The linked picker ───────────────────────────────────────────
export default function LinkedPicker({ onChange, soundEnabled = true }) {
  const [tier, setTier] = useState('foundations');
  const lessons = LESSONS[tier];
  const topics = TOPICS;

  const subjApi = useRef(null);
  const lessApi = useRef(null);
  const active = useRef(null);          // 'subject' | 'lesson'
  const touched = useRef(false);
  const lastLessonBySubject = useRef({});
  const tierRef = useRef(tier);
  tierRef.current = tier;

  const firstGesture = () => { touched.current = true; };

  const lessonIndexForSubject = useCallback((subjId, list) => {
    const remembered = lastLessonBySubject.current[subjId];
    if (remembered != null) {
      const i = list.findIndex((l) => l.t === subjId && l.label === remembered);
      if (i >= 0) return i;
    }
    const f = list.findIndex((l) => l.t === subjId);
    return f >= 0 ? f : 0;
  }, []);

  const emit = useCallback(() => {
    if (!subjApi.current || !lessApi.current || !onChange) return;
    const si = subjApi.current.getIndex();
    const li = lessApi.current.getIndex();
    const subj = topics[si];
    const les = LESSONS[tierRef.current][li];
    onChange({ topicId: subj.id, seed: subj.seed, lessonLabel: labelText(les.label), tier: tierRef.current, touched: touched.current });
  }, [onChange, topics]);

  const haptic = () => {
    if (soundEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(4); } catch (_) {}
    }
  };

  // Subject wheel drives the lesson wheel.
  const onSubjGrab = useCallback(() => { active.current = 'subject'; firstGesture(); }, []);
  const onSubjSettle = useCallback((i) => {
    if (active.current === 'subject') {
      const subj = topics[i];
      const li = lessonIndexForSubject(subj.id, LESSONS[tierRef.current]);
      lessApi.current?.glideTo(li, true);
      haptic();
    }
    emit();
  }, [topics, lessonIndexForSubject, emit]);

  // Lesson wheel drives the subject wheel (live follow + on settle).
  const onLessGrab = useCallback(() => { active.current = 'lesson'; firstGesture(); }, []);
  const onLessLive = useCallback((i) => {
    if (active.current !== 'lesson') return;
    const subjId = LESSONS[tierRef.current][i].t;
    const si = topics.findIndex((t) => t.id === subjId);
    if (si >= 0 && !subjApi.current?.isDragging()) subjApi.current?.glideTo(si, true);
  }, [topics]);
  const onLessSettle = useCallback((i) => {
    if (active.current === 'lesson') {
      const les = LESSONS[tierRef.current][i];
      lastLessonBySubject.current[les.t] = labelText(les.label);
      const si = topics.findIndex((t) => t.id === les.t);
      if (si >= 0) subjApi.current?.glideTo(si, true);
      haptic();
    }
    emit();
  }, [topics, emit]);

  // initial centering
  useIso(() => {
    subjApi.current?.setIndex(0);
    lessApi.current?.setIndex(lessonIndexForSubject(topics[0].id, LESSONS['foundations']));
    emit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // idle auto-roll of the lesson wheel until first touch, so it reads as alive.
  useEffect(() => {
    if (reducedMotion()) return;
    const id = setInterval(() => {
      if (touched.current) return;
      const cur = lessApi.current?.getIndex();
      if (cur == null) return;
      active.current = 'lesson';
      lessApi.current?.glideTo(cur + 1, false);
      // let the live-follow drag the subject; but do not mark touched.
      touched.current = false;
    }, 2600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tier switch: keep the subject, remap the lesson wheel to that subject's lesson
  // in the new tier. The lesson items change under the wheel; realign instantly.
  const switchTier = (next) => {
    if (next === tier) return;
    firstGesture();
    haptic();
    const si = subjApi.current?.getIndex() ?? 0;
    const subjId = topics[si].id;
    setTier(next);
    // after the new lessons render, snap the lesson wheel onto the matching lesson
    requestAnimationFrame(() => {
      const li = lessonIndexForSubject(subjId, LESSONS[next]);
      lessApi.current?.setIndex(li);
      emit();
    });
  };

  return (
    <div style={{ width: '100%', maxWidth: 340, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#8A94A8', marginBottom: 8 }}>
        Ten minutes of...
      </div>

      <div style={{ position: 'relative' }}>
        {/* fixed centre selection band */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: 8, right: 8, top: PAD - 1, height: ITEM + 2,
          borderRadius: 12, background: 'rgba(34,163,154,0.06)',
          borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
          pointerEvents: 'none', zIndex: 2,
        }} />

        <div style={{
          display: 'flex', alignItems: 'stretch', position: 'relative', height: WHEEL_H,
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 24%, black 76%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 24%, black 76%, transparent)',
        }}>
          <div style={{ flex: '0 0 44%', display: 'flex' }}>
            <Wheel ref={subjApi} items={topics} align="right" ariaLabel="Subject"
              onGrab={onSubjGrab} onSettle={onSubjSettle} defaultInk={T.navy} />
          </div>
          <div style={{ width: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.inkHint, fontSize: 15, pointerEvents: 'none' }}>·</div>
          <div style={{ flex: 1, display: 'flex' }}>
            <Wheel ref={lessApi} items={lessons} align="left" ariaLabel="Topic"
              onGrab={onLessGrab} onLive={onLessLive} onSettle={onLessSettle} defaultInk="#3A4763" />
          </div>
        </div>
      </div>

      {/* difficulty toggle */}
      <div role="group" aria-label="Difficulty" style={{
        display: 'flex', gap: 0, marginTop: 16, padding: 4, background: '#fff',
        border: `1px solid ${T.border}`, borderRadius: 14,
      }}>
        {TIERS.map((k) => {
          const activeTier = tier === k;
          const meta = TIER_META[k];
          return (
            <button key={k} type="button" aria-pressed={activeTier} onClick={() => switchTier(k)}
              style={{
                flex: 1, minHeight: 44, padding: '9px 4px', border: 'none', cursor: 'pointer',
                borderRadius: 10, fontFamily: FONT, fontSize: 12, fontWeight: 600,
                background: activeTier ? meta.color : 'transparent',
                color: activeTier ? '#fff' : T.inkSecondary,
                transition: 'background .18s ease, color .18s ease',
                WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
              }}>
              {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
