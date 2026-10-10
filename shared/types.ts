export type Perk = {
  name: string;
  description: string;
  type: string;
};

// skills should probs be stats
export type Stats<T> = {
  level: number;
  skills: T;
};

export type Basic = {
  martialArt: string;
  stance: string;
  reach: number;
};

export type StandUp = {
  punchSpeed: number;
  punchPower: number;
  accuracy: number;
  blocking: number;
  headMovement: number;
  footwork: number;
  switchStance: number;
  takedownDefence: number;
  kickPower: number;
  kickSpeed: number;
};

export type Grappling = {
  takedowns: number;
  topControl: number;
  bottomControl: number;
  submissions: number;
  submissionDefence: number;
  groundStriking: number;
  clinchStriking: number;
  clinchControl: number;
};

export type Health = {
  cardio: number;
  chin: number;
  body: number;
  legs: number;
  recovery: number;
};

export type Move = {
  name: string;
  level: number;
};

// Fighter
export type Fighter = {
  _id: number;
  weightClass: string;
  rank: number;
  firstName: string;
  nickname: string;
  lastName: string;
  perks: Perk[];
  basic: Stats<Basic>;
  standUp: Stats<StandUp>;
  grappling: Stats<Grappling>;
  health: Stats<Health>;
  moves: {
    punches: Move[];
    kicks: Move[];
    clinch: Move[];
    takedowns: Move[];
    ground: {
      getups: Move[];
      transitions: Move[];
      reversals: Move[];
      sweeps: Move[];
      strikes: Move[];
    };
    submissions: Move[];
    combos: Move[];
  };
};
