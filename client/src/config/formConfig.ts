import standard from "@/standard";
import { FighterForm } from "@/types/component";
import { WizardStep } from "@/types/form";
import { formatRank } from "@/utils/formatRank";
import {
  LEVEL_MAX,
  LEVEL_MIN,
  LEVEL_STEP,
  MAX_PERKS,
  RANK_UNRANKED,
  STAT_MAX,
  STAT_MIN,
} from "@shared/limits";
import { RegisterOptions } from "react-hook-form";

const levels = Array.from(
  { length: (LEVEL_MAX - LEVEL_MIN) / LEVEL_STEP + 1 },
  (_, i) => String(LEVEL_MIN + i * LEVEL_STEP)
);
export const stats = Array.from({ length: STAT_MAX - STAT_MIN + 1 }, (_, i) =>
  String(STAT_MIN + i)
);

// Level and stat selects use 0 as their placeholder value, so `min` rejects an unselected one
const levelRules: RegisterOptions<FighterForm> = {
  valueAsNumber: true,
  min: { value: LEVEL_MIN, message: "Select a level" },
};
const statRules: RegisterOptions<FighterForm> = {
  valueAsNumber: true,
  min: { value: STAT_MIN, message: "Select a value" },
};

const step1: WizardStep<FighterForm> = {
  title: "General Info",
  inputs: [
    {
      type: "text",
      id: "generalInfo.firstName",
      label: "First name",
      rules: { required: "Enter a first name" },
    },
    {
      type: "text",
      id: "generalInfo.lastName",
      label: "Last name",
      rules: { required: "Enter a last name" },
    },
    { type: "text", id: "generalInfo.nickname", label: "Nickname" },
    {
      type: "select",
      id: "generalInfo.weightClass",
      label: "Weightclass",
      options: [...standard.weightClasses, "Generic"],
      rules: { required: "Select a weight class" },
    },
    {
      type: "select",
      id: "generalInfo.rank",
      label: "Rank",
      options: Array.from({ length: RANK_UNRANKED + 1 }, (_, rank) => ({
        value: String(rank),
        option: formatRank(rank),
      })),
      rules: { valueAsNumber: true, required: "Select a rank" },
    },
  ],
};

const step2: WizardStep<FighterForm> = {
  title: "Basic Info",
  inputs: [
    {
      type: "select",
      id: "basicInfo.level",
      label: "Level",
      options: levels,
      rules: levelRules,
    },
    {
      type: "number",
      id: "basicInfo.skills.reach",
      label: "Reach",
      rules: {
        valueAsNumber: true,
        required: "Enter the reach",
        min: { value: 0, message: "Enter 0 or more" },
        validate: (reach) => Number.isInteger(reach) || "Enter a whole number",
      },
    },
    {
      type: "select",
      id: "basicInfo.skills.martialArt",
      label: "Martial Arts",
      options: [...standard.martialArts],
      rules: { required: "Select a martial art" },
    },
    {
      type: "select",
      id: "basicInfo.skills.stance",
      label: "Stance",
      options: [...standard.stances],
      rules: { required: "Select a stance" },
    },
  ],
};

const step3: WizardStep<FighterForm> = {
  title: "Perks",
  inputs: [
    {
      type: "multi-select",
      id: "perks",
      label: "Perks",
      rules: {
        // Rules are typed for any field, so the value needs narrowing
        validate: (perks) =>
          (perks as string[]).length <= MAX_PERKS ||
          `Pick at most ${MAX_PERKS} perks`,
      },
      groups: [
        {
          name: "Stand-Up",
          options: standard.perks
            .filter((p) => p.type === "Stand-Up")
            .map((p) => p.name),
        },
        {
          name: "Grappling",
          options: standard.perks
            .filter((p) => p.type === "Grappling")
            .map((p) => p.name),
        },
        {
          name: "Health & Stamina",
          options: standard.perks
            .filter((p) => p.type === "Health & Stamina")
            .map((p) => p.name),
        },
      ],
    },
  ],
};

const step4: WizardStep<FighterForm> = {
  title: "Stand-Up",
  bulkStats: true,
  inputs: [
    {
      type: "select",
      id: `standUp.level`,
      label: "Level",
      options: levels,
      rules: levelRules,
    },
    ...standard.standUp.map(
      (item) =>
        ({
          type: "select",
          id: `standUp.skills.${item.propName}`,
          label: item.name,
          options: stats,
          rules: statRules,
        } as const)
    ),
  ],
};

const step5: WizardStep<FighterForm> = {
  title: "Grappling",
  bulkStats: true,
  inputs: [
    {
      type: "select",
      id: `grappling.level`,
      label: "Level",
      options: levels,
      rules: levelRules,
    },
    ...standard.grappling.map(
      (item) =>
        ({
          type: "select",
          id: `grappling.skills.${item.propName}`,
          label: item.name,
          options: stats,
          rules: statRules,
        } as const)
    ),
  ],
};

const step6: WizardStep<FighterForm> = {
  title: "Health",
  bulkStats: true,
  inputs: [
    {
      type: "select",
      id: `health.level`,
      label: "Level",
      options: levels,
      rules: levelRules,
    },
    ...standard.health.map(
      (item) =>
        ({
          type: "select",
          id: `health.skills.${item.propName}`,
          label: item.name,
          options: stats,
          rules: statRules,
        } as const)
    ),
  ],
};

const step7: WizardStep<FighterForm> = {
  title: "Moves",
  inputs: [
    {
      type: "select",
      id: "move.name",
      label: "Move",
      groups: [
        {
          name: "Punches",
          options: standard.moves.punches.map((punch) => ({
            value: "punches:" + punch,
            option: punch,
          })),
        },
        {
          name: "Kicks",
          options: standard.moves.kicks.map((kick) => ({
            value: "kicks:" + kick,
            option: kick,
          })),
        },
        {
          name: "Clinch",
          options: standard.moves.clinch.map((clinch) => ({
            value: "clinch:" + clinch,
            option: clinch,
          })),
        },
        {
          name: "Takedowns",
          options: standard.moves.takedowns.map((takedown) => ({
            value: "takedowns:" + takedown,
            option: takedown,
          })),
        },
        ...standard.groundKeys.map((ground) => ({
          name: "Ground - " + ground.title,
          options:
            ground.key === "strikes"
              ? standard.moves.ground.strikes.map((strike) => ({
                  value: "ground.strikes:" + strike,
                  option: strike,
                }))
              : standard.moves.ground.groundMovements.map((movement) => ({
                  value: `ground.${ground.key}:` + movement,
                  option: movement,
                })),
        })),
        {
          name: "Submission",
          options: standard.moves.submissions.map((submission) => ({
            value: "submissions:" + submission,
            option: submission,
          })),
        },
        {
          name: "Combos",
          options: standard.moves.combos.map((combo) => ({
            value: "combos:" + combo,
            option: combo,
          })),
        },
      ],
    },
    {
      type: "select",
      id: "move.level",
      label: "Level",
      options: [...standard.moveLevels],
      rules: { valueAsNumber: true },
    },
  ],
};

export const wizardSteps: readonly WizardStep<FighterForm>[] = [
  step1,
  step2,
  step3,
  step4,
  step5,
  step6,
  step7,
];
