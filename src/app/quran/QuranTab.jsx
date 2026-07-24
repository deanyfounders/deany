// Qur'an tab: index <-> reader, plus the Scheherazade New webfont for Arabic
// and the shared bottom-sheet animation. Reading is unscored - no XP/coins/streak
// events originate here.
import React, { useState } from 'react';
import QuranIndex from './QuranIndex.jsx';
import QuranReader from './QuranReader.jsx';

const QURAN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;500;700&display=swap');
.quran-ar { font-family: 'Scheherazade New','Amiri',serif; }
@keyframes deanySheetUp { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
.deany-sheet-in { animation: deanySheetUp .3s cubic-bezier(0.34,1.3,0.64,1) both }
@media (prefers-reduced-motion: reduce){ .deany-sheet-in { animation: none } }
`;

export default function QuranTab() {
  const [open, setOpen] = useState(null); // { surah, ayah } | null

  return (
    <>
      <style>{QURAN_CSS}</style>
      {open
        ? <QuranReader surah={open.surah} initialAyah={open.ayah} onBack={() => setOpen(null)} />
        : <QuranIndex onOpenSurah={(surah, ayah) => setOpen({ surah, ayah })} />}
    </>
  );
}
