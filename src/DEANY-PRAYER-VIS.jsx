// REVIEW:FIQH — All prayer positions, Arabic terms, recitations, and descriptions need scholarly verification.
// This visualization follows the general Hanafi/mainstream sequence of one rakat.

import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, RotateCcw } from 'lucide-react';
import PrayerFigure from './components/PrayerFigure.jsx';

/* Each step: [id, position, arabic, transliteration, english, description, recitationAr, recitationEn] */
const RAW = [
  ['qiyam', 'qiyam', '\u0642\u0650\u064A\u0627\u0645', 'Qiyam', 'Standing',
    'Stand upright facing the qiblah with hands at your sides. Set your intention for prayer.'],
  ['takbir', 'takbir', '\u062A\u064E\u0643\u0652\u0628\u0650\u064A\u0631\u064E\u0629 \u0627\u0644\u0625\u0650\u062D\u0652\u0631\u0627\u0645', 'Takbirat al-Ihram', 'Opening Takbir',
    'Raise both hands to your ears and say the opening takbir to enter the state of prayer.',
    '\u0627\u0644\u0644\u0647\u064F \u0623\u064E\u0643\u0652\u0628\u064E\u0631', 'Allahu Akbar'],
  ['qiyam-folded', 'qiyamFolded', '\u0642\u0650\u064A\u0627\u0645', 'Qiyam', 'Recitation',
    'Place your right hand over your left on your chest. Recite Surah Al-Fatiha and a short surah.',
    '\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650', 'Bismillahir Rahmanir Raheem'],
  ['ruku', 'ruku', '\u0631\u064F\u0643\u064F\u0648\u0639', "Ruku'", 'Bowing',
    'Bow with your back flat, hands on your knees. Repeat the glorification three times.',
    '\u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0631\u064E\u0628\u0651\u0650\u064A\u064E \u0627\u0644\u0652\u0639\u064E\u0638\u0650\u064A\u0645', 'Subhana Rabbiyal Adheem'],
  ['itidal', 'standingFromRuku', '\u0627\u0644\u0627\u0639\u0652\u062A\u0650\u062F\u064E\u0627\u0644', "I'tidal", 'Rising',
    'Rise back to standing. The imam says the first phrase; all respond with the second.',
    '\u0633\u064E\u0645\u0650\u0639\u064E \u0627\u0644\u0644\u0647\u064F \u0644\u0650\u0645\u064E\u0646\u0652 \u062D\u064E\u0645\u0650\u062F\u064E\u0647', "Sami' Allahu liman hamidah"],
  ['sujud-1', 'sujud', '\u0633\u064F\u062C\u064F\u0648\u062F', 'Sujud', 'First Prostration',
    'Place forehead, nose, palms, knees, and toes on the ground. Repeat three times.',
    '\u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0631\u064E\u0628\u0651\u0650\u064A\u064E \u0627\u0644\u0623\u064E\u0639\u0652\u0644\u064E\u0649', "Subhana Rabbiyal A'la"],
  ['sitting', 'sitting', '\u062C\u0650\u0644\u0652\u0633\u064E\u0629', 'Jalsah', 'Sitting',
    'Sit upright briefly between the two prostrations and ask for forgiveness.',
    '\u0631\u064E\u0628\u0651\u0650 \u0627\u063A\u0652\u0641\u0650\u0631\u0652 \u0644\u0650\u064A', 'Rabbi ighfir li'],
  ['sujud-2', 'sujud', '\u0633\u064F\u062C\u064F\u0648\u062F', 'Sujud', 'Second Prostration',
    'Prostrate again in the same manner, repeating the glorification three times.',
    '\u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0631\u064E\u0628\u0651\u0650\u064A\u064E \u0627\u0644\u0623\u064E\u0639\u0652\u0644\u064E\u0649', "Subhana Rabbiyal A'la"],
  ['complete', 'qiyam', '\u062A\u064E\u0645\u0651\u064E', 'Tamma', 'Rakat Complete',
    'You have completed one full rakat. In a multi-rakat prayer, you would now rise for the next.'],
];
const STEPS = RAW.map(([id, position, arabic, transliteration, english, description, recitationAr, recitationEn]) => (
  { id, position, arabic, transliteration, english, description, recitationAr: recitationAr || null, recitationEn: recitationEn || null }
));

const TOTAL = STEPS.length;

const DEANYPrayerVis = ({ onBack, onHome }) => {
  const [step, setStep] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);

  const current = STEPS[step];
  const isLast = step === TOTAL - 1;

  const goTo = useCallback((next) => {
    setFadeKey((k) => k + 1);
    setStep(next);
  }, []);

  const advance = useCallback(() => {
    if (!hasInteracted) setHasInteracted(true);
    if (!isLast) goTo(step + 1);
  }, [isLast, hasInteracted, step, goTo]);

  const retreat = useCallback(() => {
    if (step > 0) goTo(step - 1);
  }, [step, goTo]);

  const restart = useCallback(() => {
    setHasInteracted(false);
    goTo(0);
  }, [goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') advance();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') retreat();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advance, retreat]);

  return (
    <div className="max-w-md mx-auto px-5 py-6 min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 min-h-[48px] text-sm text-deany-steel hover:text-deany-navy transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg px-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <p className="text-xs font-medium uppercase tracking-wide text-deany-muted">
          The Prayer
        </p>
        <button
          onClick={onHome}
          className="flex items-center min-h-[48px] min-w-[48px] justify-center text-deany-steel hover:text-deany-navy transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2 rounded-lg"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-deany-border rounded-full mb-6 flex-shrink-0">
        <div
          className="h-full bg-deany-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center" key={fadeKey}>
        {/* Arabic name */}
        <p
          className="font-arabic text-3xl leading-loose text-deany-navy mb-1 animate-fade-in"
          dir="rtl"
        >
          {current.arabic}
        </p>

        {/* Transliteration + English */}
        <p className="text-sm text-deany-muted italic animate-fade-in">{current.transliteration}</p>
        <h2 className="text-lg font-semibold text-deany-navy mt-0.5 mb-5 animate-fade-in">
          {current.english}
        </h2>

        {/* Figure */}
        <div className="mb-5">
          <PrayerFigure
            position={current.position}
            onClick={isLast ? undefined : advance}
            showHint={!hasInteracted && step === 0}
            className="min-h-[48px]"
          />
        </div>

        {/* Recitation bubble */}
        {current.recitationAr && (
          <div className="bg-deany-cream rounded-2xl px-5 py-3 border border-deany-border shadow-sm w-full max-w-xs mb-3 animate-slide-up">
            <p className="font-arabic text-xl leading-loose text-deany-navy text-center" dir="rtl">
              {current.recitationAr}
            </p>
            <p className="text-sm text-deany-muted text-center mt-1 italic">
              {current.recitationEn}
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-base leading-relaxed text-deany-steel text-center max-w-xs animate-fade-in">
          {current.description}
        </p>

        {/* Step counter */}
        <p className="text-xs text-deany-muted mt-4 animate-fade-in">
          {step + 1} / {TOTAL}
        </p>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-between items-center mt-6 flex-shrink-0">
        <button
          onClick={retreat}
          disabled={step === 0}
          className={`flex items-center justify-center min-h-[48px] min-w-[48px] rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2 ${
            step === 0 ? 'text-deany-border cursor-not-allowed' : 'text-deany-steel hover:text-deany-navy hover:bg-deany-cream'
          }`}
          aria-label="Previous step"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {isLast ? (
          <div className="flex items-center gap-3">
            <button
              onClick={restart}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-medium text-deany-navy border border-deany-border hover:bg-deany-cream transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-xl font-medium bg-deany-gold text-white hover:brightness-105 active:brightness-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2"
            >
              Done
            </button>
          </div>
        ) : (
          <button
            onClick={advance}
            className="flex items-center justify-center min-h-[48px] min-w-[48px] rounded-xl text-deany-steel hover:text-deany-navy hover:bg-deany-cream transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2"
            aria-label="Next step"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DEANYPrayerVis;
