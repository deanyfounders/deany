import React from 'react';
import PathNode from './PathNode';
import PathAsset from './PathAsset';
import LanternAsset from './assets/LanternAsset';
import BookAsset from './assets/BookAsset';
import ScaleAsset from './assets/ScaleAsset';
import StarAsset from './assets/StarAsset';

/* ────────────────────────────────────────────────────────────
   Layout constants — tuned for 375px mobile, max 360px scene
   ──────────────────────────────────────────────────────────── */
const SCENE_W  = 360;
const CENTER   = SCENE_W / 2;
const ZIGZAG   = 55;
const NODE_GAP = 190;
const PAD_TOP  = 110;
const PAD_BOT  = 140;

const ASSETS = [LanternAsset, BookAsset, ScaleAsset, StarAsset];

/* ── Compute positions ── */
function layout(count) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1 && count > 1;
    nodes.push({
      x: isLast ? CENTER : CENTER + (i % 2 === 0 ? ZIGZAG : -ZIGZAG),
      y: PAD_TOP + i * NODE_GAP,
    });
  }

  // Art-directed decorative placement — 3 objects for 5 lessons
  const decos = [];
  if (count > 0) {
    decos.push({ x: CENTER - 25, y: 30, asset: 0 });                               // Lantern before first node
  }
  if (count > 2) {
    const mid = Math.min(1, count - 2);
    decos.push({ x: CENTER + 30, y: (nodes[mid].y + nodes[mid + 1].y) / 2, asset: 1 }); // Book
  }
  if (count > 0) {
    decos.push({ x: CENTER - 15, y: nodes[count - 1].y + 100, asset: 3 });          // Star after last
  }

  const totalH = count > 0 ? nodes[count - 1].y + PAD_BOT : 400;
  return { nodes, decos, totalH };
}

/* ── Build connecting line through node centers ── */
function buildLine(nodes, totalH) {
  if (nodes.length < 2) return '';
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

/* ── Connecting path SVG ── */
const PathLine = ({ nodes, totalH }) => {
  const d = buildLine(nodes, totalH);
  if (!d) return null;
  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      viewBox={`0 0 ${SCENE_W} ${totalH}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
    >
      {/* Shadow line */}
      <path d={d} stroke="rgba(0,0,0,0.04)" strokeWidth="5"
        strokeLinecap="round" transform="translate(1,2)" />
      {/* Main line */}
      <path d={d} stroke="#D8D2C6" strokeWidth="3"
        strokeLinecap="round" />
      {/* Lighter inner highlight */}
      <path d={d} stroke="#E8E2D6" strokeWidth="1.5"
        strokeLinecap="round" />
    </svg>
  );
};

/* ── Main component ── */
const LessonPath = ({ lessons, completedLessons, moduleId, moduleColor, onSelectLesson }) => {
  if (!lessons?.length) return null;

  const { nodes, decos, totalH } = layout(lessons.length);

  const firstIncomplete = lessons.findIndex(
    (_, i) => !completedLessons[`${moduleId}-lesson-${i}`]
  );
  const getState = (i) => {
    if (completedLessons[`${moduleId}-lesson-${i}`]) return 'completed';
    if (i === firstIncomplete) return 'active';
    return 'locked';
  };

  return (
    <>
      {/* Scoped styles for node interactions + pulse */}
      <style>{`
        .lp-node-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .lp-node-btn:hover:not(:disabled) {
          transform: rotate(45deg) scale(1.08) translateY(-3px);
        }
        .lp-node-btn:active:not(:disabled) {
          transform: rotate(45deg) scale(0.96);
        }
        @keyframes lpPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(197,165,90,0.45); }
          50%      { box-shadow: 0 0 0 12px rgba(197,165,90,0); }
        }
        .lp-pulse {
          animation: lpPulse 2s ease-in-out infinite;
        }
      `}</style>

      <div style={{
        position: 'relative',
        width: SCENE_W,
        maxWidth: '100%',
        height: totalH,
        margin: '0 auto',
      }}>
        {/* Layer 1: Connecting line */}
        <PathLine nodes={nodes} totalH={totalH} />

        {/* Layer 2: Decorative objects */}
        {decos.map((d, i) => {
          const Comp = ASSETS[d.asset];
          return (
            <div key={`d${i}`} style={{
              position: 'absolute',
              left: `${(d.x / SCENE_W) * 100}%`,
              top: d.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}>
              <PathAsset><Comp size={52} /></PathAsset>
            </div>
          );
        })}

        {/* Layer 3: Lesson nodes */}
        {lessons.map((lesson, i) => {
          const pos = nodes[i];
          const state = getState(i);
          return (
            <div key={lesson.id} style={{
              position: 'absolute',
              left: `${(pos.x / SCENE_W) * 100}%`,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}>
              <PathNode
                index={i}
                state={state}
                title={lesson.title}
                duration={lesson.duration}
                onClick={() => onSelectLesson(lesson, i)}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default LessonPath;
