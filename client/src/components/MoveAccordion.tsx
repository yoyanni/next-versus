import React from "react";
import Accordion from "./Accordion";
import ChildAccordion from "./ChildAccordion";
import { ActiveAccordion } from "@/types/component";
import standard from "@/standard";
import { Fighter } from "@shared/types";

interface MoveAccordionProps {
  moves: Fighter["moves"];
  isActive: ActiveAccordion | null;
  handleToggle: () => void;
}

const MoveAccordion = ({
  moves,
  isActive,
  handleToggle,
}: MoveAccordionProps) => {
  return (
    <Accordion
      noShadow
      title="Moves"
      activeAccordion={isActive}
      handleToggle={handleToggle}
    >
      {standard.moveKeys.map((moveGroup) => {
        let movesJSX;
        if (moveGroup.key === "ground") {
          movesJSX = (
            <ChildAccordion key={moveGroup.key} noShadow title="Ground">
              {standard.groundKeys.map((groundGroup) => (
                <ChildAccordion
                  key={groundGroup.key}
                  title={groundGroup.title}
                  indentation="ps-10"
                >
                  {moves.ground[groundGroup.key]?.map((move) => {
                    return (
                      <div
                        key={move.name}
                        className="flex justify-between ps-8 pe-4 odd:bg-mainBgElevated border-b"
                      >
                        <span>{move.name}</span>
                        <span>{move.level}</span>
                      </div>
                    );
                  })}
                </ChildAccordion>
              ))}
            </ChildAccordion>
          );
        } else {
          movesJSX = (
            <ChildAccordion key={moveGroup.key} title={moveGroup.title}>
              {moves[moveGroup.key]?.map((move) => {
                return (
                  <div
                    key={move.name}
                    className="flex justify-between ps-8 pe-4 odd:bg-mainBgElevated border-b"
                  >
                    <span>{move.name}</span>
                    <span>{move.level}</span>
                  </div>
                );
              })}
            </ChildAccordion>
          );
        }
        return movesJSX;
      })}
    </Accordion>
  );
};

export default MoveAccordion;
