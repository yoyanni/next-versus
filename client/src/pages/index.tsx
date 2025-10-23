import { useState } from "react";

// Internal Import
import Cards from "@/components/Cards";
import Versebar from "@/components/Versebar";
import standard from "@/standard";
import { Sides } from "@/types/component";
import { useFighters } from "@/hooks/useFighters";

const defaultIds = {
  wc: 0,
  red: 1,
  blue: 2,
};

const defaultFighters: { red: number; blue: number }[] = [
  { red: 1, blue: 2 },
  { red: 24, blue: 25 },
  { red: 43, blue: 44 },
  { red: 64, blue: 65 },
  { red: 79, blue: 80 },
  { red: 111, blue: 112 },
  { red: 149, blue: 150 },
  { red: 201, blue: 202 },
  { red: 255, blue: 256 },
  { red: 298, blue: 299 },
  { red: 341, blue: 342 },
];

export default function Home() {
  const { data: fighters, isLoading } = useFighters();
  const [ids, setIds] = useState(defaultIds);

  // When fighters still has not loaded
  if (isLoading) return <main>Loading...</main>;
  if (!fighters) return <main>No fighters were available...</main>;

  const selected = {
    wc: ids.wc,
    red: fighters.find((f) => f._id === ids.red),
    blue: fighters.find((f) => f._id === ids.blue),
    wcFighters: fighters.filter(
      (f) =>
        f.weightClass === standard.weightClasses[ids.wc] ||
        f.weightClass === "Generic"
    ),
  };

  // Once fighters has loaded and looked for but for some reason not found
  if (selected.red == undefined || selected.blue == undefined) {
    return <main>There was an issue trying to fetch those fighters.</main>;
  }

  function changeFighter(id: number, side: Sides) {
    setIds((prevValue) => ({ ...prevValue, [side]: id }));
  }

  function changeWeightClass(id: number) {
    setIds({ wc: id, ...defaultFighters[id] });
  }

  return (
    <main className="grow mt-4">
      <Cards red={selected.red} blue={selected.blue} />
      <Versebar
        wc={selected.wc}
        red={selected.red}
        blue={selected.blue}
        wcFighters={selected.wcFighters}
        changeFighter={changeFighter}
        changeWeightClass={changeWeightClass}
      />
    </main>
  );
}
