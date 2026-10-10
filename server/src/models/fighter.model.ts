// External Import
import mongoose from "mongoose";

// Internal Import
import { Fighter as IFighter } from "@shared/types";

/**
 * Fighter Schema
 * --------------
 * Custom id implementation is needed for default selections in the FE,
 * a Counter schema could be implemented, though, default selection could also be refactored somehow
 */
const fighterSchema = new mongoose.Schema<IFighter>({
  _id: Number,
  weightClass: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    // Some seed fighters have no nickname, and `required` rejects empty strings
    default: "",
  },
  lastName: {
    type: String,
    required: true,
  },
  basic: {
    level: {
      type: Number,
      required: true,
    },
    skills: {
      martialArt: {
        type: String,
        required: true,
      },
      stance: {
        type: String,
        required: true,
      },
      reach: {
        type: Number,
        required: true,
      },
    },
  },
  perks: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  ],
  standUp: {
    level: {
      type: Number,
      required: true,
    },
    skills: {
      punchSpeed: {
        type: Number,
        required: true,
      },
      punchPower: {
        type: Number,
        required: true,
      },
      accuracy: {
        type: Number,
        required: true,
      },
      blocking: {
        type: Number,
        required: true,
      },
      headMovement: {
        type: Number,
        required: true,
      },
      footwork: {
        type: Number,
        required: true,
      },
      switchStance: {
        type: Number,
        required: true,
      },
      takedownDefence: {
        type: Number,
        required: true,
      },
      kickPower: {
        type: Number,
        required: true,
      },
      kickSpeed: {
        type: Number,
        required: true,
      },
    },
  },
  grappling: {
    level: {
      type: Number,
      required: true,
    },
    skills: {
      takedowns: {
        type: Number,
        required: true,
      },
      topControl: {
        type: Number,
        required: true,
      },
      bottomControl: {
        type: Number,
        required: true,
      },
      submissions: {
        type: Number,
        required: true,
      },
      submissionDefence: {
        type: Number,
        required: true,
      },
      groundStriking: {
        type: Number,
        required: true,
      },
      clinchStriking: {
        type: Number,
        required: true,
      },
      clinchControl: {
        type: Number,
        required: true,
      },
    },
  },
  health: {
    level: {
      type: Number,
      required: true,
    },
    skills: {
      cardio: {
        type: Number,
        required: true,
      },
      chin: {
        type: Number,
        required: true,
      },
      body: {
        type: Number,
        required: true,
      },
      legs: {
        type: Number,
        required: true,
      },
      recovery: {
        type: Number,
        required: true,
      },
    },
  },
  moves: {
    punches: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
      },
    ],
    kicks: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
      },
    ],
    clinch: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
      },
    ],
    takedowns: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
      },
    ],
    ground: {
      getups: [
        {
          name: String,
          level: Number,
        },
      ],
      transitions: [
        {
          name: String,
          level: Number,
        },
      ],
      reversals: [
        {
          name: String,
          level: Number,
        },
      ],
      sweeps: [
        {
          name: String,
          level: Number,
        },
      ],
      strikes: [
        {
          name: String,
          level: Number,
        },
      ],
    },
    submissions: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
      },
    ],
    combos: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

// Model
const Fighter = mongoose.model<IFighter>("Fighter", fighterSchema);

export default Fighter;
