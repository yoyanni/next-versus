import { useState } from "react";

// Internal Import
import Cards from "@/components/Cards";
import Loading from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import Versebar from "@/components/Versebar";
import standard from "@/standard";
import { Sides } from "@/types/component";
import { useFighters } from "@/hooks/useFighters";
import { pickCorners } from "@/utils/pickCorners";

// A null corner means "not chosen yet": pickCorners fills it by rank.
const defaultIds: { wc: number; red: number | null; blue: number | null } = {
  wc: 0,
  red: null,
  blue: null,
};

export default function Home() {
  const { data: fighters, isLoading } = useFighters();
  const [ids, setIds] = useState(defaultIds);

  const pageTitle = <PageTitle />;

  if (isLoading)
    return (
      <>
        {pageTitle}
        <Loading label="Loading fighters…" />
      </>
    );
  if (!fighters)
    return (
      <>
        {pageTitle}
        <main>No fighters were available...</main>
      </>
    );

  const wcFighters = fighters.filter(
    (f) =>
      f.weightClass === standard.weightClasses[ids.wc] ||
      f.weightClass === "Generic"
  );
  const { red, blue } = pickCorners(fighters, wcFighters, ids);

  function changeFighter(id: number, side: Sides) {
    // Pin the corner that wasn't clicked, so it doesn't move when the other one changes.
    setIds({
      wc: ids.wc,
      red: red?._id ?? null,
      blue: blue?._id ?? null,
      [side]: id,
    });
  }

  function changeWeightClass(id: number) {
    setIds({ wc: id, red: null, blue: null });
  }

  const picker = {
    wc: ids.wc,
    red,
    blue,
    wcFighters,
    changeFighter,
    changeWeightClass,
  };

  // The bottom bar must come after the cards to paint over them
  return (
    <main className="grow w-full mx-auto mt-4 tablet:px-4 desktop:max-w-7xl">
      {pageTitle}
      <Versebar placement="top" {...picker} />
      {red && blue ? (
        <Cards red={red} blue={blue} />
      ) : (
        <p className="text-center">
          There aren&apos;t enough fighters in this weight class to compare.
        </p>
      )}
      <Versebar placement="bottom" {...picker} />
    </main>
  );
}
