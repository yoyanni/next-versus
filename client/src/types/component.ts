import { ReactNode } from "react";
import { Fighter, Perk } from "../../../shared/types";

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
  redLevel: number;
  blueLevel: number;
  children: ReactNode;
}

export interface VersebarProps {
  wc: number;
  red: Fighter;
  blue: Fighter;
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
  indentation?: "ps-7" | "ps-10" | "ps-13";
}
