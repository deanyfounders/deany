// Calibration question bank.
//
// IMPORTANT: every question below is REUSED VERBATIM from an already-shipped,
// scholar-reviewed Deany lesson. No new Islamic content is authored here, so
// nothing new needs scholar review. Text (including the salawat glyph, macrons,
// and punctuation) is byte-identical to the source lesson. Source is cited per
// question. If any question is ever replaced with new content, mark it
// `// DRAFT - pending scholar review`.
//
// Ordered easy -> hard (roughly 3 easy, 3 medium, 2 hard), mirroring the
// lesson convention. `correct` is the index of the correct option.

export const CALIBRATION_QUESTIONS = [
  // 1 - EASY - Shahada - src/DEANY-B1L1.jsx (q1)
  {
    topic: 'Foundations of faith',
    question: 'How many distinct testimonies does the Shahadah contain?',
    options: [
      'One unified testimony, divided into two phrases for emphasis.',
      'Two separate testimonies: one about Allah and one about the Prophet ﷺ.',
      'Three: one about Allah, one about the Prophet ﷺ, and one about Islam itself.',
      'The number varies depending on the version recited.',
    ],
    correct: 1,
    explanation: "Correct. Ashhadu appears twice. The first testimony is about Allah: what He is and what He is not. The second is about Muhammad ﷺ and his role as Allah's Messenger. The word wa joins them.",
  },
  // 2 - EASY - Prayer - src/DEANY-B1L3.jsx (q3)
  {
    topic: 'Prayer',
    question: 'In obligatory prayer alone, how many times does a practising Muslim recite the Shahadah every day?',
    options: [
      'Five, once per prayer.',
      "Seventeen, once per rak'ah.",
      'Nine, once in each tashahhud sitting.',
      'It varies because the Shahadah is not part of obligatory prayer.',
    ],
    correct: 2,
    explanation: 'Correct. Fajr has one. Dhuhr, Asr, Maghrib, and Isha each have two. 1 + 2 + 2 + 2 + 2 = 9.',
  },
  // 3 - EASY/MEDIUM - Shahada - src/DEANY-B1L1.jsx (q2)
  {
    topic: 'Foundations of faith',
    question: 'Below are four phrases. Three express a feeling, hope, or preference. One is a formal declaration of fact. Which is the Shahadah closest to in structure?',
    options: [
      'I think this might be true.',
      'I really hope this is true.',
      'I testify that this is true.',
      'I want to believe this is true.',
    ],
    correct: 2,
    explanation: 'Correct. The Shahadah uses the same grammatical form as testimony. It is not a hope, feeling, or wish. It is a declaration that something is true.',
  },
  // 4 - MEDIUM - Creed - src/DEANY-B1L2.jsx (q1)
  {
    topic: 'Foundations of faith',
    question: 'In the second testimony, Muhammad ﷺ is named as rasul of Allah. Which best captures what rasul means?',
    options: [
      'A teacher or wise man who arrives at religious truth through reflection.',
      'Anyone who speaks about Allah in a general spiritual sense.',
      'One who is sent with a message and a mission by an authority.',
      'The most virtuous person in a generation, regardless of revelation.',
    ],
    correct: 2,
    explanation: 'Correct. Rasul carries the meaning of being sent with a message, on a mission, by an authority.',
  },
  // 5 - MEDIUM - Finance - DEANY_M1L3.jsx (q2)
  {
    topic: 'Islamic finance',
    question: 'Which BEST describes why ribā is prohibited?',
    options: [
      'Because making profit is wrong in Islam.',
      'Because the lender profits with zero risk while the borrower bears everything.',
      'Because lending money to people is not allowed.',
      'Because interest rates are too high.',
    ],
    correct: 1,
    explanation: "Exactly. The issue isn't profit - Islam encourages fair profit from real trade. The issue is RISK-FREE profit from money lent. One side bears everything, the other bears nothing. That's the injustice.",
  },
  // 6 - MEDIUM/HARD - Shahada - src/DEANY-B1L1.jsx (q5)
  {
    topic: 'Foundations of faith',
    question: 'You have learned that the Shahadah contains two testimonies, uses the testimony form of ashhadu, and negates before it affirms. Which answer best captures what makes it distinct as a declaration of faith?',
    options: [
      'Its length, because it is fewer than 15 Arabic words.',
      'Its form, because it is a testimony, not a feeling, and it clears the field of false objects of worship before affirming the true one.',
      'Its emotional effect, because it makes a person feel connected to Muslims around the world.',
      'Its recitation frequency, because Muslims say it more often than other religious creeds.',
    ],
    correct: 1,
    explanation: "Correct. The Shahadah's distinctness is structural. Ashhadu makes it a formal declaration, and the order clears the field before placing the truth.",
  },
  // 7 - HARD - Prayer (fiqh scenario) - src/DEANY-S2L3.jsx (MC_SCENARIO)
  {
    topic: 'Prayer',
    question: "Yusuf is praying Maghrib. In the second rak'ah, after rising from the first sujud, he gets distracted by his thoughts and stands straight up to begin the next rak'ah without performing the second sujud. He realises his mistake just as he stands. What should he do?",
    options: [
      'Continue the prayer normally. One sujud is enough.',
      'Sit back down and perform the missed sujud, then continue.',
      'Restart the entire prayer from the beginning.',
      "Add an extra rak'ah at the end to make up for it.",
    ],
    correct: 1,
    explanation: 'Correct. Sujud is a pillar and there must be two per rak\'ah. He returns to the missed pillar before continuing the prayer.',
  },
  // 8 - HARD - Pillars (scenario) - src/DEANY-B1L1.jsx (q4)
  {
    topic: 'Foundations of faith',
    question: 'Amina declared the Shahadah at a young age and sincerely believes it. Recently, she has struggled to pray consistently due to depression and has missed several weeks of prayers. A friend tells her she should re-declare the Shahadah to be sure she is still Muslim. Which response is safest and most accurate?',
    options: [
      'The friend is correct. Missed prayers automatically erase the Shahadah, so she must re-declare it.',
      'The friend is correct because weak practice means faith has dissolved.',
      'The friend is incorrect. Amina should be helped back to prayer with repentance and support, not told that her Shahadah has disappeared from this struggle.',
      'The friend is incorrect only because Amina has a valid excuse. Without that, the friend would be correct.',
    ],
    correct: 2,
    explanation: 'Correct. The Shahadah is not re-declared every time a Muslim falls short. Prayer remains a serious obligation, and Amina should be supported back to it. This is not a licence to minimise missed prayer, but it avoids careless judgement about her Islam.',
  },
];

// Banding by number correct out of 8.
export function bandFor(score) {
  if (score <= 3) return 'Foundations';
  if (score <= 6) return 'Builder';
  return 'Advanced';
}

export const BAND_BLURB = {
  Foundations: 'We will start with the essentials and build a strong base, one step at a time.',
  Builder: 'You have a solid base. We will build on what you know and fill in the gaps.',
  Advanced: 'You know your foundations well. We will start you on the deeper material.',
};
