// The moves that at least 90% of the 390 seed fighters have, checked on 2026-11-10.
// The next most common move (Lead Overhand) is on 76%. Paths are moves.* paths and
// names are the wizard's, in its order. The seed file calls ground strikes
// "Ground Hook" and so on; these use the wizard's names.
export const commonMoves: { path: string; names: string[] }[] = [
  {
    path: "punches",
    names: [
      "Jab",
      "Straight",
      "Lead Hook",
      "Hook",
      "Lead Uppercut",
      "Uppercut",
      "Body Jab",
      "Body Straight",
      "Lead Body Hook",
      "Body Hook",
      "Lead Body Uppercut",
      "Body Uppercut",
    ],
  },
  {
    path: "kicks",
    names: [
      "Lead Calf Kick",
      "Calf Kick",
      "Lead Leg Kick",
      "Leg Kick",
      "Lead Body Roundhouse",
      "Body Roundhouse",
      "Lead Roundhouse",
      "Roundhouse Kick",
      "Body Front Kick",
      "Body Knee",
    ],
  },
  {
    path: "clinch",
    names: [
      "Hooks",
      "Body Hooks",
      "Uppercuts",
      "Body Uppercuts",
      "Elbows",
      "Knees to Head",
      "Knees to Body",
      "Knees to Leg",
      "Lead Collar Tie",
    ],
  },
  {
    path: "takedowns",
    names: ["Single Leg", "Double Leg", "Wrestling", "BJJ/Judo"],
  },
  { path: "ground.getups", names: ["BJJ", "Wrestle"] },
  { path: "ground.transitions", names: ["BJJ", "Wrestle"] },
  { path: "ground.reversals", names: ["BJJ", "Wrestle"] },
  { path: "ground.sweeps", names: ["BJJ", "Wrestle"] },
  {
    path: "ground.strikes",
    names: [
      "Straights",
      "Hook",
      "Body Hook",
      "Body Knee",
      "Elbow",
      "Body Straights",
      "Uppercuts",
    ],
  },
  {
    path: "submissions",
    names: ["Armbars", "Guillotines", "Orthodox Chokes"],
  },
  { path: "combos", names: ["Boxing", "Muay Thai"] },
];

export const COMMON_MOVE_LEVEL = 3;
