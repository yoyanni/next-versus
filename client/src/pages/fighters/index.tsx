import Link from "next/link";
import { useState } from "react";

// Internal Import
import standard from "@/standard";
import Accordion from "@/components/Accordion";
import Loading from "@/components/Loading";
import { useFighters } from "@/hooks/useFighters";
import LinkButton from "@/components/LinkButton";

// CSS columns fill top to bottom, so a fighter's stripe depends on its row in
// its column, not its place in the list. With rows of equal height the browser
// balances the columns to ceil(count / columns) rows each. The column counts
// match `tablet:columns-2 desktop:columns-3` below.
function stripeClasses(index: number, count: number) {
  const isStriped = (columns: number) =>
    (index % Math.ceil(count / columns)) % 2 === 0;
  return [
    isStriped(1) ? "bg-mainBgElevated" : "",
    isStriped(2) ? "tablet:bg-mainBgElevated" : "tablet:bg-transparent",
    isStriped(3) ? "desktop:bg-mainBgElevated" : "desktop:bg-transparent",
  ].join(" ");
}

export default function Fighters() {
  const { data: fighters } = useFighters();
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  // standard.weightClasses could be enum
  const weightClasses = [...standard.weightClasses, "Generic"];

  if (!fighters) return <Loading label="Loading fighters…" />;

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
        <div className="tablet:columns-2 tablet:gap-x-px tablet:[column-rule:1px_solid_theme(borderColor.DEFAULT)] desktop:columns-3">
          {wcFighters.map((fighter, index) => (
            <Link
              key={fighter._id}
              href={`/fighters/` + fighter._id}
              className={`block px-6 py-1 break-inside-avoid ${stripeClasses(
                index,
                wcFighters.length
              )}`}
            >
              {fighter.firstName} {fighter.lastName}
            </Link>
          ))}
        </div>
      </Accordion>
    );
  });

  return (
    <main className="grow w-full mx-auto tablet:max-w-3xl desktop:max-w-5xl">
      <div className="mt-4 px-4">
        <h1 className="text-primaryFontSize font-bold">All Fighters</h1>
        <p>
          Here, you will find all the fighters per weightclass. You can then
          click the fighter to view their stats but also all their moves and the
          levels.
        </p>
      </div>
      <div className="mt-4 tablet:mx-4 tablet:border tablet:rounded-lg tablet:overflow-hidden">
        {accordions}
      </div>
      <LinkButton
        href="/fighters/new"
        title="Add New Fighter"
        className="mt-4 tablet:w-fit tablet:mx-auto"
      />
    </main>
  );
}
