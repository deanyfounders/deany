import React from 'react';

/*
 * 3D diamond-shaped lesson node — Chess.com style.
 *
 * Structure: rotated 45° square with rounded corners.
 * Depth: a darker offset layer behind the main face.
 * Content: counter-rotated so text/icons stay upright.
 *
 * States:
 *   active    — gold, pulsing ring, lesson number
 *   completed — teal, checkmark
 *   locked    — gray, muted, lock icon
 */

const DIAMOND = 58;
const RADIUS  = 15;
const DEPTH   = 6;

const MAT = {
  active: {
    face: 'linear-gradient(135deg, #D4B86A 0%, #C5A55A 50%, #B89A4A 100%)',
    depth: '#8A6E30',
    shadow: '0 6px 20px rgba(197,165,90,0.35), 0 2px 6px rgba(0,0,0,0.1)',
    innerShadow: 'inset 0 1px 3px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.1)',
    ring: '#C5A55A',
  },
  completed: {
    face: 'linear-gradient(135deg, #3AADA0 0%, #2A7B88 50%, #1E6670 100%)',
    depth: '#18545C',
    shadow: '0 4px 14px rgba(42,123,136,0.25), 0 2px 4px rgba(0,0,0,0.08)',
    innerShadow: 'inset 0 1px 3px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.08)',
    ring: null,
  },
  locked: {
    face: 'linear-gradient(135deg, #D8D4CE 0%, #C0BAB2 50%, #AAA49C 100%)',
    depth: '#908A82',
    shadow: '0 3px 8px rgba(0,0,0,0.06)',
    innerShadow: 'inset 0 1px 2px rgba(255,255,255,0.2)',
    ring: null,
  },
};

const PathNode = ({ index, state, title, duration, onClick }) => {
  const m = MAT[state] || MAT.locked;
  const isActive = state === 'active';
  const isDone   = state === 'completed';
  const isLocked = state === 'locked';

  const half = DIAMOND / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Diamond container */}
      <div style={{ position: 'relative', width: 90, height: 90 }}>

        {/* Pulse ring — active only */}
        {isActive && (
          <div className="lp-pulse" style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: DIAMOND + 16, height: DIAMOND + 16,
            marginLeft: -(half + 8), marginTop: -(half + 8),
            transform: 'rotate(45deg)',
            borderRadius: RADIUS + 4,
            border: '2.5px solid rgba(197,165,90,0.5)',
          }} />
        )}

        {/* Drop shadow on ground */}
        <div style={{
          position: 'absolute',
          bottom: -2, left: '50%', transform: 'translateX(-50%)',
          width: 56, height: 12,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)',
        }} />

        {/* Depth/side face */}
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          width: DIAMOND, height: DIAMOND,
          marginLeft: -half, marginTop: -half + DEPTH,
          transform: 'rotate(45deg)',
          borderRadius: RADIUS,
          background: m.depth,
        }} />

        {/* Main face (button) */}
        <button
          onClick={isLocked ? undefined : onClick}
          disabled={isLocked}
          className="lp-node-btn"
          style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: DIAMOND, height: DIAMOND,
            marginLeft: -half, marginTop: -half,
            transform: 'rotate(45deg)',
            borderRadius: RADIUS,
            background: m.face,
            boxShadow: `${m.shadow}, ${m.innerShadow}`,
            border: 'none',
            padding: 0,
            cursor: isLocked ? 'default' : 'pointer',
            outline: 'none',
            opacity: isLocked ? 0.5 : 1,
            WebkitTapHighlightColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Highlight spot (top-left) */}
          <div style={{
            position: 'absolute', top: 7, left: 7,
            width: 20, height: 20, borderRadius: '50%',
            background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.28), transparent)',
            pointerEvents: 'none',
          }} />

          {/* Counter-rotated content */}
          <div style={{ transform: 'rotate(-45deg)' }}>
            {isDone ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : isLocked ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" opacity="0.7">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#fff" strokeWidth="2" fill="none" />
                <path d="M8 11V8a4 4 0 018 0v3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            ) : (
              <span style={{
                color: '#fff',
                fontSize: 24,
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                textShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}>
                {index + 1}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Title */}
      <p style={{
        marginTop: 10,
        fontSize: 13,
        fontWeight: 700,
        fontFamily: 'Georgia, serif',
        color: isLocked ? '#B0A898' : '#1B2A4A',
        textAlign: 'center',
        lineHeight: 1.3,
        maxWidth: 120,
      }}>
        {title}
      </p>
      {duration && (
        <p style={{
          marginTop: 2,
          fontSize: 11,
          color: '#A8A098',
          textAlign: 'center',
        }}>
          {duration}
        </p>
      )}
    </div>
  );
};

export default PathNode;
