import React from "react";
import ChildAccordion from "./ChildAccordion";
import standard from "@/standard";
import { Fighter, Move } from "@shared/types";
import { IoClose } from "react-icons/io5";

// Passed by the wizard. Groups and paths are moves.* paths, e.g. "kicks", "ground" or "ground.sweeps"
export interface MoveEditing {
  openGroups: string[];
  onToggleGroup: (group: string) => void;
  onLevelChange: (path: string, name: string, level: number) => void;
  onRemove: (path: string, name: string) => void;
}

interface MoveAccordionProps {
  moves: Fighter["moves"];
  // True when the groups sit inside another accordion, as in the fighter page's Moves
  nested?: boolean;
  editing?: MoveEditing;
}

const MoveAccordion = ({
  moves,
  nested = false,
  editing,
}: MoveAccordionProps) => {
  // Nesting moves every level 3 further in. A row starts 1 in from its group's title
  const padding = nested
    ? ({
        group: "ps-7",
        subgroup: "ps-10",
        row: "ps-8",
        subgroupRow: "ps-11",
      } as const)
    : ({
        group: "ps-4",
        subgroup: "ps-7",
        row: "ps-5",
        subgroupRow: "ps-8",
      } as const);

  // Without `editing`, each group opens and closes on its own
  const groupState = (group: string) =>
    editing && {
      isOpen: editing.openGroups.includes(group),
      onToggle: () => editing.onToggleGroup(group),
    };

  const moveRows = (
    moveList: Move[] | undefined,
    path: string,
    rowPadding: string
  ) =>
    moveList?.map((move) => (
      <div
        key={move.name}
        className={`flex justify-between ${rowPadding} pe-4 odd:bg-mainBgElevated border-b`}
      >
        <span>{move.name}</span>
        {editing ? (
          <span className="flex items-center gap-x-2">
            <select
              aria-label={`Level of ${move.name}`}
              className="bg-transparent"
              value={move.level}
              onChange={(event) =>
                editing.onLevelChange(
                  path,
                  move.name,
                  Number(event.target.value)
                )
              }
            >
              {standard.moveLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label={`Remove ${move.name}`}
              onClick={() => editing.onRemove(path, move.name)}
            >
              <IoClose />
            </button>
          </span>
        ) : (
          <span>{move.level}</span>
        )}
      </div>
    ));

  return (
    <>
      {standard.moveKeys.map((moveGroup) => {
        let movesJSX;
        if (moveGroup.key === "ground") {
          movesJSX = (
            <ChildAccordion
              key={moveGroup.key}
              noShadow
              title="Ground"
              indentation={padding.group}
              {...groupState(moveGroup.key)}
            >
              {standard.groundKeys.map((groundGroup) => (
                <ChildAccordion
                  key={groundGroup.key}
                  title={groundGroup.title}
                  indentation={padding.subgroup}
                  {...groupState(`ground.${groundGroup.key}`)}
                >
                  {moveRows(
                    moves?.ground[groundGroup.key],
                    `ground.${groundGroup.key}`,
                    padding.subgroupRow
                  )}
                </ChildAccordion>
              ))}
            </ChildAccordion>
          );
        } else {
          movesJSX = (
            <ChildAccordion
              key={moveGroup.key}
              title={moveGroup.title}
              indentation={padding.group}
              {...groupState(moveGroup.key)}
            >
              {moveRows(moves?.[moveGroup.key], moveGroup.key, padding.row)}
            </ChildAccordion>
          );
        }
        return movesJSX;
      })}
    </>
  );
};

export default MoveAccordion;
