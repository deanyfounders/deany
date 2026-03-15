import React from 'react';
import PathNode from './PathNode';
import PathAsset from './PathAsset';
import LanternAsset from './assets/LanternAsset';
import BookAsset from './assets/BookAsset';
import ScaleAsset from './assets/ScaleAsset';
import StarAsset from './assets/StarAsset';

/* ── Layout constants ── */
const SCENE_W = 320;
const Y_START = 170;
const Y_GAP   = 160;
const ZIGZAG  = 36;
const CENTER  = SCENE_W / 2;

const DECO_ASSETS = [LanternAsset, BookAsset, ScaleAsset, StarAsset];

/* ── Compute positions dynamically for N lessons ── */
function buildLayout(count) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: i === count - 1 && count > 1 ? CENTER : CENTER + (i % 2 === 0 ? ZIGZAG : -ZIGZAG),
      y: Y_START + i * Y_GAP,
    });
  }

  // Art-directed decorative positions
  const decos = [];
  if (count > 0) {
    decos.push({ x: CENTER - 18, y: 55, asset: 0 });  // Lantern — before first node
  }
  if (count > 2) {
    const midIdx = Math.min(1, count - 2);
    decos.push({
      x: CENTER + 22,
      y: (nodes[midIdx].y + nodes[midIdx + 1].y) / 2,
      asset: 1,  // Book
    });
  }
  if (count > 4) {
    decos.push({
      x: CENTER - 24,
      y: (nodes[3].y + nodes[4].y) / 2,
      asset: 2,  // Scale
    });
  }
  if (count > 0) {
    decos.push({
      x: CENTER + 10,
      y: nodes[count - 1].y + 115,
      asset: 3,  // Star — after last node
    });
  }

  const totalH = count > 0 ? nodes[count - 1].y + 200 : 400;
  return { nodes, decos, totalH };
}

/* ── Build SVG road path through node centers ── */
function buildRoadPath(nodes, totalH) {
  if (!nodes.length) return '';
  const first = nodes[0];
  let d = `M ${CENTER} 15 C ${CENTER} 80, ${first.x} ${first.y - 70}, ${first.x} ${first.y}`;
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  const last = nodes[nodes.length - 1];
  d += ` C ${last.x} ${last.y + 60}, ${CENTER} ${totalH - 30}, ${CENTER} ${totalH}`;
  return d;
}

/* ── Road SVG component ── */
const RoadLayer = ({ nodes, totalH, roadPath }) => (
  <svg
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    viewBox={`0 0 ${SCENE_W} ${totalH}`}
    preserveAspectRatio="xMidYMid meet"
    fill="none"
  >
    <defs>
      <filter id="road-sh"><feGaussianBlur stdDeviation="3" /></filter>
      <linearGradient id="road-surf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EDE5D4" />
        <stop offset="100%" stopColor="#DDD5C2" />
      </linearGradient>
    </defs>

    {/* Shadow */}
    <path d={roadPath} stroke="rgba(0,0,0,0.06)" strokeWidth="78"
      strokeLinecap="round" strokeLinejoin="round"
      filter="url(#road-sh)" transform="translate(2,4)" />

    {/* Edge */}
    <path d={roadPath} stroke="#D4CCC0" strokeWidth="74"
      strokeLinecap="round" strokeLinejoin="round" />

    {/* Body */}
    <path d={roadPath} stroke="#E8E0D4" strokeWidth="66"
      strokeLinecap="round" strokeLinejoin="round" />

    {/* Surface highlight */}
    <path d={roadPath} stroke="url(#road-surf)" strokeWidth="54"
      strokeLinecap="round" strokeLinejoin="round" />

    {/* Platform spots at node positions */}
    {nodes.map((n, i) => (
      <ellipse key={i} cx={n.x} cy={n.y} rx="40" ry="14"
        fill="rgba(255,255,255,0.12)" />
    ))}

    {/* Center dashes */}
    <path d={roadPath} stroke="#C8BCA8" strokeWidth="1.5"
      strokeDasharray="8 14" strokeLinecap="round" opacity="0.35" />

    {/* Node contact shadows (on road surface) */}
    {nodes.map((n, i) => (
      <ellipse key={`sh-${i}`} cx={n.x} cy={n.y + 42}
        rx="26" ry="5" fill="rgba(0,0,0,0.08)" />
    ))}
  </svg>
);

/* ── Lesson labels positioned beside each node ── */
const LessonLabel = ({ lesson, index, state, nodeX, nodeY, totalH }) => {
  const isRight = nodeX > CENTER;
  const left = isRight
    ? ((nodeX - 108) / SCENE_W) * 100
    : ((nodeX + 48) / SCENE_W) * 100;

  return (
    <div style={{
      position: 'absolute',
      left: `${left}%`,
      top: `${(nodeY / totalH) * 100}%`,
      transform: 'translateY(-50%)',
      width: 95,
      textAlign: isRight ? 'right' : 'left',
      pointerEvents: 'none',
    }}>
      <p style={{
        fontSize: 9,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: state === 'completed' ? '#2A7B88' : state === 'active' ? '#9E7E3A' : '#A8A098',
        margin: 0,
      }}>
        Lesson {index + 1}
      </p>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'Georgia, serif',
        color: state === 'locked' ? '#A8A098' : '#1B2A4A',
        lineHeight: 1.3,
        margin: '2px 0 0',
      }}>
        {lesson.title}
      </p>
      {lesson.duration && (
        <p style={{ fontSize: 9, color: '#A8A098', margin: '2px 0 0' }}>
          {lesson.duration}
        </p>
      )}
    </div>
  );
};

/* ── Main component ── */
const LessonPath = ({ lessons, completedLessons, moduleId, moduleColor, onSelectLesson }) => {
  if (!lessons?.length) return null;

  const { nodes, decos, totalH } = buildLayout(lessons.length);
  const roadPath = buildRoadPath(nodes, totalH);

  const firstIncomplete = lessons.findIndex((_, i) => !completedLessons[`${moduleId}-lesson-${i}`]);
  const getState = (i) => {
    if (completedLessons[`${moduleId}-lesson-${i}`]) return 'completed';
    if (i === firstIncomplete) return 'active';
    return 'locked';
  };

  return (
    <>
      {/* Scoped CSS for node interactions + pulse animation */}
      <style>{`
        .lp-node-btn {
          transform: rotateX(15deg);
          transform-style: preserve-3d;
          transform-origin: center bottom;
          transition: transform 0.2s ease;
        }
        .lp-node-btn:hover:not(:disabled) {
          transform: rotateX(15deg) scale(1.06) translateY(-3px);
        }
        .lp-node-btn:active:not(:disabled) {
          transform: rotateX(15deg) scale(0.97);
        }
        @keyframes lpPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(197,165,90,0.4); }
          50%      { box-shadow: 0 0 0 10px rgba(197,165,90,0); }
        }
        .lp-pulse-ring {
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
        {/* Layer 1: Road */}
        <RoadLayer nodes={nodes} totalH={totalH} roadPath={roadPath} />

        {/* Layer 2: Decorative objects */}
        {decos.map((d, i) => {
          const Comp = DECO_ASSETS[d.asset];
          return (
            <div key={`deco-${i}`} style={{
              position: 'absolute',
              left: `${(d.x / SCENE_W) * 100}%`,
              top: `${(d.y / totalH) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}>
              <PathAsset><Comp size={42} /></PathAsset>
            </div>
          );
        })}

        {/* Layer 3: Lesson nodes + side labels */}
        {lessons.map((lesson, i) => {
          const pos = nodes[i];
          const state = getState(i);
          return (
            <React.Fragment key={lesson.id}>
              <div style={{
                position: 'absolute',
                left: `${(pos.x / SCENE_W) * 100}%`,
                top: `${(pos.y / totalH) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
              }}>
                <PathNode
                  index={i}
                  state={state}
                  title={lesson.title}
                  onClick={() => onSelectLesson(lesson, i)}
                />
              </div>
              <LessonLabel
                lesson={lesson}
                index={i}
                state={state}
                nodeX={pos.x}
                nodeY={pos.y}
                totalH={totalH}
              />
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default LessonPath;
