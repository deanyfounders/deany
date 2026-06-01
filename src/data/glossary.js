// Glossary entries for Islamic History lessons
export // ---- Glossary (Islamic History) ----------------------------------
const GLOSSARY_ENTRIES = [
  { term: "Finality of Prophethood", def: "The belief that Muhammad ﷺ is the last prophet and messenger, and that no new revelation will come after him." },
  { term: "Idol Worship", def: "Worshipping created objects or beings instead of Allah, often believing they bring protection or blessings." },
  { term: "idol worship", def: "Worshipping created objects or beings instead of Allah, often believing they bring protection or blessings." },
  { term: "Tribal Society", def: "A social system where protection, honour, and alliances are based on family and tribe rather than a central government." },
  { term: "tribal", def: "Relating to a social system where protection, honour, and alliances are based on family and tribe rather than a central government." },
  { term: "Polytheism", def: "Worshipping created objects or beings instead of Allah, often believing they bring protection or blessings." },
  { term: "polytheism", def: "Worshipping created objects or beings instead of Allah, often believing they bring protection or blessings." },
  { term: "Revelation", def: "Guidance sent by Allah to prophets. It is not personal opinion, inspiration, or guesswork." },
  { term: "revelation", def: "Guidance sent by Allah to prophets. It is not personal opinion, inspiration, or guesswork." },
  { term: "sharīʿah", def: "The practical laws and rules given by Allah. These can differ by time and people, while the core belief remains the same." },
  { term: "tawḥīd", def: "Belief in and worship of Allah alone, rejecting all forms of false worship. This is the central belief of every prophet." },
  { term: "tawhid", def: "Belief in and worship of Allah alone, rejecting all forms of false worship. This is the central belief of every prophet." },
  { term: "Kaʿbah", def: "The sacred House in Mecca, originally built by Ibrāhīm. A central gathering place for worship and pilgrimage." },
  { term: "Yathrib", def: "An oasis settlement later known as Medina, shaped by agriculture, land ownership, and local alliances." },
  { term: "Sunnah", def: "The teachings, actions, and example of the Prophet Muhammad ﷺ, explaining how to live the Qur'an." },
  { term: "Hijrah", def: "The migration from Mecca to Yathrib (Medina), marking a major shift in Islamic history." },
  { term: "Tawrah", def: "The scripture revealed to Prophet Mūsā (Moses)." },
  { term: "Hijaz", def: "The western region of Arabia that includes Mecca and Yathrib, where Islam first emerged." },
  { term: "Injīl", def: "The scripture revealed to Prophet ʿĪsā (Jesus)." },
  { term: "waḥy", def: "Guidance sent by Allah to prophets. It is not personal opinion, inspiration, or guesswork." },
  { term: "ḥanīfs", def: "People who rejected idol worship and sought pure belief in one God, associated with the way of Ibrāhīm." },
  { term: "ḥanīf", def: "A person who rejected idol worship and sought pure belief in one God, associated with the way of Ibrāhīm." },
  { term: "hanifs", def: "People who rejected idol worship and sought pure belief in one God, associated with the way of Ibrāhīm." },
  { term: "hanif", def: "A person who rejected idol worship and sought pure belief in one God, associated with the way of Ibrāhīm." },
  { term: "Qur'an", def: "The final revelation from Allah, sent to Prophet Muhammad ﷺ. The primary source of guidance for Muslims." },
  { term: "nabī", def: "A prophet -- someone chosen by Allah who receives revelation and teaches, but may not be sent with a new public mission." },
  { term: "nabi", def: "A prophet -- someone chosen by Allah who receives revelation and teaches, but may not be sent with a new public mission." },
  { term: "rasūl", def: "A messenger -- a prophet sent with a clear public mission to deliver Allah's message, often with a new scripture." },
  { term: "rasul", def: "A messenger -- a prophet sent with a clear public mission to deliver Allah's message, often with a new scripture." },
];
// Sort longest-first so multi-word terms match before their sub-words
const SORTED_TERMS = [...GLOSSARY_ENTRIES].sort((a, b) => b.term.length - a.term.length);

// Split text into segments: plain strings and { term, def } objects
function splitGlossary(text) {
  if (!text) return [];
  const result = [];
  let remaining = text;
  while (remaining.length > 0) {
    let earliest = -1, matchLen = 0, matchDef = "";
    for (const entry of SORTED_TERMS) {
      const idx = remaining.indexOf(entry.term);
      if (idx !== -1 && (earliest == -1 || idx < earliest || (idx == earliest && entry.term.length > matchLen))) {
        earliest = idx;
        matchLen = entry.term.length;
        matchDef = entry.def;
      }
    }
    if (earliest == -1) { result.push(remaining); break; }
    if (earliest > 0) result.push(remaining.substring(0, earliest));
    result.push({ term: remaining.substring(earliest, earliest + matchLen), def: matchDef });
    remaining = remaining.substring(earliest + matchLen);
  }
  return result;
}

// Sort longest-first so multi-word terms match before their sub-words
export const SORTED_TERMS = [...GLOSSARY_ENTRIES].sort((a, b) => b.term.length - a.term.length);

export function splitGlossary(text) {
  if (!text) return [];
  const result = [];
  let remaining = text;
  while (remaining.length > 0) {
    let earliest = -1, matchLen = 0, matchDef = "";
    for (const entry of SORTED_TERMS) {
      const idx = remaining.indexOf(entry.term);
      if (idx !== -1 && (earliest == -1 || idx < earliest || (idx == earliest && entry.term.length > matchLen))) {
        earliest = idx;
        matchLen = entry.term.length;
        matchDef = entry.def;
      }
    }
    if (earliest == -1) { result.push(remaining); break; }
    if (earliest > 0) result.push(remaining.substring(0, earliest));
    result.push({ term: remaining.substring(earliest, earliest + matchLen), def: matchDef });
    remaining = remaining.substring(earliest + matchLen);
  }
  return result;
}
