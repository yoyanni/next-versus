import Accordion from "@/components/Accordion";
import ChildAccordion from "@/components/ChildAccordion";
import LinkButton from "@/components/LinkButton";
import MoveAccordion from "@/components/MoveAccordion";
import { useFighter } from "@/hooks/useFighter";
import standard from "@/standard";
import { ActiveAccordion } from "@/types/component";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Fighter() {
  const router = useRouter();
  const { data: fighter } = useFighter(router.query.id);
  const [activeAccordion, setActiveAccordion] =
    useState<ActiveAccordion | null>(null);

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
        {standard.statKeys.map((statGroup) => (
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
      <MoveAccordion
        moves={fighter.moves}
        isActive={activeAccordion}
        handleToggle={() => handleToggle("moves")}
      />
      <LinkButton href={`/fighters/${fighter._id}/edit`} title="Edit Fighter" />
    </main>
  );
}
