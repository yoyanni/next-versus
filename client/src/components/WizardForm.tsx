import FormStepRender from "@/components/FormStepRender";
import MoveAccordion from "@/components/MoveAccordion";
import { wizardSteps } from "@/config/formConfig";
import { apiClient } from "@/service/apiClient";
import standard from "@/standard";
import { FighterForm } from "@/types/component";
import { Fighter } from "@shared/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FieldPath, SubmitHandler, useForm } from "react-hook-form";

const initialState = (fighter?: Fighter): FighterForm => {
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
    const { punches, kicks, clinch, takedowns, ground, submissions, combos } =
      moves;
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

interface WizardFormProps {
  fighter?: Fighter;
}

const WizardForm = ({ fighter }: WizardFormProps) => {
  const [step, setStep] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<"moves" | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FighterForm>({ defaultValues: initialState(fighter) });
  const move = watch("move");
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

  const onSubmit: SubmitHandler<FighterForm> = async (data) => {
    const { move, generalInfo, basicInfo, perks, ...fighter } = data;
    const newPerks = standard.perks.filter((perk) => perks.includes(perk.name));
    const newFighter: Omit<Fighter, "_id"> = {
      ...generalInfo,
      perks: newPerks,
      basic: basicInfo,
      ...fighter,
    };
    try {
      // useMutation could be used here
      const fighterId = await apiClient.post<Fighter["_id"]>(
        "/fighters",
        newFighter
      );
      queryClient.invalidateQueries({ queryKey: ["fighters"] });
      router.push(`/fighters/${fighterId}`);
    } catch (error) {
      // Toast could be used here
      console.error("Error creating fighter:", error);
    }
  };

  function handleToggle(accordion: "moves") {
    if (activeAccordion === accordion) setActiveAccordion(null);
    else setActiveAccordion(accordion);
  }

  const handleMoveAddition = () => {
    const [path, moveName] = move.name.split(":");
    const fieldPath = ("moves." + path) as FieldPath<
      Pick<FighterForm, "moves">
    >;

    const newMove = {
      name: moveName,
      level: move.level,
    };

    const currentMoves = getValues(fieldPath);

    if (Array.isArray(currentMoves)) {
      setValue(fieldPath, [...currentMoves, newMove]);
    }
  };

  return (
    <main className="grow flex flex-col gap-y-4 mt-4">
      <div className="flex flex-col gap-y-3 px-4">
        <h1 className="text-primaryFontSize font-bold">Create a Fighter</h1>
        {/* Stepper component */}
        <div>
          <div className="flex justify-between items-center">
            <button
              className="block px-2 py-1 border bg-white rounded-md"
              onClick={() =>
                isFirstStep ? router.back() : setStep((prev) => prev - 1)
              }
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
        <>
          <button
            onClick={handleMoveAddition}
            className="self-end mr-4 px-2 py-1 border bg-white rounded-md"
          >
            Add move
          </button>
          <div className="border mx-4 rounded-lg overflow-hidden">
            <MoveAccordion
              moves={watchMoves}
              isActive={activeAccordion}
              handleToggle={() => handleToggle("moves")}
            />
          </div>
        </>
      )}
    </main>
  );
};

export default WizardForm;
