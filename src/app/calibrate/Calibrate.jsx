// Calibration quiz - Session 1 placeholder.
// Phase 3 replaces this with 8 scholar-approved questions reused from shipped
// lessons and real banding. No Islamic content is added here.
import React from 'react';
import AppScreen, { DeanyMark, PillButton, TextLink, TOKENS } from '../shared/AppScreen.jsx';

export default function Calibrate({ appState }) {
  const { setCalibration } = appState;
  return (
    <AppScreen>
      <DeanyMark size={48} />
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 500, color: TOKENS.tealDeep, margin: '20px 0 10px' }}>
        Let's find your level
      </h1>
      <p style={{ fontSize: 15, color: TOKENS.muted, lineHeight: 1.6, maxWidth: 320, margin: '0 0 32px' }}>
        A few quick questions place you at the right starting point.
      </p>
      <PillButton onClick={() => setCalibration('Foundations')}>Continue</PillButton>
      <div style={{ marginTop: 10 }}>
        <TextLink onClick={() => setCalibration('Foundations')}>Skip for now</TextLink>
      </div>
      <div style={{ marginTop: 22, fontSize: 12, color: TOKENS.muted, opacity: 0.6 }}>
        Real calibration quiz arrives in Phase 3
      </div>
    </AppScreen>
  );
}
