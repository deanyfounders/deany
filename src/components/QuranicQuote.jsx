import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getTodayContent } from '../data/dailyContent.js';
import TafseerPanel from './TafseerPanel.jsx';

const QuranicQuote = ({ className = '' }) => {
  const item = useMemo(getTodayContent, []);
  const [showDetail, setShowDetail] = useState(false);
  const isAyah = item.type === 'ayah';
  const hasDetail = isAyah ? item.tafseer : item.context;

  return (
    <div className={`max-w-md mx-auto text-center pt-2 ${className}`}>
      {/* Type label */}
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#0d9488' }}>
        {isAyah ? "Today's Verse" : "Today's Hadith"}
      </span>

      {/* Arabic (if present) */}
      {item.arabic && (
        <p className="font-arabic text-xl sm:text-2xl leading-loose text-gray-800 mt-2" dir="rtl">
          {item.arabic}
        </p>
      )}

      {/* Translation */}
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-2" style={{ fontFamily: 'Georgia, serif' }}>
        &ldquo;{item.translation}&rdquo;
      </p>

      {/* Narrator (hadith only) */}
      {item.narrator && (
        <p className="text-xs text-gray-400 mt-1">&mdash; {item.narrator}</p>
      )}

      {/* Reference + detail toggle */}
      <div className="flex items-center justify-center gap-2.5 mt-3 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#b45309' }}>
          {item.ref}
        </span>
        {hasDetail && (
          <>
            <span className="text-gray-300">&middot;</span>
            <button
              onClick={() => setShowDetail(prev => !prev)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide
                transition-colors duration-200 rounded
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              style={{ color: '#059669' }}
            >
              {isAyah ? 'Tafseer' : 'Context'}
              {showDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </>
        )}
      </div>

      {/* Expanded panel */}
      {showDetail && hasDetail && (
        <div className="mt-4 bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/60 animate-fade-in max-w-lg mx-auto">
          {isAyah && item.tafseer ? (
            <>
              {item.transliteration && (
                <p className="text-xs italic text-gray-400 mb-3 text-center">{item.transliteration}</p>
              )}
              <TafseerPanel tafseer={item.tafseer} />
            </>
          ) : (
            <p className="text-sm leading-relaxed text-gray-600 text-left">{item.context}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuranicQuote;
