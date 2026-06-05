import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ── Topics (the 5 subjects available on Deany) ──────────────────────────
const TOPICS = [
  { id: "5_pillars", title: "Five Pillars", icon: "\u{1F54C}", desc: "Prayer, fasting, zakat, hajj, and shahada" },
  { id: "islamic_finance", title: "Islamic Finance", icon: "\u{1F4B0}", desc: "Halal trade, contracts, and wealth" },
  { id: "islamic_history", title: "Islamic History", icon: "\u{1F4DC}", desc: "From revelation to the modern age" },
  { id: "quran_memorisation", title: "Qur'an Memorisation", icon: "\u{1F4D6}", desc: "Surahs, structure, and recitation" },
  { id: "tafseer", title: "Tafsir", icon: "\u{1F50D}", desc: "Meaning and reflection on the Qur'an" },
];

const LEVELS = [
  { id: "beginner", tier: 1, label: "Beginner", desc: "I'm just getting started", icon: "\u{1F331}" },
  { id: "intermediate", tier: 2, label: "Intermediate", desc: "I know the basics well", icon: "\u{1F333}" },
  { id: "advanced", tier: 3, label: "Advanced", desc: "I've studied this seriously", icon: "\u{1F3D4}" },
];

const TIER_LABEL = { 0: "New", 1: "Beginner", 2: "Intermediate", 3: "Advanced" };
const TIER_EMOJI = { 0: "\u{1F331}", 1: "\u{1F331}", 2: "\u{1F333}", 3: "\u{1F3D4}" };

// ── Question bank - sourced verbatim from DEANY Calibration Question Bank v1 ──
// REVIEW:FIQH - Maliki madhab standard. Hadith: Bukhari + Muslim only.
// Format: [id, prompt, [opt0,opt1,opt2,opt3], correctIndex, source/explanation]
const QBANK = {
  "5_pillars": {
    1: [
      ["5P-B1", "How many obligatory daily prayers are there in Islam?", ["Three", "Four", "Five", "Six"], 2, "Five daily prayers: Fajr, Dhuhr, Asr, Maghrib, Isha. (Bukhari 349; Muslim 162)"],
      ["5P-B2", "During which month do Muslims observe the obligatory fast?", ["Muharram", "Rajab", "Sha'ban", "Ramadan"], 3, "Fasting in Ramadan is the fourth pillar. (Qur'an 2:185)"],
      ["5P-B3", "What is the Arabic name for the testimony of faith - the first pillar of Islam?", ["Salah", "Shahadah", "Zakat", "Sawm"], 1, "The Shahadah declares Allah's oneness and Muhammad's prophethood. (Bukhari 8)"],
      ["5P-B4", "How often must a Muslim perform Hajj if they have the means and ability?", ["Every year", "Every five years", "Once in their lifetime", "Whenever they choose"], 2, "Hajj is obligatory once for those with means. (Muslim 1337; Qur'an 3:97)"],
      ["5P-B5", "What is the standard rate of zakat on qualifying cash savings held for one lunar year?", ["1%", "2.5%", "5%", "10%"], 1, "Zakat on cash is 2.5% (one fortieth) above nisab. (Bukhari 1454)"],
    ],
    2: [
      ["5P-I1", "How many rak'ahs (units) are in the Maghrib prayer?", ["Two", "Three", "Four", "Five"], 1, "Maghrib is uniquely three rak'ahs. (Bukhari 350)"],
      ["5P-I2", "Which of the following invalidates wudu (ablution)?", ["Touching one's beard", "Drinking water", "Passing wind", "Walking outdoors"], 2, "Passing wind nullifies wudu by consensus. (Bukhari 135; Muslim 225)"],
      ["5P-I3", "What is the opening Takbeer of Salah called?", ["Takbeerat al-Ihram", "Takbeer at-Tashreeq", "Takbeer at-Ruku'", "Takbeer at-Sujood"], 0, "'Allahu Akbar' at the start enters the sacred state. (Bukhari 757)"],
      ["5P-I4", "The nisab (minimum threshold) for zakat on gold is approximately:", ["50 grams", "87.48 grams (20 mithqal)", "200 grams", "595 grams"], 1, "Classical nisab for gold is 20 mithqal \u2248 87.48g. (Bukhari 1447)"],
      ["5P-I5", "Which of the following is NOT one of the four arkan (pillars) of Hajj according to Maliki fiqh?", ["Ihram (entering the sacred state)", "Wuquf at Arafah", "Tawaf al-Ifadah", "Throwing pebbles at the Jamarat"], 3, "Maliki arkan: Ihram, Wuquf, Tawaf al-Ifadah, Sa'i. Pebbles are wajib, not rukn. (Al-Risalah of Ibn Abi Zayd)"],
    ],
    3: [
      ["5P-A1", "In Maliki madhab, what is the classical position of the hands during qiyam in obligatory prayer?", ["Folded over the chest", "Folded over the navel", "Folded below the navel", "Resting at the sides (sadl)"], 3, "Sadl is the classical Maliki position in fard prayer. (Mudawwana; al-Risalah)"],
      ["5P-A2", "In Maliki fiqh, how is the Bismillah handled before Surah al-Fatiha during obligatory prayer?", ["Recited aloud", "Recited silently", "Omitted entirely", "Left to the worshipper's preference"], 2, "Maliki: omit Bismillah before Fatiha in fard prayer. (Al-Muwatta; Mudawwana)"],
      ["5P-A3", "When is the raising of the hands (raf' al-yadayn) prescribed in Maliki obligatory prayer?", ["At the opening Takbeer only", "At the opening Takbeer and before ruku'", "At the opening, before ruku', and rising from ruku'", "At the opening Takbeer and before sujood"], 0, "Maliki: raise hands only at Takbeerat al-Ihram. (Al-Muwatta; Mudawwana)"],
      ["5P-A4", "According to Maliki fiqh, what is the legal classification of the Witr prayer?", ["Fard", "Wajib", "Sunnah Mu'akkadah", "Mustahabb"], 2, "Maliki: Witr is Sunnah Mu'akkadah, not obligatory. (Mudawwana; al-Risalah)"],
      ["5P-A5", "In Maliki fiqh, when does the time for Asr prayer begin?", ["Immediately after Dhuhr ends", "When the shadow of an object equals the object's own length", "When the shadow of an object is twice the object's length", "At the midpoint between Dhuhr and Maghrib"], 1, "Maliki, Shafi'i, and Hanbali agree: Asr when shadow equals object length. (Al-Muwatta; al-Risalah)"],
    ],
  },
  "islamic_finance": {
    1: [
      ["IF-B1", "What is the term for interest or usury in Islamic finance?", ["Zakat", "Riba", "Sadaqah", "Khums"], 1, "Riba: interest and unjust gain. 'Allah has permitted trade and forbidden riba.' (Qur'an 2:275)"],
      ["IF-B2", "Which of the following is permissible (halal) for a Muslim to earn through?", ["Lending money at interest", "Selling alcohol", "Honest trade in lawful goods and services", "Gambling on outcomes"], 2, "Trade in lawful goods is the foundation of permissible earning. (Qur'an 2:275)"],
      ["IF-B3", "What is zakat?", ["Voluntary daily charity", "An annual obligatory purification of qualifying wealth", "A tax paid to non-Muslim governments", "Money given only during Ramadan"], 1, "Zakat: third pillar, typically 2.5% of qualifying wealth above nisab. (Qur'an 9:60)"],
      ["IF-B4", "What does 'halal' mean in the context of food and earnings?", ["Required", "Recommended", "Permissible according to Islamic law", "Forbidden"], 2, "Halal means lawful or permissible; its opposite is haram."],
      ["IF-B5", "What is sadaqah?", ["Obligatory annual charity", "Voluntary charity given for the sake of Allah", "Money given only to family members", "A type of prayer"], 1, "Sadaqah is voluntary charity beyond obligatory zakat. (Muslim 2588)"],
    ],
    2: [
      ["IF-I1", "What is Murabaha in Islamic finance?", ["An interest-bearing loan", "A profit-and-loss-sharing partnership", "A cost-plus sale where the seller transparently discloses the cost and adds a fixed margin", "A leasing contract"], 2, "Murabaha: cost-plus sale with known mark-up. (AAOIFI Standard No. 8)"],
      ["IF-I2", "What is Mudaraba?", ["A joint partnership where all partners contribute capital equally", "A partnership where one party provides capital and the other provides labour and expertise", "A guaranteed-return savings product", "A currency exchange contract"], 1, "Rabb al-mal provides capital, mudarib provides labour. Profits shared per ratio. (AAOIFI Standard No. 13)"],
      ["IF-I3", "What is the difference between Riba al-Fadl and Riba al-Nasi'ah?", ["They are two names for the same thing", "Riba al-Fadl arises from unequal exchange of the same ribawi commodity; Riba al-Nasi'ah arises from delay or interest charged over time", "Riba al-Fadl is permissible; Riba al-Nasi'ah is forbidden", "Riba al-Fadl applies only to gold; Riba al-Nasi'ah applies only to silver"], 1, "Both forms are prohibited. (Bukhari 2174; Muslim 1584)"],
      ["IF-I4", "What is Ijara in Islamic finance?", ["A profit-sharing investment fund", "A sale contract with deferred payment", "A leasing contract where ownership remains with the lessor and the lessee pays for usage", "A guaranteed-return deposit account"], 2, "Ijara: lessor retains ownership, lessee pays rent. (AAOIFI Standard No. 9)"],
      ["IF-I5", "What does Gharar refer to in Islamic finance?", ["Profit", "Excessive uncertainty or ambiguity in a contract", "Transparency in disclosure", "Profit-sharing between parties"], 1, "Gharar: excessive uncertainty that makes outcomes speculative. (Muslim 1513)"],
    ],
    3: [
      ["IF-A1", "Which are the six commodities mentioned in the hadith of 'Ubadah ibn al-Samit as ribawi commodities?", ["Gold, silver, wheat, barley, rice, oil", "Gold, silver, wheat, barley, dates, salt", "Gold, silver, copper, wheat, dates, salt", "Gold, silver, wheat, oats, dates, sugar"], 1, "The six ribawi commodities from the hadith. (Muslim 1587)"],
      ["IF-A2", "According to Maliki fiqh, what is the ruling on Bay' al-'Inah?", ["Permissible without restriction", "Permissible only with witnesses", "Prohibited as a backdoor (hilah) to riba", "Permissible only between Muslims"], 2, "Maliki, Hanafi, Hanbali prohibit it. (Mudawwana; AAOIFI Standard No. 30)"],
      ["IF-A3", "What is Takaful and how does it differ from conventional insurance?", ["An interest-bearing savings account with optional payouts", "A cooperative risk-sharing arrangement based on tabarru' (donation), avoiding gharar, riba, and maysir", "A guaranteed-return investment fund", "A type of zakat distribution fund"], 1, "Takaful: mutual cooperation via tabarru', removing gharar, riba, maysir. (AAOIFI Standard No. 26)"],
      ["IF-A4", "What are the classical fiqh rules of currency exchange (Sarf)?", ["Both same and different currencies must be equal and hand-to-hand", "Same currency: equal and hand-to-hand. Different currencies: hand-to-hand but may differ in value", "All exchange must be deferred for market pricing", "Only Muslims may engage in currency exchange"], 1, "Classical sarf rules from the ribawi hadith. (Muslim 1587)"],
      ["IF-A5", "What is the Maliki position on conventional life insurance?", ["Permissible without restriction", "Permissible if premiums are invested in halal instruments", "Generally prohibited due to gharar, riba, and maysir; Takaful is the recognised alternative", "Permissible only for the elderly"], 2, "Contemporary Maliki fatwa councils follow AAOIFI's position. (AAOIFI Standard No. 26)"],
    ],
  },
  "islamic_history": {
    1: [
      ["IH-B1", "In which city was the Prophet Muhammad \u{FDFA} born?", ["Madinah", "Makkah", "Jerusalem", "Damascus"], 1, "Born in Makkah c.\u00A0570\u00A0CE, the Year of the Elephant. (Ibn Hisham)"],
      ["IH-B2", "What is the name of the Prophet's \u{FDFA} first wife?", ["Aisha", "Hafsa", "Khadijah", "Maymunah"], 2, "Khadijah bint Khuwaylid was the first to accept Islam. (Bukhari 3)"],
      ["IH-B3", "In which cave did the Prophet \u{FDFA} first receive revelation from the angel Jibreel?", ["Cave of Thawr", "Cave of Hira", "Cave of Uhud", "Cave of Badr"], 1, "First revelation in the Cave of Hira on Jabal an-Nour. (Bukhari 3)"],
      ["IH-B4", "Who was the first Caliph after the death of the Prophet \u{FDFA}?", ["Umar ibn al-Khattab", "Uthman ibn Affan", "Abu Bakr as-Siddiq", "Ali ibn Abi Talib"], 2, "Abu Bakr was first of the Rashidun Caliphs. (Bukhari 3667)"],
      ["IH-B5", "What is the name of the Prophet's \u{FDFA} migration from Makkah to Madinah?", ["Hajj", "Umrah", "Hijrah", "Tabuk"], 2, "The Hijrah in 622\u00A0CE became Year 1 of the Islamic calendar."],
    ],
    2: [
      ["IH-I1", "In what Hijri year did the Battle of Badr take place?", ["1 AH", "2 AH", "5 AH", "8 AH"], 1, "Badr in 2\u00A0AH (624\u00A0CE), first major engagement. (Qur'an 3:123)"],
      ["IH-I2", "Which of the Prophet's \u{FDFA} uncles raised and protected him without himself accepting Islam?", ["Hamza", "Abu Talib", "Abu Lahab", "Al-'Abbas"], 1, "Abu Talib's death marks 'Aam al-Huzn, the Year of Sorrow."],
      ["IH-I3", "Place the Rashidun Caliphs in chronological order:", ["Abu Bakr \u2192 Uthman \u2192 Umar \u2192 Ali", "Umar \u2192 Abu Bakr \u2192 Ali \u2192 Uthman", "Abu Bakr \u2192 Umar \u2192 Uthman \u2192 Ali", "Ali \u2192 Umar \u2192 Abu Bakr \u2192 Uthman"], 2, "Abu Bakr (11-13 AH), Umar (13-23), Uthman (23-35), Ali (35-40)."],
      ["IH-I4", "The Treaty of Hudaybiyyah was signed in which Hijri year?", ["2 AH", "5 AH", "6 AH", "8 AH"], 2, "The Qur'an calls it 'a clear victory.' (Qur'an 48:1; Bukhari 2731)"],
      ["IH-I5", "Which event marks Year 1 of the Islamic (Hijri) calendar?", ["The birth of the Prophet \u{FDFA}", "The first revelation", "The migration (Hijrah) to Madinah", "The conquest of Makkah"], 2, "Caliph Umar established the Hijri calendar retroactively."],
    ],
    3: [
      ["IH-A1", "Imam Malik ibn Anas, founder of the Maliki madhab, lived almost his entire life in which city?", ["Makkah", "Madinah", "Damascus", "Baghdad"], 1, "Imam Malik (d.\u00A0179\u00A0AH) relied on the 'amal of Madinah. (Muwatta)"],
      ["IH-A2", "Who led the Muslim conquest of the Iberian Peninsula (al-Andalus) in 711 CE?", ["Musa ibn Nusayr", "Tariq ibn Ziyad", "Khalid ibn al-Walid", "'Amr ibn al-'As"], 1, "Jabal Tariq (Gibraltar) is named after Tariq ibn Ziyad."],
      ["IH-A3", "The Umayyad Caliphate was founded by which figure?", ["Abu Sufyan", "Mu'awiyah ibn Abi Sufyan", "Abdul Malik ibn Marwan", "Walid ibn Abdul Malik"], 1, "Mu'awiyah established the Umayyad Caliphate in 41\u00A0AH (661\u00A0CE)."],
      ["IH-A4", "In which year did Constantinople fall to the Ottoman Empire?", ["1258 CE", "1453 CE", "1492 CE", "1517 CE"], 1, "Sultan Mehmed II conquered Constantinople on 29 May 1453 CE."],
      ["IH-A5", "Imam al-Bukhari, compiler of Sahih al-Bukhari, was born in which region?", ["Arabia (Makkah)", "Andalusia (Cordoba)", "Khorasan (Bukhara, modern Uzbekistan)", "Egypt (Cairo)"], 2, "Al-Bukhari (194-256 AH) was born in Bukhara. (Siyar A'lam an-Nubala)"],
    ],
  },
  "quran_memorisation": {
    1: [
      ["QM-B1", "How many surahs (chapters) are in the Qur'an?", ["99", "100", "110", "114"], 3, "114 surahs, from al-Fatiha to an-Nas."],
      ["QM-B2", "What is the name of the first surah of the Qur'an?", ["Al-Baqarah", "Al-Fatiha", "Yasin", "Al-Ikhlas"], 1, "Al-Fatiha ('The Opening'), also called Umm al-Kitab. (Bukhari 4474)"],
      ["QM-B3", "The Qur'an is divided into how many ajza (parts)?", ["7", "30", "60", "114"], 1, "30 ajza, allowing one juz per day in Ramadan."],
      ["QM-B4", "Which surah is recited in every rak'ah of every obligatory prayer?", ["Al-Ikhlas", "Al-Fatiha", "An-Nas", "Al-Falaq"], 1, "'No prayer for the one who does not recite the Opening.' (Bukhari 756; Muslim 394)"],
      ["QM-B5", "In which language was the Qur'an revealed?", ["Hebrew", "Aramaic", "Arabic", "Syriac"], 2, "'We have sent it down as an Arabic Qur'an.' (Qur'an 12:2)"],
    ],
    2: [
      ["QM-I1", "How many verses (ayahs) are in Surah al-Fatiha?", ["5", "7", "10", "11"], 1, "7 ayahs. (Bukhari 4474)"],
      ["QM-I2", "Which is the only surah in the Qur'an that does NOT begin with Bismillah?", ["Al-Fatiha", "Yasin", "At-Tawbah", "Al-Ikhlas"], 2, "At-Tawbah (Surah 9) has no opening Bismillah. (al-Itqan of as-Suyuti)"],
      ["QM-I3", "Which surah is known as Umm al-Kitab - the Mother of the Book?", ["Al-Baqarah", "Al-Fatiha", "Yasin", "Ar-Rahman"], 1, "Al-Fatiha summarises the Qur'an's central themes. (Bukhari 4474)"],
      ["QM-I4", "How many verses are in Surah al-Baqarah, the longest surah?", ["100", "200", "286", "320"], 2, "286 verses spanning roughly 2.5 ajza."],
      ["QM-I5", "Which is the shortest surah in the Qur'an?", ["Al-Ikhlas", "An-Nas", "Al-Kawthar", "Al-Falaq"], 2, "Al-Kawthar: 3 verses, about 10 words."],
    ],
    3: [
      ["QM-A1", "Which Qira'a (recitation) is most commonly recited in North and West Africa?", ["Hafs 'an 'Asim", "Warsh 'an Nafi'", "Qalun 'an Nafi'", "Ad-Duri 'an Abu 'Amr"], 1, "Warsh is dominant in Morocco, Algeria, and West Africa. (Ibn al-Jazari)"],
      ["QM-A2", "What general feature distinguishes Madani surahs from Makki surahs?", ["Madani surahs tend to be shorter and focused on tawhid", "Madani surahs tend to be longer and focus on legislation, social organisation, and dealings with other communities", "Madani surahs do not mention earlier prophets", "Madani surahs are recited only at night"], 1, "Madani = legislation, governance, community. Makki = tawhid, resurrection, warnings. (al-Burhan of az-Zarkashi)"],
      ["QM-A3", "What does the term Sab'at Ahruf (the Seven Ahruf) refer to?", ["The seven longest surahs of the Qur'an", "The Seven Oft-Repeated Verses of al-Fatiha", "Seven modes or dialectal forms in which the Qur'an was originally revealed", "Seven categories of Qur'anic legal rulings"], 2, "Seven modes accommodating different Arab dialects. (Bukhari 4992; Muslim 819)"],
      ["QM-A4", "Under which Rashidun Caliph was the Qur'an standardised into a single official codex?", ["Abu Bakr (initial collection only)", "Umar ibn al-Khattab", "Uthman ibn Affan", "Ali ibn Abi Talib"], 2, "Uthman standardised the 'Uthmanic codex and distributed copies. (Bukhari 4986-4987)"],
      ["QM-A5", "The first verses ever revealed to the Prophet \u{FDFA} were the opening verses of which surah?", ["Al-Fatiha", "Al-Muzzammil", "Al-'Alaq (verses 1-5)", "Al-Mudaththir"], 2, "'Read in the name of your Lord who created...' (Bukhari 3)"],
    ],
  },
  "tafseer": {
    1: [
      ["TF-B1", "Which is the correct meaning order for the opening of al-Fatiha?", ["Bismillah \u2192 Praise to Allah, Lord of all worlds \u2192 The Most Compassionate, Most Merciful", "Praise to Allah \u2192 Bismillah \u2192 The Most Compassionate", "The Most Compassionate \u2192 Praise to Allah \u2192 Bismillah", "Master of Judgement Day \u2192 Praise to Allah \u2192 Bismillah"], 0, "Al-Fatiha opens with Bismillah, then praise, then mercy. (al-Qurtubi on 1:1-3)"],
      ["TF-B2", "Which title best matches the name Surah al-Fatiha?", ["The Opening", "The Cave", "The Cow", "The Victory"], 0, "Al-Fatiha means 'The Opening.' (Bukhari 4474)"],
      ["TF-B3", "In al-Fatiha, what does 'Lord of all worlds' point to?", ["Allah's lordship over all creation", "Only one tribe", "Only the prayer place", "Only worldly wealth"], 0, "Rabb al-'alamin: Lord, Sustainer, and Nurturer of every creation. (al-Qurtubi on 1:2)"],
      ["TF-B4", "What is the main meaning of: Iyyaka na'budu wa iyyaka nasta'in?", ["You alone we worship, and You alone we ask for help", "We ask people to worship us", "We rely only on our money", "We do not need guidance"], 0, "Worship and reliance directed to Allah alone. (al-Qurtubi on 1:5)"],
      ["TF-B5", "What are we asking for in: Ihdina s-sirata l-mustaqim?", ["Guidance to the straight path", "More wealth only", "A story about a battle", "Permission to skip prayer"], 0, "The central supplication of al-Fatiha: guidance. (al-Qurtubi on 1:6)"],
    ],
    2: [
      ["TF-I1", "Which three meanings belong to Surah an-Nasr, in the correct order?", ["When Allah's help and victory comes \u2192 People entering Islam in crowds \u2192 Glorify and seek forgiveness", "Guide us to the straight path \u2192 Master of the Day \u2192 You alone we worship", "Seek refuge in the Lord of mankind \u2192 He neither begets \u2192 When help comes", "Glorify and seek forgiveness \u2192 People entering Islam \u2192 When help comes"], 0, "An-Nasr: help/victory, then crowds, then tasbih + istighfar. (al-Qurtubi on 110:1-3)"],
      ["TF-I2", "What response does Surah an-Nasr command when victory comes?", ["Glorify Allah with praise and seek forgiveness", "Boast about personal power", "Stop worshipping because the mission is complete", "Treat victory as purely political"], 0, "The surah turns victory into humility: tasbih, praise, istighfar. (Qur'an 110:3)"],
      ["TF-I3", "Why is Surah an-Nasr connected to the nearing completion of the Prophet's mission?", ["It points to victory, people entering Islam in crowds, and the command to glorify and seek forgiveness", "It tells the story of Musa in detail", "It gives inheritance shares", "It begins the Qur'an"], 0, "Understood as a sign of completion. (Bukhari 4969; al-Qurtubi)"],
      ["TF-I4", "What does 'people entering Allah's religion in crowds' suggest?", ["A public turning toward Islam after Allah's help and victory", "Only one private conversation", "The start of creation", "The rules of trade"], 0, "Visible, collective acceptance of Islam after divine help. (Qur'an 110:2)"],
      ["TF-I5", "A user says: 'Victory means I should become proud.' Which answer best reflects Surah an-Nasr?", ["Victory should lead to tasbih, gratitude, and seeking forgiveness", "Victory means forgetting Allah", "Victory removes the need for humility", "Victory is only about numbers"], 0, "Success should increase humility and return to Allah. (Qur'an 110:3)"],
    ],
    3: [
      ["TF-A1", "Which is the correct opening sequence of themes in Surah al-A'la?", ["Glorify your Lord, the Most High \u2192 Allah creates, proportions, and guides \u2192 Vegetation brought out then made dry", "The successful one purifies \u2192 Glorify your Lord \u2192 The Hereafter is better", "Vegetation brought out \u2192 Glorify your Lord \u2192 Allah creates and proportions", "The Hereafter is better \u2192 Reminder benefits the one who fears \u2192 Glorify your Lord"], 0, "Glorification, then creation signs, then vegetation. (al-Qurtubi on 87:1-5)"],
      ["TF-A2", "What is the opening command of Surah al-A'la?", ["Glorify the name of your Lord, the Most High", "Seek refuge in the Lord of mankind", "When Allah's help comes", "Woe to every slanderer"], 0, "Sabbih isma Rabbika l-A'la. (Qur'an 87:1)"],
      ["TF-A3", "Which pair of meanings appears early in Surah al-A'la?", ["Allah creates/proportions and determines/guides", "A detailed list of inheritance shares", "The story of the elephant army only", "Rules of divorce"], 0, "Creation, proportioning, decree, and guidance. (Qur'an 87:2-3)"],
      ["TF-A4", "Which statement best reflects the end of Surah al-A'la?", ["The Hereafter is better and more lasting", "Worldly life is always the final goal", "There is no reminder in earlier scriptures", "Prayer and remembrance are disconnected from success"], 0, "Bal tu'thiruna l-hayata d-dunya, wa l-akhiratu khayrun wa abqa. (Qur'an 87:16-17)"],
      ["TF-A5", "A learner says: 'I know the truth but keep choosing short-term comfort.' Which al-A'la theme speaks most directly to this?", ["Preferring worldly life while the Hereafter is better and more lasting", "The order of zakah calculation", "The location of the cave of Hira", "The rules of murabaha"], 0, "Knowledge must reshape desire: the Hereafter is better. (Qur'an 87:16-17)"],
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
  const topicState = {};
  for (const t of selectedTopics) {
    const startTier = selfRatings[t] || 1;
    const myAnswers = answers.filter(a => a.cat === t);
    const initialAnswers = myAnswers.filter(a => a.tier === startTier);
    const initialCorrect = initialAnswers.filter(a => a.correct).length;
    let phase = "initial";
    let probeTier = null;
    if (initialAnswers.length >= 3) {
      if (initialCorrect >= 2 && startTier < 3) { phase = "probe"; probeTier = startTier + 1; }
      else if (initialCorrect <= 1 && startTier > 1) { phase = "probe"; probeTier = startTier - 1; }
      else { phase = "done"; }
      if (phase === "probe") {
        const probeAnswers = myAnswers.filter(a => a.tier === probeTier);
        if (probeAnswers.length >= 2) phase = "done";
      }
    }
    topicState[t] = { startTier, phase, probeTier, total: myAnswers.length };
  }
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
      if (probeTier > startTier) placements[t] = probeCorrect >= 1 ? probeTier : startTier;
      else placements[t] = probeCorrect >= 1 ? probeTier : Math.max(0, probeTier - 1);
    } else {
      placements[t] = initialCorrect >= 2 ? startTier : Math.max(0, startTier - 1);
    }
  }
  return placements;
}

function getTotalQuestions(selectedTopics) {
  return selectedTopics.length * 4;
}

// ── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes compassFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes compassScale { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
  @keyframes compassPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.04); } }
  @keyframes compassSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes compassShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 60% { transform: translateX(6px); } }
  @keyframes compassSlideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes compassGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); } 50% { box-shadow: 0 0 24px 4px rgba(201,168,76,0.18); } }
  @keyframes compassCountUp { from { opacity: 0; transform: scale(0.5) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes compassRingFill { from { stroke-dashoffset: 283; } }
  @keyframes compassStreakPop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.3); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes compassConfetti { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
  .cmp-fade-up { animation: compassFadeUp 0.4s ease-out both; }
  .cmp-scale { animation: compassScale 0.35s ease-out both; }
  .cmp-pulse { animation: compassPulse 2.5s ease-in-out infinite; }
  .cmp-shake { animation: compassShake 0.3s ease both; }
  .cmp-slide-in { animation: compassSlideIn 0.3s ease-out both; }
  .cmp-glow { animation: compassGlow 2s ease-in-out infinite; }
  .cmp-count-up { animation: compassCountUp 0.5s cubic-bezier(.17,.67,.35,1.3) both; }
  .cmp-ring-fill { animation: compassRingFill 1.2s ease-out both; }
  .cmp-streak { animation: compassStreakPop 0.4s cubic-bezier(.17,.67,.35,1.3) both; }
  .cmp-press { transition: transform .09s ease, box-shadow .09s ease, filter .15s ease; }
  .cmp-press:hover { filter: brightness(1.04); }
  .cmp-press:active { transform: translateY(4px) !important; box-shadow: 0 0 0 transparent !important; }
  .cmp-press:focus-visible, .cmp-card:focus-visible { outline: 2px solid #F0B429; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
`;

// ── Colours (Deany brand palette) ─────────────────────────────────────────
const serif = 'Georgia, serif';
const C = {
  gold: '#F0B429', goldDk: '#C8901A', goldLight: '#FCEFCF', goldText: '#5A3E00',
  navy: '#0F4C5C', steel: '#5E7480', muted: '#94A3AA',
  teal: '#22A39A', tealDk: '#1A8C82', tealDeep: '#0F4C5C',
  sage: '#22A39A', sageLight: '#DCF3EF',
  cream: '#FBFAF6', ivory: '#F5F1EC', heroWash: '#EAF7F5',
  border: '#E8E4DF', error: '#C53030', errorLight: '#FEF2F2',
  white: '#FFFFFF',
};

const LETTERS = ['A', 'B', 'C', 'D'];

// ── Welcome ──────────────────────────────────────────────────────────────
function WelcomeStep({ onNext }) {
  return (
    <div className="cmp-fade-up" style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
      {/* Compass visual */}
      <div style={{ position: 'relative', width: 112, height: 112, margin: '0 auto 26px' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle at 50% 38%, ${C.sageLight}, transparent 70%)` }} />
        <div className="cmp-pulse" style={{ position: 'absolute', inset: 9, borderRadius: '50%', background: `linear-gradient(140deg, ${C.goldLight}, ${C.white})`, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, boxShadow: '0 12px 30px rgba(240,180,41,0.22)' }}>
          <span role="img" aria-label="compass">&#x1F9ED;</span>
        </div>
      </div>

      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.teal, marginBottom: 10 }}>Deany Compass</p>
      <h1 style={{ fontFamily: serif, fontSize: 32, fontWeight: 500, color: C.navy, lineHeight: 1.2, marginBottom: 14 }}>Find your starting point</h1>
      <p style={{ fontSize: 15, color: C.steel, lineHeight: 1.7, marginBottom: 8, maxWidth: 400, margin: '0 auto 28px' }}>
        Pick the subjects you care about, tell us where you think you are, then answer a short adaptive quiz.
        Deany will map your knowledge and build a path made for you.
      </p>

      {/* Steps preview */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 36 }}>
        {[{ n: '1', l: 'Choose subjects' }, { n: '2', l: 'Rate yourself' }, { n: '3', l: 'Quick quiz' }].map((s, i) => (
          <div key={i} className="cmp-fade-up" style={{ animationDelay: `${0.15 + i * 0.1}s`, textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.goldLight, border: `1.5px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: C.gold, margin: '0 auto 6px' }}>{s.n}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <button onClick={onNext} className="cmp-press" style={{
        background: C.gold, color: C.goldText, border: 'none', borderRadius: 14, padding: '15px 48px',
        fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 0 ${C.goldDk}`,
      }}>
        Begin Calibration
      </button>
      <p style={{ fontSize: 12, color: C.muted, marginTop: 16 }}>Takes 3 to 5 minutes</p>
    </div>
  );
}

// ── Topic Selection ──────────────────────────────────────────────────────
function TopicStep({ selected, setSelected, onNext }) {
  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      <div className="cmp-fade-up" style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: C.sage, marginBottom: 6 }}>Step 1 of 3</div>
        <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: C.navy, marginBottom: 6 }}>What do you want to learn?</h2>
        <p style={{ fontSize: 14, color: C.steel }}>Select one or more. Your quiz adapts to these.</p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {TOPICS.map((t, i) => {
          const active = selected.includes(t.id);
          return (
            <button key={t.id} onClick={() => toggle(t.id)} className="cmp-fade-up" style={{
              animationDelay: `${0.05 + i * 0.06}s`,
              display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
              borderRadius: 16, border: `2px solid ${active ? C.gold : C.border}`,
              background: active ? C.goldLight : C.white, cursor: 'pointer',
              transition: 'all 0.2s', textAlign: 'left', width: '100%',
              transform: active ? 'scale(1.01)' : 'scale(1)',
              boxShadow: active ? `0 4px 20px rgba(201,168,76,0.15)` : '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{t.title}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.desc}</div>
              </div>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${active ? C.gold : C.border}`,
                background: active ? C.gold : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                {active && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="cmp-fade-up" style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: C.steel, fontWeight: 500 }}>{selected.length} subject{selected.length > 1 ? 's' : ''} selected</span>
          <button onClick={onNext} className="cmp-press" style={{
            background: C.gold, color: C.goldText, border: 'none', borderRadius: 12, padding: '13px 36px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 0 ${C.goldDk}`,
          }}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

// ── Self-Assessment ──────────────────────────────────────────────────────
function AssessStep({ selectedTopics, ratings, setRatings, onNext }) {
  const topicData = TOPICS.filter(t => selectedTopics.includes(t.id));
  const allRated = topicData.every(t => ratings[t.id]);

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      <div className="cmp-fade-up" style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: C.sage, marginBottom: 6 }}>Step 2 of 3</div>
        <h2 style={{ fontFamily: serif, fontSize: 24, fontWeight: 500, color: C.navy, marginBottom: 6 }}>Where do you think you are?</h2>
        <p style={{ fontSize: 14, color: C.steel }}>Be honest. This helps us start you at the right level.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {topicData.map((t, ti) => (
          <div key={t.id} className="cmp-fade-up" style={{
            animationDelay: `${0.05 + ti * 0.08}s`,
            background: C.white, borderRadius: 18, padding: 20,
            border: `1.5px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>{t.icon}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{t.title}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {LEVELS.map(lv => {
                const active = ratings[t.id] === lv.tier;
                return (
                  <button key={lv.id} onClick={() => setRatings(prev => ({ ...prev, [t.id]: lv.tier }))} style={{
                    padding: '12px 8px', borderRadius: 12, border: `2px solid ${active ? C.gold : C.border}`,
                    background: active ? C.goldLight : C.cream, cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.2s', transform: active ? 'scale(1.03)' : 'scale(1)',
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 3 }}>{lv.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: active ? C.gold : C.navy }}>{lv.label}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{lv.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {allRated && (
        <div className="cmp-fade-up" style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={onNext} className="cmp-press" style={{
            background: C.gold, color: C.goldText, border: 'none', borderRadius: 14, padding: '15px 48px',
            fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 0 ${C.goldDk}`,
          }}>
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
}

// ── Quiz Question ────────────────────────────────────────────────────────
function QuizStep({ question, questionNumber, totalEstimate, streak, correctCount, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const shuffled = useMemo(() => {
    const indexed = question.opts.map((text, i) => ({ text, idx: i }));
    return stableShuffle(indexed, question.id);
  }, [question.id, question.opts]);

  const isCorrect = selected !== null && shuffled[selected]?.idx === question.correct;
  const topicLabel = TOPICS.find(t => t.id === question.cat)?.title || question.cat;
  const topicIcon = TOPICS.find(t => t.id === question.cat)?.icon || '';
  const tierName = TIER_LABEL[question.tier] || '';
  const pct = totalEstimate ? Math.min(100, Math.max(5, (questionNumber / totalEstimate) * 100)) : 30;

  function choose(i) {
    if (submitted) return;
    setSelected(i);
    setSubmitted(true);
  }

  function next() {
    if (selected === null) return;
    onAnswer({
      id: question.id, cat: question.cat, tier: question.tier,
      correct: shuffled[selected].idx === question.correct,
    });
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      {/* Top bar: topic + streak + progress */}
      <div className="cmp-fade-up" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: C.muted }}>
              Q{questionNumber}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
              background: C.cream, border: `1px solid ${C.border}`, color: C.steel,
            }}>
              {topicIcon} {topicLabel}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
              background: C.goldLight, color: C.gold,
            }}>
              {tierName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {streak >= 2 && (
              <span className="cmp-streak" style={{
                fontSize: 12, fontWeight: 800, color: '#E8590C',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                &#x1F525; {streak}
              </span>
            )}
            <span style={{ fontSize: 12, fontWeight: 700, color: C.sage }}>{correctCount} correct</span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 5, borderRadius: 3, background: C.border, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${C.sage}, ${C.gold})`, width: `${pct}%`, transition: 'width 0.6s ease-out' }} />
        </div>
      </div>

      {/* Question card */}
      <div className="cmp-scale" style={{
        background: C.white, borderRadius: 20, padding: '28px 24px',
        border: `1.5px solid ${C.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
        marginBottom: 16,
      }}>
        <p style={{ fontFamily: serif, fontSize: 19, fontWeight: 500, color: C.navy, lineHeight: 1.5, margin: 0 }}>{question.prompt}</p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shuffled.map((opt, i) => {
          const isThis = i === selected;
          const isCorrectOpt = shuffled[i].idx === question.correct;
          let bg = C.white, borderCol = C.border, textCol = C.navy, letterBg = C.cream, letterCol = C.steel;

          if (submitted && isThis && isCorrect) {
            bg = C.sageLight; borderCol = C.sage; letterBg = C.sage; letterCol = C.white;
          } else if (submitted && isThis && !isCorrect) {
            bg = C.errorLight; borderCol = C.error; letterBg = C.error; letterCol = C.white;
          } else if (submitted && isCorrectOpt) {
            bg = C.sageLight; borderCol = C.sage; letterBg = C.sage; letterCol = C.white;
          } else if (submitted) {
            textCol = C.muted;
          }

          return (
            <button key={i} onClick={() => choose(i)} disabled={submitted}
              className={submitted && isThis && !isCorrect ? 'cmp-shake' : 'cmp-slide-in'}
              style={{
                animationDelay: submitted ? '0s' : `${i * 0.05}s`,
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderRadius: 14, border: `2px solid ${borderCol}`, background: bg,
                cursor: submitted ? 'default' : 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.2s',
              }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: letterBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: letterCol, transition: 'all 0.2s',
              }}>
                {submitted && isCorrectOpt ? '\u2713' : submitted && isThis && !isCorrect ? '\u2717' : LETTERS[i]}
              </div>
              <span style={{ fontSize: 14, color: textCol, lineHeight: 1.5, fontWeight: 500 }}>{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div className="cmp-fade-up" style={{
          marginTop: 16, borderRadius: 16, padding: '18px 20px',
          background: isCorrect ? C.sageLight : C.errorLight,
          border: `1.5px solid ${isCorrect ? C.sage + '33' : C.error + '33'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{isCorrect ? '\u2705' : '\u274C'}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: isCorrect ? '#065F46' : '#991B1B' }}>
              {isCorrect ? 'Correct' : 'Not quite'}
            </span>
          </div>
          <p style={{ fontSize: 13, color: isCorrect ? '#065F46' : '#991B1B', lineHeight: 1.6, margin: '0 0 14px 0' }}>
            {question.why}
          </p>
          <button onClick={next} className="cmp-press" style={{
            background: isCorrect ? C.teal : C.navy, color: C.white, border: 'none',
            borderRadius: 12, padding: '13px 32px', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', width: '100%', boxShadow: `0 3px 0 ${isCorrect ? C.tealDk : '#0A3A47'}`,
          }}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}

// ── Score Ring ────────────────────────────────────────────────────────────
function ScoreRing({ pct }) {
  const r = 45, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const col = pct >= 80 ? C.gold : pct >= 50 ? C.sage : C.steel;
  return (
    <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
      <svg width="140" height="140" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke={C.border} strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={col} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 50 50)" className="cmp-ring-fill"
        />
      </svg>
      <div className="cmp-count-up" style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginTop: 4 }}>accuracy</span>
      </div>
    </div>
  );
}

// ── Confetti ─────────────────────────────────────────────────────────────
function Confetti() {
  const items = useRef(Array.from({ length: 30 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`, size: 10 + Math.random() * 10,
    dur: 2 + Math.random() * 2.5, delay: Math.random() * 0.8,
    char: ['\u2726', '\u2727', '\u2606', '\u{1F31F}', '\u2728', '\u2B50'][i % 6],
  })));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200 }}>
      {items.current.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.left, top: -20, fontSize: p.size,
          animation: `compassConfetti ${p.dur}s ease-out ${p.delay}s both`,
        }}>{p.char}</div>
      ))}
    </div>
  );
}

// ── Results ──────────────────────────────────────────────────────────────
function ResultsStep({ selectedTopics, selfRatings, answers, onHome, onComplete, onRestart }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const placements = useMemo(() => computePlacements(selectedTopics, selfRatings, answers), [selectedTopics, selfRatings, answers]);
  const totalCorrect = answers.filter(a => a.correct).length;
  const accuracy = answers.length ? Math.round((totalCorrect / answers.length) * 100) : 0;
  const topicData = TOPICS.filter(t => selectedTopics.includes(t.id));

  useEffect(() => {
    if (accuracy >= 70) { setShowConfetti(true); const t = setTimeout(() => setShowConfetti(false), 4000); return () => clearTimeout(t); }
  }, [accuracy]);

  const grade = accuracy >= 90 ? 'Outstanding' : accuracy >= 75 ? 'Strong' : accuracy >= 55 ? 'Solid foundation' : 'Room to grow';

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      {showConfetti && <Confetti />}

      {/* Score hero */}
      <div className="cmp-fade-up" style={{
        background: C.white, borderRadius: 24, padding: '36px 24px 28px',
        border: `1.5px solid ${C.border}`, boxShadow: '0 8px 36px rgba(0,0,0,0.06)',
        textAlign: 'center', marginBottom: 20,
      }}>
        <ScoreRing pct={accuracy} />
        <div className="cmp-count-up" style={{ animationDelay: '0.4s' }}>
          <p style={{ fontFamily: serif, fontSize: 23, fontWeight: 500, color: C.navy, margin: '18px 0 4px' }}>{grade}</p>
          <p style={{ fontSize: 13, color: C.steel }}>{totalCorrect} of {answers.length} correct across {selectedTopics.length} subject{selectedTopics.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Per-topic placements */}
      <div className="cmp-fade-up" style={{
        animationDelay: '0.2s', background: C.white, borderRadius: 20, padding: 24,
        border: `1.5px solid ${C.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        marginBottom: 20,
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: '0 0 18px 0' }}>Your placement by subject</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {topicData.map((t, i) => {
            const p = placements[t.id];
            const label = TIER_LABEL[p] || "New";
            const emoji = TIER_EMOJI[p] || "\u{1F331}";
            const barPct = Math.max(10, (p / 3) * 100);
            const barCol = p >= 3 ? C.gold : p >= 2 ? C.sage : C.steel;
            const topicAnswers = answers.filter(a => a.cat === t.id);
            const topicCorrect = topicAnswers.filter(a => a.correct).length;

            return (
              <div key={t.id} className="cmp-slide-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{t.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{t.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: barCol }}>{label}</span>
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ height: '100%', borderRadius: 4, background: barCol, width: `${barPct}%`, transition: 'width 0.8s ease-out' }} />
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>{topicCorrect}/{topicAnswers.length} correct</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight */}
      <div className="cmp-fade-up" style={{
        animationDelay: '0.4s', background: C.goldLight, borderRadius: 16, padding: '18px 20px',
        border: `1.5px solid ${C.gold}22`, marginBottom: 20,
      }}>
        <p style={{ fontSize: 13, color: C.navy, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
          {accuracy >= 75
            ? "You clearly have strong foundations. Deany will start you at a level that challenges you and fills any gaps."
            : accuracy >= 50
            ? "A solid start. Deany will reinforce the basics you know and build up the areas that need attention."
            : "Everyone starts somewhere. Deany will build your knowledge from the ground up, no shortcuts, no judgement."}
        </p>
      </div>

      {/* Actions */}
      <div className="cmp-fade-up" style={{
        animationDelay: '0.5s', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
      }}>
        <button onClick={() => {
          try { localStorage.setItem("deany-compass-result", JSON.stringify({ placements, accuracy, ts: Date.now() })); } catch {}
          if (onComplete) onComplete();
          else if (onHome) onHome();
        }} className="cmp-press" style={{
          background: C.gold, color: C.goldText, border: 'none', borderRadius: 14,
          padding: '15px 48px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
          width: '100%', maxWidth: 320, boxShadow: `0 4px 0 ${C.goldDk}`,
        }}>
          Start Your Path
        </button>
        <button onClick={onRestart} style={{
          background: 'none', border: 'none', color: C.muted, fontSize: 13,
          fontWeight: 500, cursor: 'pointer', padding: '8px 16px',
        }}>
          Retake Quiz
        </button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────
export default function DeanyCompass({ onBack, onHome, onComplete }) {
  const [step, setStep] = useState("welcome");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selfRatings, setSelfRatings] = useState({});
  const [answers, setAnswers] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);

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

  const correctCount = answers.filter(a => a.correct).length;

  const handleAnswer = useCallback((answer) => {
    setAnswers(prev => [...prev, answer]);
    setQuestionCount(c => c + 1);
    setStreak(s => answer.correct ? s + 1 : 0);
  }, []);

  const quizDone = step === "quiz" && !currentQuestion && answers.length > 0;

  function reset() {
    setStep("welcome");
    setSelectedTopics([]);
    setSelfRatings({});
    setAnswers([]);
    setQuestionCount(0);
    setStreak(0);
  }

  // Step labels for header
  const stepLabel = { welcome: '', topics: 'Choose Subjects', assess: 'Self-Assessment', quiz: 'Quiz', results: 'Results' };

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C.heroWash} 0%, ${C.cream} 340px)`, color: C.steel }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(250,248,245,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 580, margin: '0 auto', padding: '12px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: step !== 'welcome' && !quizDone && step !== 'results' ? 10 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {onBack && (
                <button onClick={onBack} style={{
                  background: 'none', border: 'none', color: C.steel, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500,
                  padding: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Back
                </button>
              )}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: C.sage }}>Deany Compass</div>
                {stepLabel[quizDone ? 'results' : step] && (
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{stepLabel[quizDone ? 'results' : step]}</div>
                )}
              </div>
            </div>
            {step !== "welcome" && step !== "results" && !quizDone && (
              <button onClick={reset} style={{
                background: 'none', border: 'none', color: C.muted, fontSize: 12,
                cursor: 'pointer', fontWeight: 500,
              }}>Restart</button>
            )}
          </div>

          {/* Progress bar (only during setup + quiz) */}
          {step !== 'welcome' && step !== 'results' && !quizDone && (
            <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: `linear-gradient(90deg, ${C.sage}, ${C.gold})`,
                width: `${step === 'topics' ? 15 : step === 'assess' ? 30 : Math.min(100, 30 + (questionCount / Math.max(1, totalEstimate)) * 70)}%`,
                transition: 'width 0.5s ease-out',
              }} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '32px 20px 60px' }}>
        {step === "welcome" && (
          <WelcomeStep onNext={() => setStep("topics")} />
        )}

        {step === "topics" && (
          <TopicStep selected={selectedTopics} setSelected={setSelectedTopics}
            onNext={() => setStep("assess")} />
        )}

        {step === "assess" && (
          <AssessStep selectedTopics={selectedTopics} ratings={selfRatings}
            setRatings={setSelfRatings}
            onNext={() => { setAnswers([]); setQuestionCount(0); setStreak(0); setStep("quiz"); }} />
        )}

        {step === "quiz" && !quizDone && currentQuestion && (
          <QuizStep key={currentQuestion.id} question={currentQuestion}
            questionNumber={questionCount + 1} totalEstimate={totalEstimate}
            streak={streak} correctCount={correctCount}
            onAnswer={handleAnswer} />
        )}

        {(step === "results" || quizDone) && (
          <ResultsStep selectedTopics={selectedTopics} selfRatings={effectiveRatings}
            answers={answers} onHome={onHome} onComplete={onComplete} onRestart={reset} />
        )}
      </div>
    </div>
  );
}
