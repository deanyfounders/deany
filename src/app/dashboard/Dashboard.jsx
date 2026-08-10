// Dashboard - the four-tab app shell on the shared navigation model (nav.js).
// The active tab is always mounted; deep content (reader / subject path / tool /
// core words) is pushed as an OVERLAY that records its origin tab, so back returns
// to exactly where the user came from (nav spec rules 1-8). One goBack for every
// back control; the browser/hardware back maps to it through nav.js history.
import React, { useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DashboardProvider, useDashboard } from './state.jsx';
import AppShell from './AppShell.jsx';
import Home from './screens/Home.jsx';
import Review from './screens/Review.jsx';
import Topics from './screens/Topics.jsx';
import You from './screens/You.jsx';
import QuranTab, { QURAN_CSS } from '../quran/QuranTab.jsx';
import QuranReader from '../quran/QuranReader.jsx';
import RootWordsModule from '../quran/corewords/RootWordsModule.jsx';
import ToolScreen from './tools/Tools.jsx';
import PathLessons from '../home/PathLessons.jsx';
import ModuleOverview from '../../ModuleOverview.jsx';
import { getHomeBadges } from './selectors.js';
import { subjectOf } from './tokens.js';
import { useDashNav } from './nav.js';

export default function Dashboard(props) {
  return <DashboardProvider><Inner {...props} /></DashboardProvider>;
}

function Inner({ mainTopics = [], modules = {}, completedLessons = {}, onSelectLesson, appState, xp = 0, coins = 0, dailyStreak = 0 }) {
  const dash = useDashboard();
  const nav = useDashNav('home');
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
  const streak = dailyStreak || dash.state.streak?.count || 0;
  const cn = dash.state.coins || coins;

  // The single set of content openers - every call site routes through the model.
  const openReader = (surah, ayah) => nav.open({ type: 'reader', surah, ayah });
  const openPath = (topicId) => nav.open({ type: 'path', topicId });
  const openTool = (tool) => nav.open({ type: 'tool', tool });
  const openCore = () => nav.open({ type: 'corewords' });

  const tab = nav.activeTab;
  const tabContent =
    tab === 'home' ? (
      <Home name={name} state={dash.state} deps={deps} coins={cn} streak={streak} xp={xp}
        onOpenTopic={openPath} onGoTab={nav.onTapTab} onSelectLesson={onSelectLesson}
        onOpenCoreWords={openCore} onOpenTool={openTool} onOpenAyah={openReader} />
    ) : tab === 'topics' ? (
      <Topics state={dash.state} deps={deps} onOpenTopic={openPath} addTopic={dash.addTopic} pauseTopic={dash.pauseTopic} resumeTopic={dash.resumeTopic} removeTopic={dash.removeTopic} />
    ) : tab === 'quran' ? (
      <QuranTab onOpenReader={openReader} />
    ) : tab === 'review' ? (
      <Review name={name} streak={streak} coins={cn} state={dash.state} deps={deps}
        onGoTab={nav.onTapTab} onSelectLesson={onSelectLesson} resolveLesson={resolveLesson} onOpenCoreWords={openCore} />
    ) : (
      <You name={name} guest={guest} state={dash.state} completedLessons={completedLessons} xp={xp}
        onSignOut={appState?.signOut} onCreateAccount={appState?.signOut} setDailyMinutes={dash.setDailyMinutes} />
    );

  const top = nav.top;
  const readerTop = top && top.type === 'reader' ? top : null;
  const fullTop = top && top.type !== 'reader' ? top : null;

  // Reader overlay: sits over the active tab (nav still visible, Qur'an highlighted).
  const readerOverlay = readerTop ? (
    <><style>{QURAN_CSS}</style><QuranReader surah={readerTop.surah} initialAyah={readerTop.ayah} onBack={nav.goBack} /></>
  ) : null;

  return (
    <>
      <AppShell tab={nav.highlightTab} onTab={nav.onTapTab} reviewDot={badges.reviewDot} scrollKey={tab} overlay={readerOverlay}>
        {tabContent}
      </AppShell>

      {/* Full-screen overlays (path / tool / core words) cover the whole screen but
          leave the dashboard mounted underneath, so back restores its scroll. */}
      {fullTop && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: fullTop.type === 'corewords' ? '#F4F2FA' : '#fff', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {fullTop.type === 'path' && (
            // All paths use the rich "how you'll learn" ModuleOverview layout.
            // Quran keeps the Core Words tool as a separate item above the modules.
            <ModuleOverview
              modules={(modules[fullTop.topicId] || []).filter(m => (m.lessons || []).length)}
              topicId={fullTop.topicId}
              completedLessons={completedLessons}
              onSelectLesson={onSelectLesson}
              onSelectModule={() => {}}
              onBack={nav.goBack}
              onHome={nav.goBack}
              onOpenCoreWords={fullTop.topicId === 'quran-arabic' ? openCore : undefined}
            />
          )}
          {fullTop.type === 'tool' && <ToolScreen tool={fullTop.tool} onBack={nav.goBack} />}
          {fullTop.type === 'corewords' && <RootWordsModule onExit={nav.goBack} />}
        </div>,
        document.body
      )}
    </>
  );
}
