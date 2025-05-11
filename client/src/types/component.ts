import { ReactNode } from "react";
import { Fighter, Perk } from "../../../types";

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
  changeWeightClass: (id: number) => void;
}

export interface StatsProps {
  name: string;
  redSkills: string | number;
  blueSkills: string | number;
}
