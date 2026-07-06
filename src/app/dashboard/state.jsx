// Dashboard state - single source of truth, persisted under deany.state.v1,
// exposed via one context provider. On first load it migrates the selected
// topics + calibration results from the onboarding key, then persists so the
// migration runs once.
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { enqueue, passItem, failItem } from './srs.js';

const KEY = 'deany.state.v1';
const ONB = 'deany_app_state';

const today = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();

const DEFAULT = () => ({
  user: { name: null },
  goal: { dailyMinutes: 5, minutesToday: 0, lastActiveDate: today() },
  streak: { count: 0, lastCompletedDate: null, weekMap: {} },
  coins: 0,
  topics: {},           // { [id]: { active, addedAt, order, level, tier, lastActiveAt } }
  review: { items: [] },
  _migrated: false,
});

function migrate(base) {
  if (typeof window === 'undefined') return base;
  try {
    const raw = window.localStorage.getItem(ONB);
    if (!raw) return base;
    const onb = JSON.parse(raw);
    const topics = {};
    (onb.topics || []).forEach((id, i) => {
      const cal = (onb.calibration || {})[id] || {};
      topics[id] = { active: true, addedAt: nowIso(), order: i, level: cal.level || 'Foundations', tier: cal.tier || 1, lastActiveAt: null };
    });
    return { ...base, user: { name: onb.user?.username || null }, topics, _migrated: true };
  } catch (_) { return base; }
}

function persist(s) { if (typeof window !== 'undefined') { try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch (_) {} } }

function load() {
  if (typeof window === 'undefined') return DEFAULT();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT(), ...JSON.parse(raw) };
  } catch (_) {}
  const migrated = migrate(DEFAULT());
  persist(migrated);
  return migrated;
}

const Ctx = createContext(null);

export function DashboardProvider({ children }) {
  const [state, setState] = useState(load);
  const patch = useCallback((updater) => setState(prev => {
    const next = { ...prev, ...(typeof updater === 'function' ? updater(prev) : updater) };
    persist(next);
    return next;
  }), []);

  const actions = useMemo(() => ({
    setDailyMinutes: (m) => patch(p => ({ goal: { ...p.goal, dailyMinutes: m } })),
    addMinutes: (m) => patch(p => {
      const d = today();
      const g = p.goal.lastActiveDate === d ? p.goal : { ...p.goal, minutesToday: 0, lastActiveDate: d };
      return { goal: { ...g, minutesToday: (g.minutesToday || 0) + m, lastActiveDate: d } };
    }),
    completeLesson: (topicId, lessonId) => patch(p => ({
      review: { items: enqueue(p.review.items, topicId, lessonId, Date.now()) },
      topics: { ...p.topics, [topicId]: { ...(p.topics[topicId] || { active: true, order: 0 }), lastActiveAt: nowIso() } },
      coins: (p.coins || 0) + 5,
    })),
    addTopic: (id) => patch(p => ({
      topics: { ...p.topics, [id]: p.topics[id] ? { ...p.topics[id], active: true } : { active: true, addedAt: nowIso(), order: Object.keys(p.topics).length, level: 'Foundations', tier: 1, lastActiveAt: null } },
    })),
    pauseTopic: (id) => patch(p => ({ topics: { ...p.topics, [id]: { ...p.topics[id], active: false } } })),
    resumeTopic: (id) => patch(p => ({ topics: { ...p.topics, [id]: { ...p.topics[id], active: true } } })),
    removeTopic: (id) => patch(p => { const topics = { ...p.topics }; delete topics[id]; return { topics }; }),
    gradeReview: (id, passed) => patch(p => ({ review: { items: p.review.items.map(it => it.id === id ? (passed ? passItem(it, Date.now()) : failItem(it, Date.now())) : it) } })),
    // Seed the review queue from lessons already completed (due now). Idempotent.
    ensureReviews: (pairs) => patch(p => {
      const existing = new Set(p.review.items.map(i => i.id));
      let items = p.review.items;
      pairs.forEach(({ topicId, lessonId }, idx) => {
        const id = `${topicId}::${lessonId}`;
        if (!existing.has(id)) { items = [...items, { id, topicId, lessonId, dueAt: new Date(Date.now() - (idx + 1) * 60000).toISOString(), intervalIndex: 0, lapses: 0 }]; existing.add(id); }
      });
      return items === p.review.items ? {} : { review: { items } };
    }),
  }), [patch]);

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDashboard() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useDashboard must be used within DashboardProvider');
  return c;
}

// Also clear dashboard state when onboarding resets (called from resetAll).
export function clearDashboardState() { if (typeof window !== 'undefined') { try { window.localStorage.removeItem(KEY); } catch (_) {} } }
