import standard from "@/standard";
import { Sides, VersebarProps } from "@/types/component";
import { formatRank } from "@/utils/formatRank";
import { useState } from "react";

const Versebar = ({
  placement,
  wc,
  red,
  blue,
  wcFighters,
  changeFighter,
  changeWeightClass,
}: VersebarProps) => {
  const [showWeightClasses, setShowWeightClasses] = useState(false);
  const [showFighters, setShowFighters] = useState<Sides | null>(null);

  function handleChangeWeightClass(id: number) {
    changeWeightClass(id);
    setShowWeightClasses(false);
  }

  // Only one list is open at a time: at the top, both drop into the same space
  function toggleWeightClassList() {
    setShowWeightClasses((prevState) => !prevState);
    setShowFighters(null);
  }

  function handleChangeFighter(id: number) {
    if (showFighters) changeFighter(id, showFighters);
    setShowFighters(null);
  }

  function toggleFighterList(side: Sides) {
    setShowWeightClasses(false);
    if (showFighters === side) setShowFighters(null);
    else setShowFighters(side);
  }

  const weightClassItems = standard.weightClasses.map((item, index) => (
    <p
      key={item}
      onClick={() => handleChangeWeightClass(index)}
      className="self-stretch text-center cursor-pointer hover:bg-navBgElevated"
    >
      {item}
    </p>
  ));

  const fighterTable = (
    <table className="w-full">
      <thead
        className={`sticky top-0 text-titleLightFontColor shadow-verseBarHeader ${
          showFighters === "red" ? "bg-[#e33636]" : "bg-[#1f76e0]"
        }`}
      >
        <tr>
          <th>Ranking</th>
          <th>Name</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody className="text-center shadow-verseBarInset">
        {wcFighters.map((f) => (
          <tr
            key={f._id}
            onClick={() => handleChangeFighter(f._id)}
            className={`py-2 border-b last:border-none text-titleLightFontColor cursor-pointer ${
              showFighters === "red"
                ? "active:bg-redCornerDark hover:bg-redCornerDark"
                : "active:bg-blueCornerDark hover:bg-blueCornerDark"
            }`}
          >
            <td className="w-[35%] py-2">{formatRank(f.rank)}</td>
            <td className="py-2 ">
              <div className="text-start leading-4">
                <div>{f.firstName}</div>
                <div className="text-primaryFontSize">{f.lastName}</div>
              </div>
            </td>
            <td className="w-[35%] py-2">{f.basic.level}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const tabShadow = (side: Sides) =>
    ![side, null].includes(showFighters)
      ? "shadow-verseBarFighter"
      : "shadow-weightClass";
  const listBg = showFighters === "red" ? "bg-redCorner" : "bg-blueCorner";

  // Phones: fixed to the bottom of the screen, after the cards so it paints over them
  if (placement === "bottom")
    return (
      <section className="fixed bottom-0 w-full tablet:hidden">
        <div className="w-fit mx-auto rounded-md bg-navBg text-titleLightFontColor shadow-weightClass">
          {showWeightClasses && (
            <div className="flex flex-col items-center px-4 py-1 border-b">
              {weightClassItems}
            </div>
          )}
          <div
            className="w-fit mx-auto px-4 py-1 rounded-md text-primaryFontSize cursor-pointer hover:bg-navBgElevated"
            onClick={toggleWeightClassList}
          >
            {standard.weightClasses[wc]}
          </div>
        </div>
        <div className="flex justify-between mt-2 text-titleLightFontColor">
          <div
            className={`min-w-[30%] p-2 rounded-se-md bg-redCornerDark leading-5 cursor-pointer ${tabShadow("red")}`}
            onClick={() => toggleFighterList("red")}
          >
            <div>{red?.firstName}</div>
            <div className="text-primaryFontSize font-semibold tracking-wider">
              {red?.lastName ?? "No fighter"}
            </div>
          </div>
          <div
            className={`min-w-[30%] p-2 rounded-ss-md bg-blueCornerDark leading-5 cursor-pointer ${tabShadow("blue")}`}
            onClick={() => toggleFighterList("blue")}
          >
            <div className="text-end">{blue?.firstName}</div>
            <div className="text-primaryFontSize font-black tracking-wider text-end">
              {blue?.lastName ?? "No fighter"}
            </div>
          </div>
        </div>
        {showFighters && (
          <div className={`relative max-h-[400px] z-20 overflow-y-auto ${listBg}`}>
            {fighterTable}
          </div>
        )}
      </section>
    );

  // Tablet and up: a row above the cards, with the lists dropping down over them
  return (
    <section className="relative hidden tablet:grid grid-cols-[1fr_auto_1fr] gap-4 mb-6 text-titleLightFontColor">
      <div
        className={`p-2 rounded-md bg-redCornerDark leading-5 cursor-pointer ${tabShadow("red")}`}
        onClick={() => toggleFighterList("red")}
      >
        <div>{red?.firstName}</div>
        <div className="text-primaryFontSize font-semibold tracking-wider">
          {red?.lastName ?? "No fighter"}
        </div>
      </div>
      <div className="relative self-center">
        <div
          className="px-4 py-1 rounded-md bg-navBg text-primaryFontSize shadow-weightClass cursor-pointer hover:bg-navBgElevated"
          onClick={toggleWeightClassList}
        >
          {standard.weightClasses[wc]}
        </div>
        {showWeightClasses && (
          <div className="absolute top-full left-1/2 z-20 flex flex-col items-center w-max mt-2 px-4 py-1 -translate-x-1/2 rounded-md bg-navBg shadow-weightClass">
            {weightClassItems}
          </div>
        )}
      </div>
      <div
        className={`p-2 rounded-md bg-blueCornerDark leading-5 text-end cursor-pointer ${tabShadow("blue")}`}
        onClick={() => toggleFighterList("blue")}
      >
        <div>{blue?.firstName}</div>
        <div className="text-primaryFontSize font-black tracking-wider">
          {blue?.lastName ?? "No fighter"}
        </div>
      </div>
      {showFighters && (
        <div
          className={`absolute top-full inset-x-0 z-20 max-h-[400px] mt-2 overflow-y-auto rounded-md shadow-weightClass ${listBg}`}
        >
          {fighterTable}
        </div>
      )}
    </section>
  );
};

export default Versebar;
