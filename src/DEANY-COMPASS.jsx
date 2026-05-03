import React, { useCallback, useMemo, useState } from "react";

// ── Topics (the 5 subjects available on Deany) ──────────────────────────
const TOPICS = [
  { id: "5_pillars", title: "Five Pillars", icon: "\u{1F54C}", desc: "Prayer, fasting, zakat, hajj, and shahada" },
  { id: "islamic_finance", title: "Islamic Finance", icon: "\u{1F4B0}", desc: "Halal trade, contracts, and wealth" },
  { id: "islamic_history", title: "Islamic History", icon: "\u{1F4DC}", desc: "From revelation to the modern age" },
  { id: "quran_memorisation", title: "Qur\u2019an Memorisation", icon: "\u{1F4D6}", desc: "Surahs, structure, and recitation" },
  { id: "tafseer", title: "Tafsir", icon: "\u{1F50D}", desc: "Meaning and reflection on the Qur\u2019an" },
];

const LEVELS = [
  { id: "beginner", tier: 1, label: "Beginner", desc: "I\u2019m just getting started" },
  { id: "intermediate", tier: 2, label: "Intermediate", desc: "I know the basics well" },
  { id: "advanced", tier: 3, label: "Advanced", desc: "I\u2019ve studied this seriously" },
];

const TIER_LABEL = { 0: "New", 1: "Beginner", 2: "Intermediate", 3: "Advanced" };

// ── Question bank — sourced verbatim from DEANY Calibration Question Bank v1 ──
// REVIEW:FIQH — Maliki madhab standard. Hadith: Bukhari + Muslim only.
// Format: [id, prompt, [opt0,opt1,opt2,opt3], correctIndex, source/explanation]
const QBANK = {
  "5_pillars": {
    1: [
      ["5P-B1", "How many obligatory daily prayers are there in Islam?", ["Three", "Four", "Five", "Six"], 2, "Five daily prayers: Fajr, Dhuhr, Asr, Maghrib, Isha. (Bukhari 349; Muslim 162)"],
      ["5P-B2", "During which month do Muslims observe the obligatory fast?", ["Muharram", "Rajab", "Sha\u2019ban", "Ramadan"], 3, "Fasting in Ramadan is the fourth pillar. (Qur\u2019an 2:185)"],
      ["5P-B3", "What is the Arabic name for the testimony of faith \u2014 the first pillar of Islam?", ["Salah", "Shahadah", "Zakat", "Sawm"], 1, "The Shahadah declares Allah\u2019s oneness and Muhammad\u2019s prophethood. (Bukhari 8)"],
      ["5P-B4", "How often must a Muslim perform Hajj if they have the means and ability?", ["Every year", "Every five years", "Once in their lifetime", "Whenever they choose"], 2, "Hajj is obligatory once for those with means. (Muslim 1337; Qur\u2019an 3:97)"],
      ["5P-B5", "What is the standard rate of zakat on qualifying cash savings held for one lunar year?", ["1%", "2.5%", "5%", "10%"], 1, "Zakat on cash is 2.5% (one fortieth) above nisab. (Bukhari 1454)"],
    ],
    2: [
      ["5P-I1", "How many rak\u2019ahs (units) are in the Maghrib prayer?", ["Two", "Three", "Four", "Five"], 1, "Maghrib is uniquely three rak\u2019ahs. (Bukhari 350)"],
      ["5P-I2", "Which of the following invalidates wudu (ablution)?", ["Touching one\u2019s beard", "Drinking water", "Passing wind", "Walking outdoors"], 2, "Passing wind nullifies wudu by consensus. (Bukhari 135; Muslim 225)"],
      ["5P-I3", "What is the opening Takbeer of Salah called?", ["Takbeerat al-Ihram", "Takbeer at-Tashreeq", "Takbeer at-Ruku\u2019", "Takbeer at-Sujood"], 0, "\u201CAllahu Akbar\u201D at the start enters the sacred state. (Bukhari 757)"],
      ["5P-I4", "The nisab (minimum threshold) for zakat on gold is approximately:", ["50 grams", "87.48 grams (20 mithqal)", "200 grams", "595 grams"], 1, "Classical nisab for gold is 20 mithqal \u2248 87.48g. (Bukhari 1447)"],
      ["5P-I5", "Which of the following is NOT one of the four arkan (pillars) of Hajj according to Maliki fiqh?", ["Ihram (entering the sacred state)", "Wuquf at Arafah", "Tawaf al-Ifadah", "Throwing pebbles at the Jamarat"], 3, "Maliki arkan: Ihram, Wuquf, Tawaf al-Ifadah, Sa\u2019i. Pebbles are wajib, not rukn. (Al-Risalah of Ibn Abi Zayd)"],
    ],
    3: [
      ["5P-A1", "In Maliki madhab, what is the classical position of the hands during qiyam in obligatory prayer?", ["Folded over the chest", "Folded over the navel", "Folded below the navel", "Resting at the sides (sadl)"], 3, "Sadl is the classical Maliki position in fard prayer. (Mudawwana; al-Risalah)"],
      ["5P-A2", "In Maliki fiqh, how is the Bismillah handled before Surah al-Fatiha during obligatory prayer?", ["Recited aloud", "Recited silently", "Omitted entirely", "Left to the worshipper\u2019s preference"], 2, "Maliki: omit Bismillah before Fatiha in fard prayer. (Al-Muwatta; Mudawwana)"],
      ["5P-A3", "When is the raising of the hands (raf\u2019 al-yadayn) prescribed in Maliki obligatory prayer?", ["At the opening Takbeer only", "At the opening Takbeer and before ruku\u2019", "At the opening, before ruku\u2019, and rising from ruku\u2019", "At the opening Takbeer and before sujood"], 0, "Maliki: raise hands only at Takbeerat al-Ihram. (Al-Muwatta; Mudawwana)"],
      ["5P-A4", "According to Maliki fiqh, what is the legal classification of the Witr prayer?", ["Fard", "Wajib", "Sunnah Mu\u2019akkadah", "Mustahabb"], 2, "Maliki: Witr is Sunnah Mu\u2019akkadah, not obligatory. (Mudawwana; al-Risalah)"],
      ["5P-A5", "In Maliki fiqh, when does the time for Asr prayer begin?", ["Immediately after Dhuhr ends", "When the shadow of an object equals the object\u2019s own length", "When the shadow of an object is twice the object\u2019s length", "At the midpoint between Dhuhr and Maghrib"], 1, "Maliki, Shafi\u2019i, and Hanbali agree: Asr when shadow equals object length. (Al-Muwatta; al-Risalah)"],
    ],
  },
  "islamic_finance": {
    1: [
      ["IF-B1", "What is the term for interest or usury in Islamic finance?", ["Zakat", "Riba", "Sadaqah", "Khums"], 1, "Riba: interest and unjust gain. \u201CAllah has permitted trade and forbidden riba.\u201D (Qur\u2019an 2:275)"],
      ["IF-B2", "Which of the following is permissible (halal) for a Muslim to earn through?", ["Lending money at interest", "Selling alcohol", "Honest trade in lawful goods and services", "Gambling on outcomes"], 2, "Trade in lawful goods is the foundation of permissible earning. (Qur\u2019an 2:275)"],
      ["IF-B3", "What is zakat?", ["Voluntary daily charity", "An annual obligatory purification of qualifying wealth", "A tax paid to non-Muslim governments", "Money given only during Ramadan"], 1, "Zakat: third pillar, typically 2.5% of qualifying wealth above nisab. (Qur\u2019an 9:60)"],
      ["IF-B4", "What does \u201Chalal\u201D mean in the context of food and earnings?", ["Required", "Recommended", "Permissible according to Islamic law", "Forbidden"], 2, "Halal means lawful or permissible; its opposite is haram."],
      ["IF-B5", "What is sadaqah?", ["Obligatory annual charity", "Voluntary charity given for the sake of Allah", "Money given only to family members", "A type of prayer"], 1, "Sadaqah is voluntary charity beyond obligatory zakat. (Muslim 2588)"],
    ],
    2: [
      ["IF-I1", "What is Murabaha in Islamic finance?", ["An interest-bearing loan", "A profit-and-loss-sharing partnership", "A cost-plus sale where the seller transparently discloses the cost and adds a fixed margin", "A leasing contract"], 2, "Murabaha: cost-plus sale with known mark-up. (AAOIFI Standard No. 8)"],
      ["IF-I2", "What is Mudaraba?", ["A joint partnership where all partners contribute capital equally", "A partnership where one party provides capital and the other provides labour and expertise", "A guaranteed-return savings product", "A currency exchange contract"], 1, "Rabb al-mal provides capital, mudarib provides labour. Profits shared per ratio. (AAOIFI Standard No. 13)"],
      ["IF-I3", "What is the difference between Riba al-Fadl and Riba al-Nasi\u2019ah?", ["They are two names for the same thing", "Riba al-Fadl arises from unequal exchange of the same ribawi commodity; Riba al-Nasi\u2019ah arises from delay or interest charged over time", "Riba al-Fadl is permissible; Riba al-Nasi\u2019ah is forbidden", "Riba al-Fadl applies only to gold; Riba al-Nasi\u2019ah applies only to silver"], 1, "Both forms are prohibited. (Bukhari 2174; Muslim 1584)"],
      ["IF-I4", "What is Ijara in Islamic finance?", ["A profit-sharing investment fund", "A sale contract with deferred payment", "A leasing contract where ownership remains with the lessor and the lessee pays for usage", "A guaranteed-return deposit account"], 2, "Ijara: lessor retains ownership, lessee pays rent. (AAOIFI Standard No. 9)"],
      ["IF-I5", "What does Gharar refer to in Islamic finance?", ["Profit", "Excessive uncertainty or ambiguity in a contract", "Transparency in disclosure", "Profit-sharing between parties"], 1, "Gharar: excessive uncertainty that makes outcomes speculative. (Muslim 1513)"],
    ],
    3: [
      ["IF-A1", "Which are the six commodities mentioned in the hadith of \u2018Ubadah ibn al-Samit as ribawi commodities?", ["Gold, silver, wheat, barley, rice, oil", "Gold, silver, wheat, barley, dates, salt", "Gold, silver, copper, wheat, dates, salt", "Gold, silver, wheat, oats, dates, sugar"], 1, "The six ribawi commodities from the hadith. (Muslim 1587)"],
      ["IF-A2", "According to Maliki fiqh, what is the ruling on Bay\u2019 al-\u2018Inah?", ["Permissible without restriction", "Permissible only with witnesses", "Prohibited as a backdoor (hilah) to riba", "Permissible only between Muslims"], 2, "Maliki, Hanafi, Hanbali prohibit it. (Mudawwana; AAOIFI Standard No. 30)"],
      ["IF-A3", "What is Takaful and how does it differ from conventional insurance?", ["An interest-bearing savings account with optional payouts", "A cooperative risk-sharing arrangement based on tabarru\u2019 (donation), avoiding gharar, riba, and maysir", "A guaranteed-return investment fund", "A type of zakat distribution fund"], 1, "Takaful: mutual cooperation via tabarru\u2019, removing gharar, riba, maysir. (AAOIFI Standard No. 26)"],
      ["IF-A4", "What are the classical fiqh rules of currency exchange (Sarf)?", ["Both same and different currencies must be equal and hand-to-hand", "Same currency: equal and hand-to-hand. Different currencies: hand-to-hand but may differ in value", "All exchange must be deferred for market pricing", "Only Muslims may engage in currency exchange"], 1, "Classical sarf rules from the ribawi hadith. (Muslim 1587)"],
      ["IF-A5", "What is the Maliki position on conventional life insurance?", ["Permissible without restriction", "Permissible if premiums are invested in halal instruments", "Generally prohibited due to gharar, riba, and maysir; Takaful is the recognised alternative", "Permissible only for the elderly"], 2, "Contemporary Maliki fatwa councils follow AAOIFI\u2019s position. (AAOIFI Standard No. 26)"],
    ],
  },
  "islamic_history": {
    1: [
      ["IH-B1", "In which city was the Prophet Muhammad \u{FDFA} born?", ["Madinah", "Makkah", "Jerusalem", "Damascus"], 1, "Born in Makkah c.\u00A0570\u00A0CE, the Year of the Elephant. (Ibn Hisham)"],
      ["IH-B2", "What is the name of the Prophet\u2019s \u{FDFA} first wife?", ["Aisha", "Hafsa", "Khadijah", "Maymunah"], 2, "Khadijah bint Khuwaylid was the first to accept Islam. (Bukhari 3)"],
      ["IH-B3", "In which cave did the Prophet \u{FDFA} first receive revelation from the angel Jibreel?", ["Cave of Thawr", "Cave of Hira", "Cave of Uhud", "Cave of Badr"], 1, "First revelation in the Cave of Hira on Jabal an-Nour. (Bukhari 3)"],
      ["IH-B4", "Who was the first Caliph after the death of the Prophet \u{FDFA}?", ["Umar ibn al-Khattab", "Uthman ibn Affan", "Abu Bakr as-Siddiq", "Ali ibn Abi Talib"], 2, "Abu Bakr was first of the Rashidun Caliphs. (Bukhari 3667)"],
      ["IH-B5", "What is the name of the Prophet\u2019s \u{FDFA} migration from Makkah to Madinah?", ["Hajj", "Umrah", "Hijrah", "Tabuk"], 2, "The Hijrah in 622\u00A0CE became Year 1 of the Islamic calendar."],
    ],
    2: [
      ["IH-I1", "In what Hijri year did the Battle of Badr take place?", ["1 AH", "2 AH", "5 AH", "8 AH"], 1, "Badr in 2\u00A0AH (624\u00A0CE), first major engagement. (Qur\u2019an 3:123)"],
      ["IH-I2", "Which of the Prophet\u2019s \u{FDFA} uncles raised and protected him without himself accepting Islam?", ["Hamza", "Abu Talib", "Abu Lahab", "Al-\u2018Abbas"], 1, "Abu Talib\u2019s death marks \u2018Aam al-Huzn, the Year of Sorrow."],
      ["IH-I3", "Place the Rashidun Caliphs in chronological order:", ["Abu Bakr \u2192 Uthman \u2192 Umar \u2192 Ali", "Umar \u2192 Abu Bakr \u2192 Ali \u2192 Uthman", "Abu Bakr \u2192 Umar \u2192 Uthman \u2192 Ali", "Ali \u2192 Umar \u2192 Abu Bakr \u2192 Uthman"], 2, "Abu Bakr (11\u201313 AH), Umar (13\u201323), Uthman (23\u201335), Ali (35\u201340)."],
      ["IH-I4", "The Treaty of Hudaybiyyah was signed in which Hijri year?", ["2 AH", "5 AH", "6 AH", "8 AH"], 2, "The Qur\u2019an calls it \u201Ca clear victory.\u201D (Qur\u2019an 48:1; Bukhari 2731)"],
      ["IH-I5", "Which event marks Year 1 of the Islamic (Hijri) calendar?", ["The birth of the Prophet \u{FDFA}", "The first revelation", "The migration (Hijrah) to Madinah", "The conquest of Makkah"], 2, "Caliph Umar established the Hijri calendar retroactively."],
    ],
    3: [
      ["IH-A1", "Imam Malik ibn Anas, founder of the Maliki madhab, lived almost his entire life in which city?", ["Makkah", "Madinah", "Damascus", "Baghdad"], 1, "Imam Malik (d.\u00A0179\u00A0AH) relied on the \u2018amal of Madinah. (Muwatta)"],
      ["IH-A2", "Who led the Muslim conquest of the Iberian Peninsula (al-Andalus) in 711 CE?", ["Musa ibn Nusayr", "Tariq ibn Ziyad", "Khalid ibn al-Walid", "\u2018Amr ibn al-\u2018As"], 1, "Jabal Tariq (Gibraltar) is named after Tariq ibn Ziyad."],
      ["IH-A3", "The Umayyad Caliphate was founded by which figure?", ["Abu Sufyan", "Mu\u2019awiyah ibn Abi Sufyan", "Abdul Malik ibn Marwan", "Walid ibn Abdul Malik"], 1, "Mu\u2019awiyah established the Umayyad Caliphate in 41\u00A0AH (661\u00A0CE)."],
      ["IH-A4", "In which year did Constantinople fall to the Ottoman Empire?", ["1258 CE", "1453 CE", "1492 CE", "1517 CE"], 1, "Sultan Mehmed II conquered Constantinople on 29 May 1453 CE."],
      ["IH-A5", "Imam al-Bukhari, compiler of Sahih al-Bukhari, was born in which region?", ["Arabia (Makkah)", "Andalusia (Cordoba)", "Khorasan (Bukhara, modern Uzbekistan)", "Egypt (Cairo)"], 2, "Al-Bukhari (194\u2013256 AH) was born in Bukhara. (Siyar A\u2019lam an-Nubala)"],
    ],
  },
  "quran_memorisation": {
    1: [
      ["QM-B1", "How many surahs (chapters) are in the Qur\u2019an?", ["99", "100", "110", "114"], 3, "114 surahs, from al-Fatiha to an-Nas."],
      ["QM-B2", "What is the name of the first surah of the Qur\u2019an?", ["Al-Baqarah", "Al-Fatiha", "Yasin", "Al-Ikhlas"], 1, "Al-Fatiha (\u201CThe Opening\u201D), also called Umm al-Kitab. (Bukhari 4474)"],
      ["QM-B3", "The Qur\u2019an is divided into how many ajza (parts)?", ["7", "30", "60", "114"], 1, "30 ajza, allowing one juz per day in Ramadan."],
      ["QM-B4", "Which surah is recited in every rak\u2019ah of every obligatory prayer?", ["Al-Ikhlas", "Al-Fatiha", "An-Nas", "Al-Falaq"], 1, "\u201CNo prayer for the one who does not recite the Opening.\u201D (Bukhari 756; Muslim 394)"],
      ["QM-B5", "In which language was the Qur\u2019an revealed?", ["Hebrew", "Aramaic", "Arabic", "Syriac"], 2, "\u201CWe have sent it down as an Arabic Qur\u2019an.\u201D (Qur\u2019an 12:2)"],
    ],
    2: [
      ["QM-I1", "How many verses (ayahs) are in Surah al-Fatiha?", ["5", "7", "10", "11"], 1, "7 ayahs. (Bukhari 4474)"],
      ["QM-I2", "Which is the only surah in the Qur\u2019an that does NOT begin with Bismillah?", ["Al-Fatiha", "Yasin", "At-Tawbah", "Al-Ikhlas"], 2, "At-Tawbah (Surah 9) has no opening Bismillah. (al-Itqan of as-Suyuti)"],
      ["QM-I3", "Which surah is known as Umm al-Kitab \u2014 the Mother of the Book?", ["Al-Baqarah", "Al-Fatiha", "Yasin", "Ar-Rahman"], 1, "Al-Fatiha summarises the Qur\u2019an\u2019s central themes. (Bukhari 4474)"],
      ["QM-I4", "How many verses are in Surah al-Baqarah, the longest surah?", ["100", "200", "286", "320"], 2, "286 verses spanning roughly 2.5 ajza."],
      ["QM-I5", "Which is the shortest surah in the Qur\u2019an?", ["Al-Ikhlas", "An-Nas", "Al-Kawthar", "Al-Falaq"], 2, "Al-Kawthar: 3 verses, about 10 words."],
    ],
    3: [
      ["QM-A1", "Which Qira\u2019a (recitation) is most commonly recited in North and West Africa?", ["Hafs \u2018an \u2018Asim", "Warsh \u2018an Nafi\u2019", "Qalun \u2018an Nafi\u2019", "Ad-Duri \u2018an Abu \u2018Amr"], 1, "Warsh is dominant in Morocco, Algeria, and West Africa. (Ibn al-Jazari)"],
      ["QM-A2", "What general feature distinguishes Madani surahs from Makki surahs?", ["Madani surahs tend to be shorter and focused on tawhid", "Madani surahs tend to be longer and focus on legislation, social organisation, and dealings with other communities", "Madani surahs do not mention earlier prophets", "Madani surahs are recited only at night"], 1, "Madani = legislation, governance, community. Makki = tawhid, resurrection, warnings. (al-Burhan of az-Zarkashi)"],
      ["QM-A3", "What does the term Sab\u2019at Ahruf (the Seven Ahruf) refer to?", ["The seven longest surahs of the Qur\u2019an", "The Seven Oft-Repeated Verses of al-Fatiha", "Seven modes or dialectal forms in which the Qur\u2019an was originally revealed", "Seven categories of Qur\u2019anic legal rulings"], 2, "Seven modes accommodating different Arab dialects. (Bukhari 4992; Muslim 819)"],
      ["QM-A4", "Under which Rashidun Caliph was the Qur\u2019an standardised into a single official codex?", ["Abu Bakr (initial collection only)", "Umar ibn al-Khattab", "Uthman ibn Affan", "Ali ibn Abi Talib"], 2, "Uthman standardised the \u2018Uthmanic codex and distributed copies. (Bukhari 4986\u20134987)"],
      ["QM-A5", "The first verses ever revealed to the Prophet \u{FDFA} were the opening verses of which surah?", ["Al-Fatiha", "Al-Muzzammil", "Al-\u2018Alaq (verses 1\u20135)", "Al-Mudaththir"], 2, "\u201CRead in the name of your Lord who created\u2026\u201D (Bukhari 3)"],
    ],
  },
  "tafseer": {
    1: [
      ["TF-B1", "Which is the correct meaning order for the opening of al-Fatiha?", ["Bismillah \u2192 Praise to Allah, Lord of all worlds \u2192 The Most Compassionate, Most Merciful", "Praise to Allah \u2192 Bismillah \u2192 The Most Compassionate", "The Most Compassionate \u2192 Praise to Allah \u2192 Bismillah", "Master of Judgement Day \u2192 Praise to Allah \u2192 Bismillah"], 0, "Al-Fatiha opens with Bismillah, then praise, then mercy. (al-Qurtubi on 1:1\u20133)"],
      ["TF-B2", "Which title best matches the name Surah al-Fatiha?", ["The Opening", "The Cave", "The Cow", "The Victory"], 0, "Al-Fatiha means \u201CThe Opening.\u201D (Bukhari 4474)"],
      ["TF-B3", "In al-Fatiha, what does \u2018Lord of all worlds\u2019 point to?", ["Allah\u2019s lordship over all creation", "Only one tribe", "Only the prayer place", "Only worldly wealth"], 0, "Rabb al-\u2019alamin: Lord, Sustainer, and Nurturer of every creation. (al-Qurtubi on 1:2)"],
      ["TF-B4", "What is the main meaning of: Iyyaka na\u2019budu wa iyyaka nasta\u2019in?", ["You alone we worship, and You alone we ask for help", "We ask people to worship us", "We rely only on our money", "We do not need guidance"], 0, "Worship and reliance directed to Allah alone. (al-Qurtubi on 1:5)"],
      ["TF-B5", "What are we asking for in: Ihdina s-sirata l-mustaqim?", ["Guidance to the straight path", "More wealth only", "A story about a battle", "Permission to skip prayer"], 0, "The central supplication of al-Fatiha: guidance. (al-Qurtubi on 1:6)"],
    ],
    2: [
      ["TF-I1", "Which three meanings belong to Surah an-Nasr, in the correct order?", ["When Allah\u2019s help and victory comes \u2192 People entering Islam in crowds \u2192 Glorify and seek forgiveness", "Guide us to the straight path \u2192 Master of the Day \u2192 You alone we worship", "Seek refuge in the Lord of mankind \u2192 He neither begets \u2192 When help comes", "Glorify and seek forgiveness \u2192 People entering Islam \u2192 When help comes"], 0, "An-Nasr: help/victory, then crowds, then tasbih + istighfar. (al-Qurtubi on 110:1\u20133)"],
      ["TF-I2", "What response does Surah an-Nasr command when victory comes?", ["Glorify Allah with praise and seek forgiveness", "Boast about personal power", "Stop worshipping because the mission is complete", "Treat victory as purely political"], 0, "The surah turns victory into humility: tasbih, praise, istighfar. (Qur\u2019an 110:3)"],
      ["TF-I3", "Why is Surah an-Nasr connected to the nearing completion of the Prophet\u2019s mission?", ["It points to victory, people entering Islam in crowds, and the command to glorify and seek forgiveness", "It tells the story of Musa in detail", "It gives inheritance shares", "It begins the Qur\u2019an"], 0, "Understood as a sign of completion. (Bukhari 4969; al-Qurtubi)"],
      ["TF-I4", "What does \u2018people entering Allah\u2019s religion in crowds\u2019 suggest?", ["A public turning toward Islam after Allah\u2019s help and victory", "Only one private conversation", "The start of creation", "The rules of trade"], 0, "Visible, collective acceptance of Islam after divine help. (Qur\u2019an 110:2)"],
      ["TF-I5", "A user says: \u2018Victory means I should become proud.\u2019 Which answer best reflects Surah an-Nasr?", ["Victory should lead to tasbih, gratitude, and seeking forgiveness", "Victory means forgetting Allah", "Victory removes the need for humility", "Victory is only about numbers"], 0, "Success should increase humility and return to Allah. (Qur\u2019an 110:3)"],
    ],
    3: [
      ["TF-A1", "Which is the correct opening sequence of themes in Surah al-A\u2019la?", ["Glorify your Lord, the Most High \u2192 Allah creates, proportions, and guides \u2192 Vegetation brought out then made dry", "The successful one purifies \u2192 Glorify your Lord \u2192 The Hereafter is better", "Vegetation brought out \u2192 Glorify your Lord \u2192 Allah creates and proportions", "The Hereafter is better \u2192 Reminder benefits the one who fears \u2192 Glorify your Lord"], 0, "Glorification, then creation signs, then vegetation. (al-Qurtubi on 87:1\u20135)"],
      ["TF-A2", "What is the opening command of Surah al-A\u2019la?", ["Glorify the name of your Lord, the Most High", "Seek refuge in the Lord of mankind", "When Allah\u2019s help comes", "Woe to every slanderer"], 0, "Sabbih isma Rabbika l-A\u2019la. (Qur\u2019an 87:1)"],
      ["TF-A3", "Which pair of meanings appears early in Surah al-A\u2019la?", ["Allah creates/proportions and determines/guides", "A detailed list of inheritance shares", "The story of the elephant army only", "Rules of divorce"], 0, "Creation, proportioning, decree, and guidance. (Qur\u2019an 87:2\u20133)"],
      ["TF-A4", "Which statement best reflects the end of Surah al-A\u2019la?", ["The Hereafter is better and more lasting", "Worldly life is always the final goal", "There is no reminder in earlier scriptures", "Prayer and remembrance are disconnected from success"], 0, "Bal tu\u2019thiruna l-hayata d-dunya, wa l-akhiratu khayrun wa abqa. (Qur\u2019an 87:16\u201317)"],
      ["TF-A5", "A learner says: \u2018I know the truth but keep choosing short-term comfort.\u2019 Which al-A\u2019la theme speaks most directly to this?", ["Preferring worldly life while the Hereafter is better and more lasting", "The order of zakah calculation", "The location of the cave of Hira", "The rules of murabaha"], 0, "Knowledge must reshape desire: the Hereafter is better. (Qur\u2019an 87:16\u201317)"],
    ],
  },
};

// ── Adaptive Engine ──────────────────────────────────────────────────────

function stableShuffle(items, seed) {
  const arr = [...items];
  let v = 1;
  for (let i = 0; i < seed.length; i++) v = (v + seed.charCodeAt(i)) * 9301 % 233280;
  for (let i = arr.length - 1; i > 0; i--) {
    v = (v * 9301 + 49297) % 233280;
    const j = Math.floor((v / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickQuestions(cat, tier, count, excludeIds) {
  const pool = (QBANK[cat]?.[tier] || []).filter(q => !excludeIds.has(q[0]));
  return stableShuffle(pool, cat + tier + Date.now().toString(36)).slice(0, count);
}

function getNextQuestion(selectedTopics, selfRatings, answers) {
  const askedIds = new Set(answers.map(a => a.id));

  // Build per-topic state
  const topicState = {};
  for (const t of selectedTopics) {
    const startTier = selfRatings[t] || 1;
    const myAnswers = answers.filter(a => a.cat === t);
    const initialAnswers = myAnswers.filter(a => a.tier === startTier);
    const initialCorrect = initialAnswers.filter(a => a.correct).length;

    let phase = "initial";
    let probeTier = null;

    if (initialAnswers.length >= 3) {
      if (initialCorrect >= 2 && startTier < 3) {
        phase = "probe";
        probeTier = startTier + 1;
      } else if (initialCorrect <= 1 && startTier > 1) {
        phase = "probe";
        probeTier = startTier - 1;
      } else {
        phase = "done";
      }

      if (phase === "probe") {
        const probeAnswers = myAnswers.filter(a => a.tier === probeTier);
        if (probeAnswers.length >= 2) phase = "done";
      }
    }

    topicState[t] = { startTier, phase, probeTier, total: myAnswers.length };
  }

  // Round-robin: pick topic with fewest questions asked that isn't done
  const active = selectedTopics
    .filter(t => topicState[t].phase !== "done")
    .sort((a, b) => topicState[a].total - topicState[b].total);

  if (!active.length) return null;

  const topic = active[0];
  const st = topicState[topic];
  const tier = st.phase === "probe" ? st.probeTier : st.startTier;
  const candidates = pickQuestions(topic, tier, 1, askedIds);

  if (!candidates.length) return null;

  const raw = candidates[0];
  return { id: raw[0], cat: topic, tier, prompt: raw[1], opts: raw[2], correct: raw[3], why: raw[4] };
}

function computePlacements(selectedTopics, selfRatings, answers) {
  const placements = {};
  for (const t of selectedTopics) {
    const startTier = selfRatings[t] || 1;
    const myAnswers = answers.filter(a => a.cat === t);
    const initialAnswers = myAnswers.filter(a => a.tier === startTier);
    const initialCorrect = initialAnswers.filter(a => a.correct).length;

    let probeTier = null;
    if (initialCorrect >= 2 && startTier < 3) probeTier = startTier + 1;
    else if (initialCorrect <= 1 && startTier > 1) probeTier = startTier - 1;

    if (probeTier !== null) {
      const probeAnswers = myAnswers.filter(a => a.tier === probeTier);
      const probeCorrect = probeAnswers.filter(a => a.correct).length;

      if (probeTier > startTier) {
        placements[t] = probeCorrect >= 1 ? probeTier : startTier;
      } else {
        placements[t] = probeCorrect >= 1 ? probeTier : Math.max(0, probeTier - 1);
      }
    } else {
      placements[t] = initialCorrect >= 2 ? startTier : Math.max(0, startTier - 1);
    }
  }
  return placements;
}

function getTotalQuestions(selectedTopics, selfRatings) {
  // 3 initial + potentially 2 probe per topic
  return selectedTopics.length * 4; // rough estimate for progress bar
}

// ── UI Helpers ───────────────────────────────────────────────────────────

function cx(...classes) { return classes.filter(Boolean).join(" "); }

function Button({ children, onClick, variant = "primary", disabled = false, className = "" }) {
  const base = "rounded-xl px-6 py-3.5 text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";
  const variants = {
    primary: "bg-deany-gold text-white hover:brightness-105 active:brightness-95",
    secondary: "border border-deany-border bg-white text-deany-navy hover:bg-deany-cream",
    ghost: "text-deany-steel hover:text-deany-navy",
  };
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      className={cx(base, variants[variant], className)}>
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={cx("bg-deany-cream rounded-2xl p-6 border border-deany-border shadow-sm", className)}>{children}</div>;
}

function ProgressBar({ value, max }) {
  const pct = max ? Math.min(100, Math.max(3, (value / max) * 100)) : 0;
  return (
    <div className="w-full h-1.5 bg-deany-border rounded-full">
      <div className="h-full bg-deany-gold rounded-full transition-all duration-300 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Step: Welcome ─────────���──────────────────────────────────────────────

function WelcomeStep({ onNext }) {
  return (
    <Card className="mx-auto max-w-2xl text-center p-8 space-y-5">
      <p className="text-xs font-medium uppercase tracking-wide text-deany-muted">Calibration Quiz</p>
      <h1 className="text-2xl md:text-3xl font-semibold text-deany-navy">Find your starting point</h1>
      <p className="text-base leading-relaxed text-deany-steel max-w-lg mx-auto">
        Choose the subjects you care about, tell us where you think you are, then answer a short diagnostic.
        Deany will use your results to build a personalised learning path.
      </p>
      <div className="pt-2">
        <Button onClick={onNext}>Begin</Button>
      </div>
    </Card>
  );
}

// ── Step: Topic Selection ────────────────────────────────────────────────

function TopicStep({ selected, setSelected, onNext }) {
  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-deany-muted">Step 1 of 3</p>
        <h2 className="text-xl font-semibold text-deany-navy">What do you want to learn?</h2>
        <p className="text-sm text-deany-steel">Select one or more subjects. Your quiz will focus on these.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {TOPICS.map(t => {
          const active = selected.includes(t.id);
          return (
            <button key={t.id} type="button" onClick={() => toggle(t.id)}
              className={cx(
                "rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold",
                active ? "border-deany-gold bg-deany-gold-light" : "border-deany-border bg-white"
              )}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <span className="text-base font-medium text-deany-navy block">{t.title}</span>
                  <span className="text-xs text-deany-muted">{t.desc}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button disabled={!selected.length} onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
}

// ── Step: Self-Assessment ────��───────────────────────────────────────────

function AssessStep({ selectedTopics, ratings, setRatings, onNext }) {
  function setRating(topicId, tier) {
    setRatings(prev => ({ ...prev, [topicId]: tier }));
  }

  const topicData = TOPICS.filter(t => selectedTopics.includes(t.id));

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-deany-muted">Step 2 of 3</p>
        <h2 className="text-xl font-semibold text-deany-navy">Where do you think you are?</h2>
        <p className="text-sm text-deany-steel">Be honest \u2014 this helps us start you at the right level.</p>
      </div>
      <div className="space-y-4">
        {topicData.map(t => (
          <Card key={t.id} className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{t.icon}</span>
              <h3 className="text-lg font-medium text-deany-navy">{t.title}</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map(lv => (
                <button key={lv.id} type="button" onClick={() => setRating(t.id, lv.tier)}
                  className={cx(
                    "rounded-xl border px-3 py-3 text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold",
                    ratings[t.id] === lv.tier
                      ? "border-deany-gold bg-deany-gold-light text-deany-navy font-medium"
                      : "border-deany-border bg-white text-deany-steel hover:bg-deany-cream"
                  )}>
                  <span className="block text-sm font-medium">{lv.label}</span>
                  <span className="block text-xs text-deany-muted mt-0.5">{lv.desc}</span>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext}>Start Quiz</Button>
      </div>
    </div>
  );
}

// ── Step: Quiz Question ────────────��─────────────────────────────────────

function QuizStep({ question, questionNumber, totalEstimate, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const shuffled = useMemo(() => {
    const indexed = question.opts.map((text, i) => ({ text, idx: i }));
    return stableShuffle(indexed, question.id);
  }, [question.id, question.opts]);

  const isCorrect = selected !== null && shuffled[selected]?.idx === question.correct;

  function choose(i) {
    if (submitted) return;
    setSelected(i);
    setSubmitted(true);
  }

  function next() {
    if (selected === null) return;
    onAnswer({
      id: question.id,
      cat: question.cat,
      tier: question.tier,
      correct: shuffled[selected].idx === question.correct,
    });
  }

  const topicLabel = TOPICS.find(t => t.id === question.cat)?.title || question.cat;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-deany-muted">
          Question {questionNumber} {totalEstimate ? `of ~${totalEstimate}` : ""}
        </p>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-deany-cream border border-deany-border text-deany-steel">{topicLabel}</span>
      </div>

      <Card className="p-6 bg-white">
        <p className="text-lg font-semibold text-deany-navy leading-relaxed">{question.prompt}</p>
      </Card>

      <div className="grid gap-3">
        {shuffled.map((opt, i) => {
          let style = "border-deany-border bg-white text-deany-steel hover:bg-deany-cream";
          if (submitted && i === selected) {
            style = isCorrect
              ? "border-deany-sage bg-deany-sage-light text-deany-navy"
              : "border-deany-error bg-deany-error-light text-deany-navy";
          } else if (submitted && shuffled[i].idx === question.correct) {
            style = "border-deany-sage bg-deany-sage-light text-deany-navy";
          } else if (submitted) {
            style = "border-deany-border bg-white text-deany-muted";
          }

          return (
            <button key={i} type="button" disabled={submitted} onClick={() => choose(i)}
              className={cx(
                "rounded-xl border p-4 text-left text-sm leading-relaxed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-deany-gold disabled:cursor-default",
                style
              )}>
              {opt.text}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={cx(
          "rounded-xl p-4 border",
          isCorrect ? "bg-deany-sage-light border-deany-sage/20" : "bg-deany-error-light border-deany-error/20"
        )}>
          <p className="text-deany-navy font-medium text-sm">{isCorrect ? "Correct." : "Not quite."}</p>
          <p className="text-deany-steel text-sm mt-1">{question.why}</p>
          <div className="mt-3 flex justify-end">
            <Button onClick={next}>Continue</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step: Results ───────────────���─────────────────────────���──────────────

function ResultsStep({ selectedTopics, selfRatings, answers, onHome, onRestart }) {
  const placements = useMemo(
    () => computePlacements(selectedTopics, selfRatings, answers),
    [selectedTopics, selfRatings, answers]
  );

  const totalCorrect = answers.filter(a => a.correct).length;
  const accuracy = answers.length ? Math.round((totalCorrect / answers.length) * 100) : 0;

  const topicData = TOPICS.filter(t => selectedTopics.includes(t.id));

  const strengths = [];
  const needsWork = [];

  for (const t of topicData) {
    const p = placements[t.id];
    const label = TIER_LABEL[p] || "New";
    if (p >= 2) strengths.push(`${t.title}: ${label}`);
    else needsWork.push(`${t.title}: ${label}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="p-8 text-center bg-white">
        <p className="text-xs font-medium uppercase tracking-wide text-deany-muted">Your Results</p>
        <p className="text-4xl font-semibold text-deany-navy mt-3">{accuracy}%</p>
        <p className="text-sm text-deany-steel mt-1">{totalCorrect} of {answers.length} correct</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-deany-navy mb-4">Your placement</h3>
        <div className="space-y-3">
          {topicData.map(t => {
            const p = placements[t.id];
            const label = TIER_LABEL[p] || "New";
            const barWidth = Math.max(8, (p / 3) * 100);
            return (
              <div key={t.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-deany-navy">{t.icon} {t.title}</span>
                  <span className="text-xs font-medium text-deany-steel">{label}</span>
                </div>
                <div className="w-full h-2 bg-deany-border rounded-full">
                  <div className={cx(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    p >= 3 ? "bg-deany-gold" : p >= 2 ? "bg-deany-sage" : "bg-deany-steel"
                  )} style={{ width: `${barWidth}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {strengths.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-medium text-deany-sage mb-3">Strengths</h3>
          <div className="space-y-2">
            {strengths.map(s => (
              <div key={s} className="bg-deany-sage-light rounded-xl p-3 text-sm text-deany-navy">{s}</div>
            ))}
          </div>
        </Card>
      )}

      {needsWork.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-medium text-deany-error mb-3">Areas to build</h3>
          <div className="space-y-2">
            {needsWork.map(s => (
              <div key={s} className="bg-deany-error-light rounded-xl p-3 text-sm text-deany-navy">{s}</div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-white text-center space-y-4">
        <p className="text-sm text-deany-steel">
          Deany will use these results to personalise your learning path.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => {
            try {
              localStorage.setItem("deany-compass-result", JSON.stringify({ placements, accuracy, ts: Date.now() }));
            } catch {}
            if (onHome) onHome();
          }}>
            Start Learning
          </Button>
          <Button variant="secondary" onClick={onRestart}>Retake Quiz</Button>
        </div>
      </Card>
    </div>
  );
}

// ── Main Component ─────────────��─────────────────────────────────────────

export default function DeanyCompass({ onBack, onHome }) {
  const [step, setStep] = useState("welcome"); // welcome | topics | assess | quiz | results
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selfRatings, setSelfRatings] = useState({});
  const [answers, setAnswers] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);

  // Default all selected topics to beginner if not rated
  const effectiveRatings = useMemo(() => {
    const r = { ...selfRatings };
    for (const t of selectedTopics) { if (!r[t]) r[t] = 1; }
    return r;
  }, [selfRatings, selectedTopics]);

  const currentQuestion = useMemo(
    () => step === "quiz" ? getNextQuestion(selectedTopics, effectiveRatings, answers) : null,
    [step, selectedTopics, effectiveRatings, answers]
  );

  const totalEstimate = useMemo(
    () => getTotalQuestions(selectedTopics, effectiveRatings),
    [selectedTopics, effectiveRatings]
  );

  const handleAnswer = useCallback((answer) => {
    setAnswers(prev => [...prev, answer]);
    setQuestionCount(c => c + 1);
  }, []);

  // Auto-advance to results when quiz is done
  const quizDone = step === "quiz" && !currentQuestion && answers.length > 0;

  function reset() {
    setStep("welcome");
    setSelectedTopics([]);
    setSelfRatings({});
    setAnswers([]);
    setQuestionCount(0);
  }

  // Determine current progress for bar
  let progressValue = 0;
  let progressMax = 3 + totalEstimate;
  if (step === "topics") progressValue = 1;
  else if (step === "assess") progressValue = 2;
  else if (step === "quiz") progressValue = 3 + questionCount;
  else if (step === "results" || quizDone) progressValue = progressMax;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-deany-border">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && step === "welcome" && (
              <button onClick={onBack} className="text-sm text-deany-steel hover:text-deany-navy transition-colors duration-200 flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Back
              </button>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-deany-sage">Deany Compass</p>
              <p className="text-sm font-semibold text-deany-navy">Calibration Quiz</p>
            </div>
          </div>
          {step !== "welcome" && step !== "results" && !quizDone && (
            <button onClick={reset} className="text-xs text-deany-muted hover:text-deany-navy transition-colors">Restart</button>
          )}
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-3">
          <ProgressBar value={progressValue} max={progressMax} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 py-8">
        {step === "welcome" && (
          <WelcomeStep onNext={() => setStep("topics")} />
        )}

        {step === "topics" && (
          <TopicStep selected={selectedTopics} setSelected={setSelectedTopics}
            onNext={() => setStep("assess")} />
        )}

        {step === "assess" && (
          <AssessStep selectedTopics={selectedTopics} ratings={selfRatings}
            setRatings={setSelfRatings} onNext={() => { setAnswers([]); setQuestionCount(0); setStep("quiz"); }} />
        )}

        {step === "quiz" && !quizDone && currentQuestion && (
          <QuizStep key={currentQuestion.id} question={currentQuestion}
            questionNumber={questionCount + 1} totalEstimate={totalEstimate}
            onAnswer={handleAnswer} />
        )}

        {(step === "results" || quizDone) && (
          <ResultsStep selectedTopics={selectedTopics} selfRatings={effectiveRatings}
            answers={answers} onHome={onHome} onRestart={reset} />
        )}
      </div>
    </div>
  );
}
