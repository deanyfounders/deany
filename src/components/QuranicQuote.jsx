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
      <span className="text-[10px] font-medium uppercase tracking-widest text-deany-sage">
        {isAyah ? "Today's Verse" : "Today's Hadith"}
      </span>

      {/* Arabic (if present) */}
      {item.arabic && (
        <p className="font-arabic text-xl sm:text-2xl leading-loose text-deany-navy mt-2" dir="rtl">
          {item.arabic}
        </p>
      )}

      {/* Translation */}
      {/* REVIEW:QURAN — Verify translation source for displayed ayah */}
      <p className="text-sm sm:text-base text-deany-steel leading-relaxed mt-2">
        &ldquo;{item.translation}&rdquo;
      </p>

      {/* Narrator (hadith only) */}
      {item.narrator && (
        <p className="text-xs text-deany-muted mt-1">&mdash; {item.narrator}</p>
      )}

      {/* Reference + detail toggle */}
      <div className="flex items-center justify-center gap-2.5 mt-3 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-deany-gold">
          {item.ref}
        </span>
        {hasDetail && (
          <>
            <span className="text-deany-border">&middot;</span>
            <button
              onClick={() => setShowDetail(prev => !prev)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide
                text-deany-sage hover:text-deany-navy transition-colors duration-200 rounded
                focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2"
            >
              {isAyah ? 'Tafseer' : 'Context'}
              {showDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </>
        )}
      </div>

      {/* Expanded panel */}
      {showDetail && hasDetail && (
        <div className="mt-4 bg-white rounded-2xl p-4 sm:p-5 border border-deany-border shadow-sm animate-fade-in max-w-lg mx-auto">
          {isAyah && item.tafseer ? (
            <>
              {item.transliteration && (
                <p className="text-xs italic text-deany-muted mb-3 text-center">{item.transliteration}</p>
              )}
              <TafseerPanel tafseer={item.tafseer} />
            </>
          ) : (
            <p className="text-sm leading-relaxed text-deany-steel text-left">{item.context}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuranicQuote;
