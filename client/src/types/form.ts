import { FighterForm } from "@/types/component";
import { FieldPath, FieldValues, RegisterOptions } from "react-hook-form";

interface FieldBase<T> {
  id: T;
  label: string;
  rules?: RegisterOptions<FighterForm>;
}

interface LabelledOption {
  value: string;
  option: string;
}

interface MoveOptionGroups {
  name: string;
  options: LabelledOption[];
}

interface OptionGroups {
  name: string;
  options: readonly string[];
}

interface Field<T> extends FieldBase<T> {
  type: "text" | "number";
}

interface SelectField<T> extends FieldBase<T> {
  type: "select";
  options?: readonly (string | LabelledOption)[];
  groups?: OptionGroups[] | MoveOptionGroups[];
}

interface MultiSelectField<T> extends FieldBase<T> {
  type: "multi-select";
  groups: OptionGroups[];
}

type FormItem<T> = Field<T> | SelectField<T> | MultiSelectField<T>;

export interface WizardStep<T extends FieldValues> {
  title: string;
  inputs: FormItem<FieldPath<T>>[];
  // Shows a select that sets every input in the step: the `.level` one to the
  // estimated level, the others to the chosen stat
  bulkStats?: boolean;
}
