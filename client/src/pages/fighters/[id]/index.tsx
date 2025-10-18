import Accordion from "@/components/Accordion";
import ChildAccordion from "@/components/ChildAccordion";
import standard from "@/standard";
import { Fighter } from "@shared/types";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const statGroups: {
  title: string;
  key: "standUp" | "grappling" | "health";
}[] = [
  { title: "Stand Up", key: "standUp" },
  { title: "Grappling", key: "grappling" },
  { title: "Health", key: "health" },
];

const moveGroups: {
  title: string;
  key:
    | "punches"
    | "kicks"
    | "clinch"
    | "takedowns"
    | "ground"
    | "submissions"
    | "combos";
}[] = [
  { title: "Punches", key: "punches" },
  { title: "Kicks", key: "kicks" },
  { title: "Clinch", key: "clinch" },
  { title: "Takedowns", key: "takedowns" },
  { title: "Ground", key: "ground" },
  { title: "Submissions", key: "submissions" },
  { title: "Combos", key: "combos" },
];

const groundGroups: {
  title: string;
  key: "getups" | "transitions" | "reversals" | "sweeps" | "strikes";
}[] = [
  { title: "Getups", key: "getups" },
  { title: "Transitions", key: "transitions" },
  { title: "Reversals", key: "reversals" },
  { title: "Sweeps", key: "sweeps" },
  { title: "Strikes", key: "strikes" },
];

export default function Fighters() {
  const [fighter, setFighter] = useState<Fighter | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<
    "moves" | "stats" | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URI + "/fighters/" + router.query.id
        );
        if (!response.ok)
          throw new Error("Issue with fetching fighter from backend.");
        const data = await response.json();
        setFighter(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };
    if (router.query.id) fetchData();
  }, [router.query.id]);

  // When fighters still have not loaded
  if (!fighter) return <main>Loading...</main>;

  function handleToggle(accordion: "moves" | "stats") {
    if (activeAccordion === accordion) setActiveAccordion(null);
    else setActiveAccordion(accordion);
  }

  return (
    <main>
      <div className="p-4">
        <h1 className="text-primaryFontSize font-bold">
          {fighter.firstName} &apos;{fighter.nickname}&apos; {fighter.lastName}
        </h1>
        <div>
          <span className="font-semibold">Rank:</span>{" "}
          <span>#{fighter.rank}</span>
        </div>
        <div>
          <span className="font-bold">Weight Class: </span>
          <span>{fighter.weightClass}</span>
        </div>
        <div>
          <span className="font-bold">Martial Arts: </span>
          <span>{fighter.basic.skills.martialArt}</span>
        </div>
        <div>
          <span className="font-bold">Stance: </span>
          <span>{fighter.basic.skills.stance}</span>
        </div>
        <div>
          <span className="font-bold">Reach: </span>
          <span>{fighter.basic.skills.reach}</span>
        </div>
        <div>
          <span className="font-bold">Level: </span>
          <span>{fighter.basic.level}</span>
        </div>
      </div>
      <Accordion
        noShadow
        title="Stats"
        activeAccordion={activeAccordion}
        handleToggle={() => handleToggle("stats")}
      >
        {statGroups.map((statGroup) => (
          <ChildAccordion key={statGroup.key} title={statGroup.title}>
            {Object.entries(fighter[statGroup.key].skills).map(
              ([skill, level]) => {
                const skillName =
                  standard[statGroup.key].find(
                    (standard) => standard.propName === skill
                  )?.name ?? "Not found";
                return (
                  <div
                    key={skillName}
                    className="flex justify-between ps-8 pe-4 odd:bg-mainBgElevated"
                  >
                    <span>{skillName}</span>
                    <span>{level}</span>
                  </div>
                );
              }
            )}
          </ChildAccordion>
        ))}
      </Accordion>
      <Accordion
        noShadow
        title="Moves"
        activeAccordion={activeAccordion}
        handleToggle={() => handleToggle("moves")}
      >
        {moveGroups.map((moveGroup) => {
          let movesJSX;
          if (moveGroup.key === "ground") {
            movesJSX = (
              <ChildAccordion noShadow title="Ground">
                {groundGroups.map((groundGroup) => (
                  <ChildAccordion
                    key={groundGroup.key}
                    title={groundGroup.title}
                    indentation="ps-10"
                  >
                    {fighter.moves.ground[groundGroup.key].map((move) => {
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
                {fighter.moves[moveGroup.key].map((move) => {
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
    </main>
  );
}
