// LinkedCurriculumPicker - a dual, bidirectionally-linked iPhone-style wheel
// picker (Subject <-> Topic), wired as Islamic Finance Lesson 3 for the app.
//
// Motion is a hand-rolled inertial engine (pointer events + requestAnimationFrame),
// NOT native scroll: 1:1 drag, velocity-sampled momentum with exponential
// friction, a critically-damped settle with a tiny overshoot, and true infinite
// looping via modular slot rendering. The left wheel is Subjects; the right wheel
// is the flattened topic list (each topic tagged with its subject) so a topic
// spin can glide the subject wheel into place. Live positions live in refs;
// React state only updates on settle. An active-owner guard prevents a sync loop.
import React, { useEffect, useLayoutEffect, useRef, useState, useMemo, useCallback, forwardRef, useImperativeHandle } from 'react';
import { ArrowLeft } from 'lucide-react';
import { T, FONT } from './onboarding/kit/tokens.js';

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const ITEM = 40;
const WHEEL_H = 200;
const PAD = (WHEEL_H - ITEM) / 2;
const RENDER = 5;
const ANGLE = 16;
const FRICTION = 1.9;
const MIN_FLICK = 2.0;
const SETTLE_VEL = 2.2;
const K_SETTLE = 200, R_SETTLE = 0.82;
const K_FOLLOW = 110, R_FOLLOW = 0.92;

const now = () => (typeof performance !== 'undefined' ? performance.now() : 0);
const mod = (n, m) => ((n % m) + m) % m;
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── One infinite inertial wheel (reusable motion controller) ────
const Wheel = forwardRef(function Wheel(
  { items, align, ariaLabel, onGrab, onLive, onSettle, defaultInk, big },
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
    if (!L) return;
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
      const opacity = Math.max(0.12, 1 - ad * 0.2);
      el.style.transform =
        `translate3d(0, ${d * ITEM}px, 0) perspective(760px) rotateX(${-angle}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.filter = ad > 1.7 ? `blur(${Math.min((ad - 1.7) * 0.6, 1.1)}px)` : 'none';
      const it = list[mod(base + o, L)];
      const txt = it.label;
      if (el.__txt !== txt) {
        el.firstChild.textContent = txt;
        el.firstChild.style.color = it.ink || defaultInk || '#3A4763';
        el.firstChild.style.fontWeight = ad < 0.5 ? '600' : (big ? '600' : '500');
        el.__txt = txt;
      }
    }
    if (base !== s.lastBase) { s.lastBase = base; if (onLive) onLive(mod(base, L)); }
  }, [onLive, defaultInk, big]);

  const stop = useCallback(() => { const s = S.current; if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; } }, []);

  const tick = useCallback(() => {
    const s = S.current;
    const t = now();
    let dt = (t - s.lastT) / 1000; s.lastT = t;
    if (dt > 0.05) dt = 0.05; if (dt <= 0) dt = 0.016;
    if (!s.dragging) {
      if (s.mode === 'inertia') {
        s.pos += s.vel * dt; s.vel *= Math.exp(-FRICTION * dt);
        if (Math.abs(s.vel) < SETTLE_VEL) { s.mode = 'spring'; s.target = Math.round(s.pos); s.kK = K_SETTLE; s.kR = R_SETTLE; }
      } else if (s.mode === 'spring') {
        const c = 2 * Math.sqrt(s.kK) * s.kR;
        const a = -s.kK * (s.pos - s.target) - c * s.vel;
        s.vel += a * dt; s.pos += s.vel * dt;
        if (Math.abs(s.pos - s.target) < 0.0009 && Math.abs(s.vel) < 0.03) {
          s.pos = s.target; s.vel = 0; s.mode = 'idle';
          paint(); stop();
          if (onSettle) onSettle(mod(s.target, itemsRef.current.length));
          return;
        }
      } else { paint(); stop(); return; }
    }
    paint();
    s.raf = requestAnimationFrame(tick);
  }, [paint, stop, onSettle]);

  const run = useCallback(() => { const s = S.current; if (!s.raf) { s.lastT = now(); s.raf = requestAnimationFrame(tick); } }, [tick]);

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
    const dy = e.clientY - s.lastY; s.lastY = e.clientY;
    s.pos -= dy / ITEM;
    let dt = (t - s.lastMoveT) / 1000; s.lastMoveT = t;
    if (dt > 0) { const v = (-dy / ITEM) / dt; s.samples.push(v); if (s.samples.length > 5) s.samples.shift(); }
    paint();
  }, [paint]);

  const onUp = useCallback((e) => {
    const s = S.current;
    if (!s.dragging) return;
    s.dragging = false;
    try { hostRef.current.releasePointerCapture(e.pointerId); } catch (_) {}
    const v = s.samples.length ? s.samples.reduce((a, b) => a + b, 0) / s.samples.length : 0;
    s.vel = v; s.kK = K_SETTLE; s.kR = R_SETTLE;
    if (reduced.current || Math.abs(v) < MIN_FLICK) { s.mode = 'spring'; s.target = Math.round(s.pos); }
    else { s.mode = 'inertia'; }
    run();
  }, [run]);

  const onKey = useCallback((e) => {
    const s = S.current;
    const step = e.key === 'PageDown' ? 3 : e.key === 'PageUp' ? -3 : e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!step && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    if (onGrab) onGrab();
    stop(); s.mode = 'spring'; s.vel = 0; s.kK = K_SETTLE; s.kR = R_SETTLE;
    const L = itemsRef.current.length;
    if (e.key === 'Home') s.target = Math.round(s.pos) - mod(Math.round(s.pos), L);
    else if (e.key === 'End') s.target = Math.round(s.pos) + (L - 1 - mod(Math.round(s.pos), L));
    else s.target = Math.round(s.pos) + step;
    run();
  }, [onGrab, run, stop]);

  useImperativeHandle(api, () => ({
    glideTo(index, soft = true) {
      const s = S.current;
      if (s.dragging) return;
      const L = itemsRef.current.length;
      const diff = Math.round((s.pos - index) / L);
      s.target = index + diff * L; s.mode = 'spring';
      s.kK = soft ? K_FOLLOW : K_SETTLE; s.kR = soft ? R_FOLLOW : R_SETTLE;
      run();
    },
    setIndex(index) {
      const s = S.current; stop();
      s.pos = index; s.target = index; s.vel = 0; s.mode = 'idle'; s.lastBase = Math.round(index);
      paint();
    },
    getIndex() { return mod(Math.round(S.current.pos), itemsRef.current.length); },
    isDragging() { return S.current.dragging; },
  }), [paint, run, stop]);

  useIso(() => { reduced.current = reducedMotion(); paint(); return stop; /* eslint-disable-next-line */ }, []);

  const rows = []; for (let o = -RENDER; o <= RENDER; o++) rows.push(o);
  return (
    <div ref={hostRef} role="listbox" aria-label={ariaLabel} tabIndex={0}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey}
      style={{ position: 'relative', flex: 1, height: WHEEL_H, outline: 'none', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', cursor: 'grab', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: PAD, left: 0, right: 0, height: ITEM, transformStyle: 'preserve-3d', pointerEvents: 'none' }}>
        {rows.map((o) => (
          <div key={o} ref={(el) => { slots.current[o + RENDER] = el; }}
            style={{ position: 'absolute', left: 0, right: 0, height: ITEM, display: 'flex', alignItems: 'center',
              justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
              padding: align === 'right' ? '0 8px 0 0' : '0 0 0 8px', willChange: 'transform, opacity', backfaceVisibility: 'hidden' }}>
            <span style={{ fontFamily: FONT, fontSize: big ? 16 : 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }} />
          </div>
        ))}
      </div>
    </div>
  );
});

// ── The linked picker ───────────────────────────────────────────
export function LinkedCurriculumPicker({ curriculum, value, onChange }) {
  const subjects = curriculum;
  const flat = useMemo(
    () => curriculum.flatMap((s) => s.topics.map((t) => ({ ...t, subjectId: s.id }))),
    [curriculum]
  );
  const subjItems = useMemo(() => subjects.map((s) => ({ label: s.label, ink: T.navy })), [subjects]);
  const topicItems = useMemo(() => flat.map((t) => ({ label: t.label, ink: '#3A4763' })), [flat]);

  const subjApi = useRef(null);
  const topicApi = useRef(null);
  const active = useRef(null);
  const lastTopicBySubject = useRef({});

  const subjectIndex = useCallback((id) => Math.max(0, subjects.findIndex((s) => s.id === id)), [subjects]);
  const flatIndexOfTopic = useCallback((id) => flat.findIndex((t) => t.id === id), [flat]);
  const flatIndexForSubject = useCallback((subjId) => {
    const remembered = lastTopicBySubject.current[subjId];
    if (remembered) { const i = flat.findIndex((t) => t.subjectId === subjId && t.id === remembered); if (i >= 0) return i; }
    const f = flat.findIndex((t) => t.subjectId === subjId);
    return f >= 0 ? f : 0;
  }, [flat]);

  const haptic = () => { if (typeof navigator !== 'undefined' && navigator.vibrate) { try { navigator.vibrate(4); } catch (_) {} } };
  const emit = useCallback((subjectId, topicId) => { if (onChange) onChange({ subjectId, topicId }); }, [onChange]);

  const onSubjGrab = useCallback(() => { active.current = 'subject'; }, []);
  const onSubjSettle = useCallback((i) => {
    const subj = subjects[i];
    if (active.current === 'subject') {
      const fi = flatIndexForSubject(subj.id);
      topicApi.current?.glideTo(fi, true);
      haptic();
      emit(subj.id, flat[fi]?.id);
    }
  }, [subjects, flat, flatIndexForSubject, emit]);

  const onTopicGrab = useCallback(() => { active.current = 'topic'; }, []);
  const onTopicLive = useCallback((i) => {
    if (active.current !== 'topic') return;
    const si = subjectIndex(flat[i].subjectId);
    if (!subjApi.current?.isDragging()) subjApi.current?.glideTo(si, true);
  }, [flat, subjectIndex]);
  const onTopicSettle = useCallback((i) => {
    const t = flat[i];
    if (active.current === 'topic') {
      lastTopicBySubject.current[t.subjectId] = t.id;
      subjApi.current?.glideTo(subjectIndex(t.subjectId), true);
      haptic();
    }
    emit(t.subjectId, t.id);
  }, [flat, subjectIndex, emit]);

  // programmatic initial selection from `value`
  useIso(() => {
    const subjId = value?.subjectId || subjects[0]?.id;
    let ti = value?.topicId ? flatIndexOfTopic(value.topicId) : -1;
    if (ti < 0) ti = flatIndexForSubject(subjId);
    subjApi.current?.setIndex(subjectIndex(subjId));
    topicApi.current?.setIndex(ti < 0 ? 0 : ti);
    if (flat[ti]) lastTopicBySubject.current[flat[ti].subjectId] = flat[ti].id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 360, margin: '0 auto' }}>
      <div style={{ position: 'relative' }}>
        {/* fixed centre selection band */}
        <div aria-hidden="true" style={{ position: 'absolute', left: 6, right: 6, top: PAD - 1, height: ITEM + 2, borderRadius: 12, background: 'rgba(34,163,154,0.06)', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ display: 'flex', alignItems: 'stretch', position: 'relative', height: WHEEL_H, perspective: '1000px',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)' }}>
          <div style={{ flex: '0 0 46%', display: 'flex' }}>
            <Wheel ref={subjApi} items={subjItems} align="right" ariaLabel="Subject" big
              onGrab={onSubjGrab} onSettle={onSubjSettle} defaultInk={T.navy} />
          </div>
          <div style={{ width: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.inkHint, fontSize: 15, pointerEvents: 'none' }}>·</div>
          <div style={{ flex: 1, display: 'flex' }}>
            <Wheel ref={topicApi} items={topicItems} align="left" ariaLabel="Topic"
              onGrab={onTopicGrab} onLive={onTopicLive} onSettle={onTopicSettle} defaultInk="#3A4763" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Lesson-3 screen wrapper (app routing: onBack / onHome / onGoToNext) ──
const CURRICULUM = [
  { id: 'five-pillars', label: 'Five Pillars', topics: [
    { id: 'shahada', label: 'Shahada' }, { id: 'salah', label: 'Salah' }, { id: 'zakat', label: 'Zakat' },
    { id: 'sawm', label: 'Sawm' }, { id: 'hajj', label: 'Hajj' } ] },
  { id: 'quran', label: 'Qur’an', topics: [
    { id: 'revelation', label: 'Revelation' }, { id: 'surahs', label: 'Understanding Surahs' }, { id: 'memorisation', label: 'Memorisation' } ] },
  { id: 'finance', label: 'Islamic Finance', topics: [
    { id: 'riba', label: 'Riba' }, { id: 'gharar', label: 'Gharar' }, { id: 'maysir', label: 'Maysir' }, { id: 'murabaha', label: 'Murabaha' } ] },
  { id: 'history', label: 'Islamic History', topics: [
    { id: 'pre-islamic-arabia', label: 'Pre-Islamic Arabia' }, { id: 'early-revelation', label: 'Early Revelation' }, { id: 'hijrah', label: 'The Hijrah' } ] },
];

export default function DEANY_M1L3({ onBack, onHome, onGoToNext } = {}) {
  const [sel, setSel] = useState({ subjectId: 'finance', topicId: 'riba' });
  const subject = CURRICULUM.find((s) => s.id === sel.subjectId);
  const topic = subject?.topics.find((t) => t.id === sel.topicId);

  return (
    <div style={{ minHeight: '100%', background: `radial-gradient(120% 80% at 50% -10%, #FCF8F1 0%, #F8F4ED 60%)`, fontFamily: FONT, color: T.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 480, width: '100%', margin: '0 auto', padding: 'calc(env(safe-area-inset-top) + 16px) 18px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <button type="button" onClick={() => { if (onBack) onBack(); }} aria-label="Back"
            style={{ width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, border: `1px solid ${T.border}`, background: '#fff', color: T.inkSecondary, cursor: 'pointer' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, color: T.teal, textTransform: 'uppercase' }}>Islamic Finance · Lesson 3</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>Choose where to start</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ textAlign: 'center', fontSize: 13.5, color: T.inkSecondary, lineHeight: 1.5, margin: '0 auto 20px', maxWidth: 320 }}>
            Spin either wheel. The subject and topic stay linked - pick a topic and its subject follows, pick a subject and the topics come with it.
          </p>

          <div style={{ background: '#fff', borderRadius: 22, border: `1px solid ${T.border}`, boxShadow: '0 18px 50px rgba(15,76,92,0.08)', padding: '18px 12px' }}>
            <LinkedCurriculumPicker curriculum={CURRICULUM} value={sel} onChange={setSel} />
          </div>

          <div aria-live="polite" style={{ textAlign: 'center', marginTop: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, color: T.inkHint, textTransform: 'uppercase', marginBottom: 4 }}>You picked</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: T.tealDeep }}>{subject?.label} · {topic?.label}</div>
          </div>
        </div>

        <button type="button" onClick={() => { if (onGoToNext) onGoToNext(); else if (onHome) onHome(); }}
          style={{ marginTop: 20, width: '100%', minHeight: 52, borderRadius: 16, border: 'none', background: T.teal, color: '#fff', fontFamily: FONT, fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: `0 6px 0 ${T.tealDeep || '#0F4C5C'}` }}>
          Continue
        </button>
      </div>
    </div>
  );
}
