// Adaptive staircase logic (pure, no UI). Placement, not teaching.
import { BANK, MAX_TIER } from './bank.js';

const MIN_Q = 5;   // ask at least this many per topic
const MAX_Q = 7;   // never more than this

export function seedTier(intent) {
  return intent === 'comfortable' ? 3 : intent === 'basics' ? 2 : 1;
}

// outcome: 'correct' | 'wrong' | 'unsure'
export function nextTier(tier, outcome, topicMax) {
  if (outcome === 'correct') return Math.min(tier + 1, topicMax);
  return Math.max(tier - 1, 1); // wrong and unsure both step down
}

// Nearest-available-tier question for a topic, excluding already-asked ids.
export function pickNextQuestion(topic, tier, askedIds) {
  const avail = BANK.filter(x => x.topic === topic && !askedIds.has(x.id));
  if (!avail.length) return null;
  avail.sort((a, b) => Math.abs(a.tier - tier) - Math.abs(b.tier - tier));
  return avail[0];
}

// Stop when we hit the cap, run dry, or the last 3 asked tiers have converged.
export function shouldStop(tierHistory, askedIds, topic) {
  const answered = tierHistory.length;
  if (answered >= MAX_Q) return true;
  const remaining = BANK.some(x => x.topic === topic && !askedIds.has(x.id));
  if (!remaining) return true;
  if (answered >= MIN_Q) {
    const last3 = tierHistory.slice(-3);
    if (Math.max(...last3) - Math.min(...last3) <= 1) return true;
  }
  return false;
}

export function finalTierFrom(tierHistory, topicMax) {
  if (!tierHistory.length) return 1;
  const last3 = [...tierHistory.slice(-3)].sort((a, b) => a - b);
  const median = last3[Math.floor(last3.length / 2)];
  return Math.max(1, Math.min(median, topicMax));
}

// Working level taxonomy (marked for rename). Scales to each topic's max tier.
export function levelForTier(tier, topicMax) {
  const ratio = tier / topicMax;
  if (ratio <= 0.4) return 'Foundations';
  if (ratio <= 0.7) return 'Builder';
  return 'Advanced';
}

export const maxTierFor = (topic) => MAX_TIER[topic] || 5;
