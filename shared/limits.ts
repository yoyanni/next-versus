/**
 * Fighters below this ID come from the seed file and are read-only without the admin token.
 * Fighters created through the API get IDs from this value up.
 */
export const SANDBOX_ID_START = 100_000;

/**
 * A fighter's rank is a number: 0 is the champion, 1 to 14 are the ranked contenders,
 * and 15 is unranked.
 */
export const RANK_CHAMP = 0;
export const RANK_UNRANKED = 15;

/**
 * Bounds the wizard enforces. Levels go up in half steps; stats are whole numbers.
 */
export const LEVEL_MIN = 1.5;
export const LEVEL_MAX = 5;
export const LEVEL_STEP = 0.5;
export const STAT_MIN = 79;
export const STAT_MAX = 100;
export const MAX_PERKS = 5;
