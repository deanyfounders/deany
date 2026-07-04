// Welcome / onboarding - Session 1 placeholder.
// Phase 2 replaces this with a 4-screen swipeable walkthrough.
import React from 'react';
import AppScreen, { DeanyMark, PillButton, TextLink, TOKENS } from '../shared/AppScreen.jsx';

export default function Welcome({ appState }) {
  const { completeOnboarding } = appState;
  return (
    <AppScreen>
      <DeanyMark size={64} />
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 500, color: TOKENS.tealDeep, margin: '22px 0 10px' }}>
        Welcome to DEANY
      </h1>
      <p style={{ fontSize: 15, color: TOKENS.muted, lineHeight: 1.6, maxWidth: 320, margin: '0 0 32px' }}>
        Start where you are. Ten minute lessons on the Pillars, the Quran, Islamic finance, and history.
      </p>
      <PillButton onClick={completeOnboarding}>Take the calibration quiz</PillButton>
      <div style={{ marginTop: 10 }}>
        <TextLink onClick={completeOnboarding}>Skip</TextLink>
      </div>
      <div style={{ marginTop: 22, fontSize: 12, color: TOKENS.muted, opacity: 0.6 }}>
        Onboarding walkthrough arrives in Phase 2
      </div>
    </AppScreen>
  );
}
