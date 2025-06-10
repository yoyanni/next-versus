import standard from "@/standard";
import { Fighter } from "@shared/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Fighters() {
  const [fighters, setFighters] = useState<Fighter[] | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
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

  function handleToggle(index: number) {
    if (activeAccordion === index) setActiveAccordion(null);
    else setActiveAccordion(index);
  }

  const accordions = weightClasses.map((wc, index) => {
    const wcFighters = fighters.filter((fighter) => fighter.weightClass === wc);
    return (
      <div key={wc} className="bg-mainBgElevated text-primaryFontSize">
        <div
          className="flex justify-between px-4 py-2 border-b first:border-t"
          onClick={() => handleToggle(index)}
        >
          <span>{wc}</span>
          <span>{activeAccordion === index ? "-" : "+"}</span>
        </div>
        {activeAccordion === index && (
          <div className="relative">
            {wcFighters.map((fighter) => (
              <Link
                key={fighter._id}
                href={`/fighters/` + fighter._id}
                className="block px-6 py-1 border-b"
              >
                {fighter.firstName} {fighter.lastName}
              </Link>
            ))}
            <div className="absolute top-0 w-full h-full opacity-50 shadow-cardInset" />
          </div>
        )}
      </div>
    );
  });

  return (
    <main className="grow">
      <div className="mt-4 px-4">
        <h1 className="text-primaryFontSize font-bold">All Fighters</h1>
        <p>
          Here, you will find all the fighters per weightclass. You can then
          click the fighter to view their stats but also all their moves and
          their levels.
        </p>
      </div>
      <div className="mt-4">{accordions}</div>
    </main>
  );
}
