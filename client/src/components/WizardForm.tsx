import BulkStatSelect from "@/components/BulkStatSelect";
import FormStepRender from "@/components/FormStepRender";
import MoveAccordion from "@/components/MoveAccordion";
import { COMMON_MOVE_LEVEL, commonMoves } from "@/config/commonMoves";
import { wizardSteps } from "@/config/formConfig";
import { createFighterForm } from "@/mapper/createFighterForm";
import { apiClient } from "@/service/apiClient";
import standard from "@/standard";
import { FighterForm } from "@/types/component";
import { levelForStat } from "@/utils/levelForStat";
import { Fighter } from "@shared/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { FieldPath, SubmitHandler, useForm } from "react-hook-form";

interface WizardFormProps {
  fighter?: Fighter;
}

const WizardForm = ({ fighter }: WizardFormProps) => {
  const [step, setStep] = useState(0);
  const [openMoveGroups, setOpenMoveGroups] = useState<string[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FighterForm>({
    defaultValues: createFighterForm(fighter),
    // Validate as fields change, so an error shown by "Forth" clears once it's fixed
    mode: "onChange",
  });
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
        queryClient.invalidateQueries({
          queryKey: ["fighter", fighterId.toString()],
        });
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
      if (fighter) {
        console.error("Error updating fighter:", error);
      } else console.error("Error creating fighter:", error);
    }
  };

  // Only the current step's fields are mounted, and handleSubmit skips unmounted ones,
  // so each step is validated here before the next one opens
  const goForth = async () => {
    const fieldPaths = wizardSteps[step].inputs.map((input) => input.id);
    if (await trigger(fieldPaths, { shouldFocus: true }))
      setStep((prev) => prev + 1);
  };

  // Sets every stat in the step to the chosen value, and its level to the estimate.
  // shouldValidate clears errors that "Forth" showed for the empty selects.
  const handleBulkStat = (stat: number) =>
    wizardSteps[step].inputs.forEach(({ id }) =>
      setValue(id, id.endsWith(".level") ? levelForStat(stat) : stat, {
        shouldValidate: true,
      })
    );

  // Move select values are "<path>:<name>" (e.g. "ground.sweeps:BJJ"); path picks the moves.* array
  const getMoves = (path: string) => {
    const fieldPath = ("moves." + path) as FieldPath<
      Pick<FighterForm, "moves">
    >;
    const currentMoves = getValues(fieldPath);
    return {
      fieldPath,
      currentMoves: Array.isArray(currentMoves) ? currentMoves : [],
    };
  };

  // The select values of the moves already added, which the move select leaves out
  const addedMoveValues = Object.entries(watchMoves).flatMap(([key, value]) =>
    Array.isArray(value)
      ? value.map((added) => `${key}:${added.name}`)
      : Object.entries(value).flatMap(([groundKey, groundMoves]) =>
          groundMoves.map((added) => `${key}.${groundKey}:${added.name}`)
        )
  );

  const [movePath, moveName] = move.name.split(":");
  const canAddMove = !!move.name && !!move.level;

  const handleMoveAddition = () => {
    const { fieldPath, currentMoves } = getMoves(movePath);
    setValue(fieldPath, [
      ...currentMoves,
      { name: moveName, level: move.level },
    ]);
    // The added move leaves the select, so both selects go back to their placeholders
    setValue("move.name", "");
    setValue("move.level", 0);
    // Open the accordion the move went into ("ground.sweeps" sits inside "ground")
    const groups = movePath.startsWith("ground.")
      ? ["ground", movePath]
      : [movePath];
    setOpenMoveGroups((prev) =>
      prev.concat(groups.filter((group) => !prev.includes(group)))
    );
  };

  const commonMoveCount = commonMoves.reduce(
    (count, { names }) => count + names.length,
    0
  );
  const hasAllCommonMoves = commonMoves.every(({ path, names }) =>
    names.every((name) => addedMoveValues.includes(`${path}:${name}`))
  );

  // Adds the common moves that are missing, at COMMON_MOVE_LEVEL, leaving the
  // ones already added at their level. Once all are added, removes them all.
  const handleCommonMovesToggle = () => {
    commonMoves.forEach(({ path, names }) => {
      const { fieldPath, currentMoves } = getMoves(path);
      setValue(
        fieldPath,
        hasAllCommonMoves
          ? currentMoves.filter((added) => !names.includes(added.name))
          : [
              ...currentMoves,
              ...names
                .filter((name) => !currentMoves.some((m) => m.name === name))
                .map((name) => ({ name, level: COMMON_MOVE_LEVEL })),
            ]
      );
    });
    // A selected move that was just added leaves the select, like in handleMoveAddition
    if (
      !hasAllCommonMoves &&
      commonMoves.some(
        ({ path, names }) => path === movePath && names.includes(moveName)
      )
    )
      setValue("move.name", "");
  };

  const handleMoveGroupToggle = (group: string) =>
    setOpenMoveGroups((prev) =>
      prev.includes(group)
        ? prev.filter((open) => open !== group)
        : [...prev, group]
    );

  const handleMoveLevelChange = (path: string, name: string, level: number) => {
    const { fieldPath, currentMoves } = getMoves(path);
    setValue(
      fieldPath,
      currentMoves.map((added) =>
        added.name === name ? { ...added, level } : added
      )
    );
  };

  const handleMoveRemoval = (path: string, name: string) => {
    const { fieldPath, currentMoves } = getMoves(path);
    setValue(
      fieldPath,
      currentMoves.filter((added) => added.name !== name)
    );
  };

  return (
    <main className="grow flex flex-col gap-y-4 w-full mx-auto mt-4 tablet:max-w-xl">
      <div className="flex flex-col gap-y-3 px-4">
        <h1 className="text-primaryFontSize font-bold">
          {fighter ? "Edit Fighter" : "Create a Fighter"}
        </h1>
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
                isLastStep ? handleSubmit(onSubmit)() : goForth()
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
          className="flex flex-col gap-y-1"
          onSubmit={(event) => {
            // Enter in a field would submit the form; only the Forth/Submit button moves on
            event.preventDefault();
          }}
        >
          {wizardSteps[step].bulkStats && (
            <BulkStatSelect onSelect={handleBulkStat} />
          )}
          <FormStepRender
            key={wizardSteps[step].title}
            step={wizardSteps[step]}
            register={register}
            errors={errors}
            perks={watchPerks}
            hiddenOptions={addedMoveValues}
          />
        </form>
      </div>

      {step === wizardSteps.length - 1 && (
        <>
          <div>
            <div className="flex justify-between mx-4">
              <button
                onClick={handleCommonMovesToggle}
                className="px-2 py-1 border bg-white rounded-md"
              >
                {hasAllCommonMoves ? "Remove common moves" : "Add common moves"}
              </button>
              <button
                onClick={handleMoveAddition}
                disabled={!canAddMove}
                className="px-2 py-1 border bg-white rounded-md disabled:opacity-50"
              >
                Add move
              </button>
            </div>
            <p className="mx-4 mt-1 text-tertiaryFontSize text-secondaryDarkFontColor">
              Common moves are the {commonMoveCount} moves that at least 90% of
              fighters have. They&apos;re added at level {COMMON_MOVE_LEVEL}.
            </p>
          </div>
          <div className="border mx-4 rounded-lg overflow-hidden">
            <MoveAccordion
              moves={watchMoves}
              editing={{
                openGroups: openMoveGroups,
                onToggleGroup: handleMoveGroupToggle,
                onLevelChange: handleMoveLevelChange,
                onRemove: handleMoveRemoval,
              }}
            />
          </div>
        </>
      )}
    </main>
  );
};

export default WizardForm;
