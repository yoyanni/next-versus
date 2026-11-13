import { ReactNode } from "react";
import { Fighter, Move, Perk } from "../../../shared/types";

export type Sides = "red" | "blue";

export interface CardsProps {
  red: Fighter;
  blue: Fighter;
}

export interface PerksProps {
  red: Perk[];
  blue: Perk[];
}

export interface CardWrapperProps {
  title: string;
  // Left out by cards that have no level, such as Perks
  redLevel?: number;
  blueLevel?: number;
  children: ReactNode;
}

export interface VersebarProps {
  placement: "top" | "bottom";
  wc: number;
  red: Fighter | undefined;
  blue: Fighter | undefined;
  wcFighters: Fighter[];
  changeFighter: (id: number, side: Sides) => void;
  changeWeightClass: (id: number) => void;
}

export interface StatsProps {
  name: string;
  redSkills: string | number;
  blueSkills: string | number;
}
export type ActiveAccordion = "moves" | "stats";

export interface AccordionProps {
  children: ReactNode;
  title: string;
  activeAccordion: string | null;
  handleToggle: () => void;
  noShadow?: boolean;
}

export interface ChildAccordionProps {
  children: ReactNode;
  title: string;
  noShadow?: boolean;
  indentation?: "ps-4" | "ps-7" | "ps-10" | "ps-13";
  isOpen?: boolean;
  onToggle?: () => void;
}

export interface FighterForm {
  generalInfo: {
    weightClass: Fighter["weightClass"];
    rank: Fighter["rank"];
    firstName: Fighter["firstName"];
    nickname: Fighter["nickname"];
    lastName: Fighter["lastName"];
  };
  basicInfo: Fighter["basic"];
  perks: string[];
  standUp: Fighter["standUp"];
  grappling: Fighter["grappling"];
  health: Fighter["health"];
  move: Move;
  moves: Fighter["moves"];
}
