import standard from "@/standard";
import { FighterForm } from "@/types/component";
import { WizardStep } from "@/types/form";
import { MAX_PERKS } from "@shared/limits";
import { Fragment } from "react";
import { FieldErrors, UseFormRegister, get } from "react-hook-form";

type FormStepRenderProps = {
  step: WizardStep<FighterForm>;
  register: UseFormRegister<FighterForm>;
  errors: FieldErrors<FighterForm>;
  perks: string[];
  // Option values to leave out of grouped selects: the moves already added
  hiddenOptions: string[];
};

function FormStepRender({
  step,
  register,
  errors,
  perks,
  hiddenOptions,
}: FormStepRenderProps) {
  const perkColor = (perkName: string | undefined) => {
    const perk = standard.perks.find((p) => p.name === perkName);
    if (perk?.type === "Stand-Up") return " bg-standup";
    else if (perk?.type === "Grappling") return " bg-grappling";
    else if (perk?.type === "Health & Stamina") return " bg-health";
    return "border";
  };

  return step.inputs.map((input) => {
    const fieldPath = input.id;
    const error = get(errors, fieldPath)?.message;
    const errorJSX = error && (
      <p className="text-right text-tertiaryFontSize text-red-600">{error}</p>
    );
    const isStat =
      input.id.includes("standUp") ||
      input.id.includes("grappling") ||
      input.id.includes("health");
    return input.type === "multi-select" ? (
      <Fragment key={fieldPath}>
        <select {...register(fieldPath, input.rules)} multiple size={10}>
          {input.groups.map((group) => (
            <optgroup key={group.name} label={group.name}>
              {group.options.map((option) => (
                <option
                  key={option}
                  value={option}
                  disabled={
                    perks.length >= MAX_PERKS && !perks.includes(option)
                  }
                >
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="flex justify-center gap-x-1">
          {Array.from({ length: MAX_PERKS }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 w-5 rounded-full ${perkColor(perks[i])}`}
            />
          ))}
        </div>
        {errorJSX}
      </Fragment>
    ) : (
      <Fragment key={fieldPath}>
        <div className="flex justify-between">
          <label htmlFor={fieldPath}>{input.label}:</label>
          {input.type === "select" ? (
            <select {...register(fieldPath, input.rules)} id={fieldPath}>
              <option
                value={
                  fieldPath === "basicInfo.level" || fieldPath === "move.level" || isStat
                    ? 0
                    : ""
                }
              >
                -- Select a {isStat ? "Level" : input.label} --
              </option>
              {input.groups
                ? input.groups.map((group) => {
                    const options = group.options.filter(
                      (option) =>
                        typeof option === "string" ||
                        !hiddenOptions.includes(option.value)
                    );
                    return (
                      options.length > 0 && (
                        <optgroup key={group.name} label={group.name}>
                          {options.map((option) => {
                            if (typeof option === "string") {
                              return <option key={option} value={option} />;
                            }
                            return (
                              <option key={option.option} value={option.value}>
                                {option.option}
                              </option>
                            );
                          })}
                        </optgroup>
                      )
                    );
                  })
                : input.options?.map((option) => {
                    if (typeof option === "string") {
                      return (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      );
                    }
                    return (
                      <option key={option.value} value={option.value}>
                        {option.option}
                      </option>
                    );
                  })}
            </select>
          ) : (
            <input
              {...register(fieldPath, input.rules)}
              id={fieldPath}
              min="0"
              type={input.type}
              placeholder={input.label}
              className="ps-1"
            />
          )}
        </div>
        {errorJSX}
      </Fragment>
    );
  });
}

export default FormStepRender;
