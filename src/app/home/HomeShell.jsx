// App home shell - Session 1 placeholder.
// Phase 5 replaces this with the bottom tab bar (Learn / Review / Profile) and
// the vertical lesson path. Existing lesson components mount inside untouched.
import React from 'react';
import AppScreen, { DeanyMark, PillButton, TextLink, TOKENS } from '../shared/AppScreen.jsx';

export default function HomeShell({ appState }) {
  const { state, signOut } = appState;
  const name = state.user?.username || 'friend';
  return (
    <AppScreen>
      <DeanyMark size={56} />
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 500, color: TOKENS.tealDeep, margin: '20px 0 6px' }}>
        Welcome, {name}
      </h1>
      <p style={{ fontSize: 14, color: TOKENS.muted, margin: '0 0 4px' }}>
        Starting level: <strong style={{ color: TOKENS.navy }}>{state.level || 'Foundations'}</strong>
      </p>
      <p style={{ fontSize: 15, color: TOKENS.muted, lineHeight: 1.6, maxWidth: 320, margin: '14px 0 32px' }}>
        Your home screen with the lesson path and bottom tabs is coming in Phase 5.
      </p>
      <PillButton color={TOKENS.gold} onClick={() => { /* Phase 5: open Continue lesson */ }}>
        Continue learning
      </PillButton>
      <div style={{ marginTop: 12 }}>
        <TextLink onClick={signOut}>Sign out</TextLink>
      </div>
    </AppScreen>
  );
}
