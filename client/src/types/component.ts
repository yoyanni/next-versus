import { ReactNode } from "react";
import { Fighter, Perk } from "../../../types";

export interface CardsProps {
  red: Fighter;
  blue: Fighter;
}

export interface PerkCardProps {
  readonly title: "Perks";
  red: Perk[];
  blue: Perk[];
}

export interface StatCardWrapperProps {
  title: string;
  redLevel: number;
  blueLevel: number;
  children: ReactNode;
}

export interface VersebarProps {
  wc: number;
  red: Fighter;
  blue: Fighter;
}

export interface StatsProps {
  name: string;
  redSkills: any;
  blueSkills: any;
}
