import React from 'react';

/**
 * PrayerFigure — SVG silhouette figure that morphs between salah positions.
 * Uses currentColor for all fills (inherits text-deany-navy from parent).
 * Each pose is a group of SVG shapes within a 200x240 viewBox.
 */

const C = 'currentColor';

const poses = {
  qiyam: () => (
    <g>
      <circle cx="100" cy="44" r="20" fill={C} />
      <rect x="94" y="64" width="12" height="12" rx="4" fill={C} />
      <rect x="76" y="74" width="48" height="72" rx="10" fill={C} />
      <rect x="58" y="78" width="16" height="54" rx="8" fill={C} />
      <rect x="126" y="78" width="16" height="54" rx="8" fill={C} />
      <rect x="80" y="144" width="18" height="76" rx="8" fill={C} />
      <rect x="102" y="144" width="18" height="76" rx="8" fill={C} />
      <ellipse cx="89" cy="224" rx="13" ry="5" fill={C} />
      <ellipse cx="111" cy="224" rx="13" ry="5" fill={C} />
    </g>
  ),

  takbir: () => (
    <g>
      <circle cx="100" cy="44" r="20" fill={C} />
      <rect x="94" y="64" width="12" height="12" rx="4" fill={C} />
      <rect x="76" y="74" width="48" height="72" rx="10" fill={C} />
      <rect x="52" y="26" width="16" height="58" rx="8" fill={C} />
      <rect x="132" y="26" width="16" height="58" rx="8" fill={C} />
      <ellipse cx="60" cy="22" rx="8" ry="10" fill={C} />
      <ellipse cx="140" cy="22" rx="8" ry="10" fill={C} />
      <rect x="80" y="144" width="18" height="76" rx="8" fill={C} />
      <rect x="102" y="144" width="18" height="76" rx="8" fill={C} />
      <ellipse cx="89" cy="224" rx="13" ry="5" fill={C} />
      <ellipse cx="111" cy="224" rx="13" ry="5" fill={C} />
    </g>
  ),

  qiyamFolded: () => (
    <g>
      <circle cx="100" cy="44" r="20" fill={C} />
      <rect x="94" y="64" width="12" height="12" rx="4" fill={C} />
      <rect x="76" y="74" width="48" height="72" rx="10" fill={C} />
      <rect x="68" y="94" width="64" height="14" rx="7" fill={C} />
      <ellipse cx="100" cy="101" rx="12" ry="7" fill={C} opacity="0.85" />
      <rect x="80" y="144" width="18" height="76" rx="8" fill={C} />
      <rect x="102" y="144" width="18" height="76" rx="8" fill={C} />
      <ellipse cx="89" cy="224" rx="13" ry="5" fill={C} />
      <ellipse cx="111" cy="224" rx="13" ry="5" fill={C} />
    </g>
  ),

  ruku: () => (
    <g>
      <circle cx="52" cy="92" r="18" fill={C} />
      <rect x="54" y="102" width="68" height="32" rx="10" fill={C} />
      <rect x="108" y="102" width="12" height="48" rx="6" fill={C} />
      <rect x="62" y="102" width="12" height="48" rx="6" fill={C} />
      <ellipse cx="126" cy="126" rx="16" ry="16" fill={C} />
      <rect x="118" y="140" width="16" height="78" rx="8" fill={C} />
      <rect x="138" y="140" width="16" height="78" rx="8" fill={C} />
      <ellipse cx="126" cy="222" rx="12" ry="5" fill={C} />
      <ellipse cx="146" cy="222" rx="12" ry="5" fill={C} />
    </g>
  ),

  standingFromRuku: () => (
    <g>
      <circle cx="100" cy="44" r="20" fill={C} />
      <rect x="94" y="64" width="12" height="12" rx="4" fill={C} />
      <rect x="76" y="74" width="48" height="72" rx="10" fill={C} />
      <rect x="54" y="82" width="16" height="52" rx="8" fill={C} />
      <rect x="130" y="82" width="16" height="52" rx="8" fill={C} />
      <rect x="80" y="144" width="18" height="76" rx="8" fill={C} />
      <rect x="102" y="144" width="18" height="76" rx="8" fill={C} />
      <ellipse cx="89" cy="224" rx="13" ry="5" fill={C} />
      <ellipse cx="111" cy="224" rx="13" ry="5" fill={C} />
    </g>
  ),

  sujud: () => (
    <g>
      <circle cx="38" cy="210" r="14" fill={C} />
      <ellipse cx="84" cy="196" rx="44" ry="18" fill={C} />
      <rect x="22" y="206" width="36" height="10" rx="5" fill={C} />
      <ellipse cx="128" cy="178" rx="18" ry="18" fill={C} />
      <rect x="120" y="190" width="12" height="32" rx="6" fill={C} />
      <rect x="138" y="190" width="12" height="32" rx="6" fill={C} />
      <ellipse cx="132" cy="194" rx="12" ry="7" fill={C} />
      <ellipse cx="126" cy="224" rx="9" ry="5" fill={C} />
      <ellipse cx="144" cy="224" rx="9" ry="5" fill={C} />
    </g>
  ),

  sitting: () => (
    <g>
      <circle cx="100" cy="128" r="18" fill={C} />
      <rect x="94" y="146" width="12" height="8" rx="4" fill={C} />
      <rect x="82" y="152" width="36" height="44" rx="8" fill={C} />
      <rect x="68" y="168" width="14" height="30" rx="7" fill={C} />
      <rect x="118" y="168" width="14" height="30" rx="7" fill={C} />
      <rect x="62" y="194" width="76" height="14" rx="7" fill={C} />
      <rect x="56" y="204" width="16" height="12" rx="6" fill={C} />
      <rect x="128" y="204" width="16" height="12" rx="6" fill={C} />
      <ellipse cx="64" cy="220" rx="12" ry="5" fill={C} />
      <ellipse cx="136" cy="220" rx="12" ry="5" fill={C} />
    </g>
  ),
};

const PrayerFigure = ({ position = 'qiyam', onClick, showHint = false, className = '' }) => {
  const renderPose = poses[position] || poses.qiyam;
  const isGroundPose = position === 'sujud' || position === 'sitting' || position === 'ruku';

  return (
    <div
      className={`relative cursor-pointer select-none text-deany-navy ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Prayer position: ${position}. Tap to advance.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Pulsing glow behind figure */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-40 h-40 rounded-full animate-pulse-gold"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)' }}
        />
      </div>

      <svg
        viewBox="0 0 200 240"
        className="w-48 h-56 mx-auto"
        style={{ filter: 'drop-shadow(0 2px 6px rgba(26,35,50,0.10))' }}
      >
        {/* Subtle ground line for grounded poses */}
        {isGroundPose && (
          <line
            x1="10" y1="232" x2="190" y2="232"
            className="stroke-deany-border"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {renderPose()}
      </svg>

      {/* Tap hint */}
      {showHint && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap animate-fade-in">
          <span className="text-sm text-deany-muted italic">Tap the figure to begin</span>
        </div>
      )}
    </div>
  );
};

export default PrayerFigure;
