// Nexus chrome copy (spec v3.2 section 9) and analytics event names (section 10).
// The strings are final and shipped verbatim - DEANY voice: sentence case, no
// exclamation marks, no em-dashes, a competent tool not a life coach. Do not
// paraphrase. Anything religious inside cards stays Mehdi's; these are chrome only.

export const NEXUS_COPY = Object.freeze({
  sheetHeader: 'This ayah in DEANY',
  completedTag: 'Completed',
  justTheStory: 'Just the story',
  upNextTag: 'Up next in your route',
  // {n} = lesson number, {route} = route name, {m} = user's current lesson
  aheadTag: ({ n, route, m }) => `Lesson ${n} in your ${route} route. You are on lesson ${m}.`,
  gatedTag: 'Under scholar review',
  storyFooter: ({ n, route }) => `The full lesson is number ${n} in your ${route} route.`,
  remindAction: 'Remind me when I arrive',
  remindConfirm: 'We will note it when you get there.',
  cardCheckIntro: 'Quick check, three questions. Skippable.',
  skipAction: 'Skip',
  srsOffer: 'Test me on this later',
  srsSubline: 'Short questions will appear in your practice reviews.',
  srsDecline: 'No thanks',
  // {surah} {ayah} form the reference, e.g. "Quraysh 106:1"
  provenanceBanner: ({ surah, ayah }) => `You found ${surah} ${ayah} while reading the mushaf.`,
  provenanceBannerWithReview: ({ surah, ayah }) => `You found ${surah} ${ayah} while reading the mushaf and have been reviewing its story.`,
  readPanelRow: 'Connections',
  practiceRunNoXp: 'Practice run, no XP.',
  offlineUncached: 'Available when you are back online',
});

// Final event names (spec section 10). Properties documented alongside each.
export const NEXUS_EVENTS = Object.freeze({
  dotTap: 'nexus_dot_tap',                 // (ayah_key, mode)
  sheetOpen: 'nexus_sheet_open',           // (ayah_key, connection_count)
  rowTap: 'nexus_row_tap',                 // (entity_id, state)
  storyCardOpen: 'story_card_open',        // (lesson_id, from_state)
  storyCardReadEnd: 'story_card_read_end', // (lesson_id, reached_footer)
  cardCheckStart: 'card_check_start',      // (lesson_id)
  cardCheckComplete: 'card_check_complete',// (lesson_id, correct_count)
  cardCheckSkip: 'card_check_skip',        // (lesson_id, correct_count)
  srsOptin: 'srs_optin',                   // (lesson_id)
  srsDecline: 'srs_decline',               // (lesson_id)
  reminderSet: 'reminder_set',             // (lesson_id, ayah_key)
  provenanceBannerShown: 'provenance_banner_shown', // (lesson_id)
  refchipTap: 'refchip_tap',               // (entity_id, target_key)
  mushafReturnTap: 'mushaf_return_tap',    // (entity_id)
});
