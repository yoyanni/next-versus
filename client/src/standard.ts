import { Standards } from "./types";

const standard: Standards = {
  weightClasses: [
    "Strawweight",
    "Flyweight (W)",
    "Bantamweight (W)",
    "Flyweight",
    "Bantamweight",
    "Featherweight",
    "Lightweight",
    "Welterweight",
    "Middleweight",
    "Light Heavyweight",
    "Heavyweight",
  ],
  basic: [
    { name: "Martial Art", propName: "martialArt" },
    { name: "Stance", propName: "stance" },
    { name: "Reach", propName: "reach" },
  ],
  standUp: [
    { name: "Punch Speed", propName: "punchSpeed" },
    { name: "Punch Power", propName: "punchPower" },
    { name: "Accuracy", propName: "accuracy" },
    { name: "Blocking", propName: "blocking" },
    { name: "Head Movement", propName: "headMovement" },
    { name: "Footwork", propName: "footwork" },
    { name: "Switch Stance", propName: "switchStance" },
    { name: "Takedown Defence", propName: "takedownDefence" },
    { name: "Kick Power", propName: "kickPower" },
    { name: "Kick Speed", propName: "kickSpeed" },
  ],
  grappling: [
    { name: "Takedown", propName: "takedowns" },
    { name: "Top Control", propName: "topControl" },
    { name: "Bottom Control", propName: "bottomControl" },
    { name: "Submission", propName: "submissions" },
    { name: "Submission Defence", propName: "submissionDefence" },
    { name: "Ground Striking", propName: "groundStriking" },
    { name: "Clinch Striking", propName: "clinchStriking" },
    { name: "Clinch Control", propName: "clinchControl" },
  ],
  health: [
    { name: "Cardio", propName: "cardio" },
    { name: "Chin", propName: "chin" },
    { name: "Body", propName: "body" },
    { name: "Legs", propName: "legs" },
    { name: "Recovery", propName: "recovery" },
  ],
};

export default standard;
