import { useState } from "react";

// Internal Import
import Cards from "@/components/Cards";
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

  // When fighters still has not loaded
  if (isLoading) return <main>Loading...</main>;
  if (!fighters) return <main>No fighters were available...</main>;

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

  return (
    <main className="grow mt-4">
      {red && blue ? (
        <Cards red={red} blue={blue} />
      ) : (
        <p className="text-center">
          There aren&apos;t enough fighters in this weight class to compare.
        </p>
      )}
      <Versebar
        wc={ids.wc}
        red={red}
        blue={blue}
        wcFighters={wcFighters}
        changeFighter={changeFighter}
        changeWeightClass={changeWeightClass}
      />
    </main>
  );
}
