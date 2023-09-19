type Perk = {
  name: string;
  description: string;
  type: string;
};

type Move = {
  name: string;
  level: number;
};

interface FighterType {
  _id: number;
  weightClass: string;
  rank: string;
  firstName: string;
  nickname: string;
  lastName: string;
  basic: {
    level: number;
    skills: {
      martialArt: string;
      stance: string;
      reach: number;
    };
  };
  perks: Perk[];
  standUp: {
    level: number;
    skills: {
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
  };
  grappling: {
    level: number;
    skills: {
      takedowns: number;
      topControl: number;
      bottomControl: number;
      submissions: number;
      submissionDefence: number;
      groundStriking: number;
      clinchStriking: number;
      clinchControl: number;
    };
  };
  health: {
    level: number;
    skills: {
      cardio: number;
      chin: number;
      body: number;
      legs: number;
      recovery: number;
    };
  };
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
}

export default FighterType;
