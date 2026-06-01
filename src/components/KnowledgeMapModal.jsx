import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { concepts, edges, positions, trackAccents, computeStates } from '../data/conceptGraph.js';

const W = 800, H = 600;

const KnowledgeMapModal = ({ onClose, completedLessons = {} }) => {
  const states = useMemo(() => computeStates(completedLessons), [completedLessons]);
  const [tf, setTf] = useState({ x: 0, y: 0, s: 1 });
  const [drag, setDrag] = useState(null);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  // Stable star field
  const stars = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    cx: ((i * 97 + 31) % W), cy: ((i * 53 + 17) % H), r: (i % 3) * 0.4 + 0.4, o: (i % 5) * 0.06 + 0.04,
  })), []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => { ref.current?.focus(); }, []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    setTf(t => ({ ...t, s: Math.max(0.4, Math.min(3, t.s - e.deltaY * 0.001)) }));
  }, []);

  const onDown = (e) => {
    if (e.target.closest('[data-node]')) return;
    setDrag({ sx: e.clientX - tf.x, sy: e.clientY - tf.y });
  };
  const onMove = (e) => { if (drag) setTf(t => ({ ...t, x: e.clientX - drag.sx, y: e.clientY - drag.sy })); };
  const onUp = () => setDrag(null);

  const nColor = (c) => states[c.id] === 'unlocked' ? (trackAccents[c.track] || '#22A39A') : states[c.id] === 'available' ? '#F0B429' : '#2A4A5A';
  const eColor = (f, t) => {
    if (states[f] === 'unlocked' && states[t] === 'unlocked') return (trackAccents[concepts.find(c => c.id === f)?.track] || '#22A39A') + '90';
    if (states[f] === 'unlocked' && states[t] === 'available') return '#F0B42960';
    return '#1A3040';
  };

  const counts = useMemo(() => {
    const v = Object.values(states);
    return { unlocked: v.filter(s => s === 'unlocked').length, available: v.filter(s => s === 'available').length, locked: v.filter(s => s === 'locked').length };
  }, [states]);

  return (
    <div ref={ref} tabIndex={-1} role="dialog" aria-label="Knowledge map" onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(8,24,32,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', outline: 'none' }}>
      <div style={{ width: '92vw', maxWidth: 1060, height: '82vh', maxHeight: 720, background: 'linear-gradient(160deg, #081820, #0F3340)', borderRadius: 20, position: 'relative', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid rgba(127,216,206,0.08)', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 500, color: '#7FD8CE' }}>Your Knowledge Galaxy</div>
            <div style={{ fontSize: 10, color: '#4A7A7A', marginTop: 2 }}>{counts.unlocked} unlocked · {counts.available} available · {counts.locked} locked</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, fontSize: 9, color: '#5A8A8A' }}>
              {[['Unlocked', '#22A39A'], ['Next', '#F0B429'], ['Locked', '#2A4A5A']].map(([l, c]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: c }} /> {l}
                </span>
              ))}
            </div>
            <button onClick={() => setTf(t => ({ ...t, s: Math.min(3, t.s + 0.3) }))} style={{ background: 'rgba(127,216,206,0.08)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#7FD8CE', minHeight: 36, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ZoomIn size={14} /></button>
            <button onClick={() => setTf(t => ({ ...t, s: Math.max(0.4, t.s - 0.3) }))} style={{ background: 'rgba(127,216,206,0.08)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: '#7FD8CE', minHeight: 36, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ZoomOut size={14} /></button>
            <button onClick={onClose} aria-label="Close" style={{ background: 'rgba(127,216,206,0.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#7FD8CE', display: 'flex', minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
          </div>
        </div>

        {/* Canvas */}
        <div style={{ width: '100%', height: 'calc(100% - 56px)', cursor: drag ? 'grabbing' : 'grab', overflow: 'hidden' }}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onWheel={onWheel}>
          <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
            style={{ transform: `translate(${tf.x}px,${tf.y}px) scale(${tf.s})`, transformOrigin: 'center', transition: drag ? 'none' : 'transform .12s ease-out' }}>
            <defs>
              <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <filter id="glowStrong"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {stars.map((s, i) => <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#7FD8CE" opacity={s.o} />)}

            {/* Edges */}
            {edges.map(([f, t], i) => {
              const pf = positions[f], pt = positions[t];
              if (!pf || !pt) return null;
              return <line key={i} x1={pf.x * W} y1={pf.y * H} x2={pt.x * W} y2={pt.y * H} stroke={eColor(f, t)} strokeWidth={1.2}
                strokeDasharray={states[t] === 'locked' ? '4 4' : 'none'} />;
            })}

            {/* Nodes */}
            {concepts.map(c => {
              const p = positions[c.id];
              if (!p) return null;
              const cx = p.x * W, cy = p.y * H, s = states[c.id];
              const color = nColor(c), r = s === 'available' ? 13 : s === 'unlocked' ? 11 : 7;
              return (
                <g key={c.id} data-node style={{ cursor: 'pointer' }} onClick={() => setSelected(selected === c.id ? null : c.id)}>
                  {s !== 'locked' && <circle cx={cx} cy={cy} r={r + 10} fill={color} opacity={0.1} filter="url(#glow)" />}
                  {s === 'available' && <circle cx={cx} cy={cy} r={r + 6} fill="none" stroke="#F0B429" strokeWidth={1} opacity={0.4}>
                    <animate attributeName="r" values={`${r + 4};${r + 14};${r + 4}`} dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.12;0.4" dur="3s" repeatCount="indefinite" />
                  </circle>}
                  <circle cx={cx} cy={cy} r={r} fill={s === 'locked' ? '#152530' : color}
                    stroke={s === 'available' ? '#F0B429' : s === 'unlocked' ? color : '#243A4A'} strokeWidth={s === 'available' ? 2 : 1}
                    strokeDasharray={s === 'locked' ? '2.5 2.5' : 'none'} filter={s !== 'locked' ? 'url(#glow)' : undefined} />
                  {s === 'unlocked' && <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize={9} fill="#fff" fontWeight="bold">&#10003;</text>}
                  <text x={cx} y={cy + r + 13} textAnchor="middle" fontSize={8.5} fill={s === 'locked' ? '#2A4A5A' : '#8AC0B8'} fontWeight={s === 'available' ? 600 : 400}>{c.label}</text>
                </g>
              );
            })}

            {/* Track labels */}
            <text x={0.18 * W} y={0.04 * H} textAnchor="middle" fontSize={10} fill="#22A39A" opacity={0.5} fontWeight={600}>5 PILLARS</text>
            <text x={0.68 * W} y={0.06 * H} textAnchor="middle" fontSize={10} fill="#235C7A" opacity={0.5} fontWeight={600}>QURAN</text>
            <text x={0.72 * W} y={0.35 * H} textAnchor="middle" fontSize={10} fill="#F0B429" opacity={0.5} fontWeight={600}>FINANCE</text>
          </svg>
        </div>

        {/* Detail panel */}
        {selected && (() => {
          const c = concepts.find(n => n.id === selected);
          if (!c) return null;
          const s = states[selected];
          const reqIds = edges.filter(([, t]) => t === c.id).map(([f]) => f);
          const missing = reqIds.filter(r => states[r] !== 'unlocked').map(r => concepts.find(n => n.id === r)?.label).filter(Boolean);
          return (
            <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(12,40,52,0.95)', border: '1px solid rgba(127,216,206,0.15)', borderRadius: 14, padding: '12px 18px', minWidth: 240, backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: '#fff' }}>{c.label}</div>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 8, background: s === 'unlocked' ? 'rgba(34,163,154,0.2)' : s === 'available' ? 'rgba(240,180,41,0.2)' : 'rgba(42,74,90,0.3)', color: s === 'unlocked' ? '#7FD8CE' : s === 'available' ? '#F0B429' : '#5A7A8A' }}>
                  {s === 'unlocked' ? 'Completed' : s === 'available' ? 'Available' : 'Locked'}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#6A9A9A', marginTop: 5, lineHeight: 1.4 }}>
                {s === 'unlocked' && 'You\'ve completed this concept.'}
                {s === 'available' && 'Ready to start - all prerequisites met.'}
                {s === 'locked' && (missing.length ? `Complete ${missing.join(', ')} first.` : 'Prerequisites not yet met.')}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default KnowledgeMapModal;
