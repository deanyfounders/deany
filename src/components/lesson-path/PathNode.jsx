import React from 'react';

const MATERIALS = {
  completed: {
    top: 'linear-gradient(135deg, #3A9B88, #2A7B88)',
    side: '#1E5E68',
    glow: 'rgba(42,123,136,0.2)',
  },
  active: {
    top: 'linear-gradient(135deg, #D4B86A, #C5A55A)',
    side: '#9E7E3A',
    glow: 'rgba(197,165,90,0.35)',
  },
  locked: {
    top: 'linear-gradient(135deg, #C5BDB0, #B0A898)',
    side: '#918A7E',
    glow: 'rgba(150,140,130,0.1)',
  },
};

/**
 * 3D pedestal lesson node.
 * CSS perspective(800px) + rotateX(15deg) creates the raised-platform look.
 *
 * @param {number}   index       - lesson index (0-based), shown as number on face
 * @param {string}   state       - 'completed' | 'active' | 'locked'
 * @param {string}   title       - lesson title displayed below
 * @param {function} onClick     - tap handler
 */
const PathNode = ({ index, state, title, onClick }) => {
  const m = MATERIALS[state] || MATERIALS.locked;
  const isActive  = state === 'active';
  const isDone    = state === 'completed';
  const isLocked  = state === 'locked';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
      {/* Perspective container */}
      <div style={{ perspective: 800 }}>
        <button
          onClick={isLocked ? undefined : onClick}
          disabled={isLocked}
          className="lp-node-btn"
          style={{
            border: 'none',
            background: 'none',
            padding: 0,
            outline: 'none',
            cursor: isLocked ? 'default' : 'pointer',
            position: 'relative',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {/* Pulse ring for active */}
          {isActive && (
            <div className="lp-pulse-ring" style={{
              position: 'absolute',
              inset: -8,
              borderRadius: 22,
              border: '2px solid rgba(197,165,90,0.4)',
              pointerEvents: 'none',
            }} />
          )}

          {/* Top face */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            background: m.top,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.1)',
            opacity: isLocked ? 0.5 : 1,
          }}>
            {/* Highlight strip */}
            <div style={{
              position: 'absolute',
              top: 5,
              left: 10,
              right: 22,
              height: 5,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.18)',
            }} />

            {isDone ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <span style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 700,
                fontFamily: 'Georgia, serif',
                textShadow: '0 1px 2px rgba(0,0,0,0.15)',
              }}>
                {index + 1}
              </span>
            )}
          </div>

          {/* Side face (depth) */}
          <div style={{
            width: 64,
            height: 10,
            borderRadius: '0 0 14px 14px',
            background: m.side,
            marginTop: -3,
            position: 'relative',
            zIndex: 1,
            opacity: isLocked ? 0.5 : 1,
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '35%',
              borderRadius: '0 0 0 14px',
              background: 'rgba(255,255,255,0.07)',
            }} />
          </div>
        </button>
      </div>

      {/* Contact shadow (ground plane, outside perspective) */}
      <div style={{
        width: 48,
        height: 7,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${m.glow} 0%, transparent 70%)`,
        marginTop: 3,
      }} />

      {/* Lesson title */}
      <p style={{
        marginTop: 7,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'Georgia, serif',
        color: isLocked ? '#A0A0A0' : '#1B2A4A',
        textAlign: 'center',
        lineHeight: 1.3,
        maxWidth: 90,
        margin: '7px auto 0',
      }}>
        {title}
      </p>
    </div>
  );
};

export default PathNode;
