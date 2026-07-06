// Section 2 primitives - every dashboard surface is composed from these.
// No shadows. Brand tokens + approved tints only. 44px min tap targets.
import React, { useState } from 'react';
import { Flame, Coins, RefreshCw, Check, ChevronRight, Plus } from 'lucide-react';
import { D, RADIUS, FONT, TYPE, subjectOf } from './tokens.js';

const press = () => {
  const [p, setP] = useState(false);
  return [p, { onPointerDown: () => setP(true), onPointerUp: () => setP(false), onPointerLeave: () => setP(false) }];
};

export function Card({ children, style }) {
  return <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: RADIUS.card, padding: 16, ...style }}>{children}</div>;
}

export function IconTile({ emoji, tint, size = 38 }) {
  return <span style={{ width: size, height: size, borderRadius: RADIUS.tile, background: tint, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, flexShrink: 0 }}>{emoji}</span>;
}

export function StatPill({ kind = 'streak', value, pop }) {
  const isStreak = kind === 'streak';
  return (
    <span className={pop ? 'dash-pop' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', background: D.card, border: `1px solid ${D.border}`, borderRadius: RADIUS.pill, minHeight: 32 }}>
      {isStreak ? <Flame size={15} color={D.goldInk} /> : <Coins size={15} color={D.tealDeep} />}
      <span style={{ fontSize: TYPE.meta, fontWeight: 500, color: isStreak ? D.goldInk : D.tealDeep }}>{value}</span>
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

export function HeroContinueCard({ eyebrow, title, meta, progressPct, accent = D.teal, buttonLabel = 'Continue', onPress, variant = 'lesson' }) {
  const [pressed, handlers] = press();
  const eyebrowColor = variant === 'review' ? D.gold : D.gold;
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: D.navy, borderRadius: RADIUS.hero, padding: 16 }}>
      <span aria-hidden="true" style={{ position: 'absolute', top: -24, right: -18, width: 90, height: 90, borderRadius: '50%', background: accent, opacity: 0.18 }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: TYPE.hint, letterSpacing: '0.5px', textTransform: 'uppercase', color: eyebrowColor, fontWeight: 500, marginBottom: 6 }}>{eyebrow}</div>
        <div style={{ fontSize: TYPE.cardTitle, fontWeight: 500, color: D.canvas, lineHeight: 1.3, marginBottom: 4 }}>{title}</div>
        {meta && <div style={{ fontSize: TYPE.meta, color: D.navyMuted, marginBottom: 14 }}>{meta}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: meta ? 0 : 12 }}>
          {typeof progressPct === 'number' && (
            <div style={{ flex: 1, height: 6, background: D.navyDivider, borderRadius: RADIUS.pill, overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: accent, borderRadius: RADIUS.pill, transition: 'width .3s ease-out' }} />
            </div>
          )}
          <button onClick={onPress} {...handlers} style={{
            marginLeft: typeof progressPct === 'number' ? 0 : 'auto', flexShrink: 0, background: D.teal, color: '#fff', border: 'none',
            borderRadius: RADIUS.btnInCard, padding: '9px 18px', fontSize: TYPE.body, fontWeight: 500, cursor: 'pointer', minHeight: 44,
            transform: pressed ? 'scale(0.98)' : 'scale(1)', transition: 'transform .12s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
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

export function TopicMiniCard({ topicId, name, progressPct = 0, nextTitle, onPress }) {
  const s = subjectOf(topicId);
  const [pressed, handlers] = press();
  return (
    <button onClick={onPress} {...handlers} style={{
      textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8, background: D.card, border: `1px solid ${D.border}`, borderRadius: RADIUS.card,
      padding: 14, cursor: 'pointer', minHeight: 44, transform: pressed ? 'scale(0.98)' : 'scale(1)', transition: 'transform .12s ease',
      WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
    }}>
      <IconTile emoji={s.emoji} tint={s.tint} size={34} />
      <div style={{ fontSize: TYPE.body, fontWeight: 500, color: D.ink, lineHeight: 1.25 }}>{name}</div>
      <div style={{ height: 4, background: D.trackOnWhite, borderRadius: RADIUS.pill, overflow: 'hidden' }}>
        <div style={{ width: `${progressPct}%`, height: '100%', background: s.accent, borderRadius: RADIUS.pill, transition: 'width .3s ease-out' }} />
      </div>
      {nextTitle && <div style={{ fontSize: TYPE.hint, color: D.inkHint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Next: {nextTitle}</div>}
    </button>
  );
}

export function ExploreCard({ onPress }) {
  const [pressed, handlers] = press();
  return (
    <button onClick={onPress} {...handlers} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'transparent',
      border: `1.5px dashed ${D.disabled}`, borderRadius: RADIUS.card, padding: 14, cursor: 'pointer', minHeight: 44, color: D.inkSecondary,
      transform: pressed ? 'scale(0.98)' : 'scale(1)', transition: 'transform .12s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
    }}>
      <Plus size={20} color={D.inkSecondary} />
      <span style={{ fontSize: TYPE.meta, fontWeight: 500 }}>Explore topics</span>
    </button>
  );
}

export function TopicRow({ topicId, name, desc, right, onPress }) {
  const s = subjectOf(topicId);
  const [pressed, handlers] = press();
  return (
    <button onClick={onPress} {...handlers} style={{
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none',
      borderBottom: `1px solid ${D.border}`, padding: '14px 2px', cursor: onPress ? 'pointer' : 'default', minHeight: 44,
      transform: pressed && onPress ? 'scale(0.99)' : 'scale(1)', transition: 'transform .12s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
    }}>
      <IconTile emoji={s.emoji} tint={s.tint} size={40} />
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
