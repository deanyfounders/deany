// DEMO AUTH - accepts any credentials by design.
// Replace with real auth (e.g. Supabase/Firebase/Clerk) before public launch.
//
// Session 1 placeholder. Phase 4 adds the username/password form, show/hide
// toggle, and validation. Credentials are never sent anywhere.
import React from 'react';
import AppScreen, { DeanyMark, PillButton, TOKENS } from '../shared/AppScreen.jsx';

export default function Auth({ appState }) {
  const { signIn } = appState;
  return (
    <AppScreen>
      <DeanyMark size={48} />
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 500, color: TOKENS.tealDeep, margin: '20px 0 10px' }}>
        Create your account
      </h1>
      <p style={{ fontSize: 15, color: TOKENS.muted, lineHeight: 1.6, maxWidth: 320, margin: '0 0 32px' }}>
        Save your progress and keep your streak going.
      </p>
      <PillButton onClick={() => signIn('friend')}>Continue</PillButton>
      <div style={{ marginTop: 22, fontSize: 12, color: TOKENS.muted, opacity: 0.6 }}>
        Demo sign in form arrives in Phase 4
      </div>
    </AppScreen>
  );
}
