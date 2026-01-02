import FormStepRender from "@/components/FormStepRender";
import MoveAccordion from "@/components/MoveAccordion";
import { wizardSteps } from "@/config/formConfig";
import { createFighterForm } from "@/mapper/createFighterForm";
import { apiClient } from "@/service/apiClient";
import standard from "@/standard";
import { FighterForm } from "@/types/component";
import { Fighter } from "@shared/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { FieldPath, SubmitHandler, useForm } from "react-hook-form";

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
  } = useForm<FighterForm>({ defaultValues: createFighterForm(fighter) });
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
    const { move, generalInfo, basicInfo, perks, ...fighterForm } = data;
    const newPerks = standard.perks.filter((perk) => perks.includes(perk.name));
    const newFighter: Omit<Fighter, "_id"> = {
      ...generalInfo,
      perks: newPerks,
      basic: basicInfo,
      ...fighterForm,
    };
    try {
      // useMutation could be used here
      let fighterId;
      if (fighter) {
        fighterId = await apiClient.put<Fighter["_id"]>(
          `/fighters/${fighter._id}`,
          newFighter
        );
        queryClient.invalidateQueries({ queryKey: ["fighter", fighterId.toString()] });
      } else {
        fighterId = await apiClient.post<Fighter["_id"]>(
          "/fighters",
          newFighter
        );
      }
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
