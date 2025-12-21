import { FighterForm } from "@/types/component";
import { Fighter } from "@shared/types";

export const createFighterForm = (fighter?: Fighter): FighterForm => {
  if (fighter) {
    const {
      firstName,
      nickname,
      lastName,
      rank,
      weightClass,
      basic,
      perks,
      standUp,
      grappling,
      health,
      moves,
    } = fighter;
    return {
      generalInfo: {
        weightClass: weightClass,
        rank: rank,
        firstName: firstName,
        nickname: nickname,
        lastName: lastName,
      },
      basicInfo: {
        level: basic.level,
        skills: {
          martialArt: basic.skills.martialArt,
          stance: basic.skills.stance,
          reach: basic.skills.reach,
        },
      },
      perks: perks.map((perk) => perk.name),
      standUp: {
        level: standUp.level,
        skills: {
          punchSpeed: standUp.skills.punchSpeed,
          punchPower: standUp.skills.punchPower,
          accuracy: standUp.skills.accuracy,
          blocking: standUp.skills.blocking,
          headMovement: standUp.skills.headMovement,
          footwork: standUp.skills.footwork,
          switchStance: standUp.skills.switchStance,
          takedownDefence: standUp.skills.takedownDefence,
          kickPower: standUp.skills.kickPower,
          kickSpeed: standUp.skills.kickSpeed,
        },
      },
      grappling: {
        level: grappling.level,
        skills: {
          takedowns: grappling.skills.takedowns,
          topControl: grappling.skills.topControl,
          bottomControl: grappling.skills.bottomControl,
          submissions: grappling.skills.submissions,
          submissionDefence: grappling.skills.submissionDefence,
          groundStriking: grappling.skills.groundStriking,
          clinchStriking: grappling.skills.clinchStriking,
          clinchControl: grappling.skills.clinchControl,
        },
      },
      health: {
        level: 0,
        skills: {
          cardio: health.skills.cardio,
          chin: health.skills.chin,
          body: health.skills.body,
          legs: health.skills.legs,
          recovery: health.skills.recovery,
        },
      },
      move: { name: "", level: 0 },
      moves: {
        punches: moves.punches,
        kicks: moves.kicks,
        clinch: moves.clinch,
        takedowns: moves.takedowns,
        ground: {
          getups: moves.ground.getups,
          transitions: moves.ground.transitions,
          reversals: moves.ground.reversals,
          sweeps: moves.ground.sweeps,
          strikes: moves.ground.strikes,
        },
        submissions: moves.submissions,
        combos: moves.combos,
      },
    };
  } else {
    return {
      generalInfo: {
        weightClass: "",
        rank: "",
        firstName: "",
        nickname: "",
        lastName: "",
      },
      basicInfo: {
        level: 0,
        skills: { martialArt: "", stance: "", reach: NaN },
      },
      perks: [],
      standUp: {
        level: 0,
        skills: {
          punchSpeed: 0,
          punchPower: 0,
          accuracy: 0,
          blocking: 0,
          headMovement: 0,
          footwork: 0,
          switchStance: 0,
          takedownDefence: 0,
          kickPower: 0,
          kickSpeed: 0,
        },
      },
      grappling: {
        level: 0,
        skills: {
          takedowns: 0,
          topControl: 0,
          bottomControl: 0,
          submissions: 0,
          submissionDefence: 0,
          groundStriking: 0,
          clinchStriking: 0,
          clinchControl: 0,
        },
      },
      health: {
        level: 0,
        skills: { cardio: 0, chin: 0, body: 0, legs: 0, recovery: 0 },
      },
      move: { name: "", level: 0 },
      moves: {
        punches: [],
        kicks: [],
        clinch: [],
        takedowns: [],
        ground: {
          getups: [],
          transitions: [],
          reversals: [],
          sweeps: [],
          strikes: [],
        },
        submissions: [],
        combos: [],
      },
    };
  }
};
