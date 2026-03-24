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

const QuranicQuote = ({ className = '' }) => {
  const quote = useMemo(getSessionQuote, []);
  const [showTafseer, setShowTafseer] = useState(false);

  return (
    <div className={`max-w-md mx-auto text-center ${className}`}>
      {/* Arabic */}
      <p className="font-arabic text-lg sm:text-xl leading-loose text-gray-700" dir="rtl">
        {quote.arabic}
      </p>

      {/* Translation — serves as the page subtitle */}
      <p className="text-sm sm:text-base text-gray-500 leading-relaxed mt-1.5">
        "{quote.translation}"
      </p>

      {/* Reference + tafseer toggle on one line */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {quote.reference}
        </span>
        <span className="text-gray-300">·</span>
        <button
          onClick={() => setShowTafseer(prev => !prev)}
          className="inline-flex items-center gap-0.5 text-[11px] font-medium text-gray-400
            hover:text-gray-600 transition-colors duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded"
        >
          Tafseer
          {showTafseer
            ? <ChevronUp className="w-3 h-3" />
            : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Tafseer panel — subtle expand */}
      {showTafseer && (
        <div className="mt-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 text-left border border-white/60 animate-fade-in max-w-lg mx-auto">
          <p className="text-xs italic text-gray-400 mb-2">
            {quote.transliteration}
          </p>
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
