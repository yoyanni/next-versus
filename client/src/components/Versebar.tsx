import standard from "@/standard";
import { Sides, VersebarProps } from "@/types/component";
import { formatRank } from "@/utils/formatRank";
import { useState } from "react";

const Versebar = ({
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

  function toggleWeightClassList() {
    setShowWeightClasses((prevState) => !prevState);
  }

  function handleChangeFighter(id: number) {
    if (showFighters) changeFighter(id, showFighters);
    setShowFighters(null);
  }

  function toggleFighterList(side: Sides) {
    if (showFighters === side) setShowFighters(null);
    else setShowFighters(side);
  }

  return (
    <section className="fixed bottom-0 inset-x-0 mx-auto tablet:px-4 desktop:max-w-7xl">
      <div className="w-fit mx-auto rounded-md bg-navBg text-titleLightFontColor shadow-weightClass">
        {showWeightClasses && (
          <div className="flex flex-col items-center px-4 py-1 border-b">
            {standard.weightClasses.map((item, index) => {
              return (
                <p
                  key={item}
                  onClick={() => handleChangeWeightClass(index)}
                  className="self-stretch text-center cursor-pointer hover:bg-navBgElevated"
                >
                  {item}
                </p>
              );
            })}
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
          className={`min-w-[30%] p-2 rounded-se-md bg-redCornerDark leading-5 cursor-pointer tablet:rounded-t-md ${
            !["red", null].includes(showFighters)
              ? "shadow-verseBarFighter"
              : "shadow-weightClass"
          }`}
          onClick={() => toggleFighterList("red")}
        >
          <div>{red?.firstName}</div>
          <div className="text-primaryFontSize font-semibold tracking-wider">
            {red?.lastName ?? "No fighter"}
          </div>
        </div>
        <div
          className={`min-w-[30%] p-2 rounded-ss-md bg-blueCornerDark leading-5 cursor-pointer tablet:rounded-t-md ${
            !["blue", null].includes(showFighters)
              ? "shadow-verseBarFighter"
              : "shadow-weightClass"
          }`}
          onClick={() => toggleFighterList("blue")}
        >
          <div className="text-end">{blue?.firstName}</div>
          <div className="text-primaryFontSize font-black tracking-wider text-end">
            {blue?.lastName ?? "No fighter"}
          </div>
        </div>
      </div>
      {showFighters && (
        <div
          className={`relative max-h-[400px] z-20 overflow-y-auto ${
            showFighters === "red" ? "bg-redCorner" : "bg-blueCorner"
          }`}
        >
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
        </div>
      )}
    </section>
  );
};

export default Versebar;
