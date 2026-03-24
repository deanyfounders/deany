import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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

const QuranicQuote = ({ glass = '', className = '' }) => {
  const quote = useMemo(getSessionQuote, []);
  const [showTafseer, setShowTafseer] = useState(false);

  return (
    <div className={`${glass} rounded-2xl p-6 sm:p-8 text-center ${className}`}>
      {/* Arabic — the centrepiece */}
      <p className="font-arabic text-xl sm:text-2xl leading-loose text-gray-900 mb-3" dir="rtl" style={{ fontFamily: 'Georgia, serif' }}>
        ❝ {quote.arabic} ❞
      </p>

      {/* Transliteration */}
      <p className="text-sm italic text-gray-400 mb-3">
        {quote.transliteration}
      </p>

      {/* Translation */}
      <p className="text-sm sm:text-base font-medium text-gray-700 leading-relaxed max-w-lg mx-auto mb-2">
        "{quote.translation}"
      </p>

      {/* Reference */}
      <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#b45309' }}>
        {quote.reference}
      </p>

      {/* Tafseer toggle */}
      <button
        onClick={() => setShowTafseer(prev => !prev)}
        className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
          text-gray-400 hover:text-gray-600 hover:bg-white/50
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
      >
        Tafseer
        {showTafseer
          ? <ChevronUp className="w-3 h-3" />
          : <ChevronDown className="w-3 h-3" />}
      </button>

      {/* Tafseer panel */}
      {showTafseer && (
        <div className="mt-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 text-left border border-white/60 animate-fade-in">
          <p className="text-sm leading-relaxed text-gray-600">
            {quote.tafseer}
          </p>
          <p className="text-[11px] text-gray-400 mt-3">
            <span className="font-semibold text-gray-600">Al-Qurtubi</span> · Al-Jami' li-Ahkam al-Quran{"  "}·{"  "}
            <span className="font-semibold text-gray-600">Ibn Atiyyah</span> · Al-Muharrar al-Wajiz
          </p>
        </div>
      )}
    </div>
  );
};

export default QuranicQuote;
