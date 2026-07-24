// Attribution is a licence condition (Part D), not a footer nicety. The Tanzil
// line always renders; the Pickthall line hides when translation is off.
import React from 'react';
import { D, FONT } from '../dashboard/tokens.js';

export default function Attribution({ showTranslation = true, compact = false }) {
  return (
    <div style={{ fontFamily: FONT, fontSize: 11, lineHeight: 1.6, color: D.inkFaint, padding: compact ? '0' : '18px 4px 4px' }}>
      <p style={{ margin: 0 }}>
        Arabic text is the Tanzil Project Uthmani Qur'an Text v1.1, reproduced without modification.{' '}
        <a href="https://tanzil.net" target="_blank" rel="noreferrer" style={{ color: D.tealDeep, textDecoration: 'underline' }}>tanzil.net</a>
      </p>
      {showTranslation && (
        <p style={{ margin: '4px 0 0' }}>
          English is the translation of the meanings by Marmaduke Pickthall (1930), public-domain edition.
        </p>
      )}
    </div>
  );
}
