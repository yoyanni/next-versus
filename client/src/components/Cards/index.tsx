import standard from "@/standard";
import { CardsProps } from "@/types";
import PerkCard from "./PerkCard";
import StatCardWrapper from "./StatCardWrapper";
import { Fragment } from "react";

const Cards = ({ red, blue }: CardsProps) => {
  return (
    <Fragment>
      <StatCardWrapper
        title="Fighter Info"
        redLevel={red.basic.level}
        blueLevel={blue.basic.level}
      >
        {standard.basic.map(({ name, propName }) => {
          return (
            <div key={name}>
              <h3>
                <span>{name}</span>
              </h3>
              <div>
                <div>{red.basic.skills[propName]}</div>
                <div>{blue.basic.skills[propName]}</div>
              </div>
            </div>
          );
        })}
      </StatCardWrapper>
      <PerkCard title="Perks" red={red.perks} blue={blue.perks} />
      <StatCardWrapper
        title="Stand-Up"
        redLevel={red.standUp.level}
        blueLevel={blue.standUp.level}
      >
        {standard.standUp.map(({ name, propName }) => {
          return (
            <div key={name}>
              <h3>
                <span>{name}</span>
              </h3>
              <div>
                <div>{red.standUp.skills[propName]}</div>
                <div>{blue.standUp.skills[propName]}</div>
              </div>
            </div>
          );
        })}
      </StatCardWrapper>
      <StatCardWrapper
        title="Grappling"
        redLevel={red.grappling.level}
        blueLevel={blue.grappling.level}
      >
        {standard.grappling.map(({ name, propName }) => {
          return (
            <div key={name}>
              <h3>
                <span>{name}</span>
              </h3>
              <div>
                <div>{red.grappling.skills[propName]}</div>
                <div>{blue.grappling.skills[propName]}</div>
              </div>
            </div>
          );
        })}
      </StatCardWrapper>
      <StatCardWrapper
        title="Health"
        redLevel={red.health.level}
        blueLevel={blue.health.level}
      >
        {standard.health.map(({ name, propName }) => {
          return (
            <div key={name}>
              <h3>
                <span>{name}</span>
              </h3>
              <div>
                <div>{red.health.skills[propName]}</div>
                <div>{blue.health.skills[propName]}</div>
              </div>
            </div>
          );
        })}
      </StatCardWrapper>
      <hr />
    </Fragment>
  );
};

export default Cards;
