import React from 'react';

function TafseerSegment({ segment }) {
  if (segment.type === 'highlight') {
    return (
      <div className="border-l-4 border-teal-500 pl-4 mb-3 bg-teal-50/80 rounded-r-lg py-2.5 pr-3">
        {segment.label && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 block mb-1">
            {segment.label}
          </span>
        )}
        <p className="text-sm text-teal-900 font-medium leading-relaxed">{segment.text}</p>
      </div>
    );
  }
  if (segment.type === 'gem') {
    return (
      <div className="bg-deany-gold-light border border-deany-gold/20 rounded-xl px-5 py-4 mb-3 relative">
        <span className="absolute top-1.5 left-3 text-deany-gold text-2xl font-serif leading-none opacity-30">&ldquo;</span>
        <p className="text-[15px] text-deany-navy font-semibold leading-relaxed pl-4 italic">{segment.text}</p>
      </div>
    );
  }
  // type === 'body' (default)
  return <p className="text-sm text-gray-600 leading-relaxed mb-3">{segment.text}</p>;
}

export default function TafseerPanel({ tafseer }) {
  // Backward compat: plain string tafseer
  if (typeof tafseer === 'string') {
    return <p className="text-sm leading-relaxed text-gray-600">{tafseer}</p>;
  }

  return (
    <div className="text-left">
      {tafseer.scholars.map((scholar, i) => (
        <div key={i} className={i > 0 ? 'mt-4 pt-4 border-t border-gray-200/50' : ''}>
          {scholar.segments.map((seg, j) => <TafseerSegment key={j} segment={seg} />)}
          <p className="text-[11px] text-gray-400 font-medium">
            {scholar.name} &middot; <span className="italic">{scholar.source}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
