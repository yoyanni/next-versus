import MoveAccordion from "@/components/MoveAccordion";
import standard from "@/standard";
import { Fighter } from "@shared/types";
import React, { Fragment, useState } from "react";

interface Input {
  type: "text" | "number";
  id: string;
  label: string;
}
interface SelectInput extends Omit<Input, "type"> {
  type: "select";
  options?: string[];
  groups?: OptionGroups[];
}
interface MultiSelectInput extends Omit<Input, "type"> {
  type: "multi-select";
  groups: OptionGroups[];
}

interface OptionGroups {
  name: string;
  options: any[];
}

interface FormItem {
  title: string;
  inputs: (Input | SelectInput | MultiSelectInput)[];
}

// TODO: Options need to be refactored
const form: FormItem[] = [
  {
    title: "General Info",
    inputs: [
      { type: "text", id: "firstName", label: "First name" },
      { type: "text", id: "lastName", label: "Last name" },
      { type: "text", id: "nickName", label: "Nickname" },
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
  },
  {
    title: "Basic Info",
    inputs: [
      { type: "number", id: "reach", label: "Reach" },
      {
        type: "select",
        id: "martialArts",
        label: "Martial Arts",
        options: [...standard.martialArts],
      },
      {
        type: "select",
        id: "stance",
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
  },
  {
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
            options: standard.perks.filter(
              (p) => p.type === "Health & Stamina"
            ),
          },
        ],
      },
    ],
  },
  {
    title: "Stand-Up",
    inputs: standard.standUp.map((item) => ({
      type: "number",
      id: item.propName,
      label: item.name,
    })),
  },
  {
    title: "Grappling",
    inputs: standard.grappling.map((item) => ({
      type: "number",
      id: item.propName,
      label: item.name,
    })),
  },
  {
    title: "Health",
    inputs: standard.health.map((item) => ({
      type: "number",
      id: item.propName,
      label: item.name,
    })),
  },
  {
    title: "Moves",
    inputs: [
      {
        type: "select", // probs needs refactoring
        id: "move",
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
  },
];

const initialState = {
  generalInfo: {},
  basicInfo: {},
  perks: [] as any[],
  standUp: {},
  grappling: {},
  health: {},
  moves: { ground: {} },
};

const NewFighter = () => {
  const [step, setStep] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<"moves" | null>(null);
  const [formData, setFormData] = useState(initialState);
  const isFirstStep = step === 0;
  const isLastStep = step === form.length - 1;

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
  // const perkColor = (perkIndex: number) => {
  //   const perkType = formData.perks[perkIndex]?.type;
  //   if (perkType === "Stand-Up") return " bg-standup";
  //   if (perkType === "Grappling") return " bg-grappling";
  //   if (perkType === "Health & Stamina") return " bg-health";
  //   return "";
  // };

  // const handleChange = (e) => {
  //   const selectedPerk = standard.perks.find(
  //     (perk) => perk.name === e.target.value
  //   );
  //   console.log(e);
  //   if (!selectedPerk) return;
  //   setFormData({ ...formData, perks: [...formData.perks, selectedPerk] });
  // };

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
            <h2>{form[step].title}</h2>
            <button
              className="block px-2 py-1 border bg-white rounded-md"
              onClick={() => setStep((prev) => prev + 1)}
            >
              {isLastStep ? "Submit" : "Forth"}
            </button>
          </div>
          <div className="flex gap-x-0.5 mt-1 rounded-full overflow-clip">
            {form.map((item, index) => (
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
        <section className="flex flex-col gap-y-1">
          {form[step].inputs.map((formItem) =>
            formItem.type === "multi-select" ? (
              <Fragment key={formItem.id}>
                <select
                  multiple
                  id={formItem.id}
                  name={formItem.label}
                  size={10}
                  // onChange={handleChange}
                >
                  {formItem.groups.map((group) => (
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
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      // className={`h-1.5 w-5 rounded-full${perkColor(i)}`}
                      className={`h-1.5 w-5 rounded-full border`}
                    />
                  ))}
                </div>
              </Fragment>
            ) : (
              <Fragment key={formItem.id}>
                <div className="flex justify-between">
                  <label htmlFor={formItem.id}>{formItem.label}:</label>
                  {formItem.type === "select" ? (
                    <select id={formItem.id} name={formItem.label}>
                      {formItem.groups
                        ? formItem.groups.map((group) => (
                            <optgroup key={group.name} label={group.name}>
                              {group.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </optgroup>
                          ))
                        : formItem.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                  ) : (
                    <input
                      id={formItem.id}
                      min="0"
                      onChange={(e) => console.log(e)}
                      type={formItem.type}
                      placeholder={formItem.label}
                      className="ps-1"
                    />
                  )}
                </div>
              </Fragment>
            )
          )}
        </section>
      </div>
      {step === form.length - 1 && (
        <div className="border mx-4 rounded-lg overflow-hidden">
          <MoveAccordion
            moves={formData.moves as Fighter["moves"]}
            isActive={activeAccordion}
            handleToggle={() => handleToggle("moves")}
          />
        </div>
      )}
    </main>
  );
};

export default NewFighter;
