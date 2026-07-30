// Story-card status lookup, shared by the Connections sheet (to gate AHEAD rows)
// and the story card itself. The cards are Mehdi-authored; engineering only reads
// their status.
import hist from '../../../content/story-cards/hist_b1_l2.json';
import fin from '../../../content/story-cards/fin_l3.json';

export const STORY_CARDS = { hist_b1_l2: hist, fin_l3: fin };
export const storyStatus = (id) => (STORY_CARDS[id] && STORY_CARDS[id].status) || 'pending_mehdi';
export const storyApproved = (id) => storyStatus(id) === 'approved';
