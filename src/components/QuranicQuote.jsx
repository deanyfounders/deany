import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import quranicQuotes from '../data/quranicQuotes.js';

const SESSION_KEY = 'deany-quranic-quote-index';

function getSessionQuote() {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (stored !== null) {
    const idx = parseInt(stored, 10);
    if (idx >= 0 && idx < quranicQuotes.length) return quranicQuotes[idx];
  }
  const idx = Math.floor(Math.random() * quranicQuotes.length);
  sessionStorage.setItem(SESSION_KEY, String(idx));
  return quranicQuotes[idx];
}

const QuranicQuote = ({ className = '' }) => {
  const quote = useMemo(getSessionQuote, []);
  const [showTafseer, setShowTafseer] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border border-deany-border shadow-sm overflow-hidden ${className}`}>
      <div className="border-l-4 border-deany-gold p-5 sm:p-6">
        {/* Arabic */}
        <p className="font-arabic text-right text-xl sm:text-2xl leading-loose text-deany-navy mb-3" dir="rtl">
          {quote.arabic}
        </p>

        {/* Transliteration */}
        <p className="text-sm italic text-deany-muted mb-2">
          {quote.transliteration}
        </p>

        {/* Translation */}
        <p className="text-base font-semibold text-deany-navy leading-relaxed mb-2">
          {quote.translation}
        </p>

        {/* Reference */}
        <p className="text-xs font-medium uppercase tracking-wide text-deany-muted">
          {quote.reference}
        </p>

        {/* Tafseer toggle */}
        <button
          onClick={() => setShowTafseer(prev => !prev)}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
            text-deany-gold border border-deany-gold hover:bg-deany-gold-light
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Tafseer
          {showTafseer
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Tafseer panel */}
        {showTafseer && (
          <div className="mt-4 bg-deany-gold-tint rounded-xl p-4 animate-fade-in">
            <p className="text-sm leading-relaxed text-deany-steel">
              {quote.tafseer}
            </p>
            <p className="text-xs text-deany-muted mt-3">
              Sources: <span className="font-semibold text-deany-navy">Al-Qurtubi</span> (Al-Jami' li-Ahkam al-Quran) · <span className="font-semibold text-deany-navy">Ibn Atiyyah</span> (Al-Muharrar al-Wajiz)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranicQuote;
