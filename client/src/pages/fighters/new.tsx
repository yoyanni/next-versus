import FormStepRender from "@/components/FormStepRender";
import MoveAccordion from "@/components/MoveAccordion";
import standard from "@/standard";
import { Fighter, Move } from "@shared/types";
import React, { useRef, useState } from "react";
import {
  FieldPath,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";

interface FieldBase<T> {
  id: T;
  label: string;
  // validation
}

interface OptionGroups {
  name: string;
  options: any[];
}

interface Field<T> extends FieldBase<T> {
  type: "text" | "number";
}

interface SelectField<T> extends FieldBase<T> {
  type: "select";
  options?: string[];
  groups?: OptionGroups[];
}

interface MultiSelectField<T> extends FieldBase<T> {
  type: "multi-select";
  groups: OptionGroups[];
}

type FormItem<T> = Field<T> | SelectField<T> | MultiSelectField<T>;

export interface WizardStep<T extends FieldValues> {
  title: string;
  inputs: FormItem<FieldPath<T>>[];
}

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

// const step7: WizardStep<Pick<Fighter, "moves"> & { level: number }> = {
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

const wizardSteps = [step1, step2, step3, step4, step5, step6, step7] as const;

const initialState = {
  generalInfo: {},
  basicInfo: {},
  perks: [],
  standUp: {},
  grappling: {},
  health: {},
  moves: { ground: {} },
};

export interface FighterForm {
  generalInfo: {
    weightClass: Fighter["weightClass"];
    rank: Fighter["rank"];
    firstName: Fighter["firstName"];
    nickname: Fighter["nickname"];
    lastName: Fighter["lastName"];
  };
  basicInfo: Fighter["basic"];
  perks: string[];
  standUp: Fighter["standUp"];
  grappling: Fighter["grappling"];
  health: Fighter["health"];
  move: Move;
  moves: Fighter["moves"];
}

const NewFighter = () => {
  const [step, setStep] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<"moves" | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FighterForm>({ defaultValues: initialState });
  const watchMoves = watch("moves");
  const watchPerks = watch("perks");

  const isFirstStep = step === 0;
  const isLastStep = step === wizardSteps.length - 1;

  const colors = [
    "#4096ff",
    "#5f8de6",
    "#7e84cc",
    "#9d7bb3",
    "#bc7299",
    "#db697f",
    "#ff4d4f",
  ];
  const bgColors = colors.map((color) => `bg-[${color}]`);
  const borderColors = colors.map((color) => `border-[${color}]`);

  const onSubmit: SubmitHandler<FighterForm> = (data) => {
    console.log("Form submitted:", data);
  };

  function handleToggle(accordion: "moves") {
    if (activeAccordion === accordion) setActiveAccordion(null);
    else setActiveAccordion(accordion);
  }

  return (
    <main className="grow flex flex-col gap-y-4 mt-4">
      <div className="flex flex-col gap-y-3 px-4">
        <h1 className="text-primaryFontSize font-bold">Create a Fighter</h1>
        {/* Stepper component */}
        <div>
          <div className="flex justify-between items-center">
            <button
              className="block px-2 py-1 border bg-white rounded-md"
              onClick={() => setStep((prev) => prev - 1)}
            >
              {isFirstStep ? "Cancel" : "Back"}
            </button>
            <h2>{wizardSteps[step].title}</h2>
            <button
              className="block px-2 py-1 border bg-white rounded-md"
              onClick={() =>
                isLastStep
                  ? formRef.current?.requestSubmit()
                  : setStep((prev) => prev + 1)
              }
            >
              {isLastStep ? "Submit" : "Forth"}
            </button>
          </div>
          <div className="flex gap-x-0.5 mt-1 rounded-full overflow-clip">
            {wizardSteps.map((item, index) => (
              <div
                key={item.title}
                className={`grow h-1.5${
                  index <= step
                    ? " " + bgColors[index]
                    : ` border ${borderColors[index]}`
                }`}
              />
            ))}
          </div>
        </div>
        {/* Form inputs */}
        <form
          ref={formRef}
          className="flex flex-col gap-y-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          {wizardSteps.map((wizardStep, i) => {
            if (step === 0 && step === i)
              return (
                <FormStepRender
                  key={wizardStep.title}
                  step={wizardSteps[step]}
                  register={register}
                />
              );
            else if (step === 1 && step === i)
              return (
                <FormStepRender
                  key={wizardStep.title}
                  step={wizardSteps[step]}
                  register={register}
                />
              );
            else if (step === 2 && step === i)
              return (
                <FormStepRender
                  key={wizardStep.title}
                  step={wizardSteps[step]}
                  register={register}
                  perks={watchPerks}
                />
              );
            else if (step === 3 && step === i)
              return (
                <FormStepRender
                  key={wizardStep.title}
                  step={wizardSteps[step]}
                  register={register}
                />
              );
            else if (step === 4 && step === i)
              return (
                <FormStepRender
                  key={wizardStep.title}
                  step={wizardSteps[step]}
                  register={register}
                />
              );
            else if (step === 5 && step === i)
              return (
                <FormStepRender
                  key={wizardStep.title}
                  step={wizardSteps[step]}
                  register={register}
                />
              );
            else if (step === 6 && step === i)
              return (
                <FormStepRender
                  key={wizardStep.title}
                  step={wizardSteps[step]}
                  register={register}
                />
              );
          })}
        </form>
      </div>
      {step === wizardSteps.length - 1 && (
        <div className="border mx-4 rounded-lg overflow-hidden">
          <MoveAccordion
            moves={watchMoves}
            isActive={activeAccordion}
            handleToggle={() => handleToggle("moves")}
          />
        </div>
      )}
    </main>
  );
};

export default NewFighter;
