import FormStepRender from "@/components/FormStepRender";
import MoveAccordion from "@/components/MoveAccordion";
import { wizardSteps } from "@/forms/wizardForm";
import { FighterForm } from "@/types/component";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const initialState = {
  generalInfo: {},
  basicInfo: {},
  perks: [],
  standUp: {},
  grappling: {},
  health: {},
  moves: { ground: {} },
};

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
