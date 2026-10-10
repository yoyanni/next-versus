import standard from "@/standard";
import { FighterForm } from "@/types/component";
import { WizardStep } from "@/types/form";
import { Fragment } from "react";
import { UseFormRegister, FieldPath, FieldValues } from "react-hook-form";

type FormStepRenderProps<T extends FieldValues> = {
  step: WizardStep<T>;
  register: UseFormRegister<FighterForm>;
  perks?: string[];
};

function FormStepRender<T extends object>({
  step,
  register,
  perks,
}: FormStepRenderProps<T>) {
  const perkColor = (perkName: string | undefined) => {
    const perk = standard.perks.find((p) => p.name === perkName);
    if (perk?.type === "Stand-Up") return " bg-standup";
    else if (perk?.type === "Grappling") return " bg-grappling";
    else if (perk?.type === "Health & Stamina") return " bg-health";
    return "border";
  };

  return step.inputs.map((input) => {
    const fieldPath = input.id as FieldPath<FighterForm>;
    const isStat =
      input.id.includes("standUp") ||
      input.id.includes("grappling") ||
      input.id.includes("health");
    return input.type === "multi-select" ? (
      <Fragment key={fieldPath}>
        <select {...register(fieldPath)} multiple size={10}>
          {input.groups.map((group) => (
            <optgroup key={group.name} label={group.name}>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="flex justify-center gap-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-5 rounded-full ${perkColor(perks?.[i])}`}
            />
          ))}
        </div>
      </Fragment>
    ) : (
      <Fragment key={fieldPath}>
        <div className="flex justify-between">
          <label htmlFor={fieldPath}>{input.label}:</label>
          {input.type === "select" ? (
            <select {...register(fieldPath)} id={fieldPath}>
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
                ? input.groups.map((group) => (
                    <optgroup key={group.name} label={group.name}>
                      {group.options.map((option) => {
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
                  ))
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
              {...register(fieldPath)}
              id={fieldPath}
              min="0"
              type={input.type}
              placeholder={input.label}
              className="ps-1"
            />
          )}
        </div>
      </Fragment>
    );
  });
}

export default FormStepRender;
