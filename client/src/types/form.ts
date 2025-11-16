import { FieldPath, FieldValues } from "react-hook-form";

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
