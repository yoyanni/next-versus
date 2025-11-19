import standard from "@/standard";
import { FighterForm } from "@/types/component";
import { WizardStep } from "@/types/form";

const step1: WizardStep<Pick<FighterForm, "generalInfo">> = {
  title: "General Info",
  inputs: [
    { type: "text", id: "generalInfo.firstName", label: "First name" },
    { type: "text", id: "generalInfo.lastName", label: "Last name" },
    { type: "text", id: "generalInfo.nickname", label: "Nickname" },
    {
      type: "select",
      id: "generalInfo.weightClass",
      label: "Weightclass",
      options: [...standard.weightClasses, "Generic"],
    },
    {
      type: "select",
      id: "generalInfo.rank",
      label: "Rank",
      options: [...standard.ranks],
    },
  ],
};

const step2: WizardStep<Pick<FighterForm, "basicInfo">> = {
  title: "Basic Info",
  inputs: [
    { type: "number", id: "basicInfo.skills.reach", label: "Reach" },
    {
      type: "select",
      id: "basicInfo.skills.martialArt",
      label: "Martial Arts",
      options: [...standard.martialArts],
    },
    {
      type: "select",
      id: "basicInfo.skills.stance",
      label: "Stance",
      options: [...standard.stances],
    },
    {
      type: "select",
      id: "basicInfo.level",
      label: "Level",
      options: [...standard.levels],
    },
  ],
};

const step3: WizardStep<Pick<FighterForm, "perks">> = {
  title: "Perks",
  inputs: [
    {
      type: "multi-select",
      id: "perks",
      label: "Perks",
      groups: [
        {
          name: "Stand-Up",
          options: standard.perks.filter((p) => p.type === "Stand-Up"),
        },
        {
          name: "Grappling",
          options: standard.perks.filter((p) => p.type === "Grappling"),
        },
        {
          name: "Health & Stamina",
          options: standard.perks.filter((p) => p.type === "Health & Stamina"),
        },
      ],
    },
  ],
};

const step4: WizardStep<Pick<FighterForm, "standUp">> = {
  title: "Stand-Up",
  inputs: [
    {
      type: "number",
      id: `standUp.level`,
      label: "Level",
    },
    ...standard.standUp.map(
      (item) =>
        ({
          type: "number",
          id: `standUp.skills.${item.propName}`,
          label: item.name,
        } as const)
    ),
  ],
};

const step5: WizardStep<Pick<FighterForm, "grappling">> = {
  title: "Grappling",
  inputs: [
    {
      type: "number",
      id: `grappling.level`,
      label: "Level",
    },
    ...standard.grappling.map(
      (item) =>
        ({
          type: "number",
          id: `grappling.skills.${item.propName}`,
          label: item.name,
        } as const)
    ),
  ],
};

const step6: WizardStep<Pick<FighterForm, "health">> = {
  title: "Health",
  inputs: [
    {
      type: "number",
      id: `health.level`,
      label: "Level",
    },
    ...standard.health.map(
      (item) =>
        ({
          type: "number",
          id: `health.skills.${item.propName}`,
          label: item.name,
        } as const)
    ),
  ],
};

const step7: WizardStep<Pick<FighterForm, "move">> = {
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
    },
  ],
};

export const wizardSteps = [
  step1,
  step2,
  step3,
  step4,
  step5,
  step6,
  step7,
] as const;
