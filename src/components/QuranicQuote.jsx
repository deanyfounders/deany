import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getTodayContent } from '../data/dailyContent.js';
import TafseerPanel from './TafseerPanel.jsx';

const QuranicQuote = ({ variant = 'hero', className = '' }) => {
  const item = useMemo(getTodayContent, []);
  const [showDetail, setShowDetail] = useState(false);
  const isAyah = item.type === 'ayah';
  const hasDetail = isAyah ? item.tafseer : item.context;

  if (variant === 'sidebar') {
    return (
      <div className={`bg-white/70 backdrop-blur-xl rounded-2xl border-l-4 border-deany-sage shadow-sm p-5 ${className}`}>
        {/* Type label */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-deany-sage block mb-2">
          {isAyah ? "Ayah of the Day" : "Hadith of the Day"}
        </span>

        {/* Arabic */}
        {item.arabic && (
          <p className="font-arabic text-xl leading-loose text-deany-navy mb-2" dir="rtl">
            {item.arabic}
          </p>
        )}

        {/* Translation */}
        <p className="text-sm leading-relaxed text-deany-steel" style={{ fontFamily: 'Georgia, serif' }}>
          &ldquo;{item.translation}&rdquo;
        </p>

        {/* Narrator (hadith only) */}
        {item.narrator && (
          <p className="text-xs text-deany-muted mt-1">&mdash; {item.narrator}</p>
        )}

        {/* Reference + toggle */}
        <div className="flex items-center gap-2.5 mt-3 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-deany-gold">
            {item.ref}
          </span>
          {hasDetail && (
            <>
              <span className="text-deany-muted">&middot;</span>
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

        {/* Collapsible tafseer/context */}
        <div
          className={`transition-all duration-300 ease-out overflow-hidden ${
            showDetail && hasDetail ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="overflow-y-auto max-h-[280px] bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-deany-border/40">
            {isAyah && item.tafseer ? (
              <>
                {item.transliteration && (
                  <p className="text-xs italic text-deany-muted mb-3">{item.transliteration}</p>
                )}
                <TafseerPanel tafseer={item.tafseer} />
              </>
            ) : (
              <p className="text-sm leading-relaxed text-deany-steel">{item.context}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // variant === 'hero' (legacy centered layout)
  return (
    <div className={`max-w-md mx-auto text-center pt-2 ${className}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-deany-sage">
        {isAyah ? "Today's Verse" : "Today's Hadith"}
      </span>

      {item.arabic && (
        <p className="font-arabic text-xl sm:text-2xl leading-loose text-deany-navy mt-2" dir="rtl">
          {item.arabic}
        </p>
      )}

      <p className="text-sm sm:text-base text-deany-steel leading-relaxed mt-2" style={{ fontFamily: 'Georgia, serif' }}>
        &ldquo;{item.translation}&rdquo;
      </p>

      {item.narrator && (
        <p className="text-xs text-deany-muted mt-1">&mdash; {item.narrator}</p>
      )}

      <div className="flex items-center justify-center gap-2.5 mt-3 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-deany-gold">
          {item.ref}
        </span>
        {hasDetail && (
          <>
            <span className="text-deany-muted">&middot;</span>
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

      {/* Collapsible panel */}
      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${
          showDetail && hasDetail ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/60 max-w-lg mx-auto">
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
      </div>
    </div>
  );
};

export default QuranicQuote;
