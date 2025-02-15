import standard from "@/standard";
import PerkCard from "./PerkCard";
import StatCardWrapper from "./StatCardWrapper";
import Stats from "./Stats";

import type { CardsProps } from "@/types/component";

const Cards = ({ red, blue }: CardsProps) => {
  return (
    <div className="flex flex-col gap-8 mt-8">
      <StatCardWrapper
        title="Fighter Info"
        redLevel={red.basic.level}
        blueLevel={blue.basic.level}
      >
        {standard.basic.map(({ name, propName }) => (
          <Stats
            key={name}
            name={name}
            redSkills={red.basic.skills[propName]}
            blueSkills={blue.basic.skills[propName]}
          />
        ))}
      </StatCardWrapper>
      <PerkCard title="Perks" red={red.perks} blue={blue.perks} />
      <StatCardWrapper
        title="Stand-Up"
        redLevel={red.standUp.level}
        blueLevel={blue.standUp.level}
      >
        {standard.standUp.map(({ name, propName }) => (
          <Stats
            key={name}
            name={name}
            redSkills={red.standUp.skills[propName]}
            blueSkills={blue.standUp.skills[propName]}
          />
        ))}
      </StatCardWrapper>
      <StatCardWrapper
        title="Grappling"
        redLevel={red.grappling.level}
        blueLevel={blue.grappling.level}
      >
        {standard.grappling.map(({ name, propName }) => (
          <Stats
            key={name}
            name={name}
            redSkills={red.grappling.skills[propName]}
            blueSkills={blue.grappling.skills[propName]}
          />
        ))}
      </StatCardWrapper>
      <StatCardWrapper
        title="Health"
        redLevel={red.health.level}
        blueLevel={blue.health.level}
      >
        {standard.health.map(({ name, propName }) => (
          <Stats
            key={name}
            name={name}
            redSkills={red.health.skills[propName]}
            blueSkills={blue.health.skills[propName]}
          />
        ))}
      </StatCardWrapper>
    </div>
  );
};

export default Cards;
