import Link from "next/link";
import { useState } from "react";

// Internal Import
import standard from "@/standard";
import Accordion from "@/components/Accordion";
import { useFighters } from "@/hooks/useFighters";
import LinkButton from "@/components/LinkButton";

export default function Fighters() {
  const { data: fighters } = useFighters();
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  // standard.weightClasses could be enum
  const weightClasses = [...standard.weightClasses, "Generic"];

  // When fighters still have not loaded
  if (!fighters) return <main>Loading...</main>;

  function handleToggle(accordion: string) {
    if (activeAccordion === accordion) setActiveAccordion(null);
    else setActiveAccordion(accordion);
  }

  const accordions = weightClasses.map((weightClass) => {
    const wcFighters = fighters.filter(
      (fighter) => fighter.weightClass === weightClass
    );
    return (
      <Accordion
        key={weightClass}
        title={weightClass}
        activeAccordion={activeAccordion}
        handleToggle={() => handleToggle(weightClass.toLowerCase())}
      >
        {wcFighters.map((fighter) => (
          <Link
            key={fighter._id}
            href={`/fighters/` + fighter._id}
            className="block px-6 py-1 odd:bg-mainBgElevated"
          >
            {fighter.firstName} {fighter.lastName}
          </Link>
        ))}
      </Accordion>
    );
  });

  return (
    <main className="grow">
      <div className="mt-4 px-4">
        <h1 className="text-primaryFontSize font-bold">All Fighters</h1>
        <p>
          Here, you will find all the fighters per weightclass. You can then
          click the fighter to view their stats but also all their moves and the
          levels.
        </p>
      </div>
      <div className="mt-4">{accordions}</div>
      <LinkButton
        href="/fighters/new"
        title="Add New Fighter"
        className="mt-4"
      />
    </main>
  );
}
