// REVIEW:QURAN — Verify all translations and tafseer paraphrases against original sources
// REVIEW:HADITH — Verify all hadith gradings, narrations, and translations

const Q = "Al-Jami' li-Ahkam al-Quran";
const I = 'Al-Muharrar al-Wajiz';

export const DAILY_CONTENT = [
  // ── AYAH 1 ─────────────────────────────────────────────────
  {
    id: 'baqarah-2-216', type: 'ayah', ref: 'Al-Baqarah 2:216',
    arabic: 'عسى أن تكرهوا شيئاً وهو خيرـ لكم',
    transliteration: "'Asa an takrahu shay'an wa huwa khayrun lakum",
    translation: 'It may be that you dislike a thing which is good for you, and that you like a thing which is bad for you. Allah knows but you do not know.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: 'Establishes this as a foundational principle: the human intellect cannot perceive the full wisdom behind divine decrees.' },
        { type: 'highlight', label: 'Divine assurance', text: '"Wa huwa khayrun lakum" is Allah\'s direct assurance that what He ordains is invariably better than what His servant desires.' },
        { type: 'gem', text: 'Every obligation or trial that the self resists may carry within it a benefit inaccessible to human perception.' },
        { type: 'body', text: 'The scholars unanimously held that this principle is not restricted to jihad but applies to all of Allah\'s decrees.' },
      ]},
    ]},
  },

  // ── AYAH 2 ─────────────────────────────────────────────────
  {
    id: 'baqarah-2-286', type: 'ayah', ref: 'Al-Baqarah 2:286',
    arabic: 'لا يكلّفُ اللّهُ نفساً إلّا وُسْعَها',
    transliteration: "La yukalliful-Lahu nafsan illa wus'aha",
    translation: 'Allah does not burden a soul beyond that it can bear.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: 'This ayah is among the most mercy-laden in the entire Quran.' },
        { type: 'highlight', label: 'Occasion of revelation', text: 'The companions feared being held accountable for thoughts arising in their hearts, and this verse came as divine relief.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: '"Wus\'aha" (its capacity) refers to what the soul can genuinely carry, not merely what it prefers — meaning Allah calibrated every burden with exact precision to the one who bears it.' },
      ]},
    ]},
  },

  // ── AYAH 3 ─────────────────────────────────────────────────
  {
    id: 'sharh-94-5-6', type: 'ayah', ref: 'Ash-Sharh 94:5-6',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْراً • إِنَّ مَعَ الْعُسْرِ يُسْراً',
    transliteration: "Fa-inna ma'al-'usri yusra. Inna ma'al-'usri yusra.",
    translation: 'For indeed, with hardship will be ease. Indeed, with hardship will be ease.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: 'Explains the grammatical subtlety: "al-\'usr" carries the definite article and is singular, while "yusr" is indefinite and repeated twice.' },
        { type: 'highlight', label: "The scholars' principle", text: 'A definite noun used twice in Arabic refers to the same entity; an indefinite noun used twice refers to two separate instances — hence one hardship, two eases.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: 'The ease is structurally inseparable from the hardship, not sequential to it — they arrive together.' },
      ]},
    ]},
  },

  // ── AYAH 4 ─────────────────────────────────────────────────
  {
    id: 'aal-imran-3-173', type: 'ayah', ref: 'Aal Imran 3:173',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: "Hasbunallahu wa ni'mal-wakil",
    translation: 'Allah is sufficient for us, and He is the Best Disposer of affairs.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: "These words were uttered by the companions at Hamra' al-Asad, immediately after the grief of Uhud, when Abu Sufyan threatened to return." },
        { type: 'highlight', label: 'Core meaning', text: '"Hasbunallah" is a comprehensive declaration: Allah is fully sufficient in all matters, leaving no need unaddressed by any other.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: 'This four-word phrase condenses three spiritual stations simultaneously: tawakkul (reliance on Allah), tafwid (delegation of all affairs to Him), and ridwan (contentment with whatever He decrees).' },
      ]},
    ]},
  },

  // ── AYAH 5 ─────────────────────────────────────────────────
  {
    id: 'talaq-65-3', type: 'ayah', ref: 'At-Talaq 65:3',
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    transliteration: "Wa man yatawakkal 'alal-Lahi fa-huwa hasbuh",
    translation: 'And whoever relies upon Allah — then He is sufficient for him.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: "This is the Quran's supreme statement on tawakkul: an unconditional Divine pledge with no restriction on who qualifies." },
        { type: 'highlight', label: 'What tawakkul really means', text: 'Tawakkul in the scholars\' definition is not passivity or abandonment of means, but the anchoring of the heart entirely in Allah while the limbs continue to act.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: 'Sufficiency from Allah follows reliance upon Allah as a direct consequence, not a delayed reward.' },
      ]},
    ]},
  },

  // ── AYAH 6 ─────────────────────────────────────────────────
  {
    id: 'raad-13-28', type: 'ayah', ref: "Ar-Ra'd 13:28",
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    transliteration: "Ala bi-dhikrillahi tatma'innul-qulub",
    translation: 'Unquestionably, by the remembrance of Allah do hearts find rest.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'highlight', label: 'What tama\'ninah means', text: "Tama'ninah is the deepest form of stillness and settledness, beyond mere comfort or happiness — a profound spiritual tranquillity that no worldly cause can produce: neither wealth, nor security, nor companionship generates what dhikr alone provides." },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'body', text: 'The affirmative particle "ala" opening the ayah is used in classical Arabic specifically to draw urgent attention to something of supreme importance.' },
        { type: 'gem', text: 'The heart that is disconnected from dhikr is in a state of restlessness by divine design.' },
      ]},
    ]},
  },

  // ── AYAH 7 ─────────────────────────────────────────────────
  {
    id: 'zumar-39-53', type: 'ayah', ref: 'Az-Zumar 39:53',
    arabic: 'لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ • إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعاً',
    transliteration: "La taqnatu min rahmatil-Lah. Innal-Laha yaghfirudh-dhunuba jami'a.",
    translation: 'Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: "Identifies this as the ayah of greatest hope (raja') in the Quran. The address is directed to those who have \"transgressed against themselves\" — sinners called directly by Allah to turn back." },
        { type: 'highlight', label: 'Scope of mercy', text: "The scholars unanimously held that \"yaghfiru al-dhunuba jami'an\" applies to all sins for those who repent and return to Islam." },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: '"Jami\'an" (all) is a totality word in Arabic that linguistically permits no exception: the scope of divine mercy, as stated, exceeds any sin a human could commit.' },
      ]},
    ]},
  },

  // ── AYAH 8 ─────────────────────────────────────────────────
  {
    id: 'baqarah-2-152', type: 'ayah', ref: 'Al-Baqarah 2:152',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    transliteration: 'Fadhkuruni adhkurkum wash-kuru li wa la takfurun',
    translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: 'This ayah establishes the most intimate reciprocal pledge in the Quran: the Creator of the heavens promises to remember the servant who remembers Him.' },
        { type: 'highlight', label: 'What "I will remember you" means', text: 'Some scholars said it means forgiveness; others, divine reward; others, praise of the servant among the angels — and Al-Qurtubi holds all these meanings are included together.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: 'The inseparable triad: dhikr of the tongue, shukr of the heart, and rejection of ingratitude — together constituting the complete response of the believing soul.' },
      ]},
    ]},
  },

  // ── AYAH 9 ─────────────────────────────────────────────────
  {
    id: 'ibrahim-14-7', type: 'ayah', ref: 'Ibrahim 14:7',
    arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ • وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَديدْ',
    transliteration: "La'in shakartum la-azidannakum. Wa la'in kafartum inna 'adhabi la-shadid.",
    translation: 'If you are grateful, I will surely increase you in favour; but if you deny, indeed My punishment is severe.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: 'The "increase" (ziyada) is linguistically unrestricted: the grammar contains no qualifier limiting it to any single type.' },
        { type: 'highlight', label: 'Scope of increase', text: 'Scholars said it encompasses increase in provision, faith, knowledge, wellbeing, and station in the Hereafter.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'body', text: 'The construction deploys a conditional oath structure — making this among the most formally binding divine promises in the Quran.' },
        { type: 'gem', text: 'Shukr (gratitude) in the scholars\' definition is not speech alone: it is the heart acknowledging the gift, the tongue expressing it, and the limbs acting accordingly.' },
      ]},
    ]},
  },

  // ── AYAH 10 ────────────────────────────────────────────────
  {
    id: 'inshirah-94-1-3', type: 'ayah', ref: 'Al-Inshirah 94:1-3',
    arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ • وَوَضَعْنَا عَنكَ وِزْرَكَ',
    transliteration: "Alam nashrah laka sadrak. Wa wada'na 'anka wizrak.",
    translation: 'Did We not expand for you your chest? And We removed from you your burden.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: 'The rhetorical question "alam nashrah" is a form of divine tenderness: reminding the Prophet (peace be upon him) of gifts he may have overlooked in moments of distress.' },
        { type: 'highlight', label: 'Expansion of the chest', text: "Sharh al-sadr means: the heart's readiness to receive truth, bear hardship with patience, and engage others with generosity." },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: 'Allah customises His preparation of each believer for the role they are given.' },
      ]},
    ]},
  },

  // ── AYAH 11 ────────────────────────────────────────────────
  {
    id: 'baqarah-2-45', type: 'ayah', ref: 'Al-Baqarah 2:45',
    arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ • وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ',
    transliteration: "Wasta'inu bis-sabri was-salah. Wa innaha la-kabiratun illa 'alal-khashi'in.",
    translation: 'And seek help through patience and prayer; and indeed, it is difficult except for the humbly submissive.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'highlight', label: 'Why sabr and salah together', text: 'Sabr restrains the soul from what harms it, while salah connects it to the source that nourishes it.' },
        { type: 'body', text: '"Kabiratun" (great, weighty) applied to prayer does not mean it is inherently burdensome, but that its heaviness is felt only by those whose hearts remain heedless of Allah.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: 'Al-khashi\'in — the humbly submissive — are those whose hearts are in a state of awe before Allah at all times: for them, prayer is not a weight but a return to rest.' },
      ]},
    ]},
  },

  // ── AYAH 12 ────────────────────────────────────────────────
  {
    id: 'baqarah-2-256', type: 'ayah', ref: 'Al-Baqarah 2:256',
    arabic: 'لَا إِكْرَاهَ فِي الدِّينِ • قَد تَبَيَّنَ الرُّشْدُ مِنَ الغَيِّ',
    transliteration: "La ikraha fi'd-din. Qad tabayyana'r-rushdu min'al-ghayy.",
    translation: 'There is no compulsion in religion. The right course has become clear from the wrong.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: '"La ikraha fi al-din" establishes a foundational principle: iman, by its very nature, requires willing conviction and cannot be produced by force.' },
        { type: 'highlight', label: 'Universal scope', text: 'Al-Qurtubi records the scholarly discussion on scope and favours the position of universality — this is a permanent principle, not limited to one context.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: 'Revelation has illuminated the distinction between truth and falsehood so completely that compulsion becomes superfluous — the evidence stands on its own.' },
      ]},
    ]},
  },

  // ── AYAH 13 ────────────────────────────────────────────────
  {
    id: 'nahl-16-97', type: 'ayah', ref: 'An-Nahl 16:97',
    arabic: 'مَنْ عَمِلَ صَالِحاً … فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً',
    transliteration: "Man 'amila salihan… falanu-hiyannahu hayatan tayyiba.",
    translation: 'Whoever does righteous deeds… We will surely cause him to live a good life.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: "Scholars differed on \"hayah tayyibah\" (a good life): some said it is rizq halal (lawful sustenance), others said the life of barzakh for believers, and others said qana'ah — contentment." },
        { type: 'gem', text: "A life made good not by its material circumstances but by the heart's satisfaction with Allah's decree." },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'highlight', label: 'Equal promise', text: 'The gender-neutral form "man \'amila" (whoever does) explicitly includes both men and women as equal recipients of this promise.' },
      ]},
    ]},
  },

  // ── AYAH 14 ────────────────────────────────────────────────
  {
    id: 'ikhlas-112-3-4', type: 'ayah', ref: 'Al-Ikhlas 112:3-4',
    arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ • وَلَمْ يَكُن لَّهُ كُفُواً أَحَدْ',
    transliteration: 'Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.',
    translation: 'He neither begets nor was He begotten. Nor is there to Him any equivalent.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'highlight', label: 'Theological foundation', text: '"Lam yalid wa lam yulad" constitutes a complete negation of all anthropomorphism in both directions: Allah has no offspring and no origin.' },
        { type: 'body', text: "These two verses alone are sufficient to refute every theological error about Allah's nature." },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: "The absolute incomparability of Allah is affirmed with the most expansive language Arabic possesses — \"ahad\" used in its most absolute sense, admitting no likeness in any category of existence." },
      ]},
    ]},
  },

  // ── AYAH 15 ────────────────────────────────────────────────
  {
    id: 'kafirun-109-6', type: 'ayah', ref: 'Al-Kafirun 109:6',
    arabic: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ',
    transliteration: 'Lakum dinukum wa liya din.',
    translation: 'For you is your religion, and for me is my religion.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: "This is not a concession of religious equivalence but a declaration of complete non-entanglement: each party's accountability rests with their own chosen path." },
        { type: 'highlight', label: 'Historical context', text: 'The Quraysh offered the Prophet (peace be upon him) a compromise of mutual worship, and this surah descended as a direct, dignified refusal.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: "The six-fold repetition of forms of 'ibadah throughout the surah is a rhetorical device of absolute finality in Arabic — leaving no ambiguity about the separation between tawhid and shirk." },
      ]},
    ]},
  },

  // ── AYAH 16 ────────────────────────────────────────────────
  {
    id: 'hadid-57-22-23', type: 'ayah', ref: 'Al-Hadid 57:22-23',
    arabic: 'مَا أَصَابَ مِن مُّصِيبَةَ فِي الْأَرْضِ وَلَا فِي أَنفُسِكُمْ إِلَّا فِي كِتَابَ',
    transliteration: "Ma asaba min musibatin fil-ardi wa la fi anfusikum illa fi kitab…",
    translation: 'No calamity befalls on earth, nor in yourselves, except that it was recorded in a Book before We brought it into existence…',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: 'The recording of every decree in Al-Lawh al-Mahfuz before creation is a foundational article of belief, not merely a moral lesson.' },
        { type: 'gem', text: 'This is one of the few places in the Quran where an article of faith is explicitly tied to its psychological benefit: it was recorded "so that you may not grieve for what has escaped you, nor be exultant at what He has given you."' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'highlight', label: 'Core principle', text: 'Equanimity in loss and humility in gain both flow from this single conviction.' },
      ]},
    ]},
  },

  // ── AYAH 17 ────────────────────────────────────────────────
  {
    id: 'ahzab-33-3', type: 'ayah', ref: 'Al-Ahzab 33:3',
    arabic: 'وَتَوَكَّلْ عَلَى اللَّهِ • وَكَفَى بِاللَّهِ وَكِيلاً',
    transliteration: "Wa tawakkal 'alal-Lahi wa kafa bil-Lahi wakila.",
    translation: 'And put your trust in Allah; and sufficient is Allah as Disposer of affairs.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: 'This verse comes directly after the command to maintain taqwa, placing tawakkul as the spiritual armour for holding firm.' },
        { type: 'highlight', label: 'Al-Wakil', text: '"Wakila" (Trustee) means one who manages everything on behalf of another — Allah takes complete charge of the affairs of the one who entrusts themselves to Him.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: '"Kafa" (sufficient) carries the sense that nothing outstanding remains once Allah is relied upon. The believer\'s part is to turn, and Allah\'s part is to carry.' },
      ]},
    ]},
  },

  // ── AYAH 18 ────────────────────────────────────────────────
  {
    id: 'baqarah-2-186', type: 'ayah', ref: 'Al-Baqarah 2:186',
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي • فَإِنِّي قَرِيبٌ • أَجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    transliteration: "Wa idha sa'alaka 'ibadi 'anni: fa-inni qarib. Ujibu da'wata'd-da'i idha da'an.",
    translation: 'And when My servants ask you about Me — indeed I am near. I respond to the call of the caller when he calls.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: 'One of the most intimate ayahs in the entire Quran. It is placed within the verses of Ramadan, and the response comes without intermediary, in the first person, directly from Allah.' },
        { type: 'gem', text: 'Allah said "I respond" (ujib) rather than "I accept" — indicating that every sincere du\'a is heard even if the divine response takes a form the servant does not immediately recognise.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'highlight', label: 'Unconditional nearness', text: "Allah's nearness is unconditional; it is the believer's part that follows, not precedes, the divine guarantee." },
      ]},
    ]},
  },

  // ── AYAH 19 ────────────────────────────────────────────────
  {
    id: 'duha-93-5', type: 'ayah', ref: 'Ad-Duha 93:5',
    arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَى',
    transliteration: "Wa lasawfa yu'tika rabbuka fa-tarda.",
    translation: 'And your Lord is going to give you, and you will be satisfied.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'body', text: "This was the Prophet's (peace be upon him) consolation during the cessation of revelation, when the mushrikeen mocked him." },
        { type: 'highlight', label: 'Scope of the promise', text: 'The verse is an open-ended divine promise: Allah will give until the recipient is fully satisfied — encompassing all honours in the Hereafter, including the great intercession.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: '"La-sawfa" combines the emphatic lam with the future particle sawfa — together constituting the most linguistically emphatic form of future promise available in classical Arabic, leaving no room for doubt.' },
      ]},
    ]},
  },

  // ── AYAH 20 ────────────────────────────────────────────────
  {
    id: 'fath-48-4', type: 'ayah', ref: 'Al-Fath 48:4',
    arabic: 'هُوَ الَّذِي أَنزَلَ السَّكِينَةَ فِي قُلُوبِ الْمُؤْمِنِينَ',
    transliteration: "Huwal-ladhi anzala's-sakinata fi qulubil-mu'minin.",
    translation: 'It is He who sent down tranquility into the hearts of the believers.',
    tafseer: { scholars: [
      { name: 'Al-Qurtubi', source: Q, segments: [
        { type: 'highlight', label: 'What sakina is', text: 'Sakina is a divine quality of peace and settledness that Allah sends directly into the heart: it is not a product of circumstance or self-discipline, but an act of Allah upon the believer.' },
        { type: 'body', text: 'Certainty in moments of fear, steadiness during crisis, and composure before overwhelming odds — all of these being gifts from above, not achievements from within.' },
      ]},
      { name: 'Ibn Atiyyah', source: I, segments: [
        { type: 'gem', text: 'Tranquillity deepens iman, and deepened iman opens the heart to further tranquillity — a divine spiral of grace.' },
      ]},
    ]},
  },

  // ── HADITH 1 ───────────────────────────────────────────────
  // REVIEW:HADITH — Verify exact wording and book/hadith number
  {
    id: 'bukhari-1', type: 'hadith', ref: 'Sahih al-Bukhari 1',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    narrator: 'Umar ibn al-Khattab رضي الله عنه',
    translation: 'Actions are but by intentions, and every person will have only what they intended.',
    context: 'The first hadith in Sahih al-Bukhari and the foundation of Islamic jurisprudence. Imam al-Bukhari opened his entire collection with this narration because intention (niyyah) is the prerequisite that gives meaning to every act of worship, every transaction, and every deed. Without the correct intention, even an outwardly good action loses its spiritual weight.',
  },

  // REVIEW:HADITH — Verify exact wording and book/hadith number
  {
    id: 'bukhari-5027', type: 'hadith', ref: 'Sahih al-Bukhari 5027',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    narrator: 'Uthman ibn Affan رضي الله عنه',
    translation: 'The best of you are those who learn the Quran and teach it.',
    context: 'A hadith that places Quranic education at the summit of virtuous action. The Prophet (peace be upon him) did not say "the best of you are the wealthiest" or "the most powerful" — he said the best are those engaged in the cycle of learning and passing on the Book of Allah. This applies to every level of learning: the beginner who studies a single surah and shares it is included in this promise.',
  },

  // REVIEW:HADITH — Verify exact wording, grading, and hadith number
  {
    id: 'bukhari-3', type: 'hadith', ref: 'Sahih al-Bukhari — Book of Revelation, Hadith 3',
    arabic: null,
    narrator: 'Aisha رضي الله عنها',
    translation: 'He returned home while his heart was trembling and said: "Wrap me! Wrap me!"',
    context: "Narrated by Aisha رضي الله عنها — the first account of the first revelation. After the angel Jibril appeared to the Prophet Muhammad ﷺ in the cave of Hira and commanded him to read, the Prophet returned to Khadijah in a state of awe and fear. This hadith captures the profoundly human moment at the beginning of prophethood: even the greatest of creation was shaken by the encounter with divine revelation.",
  },

  // REVIEW:HADITH — Verify exact wording, grading by al-Albani, and hadith number
  {
    id: 'dawud-3462', type: 'hadith', ref: 'Abu Dawud 3462, graded sahih by al-Albani',
    arabic: null,
    narrator: null,
    translation: "The Prophet ﷺ prohibited bay' al-inah — a transaction where a person sells an item to another on credit then buys it back for less in cash.",
    context: "The earliest prohibition of a legal trick (hilah) in Islamic finance. Bay' al-inah looks like two separate sales, but in substance it is a loan with interest disguised through a sale contract. This hadith establishes a core principle that runs through all of Islamic finance: substance matters more than the label. A transaction that achieves the same result as riba does not become permissible merely because it is structured differently.",
  },
];

// Helper — pick today's item deterministically (cycles by day of year)
export function getTodayContent() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return DAILY_CONTENT[dayOfYear % DAILY_CONTENT.length];
}
