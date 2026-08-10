// Level math for the dashboard Level card and the profile (deany_level_card_spec).
// One source of truth: the level, progress and XP-to-next are all derived here
// from lifetime XP. Never inline these thresholds in a component.
//
// Threshold curve (gently increasing): reaching level L (L >= 2) costs
// (50 + L * 25) XP beyond the lifetime XP at level L-1.
//   L1 -> L2 = 100,  L2 -> L3 = 125,  L3 -> L4 = 150,  ...
// Because level is derived from lifetime XP (which only grows), it never
// decreases. Every account is at least Level 1 at 0 XP; there is no Level 0.
export const xpCostToReach = (level) => 50 + level * 25; // level >= 2

export function levelFor(totalXp) {
  const xp = Math.max(0, Math.floor(Number(totalXp) || 0));
  let level = 1;
  let levelStart = 0; // lifetime XP at the start of the current level
  for (let i = 0; i < 100000; i++) { // bounded loop, real inputs exit far sooner
    const cost = xpCostToReach(level + 1);
    if (xp - levelStart >= cost) { levelStart += cost; level += 1; } else break;
  }
  const toNextCost = xpCostToReach(level + 1);
  const xpIntoLevel = xp - levelStart;
  const xpToNext = Math.max(0, toNextCost - xpIntoLevel);
  const progress = toNextCost > 0 ? Math.min(1, Math.max(0, xpIntoLevel / toNextCost)) : 0;
  return { level, nextLevel: level + 1, xp, xpIntoLevel, xpToNext, progress, levelStart, nextLevelStart: levelStart + toNextCost };
}
