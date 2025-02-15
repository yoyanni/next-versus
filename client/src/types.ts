import { ReactNode } from "react";
import { Basic, Grappling, Health, StandUp, Fighter, Perk } from "../../types";

interface StandardStat<T> {
  name: string;
  propName: keyof T;
}

export interface Standards {
  weightClasses: string[];
  basic: StandardStat<Basic>[];
  standUp: StandardStat<StandUp>[];
  grappling: StandardStat<Grappling>[];
  health: StandardStat<Health>[];
}

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
