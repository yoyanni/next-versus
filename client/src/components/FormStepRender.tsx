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
  const perkColor = (perkName: string) => {
    const perk = standard.perks.find((p) => p.name === perkName);
    if (perk?.type === "Stand-Up") return " bg-standup";
    else if (perk?.type === "Grappling") return " bg-grappling";
    else if (perk?.type === "Health & Stamina") return " bg-health";
    return "";
  };

  return step.inputs.map((input) => {
    const fieldPath = input.id as FieldPath<FighterForm>;
    return input.type === "multi-select" ? (
      <Fragment key={fieldPath}>
        <select {...register(fieldPath)} multiple size={10}>
          {input.groups.map((group) => (
            <optgroup key={group.name} label={group.name}>
              {group.options.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="flex justify-center gap-x-1">
          {perks?.map((perk) => (
            <div
              key={perk}
              className={`h-1.5 w-5 rounded-full border${perkColor(perk)}`}
            />
          ))}
        </div>
      </Fragment>
    ) : (
      <Fragment key={fieldPath}>
        <div className="flex justify-between">
          <label htmlFor={fieldPath}>{input.label}:</label>
          {input.type === "select" ? (
            <select {...register(fieldPath)} id={fieldPath} name={input.label}>
              {input.groups
                ? input.groups.map((group) => (
                    <optgroup key={group.name} label={group.name}>
                      {group.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </optgroup>
                  ))
                : input.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
            </select>
          ) : (
            <input
              {...register(fieldPath)}
              id={fieldPath}
              min="0"
              onChange={(e) => console.log(e)}
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
