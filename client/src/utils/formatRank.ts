import { RANK_CHAMP, RANK_UNRANKED } from "@shared/limits";

export const formatRank = (rank: number) => {
  if (rank === RANK_CHAMP) return "Champ";
  return rank > RANK_CHAMP && rank < RANK_UNRANKED ? `#${rank}` : "Unranked";
};
