import {
  LEVEL_MAX,
  LEVEL_MIN,
  LEVEL_STEP,
  STAT_MAX,
  STAT_MIN,
} from "@shared/limits";

const levelCount = (LEVEL_MAX - LEVEL_MIN) / LEVEL_STEP + 1;
const statCount = STAT_MAX - STAT_MIN + 1;

/**
 * Estimates a level from a stat by splitting the 22 stats into 8 even bands,
 * one per level: 79-81 → 1.5, 82-84 → 2, 85-87 → 2.5, 88-89 → 3,
 * 90-92 → 3.5, 93-95 → 4, 96-98 → 4.5, 99-100 → 5.
 */
export const levelForStat = (stat: number) =>
  LEVEL_MIN +
  Math.floor(((stat - STAT_MIN) * levelCount) / statCount) * LEVEL_STEP;
