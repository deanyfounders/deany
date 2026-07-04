// AppGate - the single decision point between the website and the installed app.
//
// Browser visitors (no app mode) get the current website unchanged.
// In app mode the flow resolves in order:
//   not onboarded  -> Welcome
//   not calibrated -> Calibrate
//   not signed in  -> Auth
//   otherwise      -> HomeShell
import React from 'react';
import App from '../App.jsx';
import { useAppMode } from './hooks/useAppMode.js';
import { useAppState } from './hooks/useAppState.js';
import Welcome from './welcome/Welcome.jsx';
import Calibrate from './calibrate/Calibrate.jsx';
import Auth from './auth/Auth.jsx';
import HomeShell from './home/HomeShell.jsx';

export default function AppGate() {
  const appMode = useAppMode();
  const appState = useAppState();

  // Website: zero change for regular browser visitors.
  if (!appMode) return <App />;

  const { state } = appState;
  if (!state.onboarded) return <Welcome appState={appState} />;
  if (!state.calibrated) return <Calibrate appState={appState} />;
  if (!state.user) return <Auth appState={appState} />;
  return <HomeShell appState={appState} />;
}
