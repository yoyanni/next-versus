import standard from "@/standard";
import { FighterForm } from "@/types/component";
import { WizardStep } from "@/types/form";

const step1: WizardStep<FighterForm["generalInfo"]> = {
  title: "General Info",
  inputs: [
    { type: "text", id: "firstName", label: "First name" },
    { type: "text", id: "lastName", label: "Last name" },
    { type: "text", id: "nickname", label: "Nickname" },
    {
      type: "select",
      id: "weightClass",
      label: "Weightclass",
      options: [...standard.weightClasses, "Generic"],
    },
    {
      type: "select",
      id: "rank",
      label: "Rank",
      options: [...standard.ranks],
    },
  ],
};

const step2: WizardStep<FighterForm["basicInfo"]> = {
  title: "Basic Info",
  inputs: [
    { type: "number", id: "skills.reach", label: "Reach" },
    {
      type: "select",
      id: "skills.martialArt",
      label: "Martial Arts",
      options: [...standard.martialArts],
    },
    {
      type: "select",
      id: "skills.stance",
      label: "Stance",
      options: [...standard.stances],
    },
    {
      type: "select",
      id: "level",
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

const step4: WizardStep<FighterForm["standUp"]> = {
  title: "Stand-Up",
  inputs: standard.standUp.map((item) => ({
    type: "number",
    id: `skills.${item.propName}`,
    label: item.name,
  })),
}; 

const step5: WizardStep<FighterForm["grappling"]> = {
  title: "Grappling",
  inputs: standard.grappling.map((item) => ({
    type: "number",
    id: `skills.${item.propName}`,
    label: item.name,
  })),
};

const step6: WizardStep<FighterForm["health"]> = {
  title: "Health",
  inputs: standard.health.map((item) => ({
    type: "number",
    id: `skills.${item.propName}`,
    label: item.name,
  })),
};

const step7: WizardStep<FighterForm["move"]> = {
  title: "Moves",
  inputs: [
    {
      type: "select", // probs needs refactoring
      id: "name",
      label: "Move",
      groups: [
        {
          name: "Punches",
          options: [...standard.moves.punches],
        },
        {
          name: "Kicks",
          options: [...standard.moves.kicks],
        },
        {
          name: "Clinch",
          options: [...standard.moves.clinch],
        },
        {
          name: "Takedowns",
          options: [...standard.moves.takedowns],
        },
        ...standard.groundKeys.map((ground) => ({
          name: "Ground - " + ground.title,
          options:
            ground.key === "strikes"
              ? [...standard.moves.ground.strikes]
              : [...standard.moves.ground.groundMovements],
        })),
        {
          name: "Submission",
          options: [...standard.moves.submissions],
        },
        {
          name: "Combos",
          options: [...standard.moves.combos],
        },
      ],
    },
    {
      type: "select",
      id: "level",
      label: "Level",
      options: [...standard.moveLevels],
    },
  ],
};

export const wizardSteps = [step1, step2, step3, step4, step5, step6, step7] as const;
