// Section 2 primitives - every dashboard surface is composed from these.
// No shadows. Brand tokens + approved tints only. 44px min tap targets.
import React, { useState } from 'react';
import { Flame, Coins, RefreshCw, Check, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { D, RADIUS, FONT, TYPE, subjectOf } from './tokens.js';

const press = () => {
  const [p, setP] = useState(false);
  return [p, { onPointerDown: () => setP(true), onPointerUp: () => setP(false), onPointerLeave: () => setP(false) }];
};

export function Card({ children, style }) {
  return <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: RADIUS.card, padding: 16, ...style }}>{children}</div>;
}

export function IconTile({ subjectId, size = 38, bg, tilt = 0 }) {
  const s = subjectOf(subjectId);
  const Icon = s.Icon;
  return (
    <span style={{ width: size, height: size, borderRadius: RADIUS.tile, background: bg || s.tint, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: tilt ? `rotate(${tilt}deg)` : undefined }}>
      {Icon ? <Icon size={Math.round(size * 0.48)} color={s.ink} strokeWidth={1.75} /> : null}
    </span>
  );
}

export function StatPill({ kind = 'streak', value, pop }) {
  const isStreak = kind === 'streak';
  const c = isStreak ? D.streakPill : D.coinsPill;
  return (
    <span className={pop ? 'dash-pop' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: RADIUS.pill, minHeight: 32 }}>
      {isStreak ? <Flame size={14} color={c.ink} /> : <Coins size={14} color={c.ink} />}
      <span style={{ fontSize: TYPE.meta, fontWeight: 500, color: c.ink }}>{value}</span>
    </span>
  );
}

export function GoalBar({ value = 0, max = 5, width, label }) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  return (
    <div style={{ width }}>
      <div style={{ height: 5, background: D.trackOnCanvas, borderRadius: RADIUS.pill, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: D.teal, borderRadius: RADIUS.pill, transition: 'width .3s ease-out' }} />
      </div>
      {label && <div style={{ fontSize: TYPE.hint, color: D.inkHint, marginTop: 4 }}>{label}</div>}
    </div>
  );
}

function HeroPattern() {
  const diamonds = [[42, 34, 24], [128, 96, 16], [214, 40, 28], [278, 112, 18], [168, 22, 13], [300, 66, 22]];
  return (
    <svg viewBox="0 0 320 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }}>
      {diamonds.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(45)`}>
          <rect x={-s / 2} y={-s / 2} width={s} height={s} fill="none" stroke={D.gold} strokeWidth={1.5} />
          <rect x={-s / 2.6} y={-s / 2.6} width={s / 1.3} height={s / 1.3} fill="none" stroke={D.gold} strokeWidth={1} transform="rotate(45)" />
        </g>
      ))}
    </svg>
  );
}

export function HeroContinueCard({ variant = 'lesson', subjectId, eyebrow, title, meta, progressPct, accent = D.teal, buttonLabel = 'Continue', onPress, rewardCoins = 20 }) {
  const [pressed, setPressed] = useState(false);
  const inProgress = typeof progressPct === 'number' && progressPct > 0;
  const s = subjectId ? subjectOf(subjectId) : null;
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: D.navy, borderRadius: RADIUS.hero, padding: 16, minHeight: 148 }}>
      <span aria-hidden="true" style={{ position: 'absolute', top: -30, right: -22, width: 100, height: 100, borderRadius: '50%', background: accent, opacity: 0.18 }} />
      <HeroPattern />
      {s && s.Icon && (
        <span style={{ position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: 11, background: accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(8deg)', zIndex: 2 }}>
          {React.createElement(s.Icon, { size: 20, color: D.navy, strokeWidth: 2 })}
        </span>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: TYPE.hint, color: D.gold, fontWeight: 500, marginBottom: 5, paddingRight: 44 }}>{eyebrow}</div>
        <div style={{ fontSize: 18, fontWeight: 500, color: D.canvas, lineHeight: 1.3, marginBottom: 3, paddingRight: 44 }}>{title}</div>
        {meta && <div style={{ fontSize: TYPE.meta, color: D.navyMuted }}>{meta}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 13 }}>
          {inProgress ? (
            <div style={{ flex: 1, height: 6, background: D.navyDivider, borderRadius: RADIUS.pill, overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: accent, borderRadius: RADIUS.pill, transition: 'width .3s ease-out' }} />
            </div>
          ) : (
            <div style={{ flex: 1, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: TYPE.meta, fontWeight: 500, color: D.gold }}>
              <Sparkles size={14} color={D.gold} /> +{rewardCoins} coins
            </div>
          )}
          <button onClick={onPress} onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)} style={{
            flexShrink: 0, background: D.teal, color: '#fff', border: 'none', borderBottom: `${pressed ? 2 : 4}px solid #147067`, borderRadius: 14,
            padding: pressed ? '12px 24px 6px' : '10px 24px 8px', fontSize: TYPE.body, fontWeight: 500, cursor: 'pointer', minHeight: 44,
            transform: pressed ? 'translateY(2px)' : 'translateY(0)', transition: 'transform .1s ease, border-bottom-width .1s ease, padding .1s ease',
            WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
          }}>{buttonLabel}</button>
        </div>
      </div>
    </div>
  );
}

export function ReviewDueCard({ count, minutes, caughtUp, dueTomorrow, onPress }) {
  const [pressed, handlers] = press();
  return (
    <button onClick={onPress} {...handlers} style={{
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: D.card, border: `1px solid ${D.border}`,
      borderRadius: RADIUS.card, padding: 14, cursor: 'pointer', minHeight: 44, transform: pressed ? 'scale(0.98)' : 'scale(1)',
      transition: 'transform .12s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
    }}>
      <span style={{ width: 38, height: 38, borderRadius: RADIUS.tile, background: caughtUp ? subjectOf('5-pillars').tint : '#FBF3DF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {caughtUp ? <Check size={18} color={D.tealDeep} /> : <RefreshCw size={17} color={D.goldInk} />}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 500, color: D.ink }}>{caughtUp ? 'All caught up' : 'Review is ready'}</span>
        <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint, marginTop: 1 }}>
          {caughtUp ? `${dueTomorrow} due tomorrow` : `${count} items ready · about ${minutes} min`}
        </span>
      </span>
      <ChevronRight size={18} color={D.disabled} style={{ flexShrink: 0 }} />
    </button>
  );
}

export function TopicMiniCard({ topicId, name, progressPct = 0, nextTitle, onPress, tilt = 5 }) {
  const s = subjectOf(topicId);
  const c = s.card;
  const [pressed, handlers] = press();
  const inProgress = progressPct > 0;
  return (
    <button onClick={onPress} {...handlers} style={{
      textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8, background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: RADIUS.card,
      padding: 14, cursor: 'pointer', minHeight: 44, transform: pressed ? 'scale(0.98)' : 'scale(1)', transition: 'transform .12s ease',
      WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconTile subjectId={topicId} size={34} bg="#FFFFFF" tilt={tilt} />
        {!inProgress && <span style={{ fontSize: 10, fontWeight: 500, color: c.chipInk, background: c.chipBg, borderRadius: 999, padding: '2px 9px' }}>New</span>}
      </div>
      <div style={{ fontSize: TYPE.body, fontWeight: 500, color: c.title, lineHeight: 1.25 }}>{name}</div>
      {inProgress && (
        <div style={{ height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: RADIUS.pill, overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: s.accent, borderRadius: RADIUS.pill, transition: 'width .3s ease-out' }} />
        </div>
      )}
      {nextTitle && <div style={{ fontSize: TYPE.hint, color: c.hint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inProgress ? 'Next' : 'Up first'}: {nextTitle}</div>}
    </button>
  );
}

// Compact full-width dashed row (never a tall square).
export function ExploreCard({ onPress }) {
  const [pressed, handlers] = press();
  return (
    <button onClick={onPress} {...handlers} style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'transparent',
      border: `1.5px dashed ${D.disabled}`, borderRadius: RADIUS.card, padding: '11px 14px', minHeight: 44, cursor: 'pointer', color: D.inkSecondary,
      transform: pressed ? 'scale(0.98)' : 'scale(1)', transition: 'transform .12s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
    }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#E9F6F4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} color={D.tealDeep} /></span>
      <span style={{ fontSize: TYPE.meta, fontWeight: 500 }}>Explore more topics</span>
    </button>
  );
}

export function TopicRow({ topicId, name, desc, right, onPress }) {
  const [pressed, handlers] = press();
  return (
    <button onClick={onPress} {...handlers} style={{
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none',
      borderBottom: `1px solid ${D.border}`, padding: '14px 2px', cursor: onPress ? 'pointer' : 'default', minHeight: 44,
      transform: pressed && onPress ? 'scale(0.99)' : 'scale(1)', transition: 'transform .12s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
    }}>
      <IconTile subjectId={topicId} size={40} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: TYPE.body, fontWeight: 500, color: D.ink }}>{name}</span>
        {desc && <span style={{ display: 'block', fontSize: TYPE.hint, color: D.inkHint, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</span>}
      </span>
      <span style={{ flexShrink: 0 }}>{right}</span>
    </button>
  );
}

export function StatBlock({ label, value, style }) {
  return (
    <div style={{ ...style }}>
      <div style={{ fontSize: TYPE.hint, color: D.inkHint, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: TYPE.bigNumber, fontWeight: 500, color: D.ink }}>{value}</div>
    </div>
  );
}

export function StreakCalendar({ weekMap = {}, weekDates = [], todayDate }) {
  const initials = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
      {weekDates.map((date, i) => {
        const done = !!weekMap[date];
        const isToday = date === todayDate;
        return (
          <div key={date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: TYPE.hint, color: D.inkHint }}>{initials[new Date(date + 'T00:00:00').getDay()]}</span>
            <span style={{
              width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: done ? D.teal : 'transparent', border: done ? 'none' : `1px solid ${D.border}`, boxShadow: isToday ? `0 0 0 2px ${D.gold}` : 'none',
            }}>
              {done && <Check size={14} color="#fff" strokeWidth={3} />}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function SectionHeading({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 2px 10px' }}>
      <span style={{ fontSize: TYPE.sectionHeading, fontWeight: 500, color: D.ink }}>{children}</span>
      {action}
    </div>
  );
}
