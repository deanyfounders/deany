// AppGate - the single decision point between the website and the installed app.
//
// Browser visitors (no app mode) get the current website unchanged.
// In app mode the flow resolves in order:
//   not onboarded  -> Welcome
//   not calibrated -> Calibrate
//   not signed in  -> Auth
//   otherwise      -> HomeShell
import React, { useEffect } from 'react';
import App from '../App.jsx';
import { useAppMode } from './hooks/useAppMode.js';
import { useAppState } from './hooks/useAppState.js';
import Welcome from './welcome/Welcome.jsx';
import TopicSelect from '../onboarding/screens/TopicSelect.jsx';
import Calibration from '../onboarding/screens/Calibration.jsx';
import Auth from './auth/Auth.jsx';
import AppModeStyles from './shared/AppModeStyles.jsx';

export default function AppGate() {
  const appMode = useAppMode();
  const appState = useAppState();

  // ?reset=1 restarts the whole app flow from the first onboarding page
  // (for testing / "start over"). The param is stripped after resetting.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === '1') {
      appState.resetAll();
      params.delete('reset');
      const qs = params.toString();
      window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''));
    }
    // resetAll is stable; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Website: zero change for regular browser visitors.
  if (!appMode) return <App />;

  const { state } = appState;

  // Fully onboarded: run the real app in app mode. App renders the home shell
  // for its 'home' screen and reuses all existing lesson routing.
  if (state.onboarded && state.calibrated && state.user) {
    return (
      <>
        <AppModeStyles />
        <App appMode appState={appState} />
      </>
    );
  }

  // Pre-app flow. Each stage fades in as the user advances.
  const topics = state.topics || [];
  let stage = 'welcome', screen = <Welcome appState={appState} />;
  if (state.onboarded && !state.calibrated && topics.length === 0) { stage = 'topics'; screen = <TopicSelect appState={appState} />; }
  else if (state.onboarded && topics.length > 0 && !state.calibrated) { stage = 'calibrate'; screen = <Calibration appState={appState} />; }
  else if (state.onboarded && state.calibrated && !state.user) { stage = 'auth'; screen = <Auth appState={appState} />; }

  return (
    <>
      <AppModeStyles />
      <div key={stage} className="deany-fade">{screen}</div>
    </>
  );
}
