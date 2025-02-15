import { Basic, Grappling, Health, StandUp } from "../../../types";

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
