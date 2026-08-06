// Dashboard - the four-tab app shell. Wraps the store, resolves the active
// tab, and hands topic taps to the existing per-subject lesson path.
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DashboardProvider, useDashboard } from './state.jsx';
import AppShell from './AppShell.jsx';
import Home from './screens/Home.jsx';
import Review from './screens/Review.jsx';
import Topics from './screens/Topics.jsx';
import You from './screens/You.jsx';
import QuranTab from '../quran/QuranTab.jsx';
import RootWordsModule from '../quran/corewords/RootWordsModule.jsx';
import ToolScreen from './tools/Tools.jsx';
import PathLessons from '../home/PathLessons.jsx';
import { getHomeBadges } from './selectors.js';
import { subjectOf } from './tokens.js';

export default function Dashboard(props) {
  return <DashboardProvider><Inner {...props} /></DashboardProvider>;
}

function Inner({ mainTopics = [], modules = {}, completedLessons = {}, onSelectLesson, appState, xp = 0, coins = 0, dailyStreak = 0 }) {
  const dash = useDashboard();
  const [tab, setTab] = useState('home');
  const [pathTopicId, setPathTopicId] = useState(null);
  const [coreWordsOpen, setCoreWordsOpen] = useState(false);
  const [quranInitial, setQuranInitial] = useState(null); // { surah, ayah } | null
  const [toolOpen, setToolOpen] = useState(null); // 'zakat' | 'qibla' | 'tasbih' | 'hijri' | null
  const deps = useMemo(() => ({ modules, completedLessons }), [modules, completedLessons]);

  // Name rule: use it if 2+ chars; else the email local-part capitalized; else null.
  const rawName = (appState?.state?.user?.username || dash.state.user?.name || '').trim();
  let name = rawName.length >= 2 ? rawName : null;
  if (!name && rawName.includes('@')) { const p = rawName.split('@')[0]; if (p) name = p.charAt(0).toUpperCase() + p.slice(1); }
  const guest = !name;

  // Seed the review queue from lessons already completed, so Review is real.
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  useEffect(() => {
    const pairs = [];
    Object.keys(modules).forEach(topicId => {
      (modules[topicId] || []).forEach(mod => (mod.lessons || []).forEach((_, i) => {
        const key = `${mod.id}-lesson-${i}`;
        if (completedLessons[key]) pairs.push({ topicId, lessonId: key });
      }));
    });
    if (pairs.length) dash.ensureReviews(pairs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCount]);

  // Resolve a review item back to a launchable lesson.
  const resolveLesson = (item) => {
    for (const mod of (modules[item.topicId] || [])) {
      const lessons = mod.lessons || [];
      for (let i = 0; i < lessons.length; i++) {
        if (`${mod.id}-lesson-${i}` === item.lessonId) return { lesson: lessons[i], idx: i, mod };
      }
    }
    return null;
  };

  const badges = getHomeBadges(dash.state, Date.now());

  // Tool screens: full-screen takeover with a back button (like the lesson path).
  if (toolOpen) {
    return (
      <div style={{ height: '100dvh', maxHeight: '100dvh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: '#fff' }}>
        <ToolScreen tool={toolOpen} onBack={() => setToolOpen(null)} />
      </div>
    );
  }

  // Per-subject lesson path (reuses the existing timeline)
  if (pathTopicId) {
    const topic = mainTopics.find(t => t.id === pathTopicId) || { id: pathTopicId, title: subjectOf(pathTopicId).name };
    return (
      <PathLessons
        topic={topic} modules={modules} completedLessons={completedLessons}
        accent={subjectOf(pathTopicId).accent} level={dash.state.topics[pathTopicId]?.level}
        onSelectLesson={onSelectLesson} onBack={() => setPathTopicId(null)}
      />
    );
  }

  return (
    <AppShell tab={tab} onTab={setTab} reviewDot={badges.reviewDot}>
      {tab === 'home' && (
        <Home name={name} state={dash.state} deps={deps} coins={dash.state.coins || coins} streak={dailyStreak || dash.state.streak?.count || 0}
          onOpenTopic={setPathTopicId} onGoTab={setTab} onSelectLesson={onSelectLesson}
          onOpenCoreWords={() => setCoreWordsOpen(true)} onOpenTool={setToolOpen}
          onOpenAyah={(surah, ayah) => { setQuranInitial({ surah, ayah }); setTab('quran'); }} />
      )}
      {tab === 'topics' && (
        <Topics state={dash.state} deps={deps} onOpenTopic={setPathTopicId} addTopic={dash.addTopic} pauseTopic={dash.pauseTopic} resumeTopic={dash.resumeTopic} removeTopic={dash.removeTopic} />
      )}
      {tab === 'quran' && (<QuranTab initialOpen={quranInitial} onConsumed={() => setQuranInitial(null)} />)}
      {tab === 'review' && (
        <Review name={name} streak={dailyStreak || dash.state.streak?.count || 0} coins={dash.state.coins || coins} state={dash.state} deps={deps}
          onGoTab={setTab} onSelectLesson={onSelectLesson} resolveLesson={resolveLesson} onOpenCoreWords={() => setCoreWordsOpen(true)} />
      )}
      {tab === 'you' && (
        <You name={name} guest={guest} state={dash.state} completedLessons={completedLessons} xp={xp}
          onSignOut={appState?.signOut} onCreateAccount={appState?.signOut} setDailyMinutes={dash.setDailyMinutes} />
      )}

      {/* Quranic Core Words full-screen, portaled to body so it covers the nav */}
      {coreWordsOpen && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#F4F2FA' }}>
          <RootWordsModule onExit={() => setCoreWordsOpen(false)} />
        </div>,
        document.body
      )}
    </AppShell>
  );
}
