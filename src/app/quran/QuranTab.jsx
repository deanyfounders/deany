// Qur'an tab: the surah/juz/saved index. The reader itself is a dashboard OVERLAY
// (see Dashboard + nav.js) so it can be opened from any origin and back returns to
// that origin, not this tab. This tab keeps only its own index state (the segment),
// which survives while the reader overlay is up. Reading is unscored.
import React, { useState } from 'react';
import QuranIndex from './QuranIndex.jsx';

export const QURAN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;500;700&display=swap');
.quran-ar { font-family: 'Scheherazade New','Amiri',serif; }
@keyframes deanySheetUp { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
.deany-sheet-in { animation: deanySheetUp .3s cubic-bezier(0.34,1.3,0.64,1) both }
@media (prefers-reduced-motion: reduce){ .deany-sheet-in { animation: none } }
`;

export default function QuranTab({ onOpenReader }) {
  // Held here so returning from the reader restores the tab you were on (surah/juz/saved).
  const [seg, setSeg] = useState('surah');
  return (
    <>
      <style>{QURAN_CSS}</style>
      <QuranIndex seg={seg} onSeg={setSeg} onOpenSurah={(surah, ayah) => onOpenReader && onOpenReader(surah, ayah)} />
    </>
  );
}
