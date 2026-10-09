import type { Fighter } from "@shared/types";
import { SANDBOX_ID_START } from "@shared/limits";

const UNRANKED = Number.MAX_SAFE_INTEGER;

// The seed data marks a champion as "Champ" or "0". Anything that isn't a whole number is unranked.
const rankOrder = (rank: string) => {
  if (rank === "Champ") return 0;
  return /^\d+$/.test(rank) ? Number(rank) : UNRANKED;
};

const isSandbox = (f: Fighter) => f._id >= SANDBOX_ID_START;

// Seed fighters come first, so a visitor can't put a sandbox fighter on the home page by ranking it Champ.
const byRank = (fighters: Fighter[]) =>
  [...fighters].sort(
    (a, b) =>
      Number(isSandbox(a)) - Number(isSandbox(b)) ||
      rankOrder(a.rank) - rankOrder(b.rank)
  );

// A corner with no selection, or whose fighter no longer exists, gets the highest-ranked
// fighter in the weight class that the other corner isn't already showing.
export const pickCorners = (
  fighters: Fighter[],
  wcFighters: Fighter[],
  ids: { red: number | null; blue: number | null }
) => {
  const ranked = byRank(wcFighters);
  const red =
    fighters.find((f) => f._id === ids.red) ??
    ranked.find((f) => f._id !== ids.blue);
  const blue =
    fighters.find((f) => f._id === ids.blue) ??
    ranked.find((f) => f._id !== red?._id);

  return { red, blue };
};
