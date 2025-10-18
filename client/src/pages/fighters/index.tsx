import Accordion from "@/components/Accordion";
import standard from "@/standard";
import { Fighter } from "@shared/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Fighters() {
  const [fighters, setFighters] = useState<Fighter[] | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  // standard.weightClasses could be enum
  const weightClasses = [...standard.weightClasses, "Generic"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URI + "/fighters"
        );
        if (!response.ok)
          throw new Error("Issue with fetching fighters from backend.");
        const data = await response.json();
        setFighters(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetchData();
  }, []);

  // When fighters still have not loaded
  if (!fighters) return <main>Loading...</main>;

  function handleToggle(accordion: string) {
    console.log(accordion);

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
    </main>
  );
}
