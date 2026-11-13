import standard from "@/standard";
import { Sides, VersebarProps } from "@/types/component";
import { formatRank } from "@/utils/formatRank";
import { useId, useState } from "react";

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
  const weightClassListId = useId();
  const fighterListId = useId();

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
    <button
      type="button"
      key={item}
      aria-current={index === wc}
      onClick={() => handleChangeWeightClass(index)}
      className="self-stretch text-center hover:bg-navBgElevated"
    >
      {item}
    </button>
  ));

  const weightClassToggle = (className: string) => (
    <button
      type="button"
      aria-expanded={showWeightClasses}
      aria-controls={showWeightClasses ? weightClassListId : undefined}
      className={className}
      onClick={toggleWeightClassList}
    >
      <span className="sr-only">Weight class: </span>
      {standard.weightClasses[wc]}
    </button>
  );

  const fighterToggle = (side: Sides, className: string) => {
    const fighter = side === "red" ? red : blue;
    return (
      <button
        type="button"
        aria-expanded={showFighters === side}
        aria-controls={showFighters === side ? fighterListId : undefined}
        // A flex column keeps the names at the top, as a stretched block would
        className={`flex flex-col ${className}`}
        onClick={() => toggleFighterList(side)}
      >
        <span className="sr-only">{side === "red" ? "Red" : "Blue"} corner: </span>
        <span className="block">{fighter?.firstName}</span>{" "}
        <span
          className={`block text-primaryFontSize tracking-wider ${
            side === "red" ? "font-semibold" : "font-black"
          }`}
        >
          {fighter?.lastName ?? "No fighter"}
        </span>
      </button>
    );
  };

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
          // The name cell's button gives keyboard users a control. It has no
          // handler of its own: its click, from a mouse or the keyboard,
          // bubbles up to the row, so a click anywhere on the row still works.
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
            <td className="py-2">
              <button type="button" className="block w-full text-start leading-4">
                <span className="block">{f.firstName}</span>{" "}
                <span className="block text-primaryFontSize">{f.lastName}</span>
              </button>
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
        {/* Reversed so the list, drawn above its button, comes after it in tab order */}
        <div className="flex flex-col-reverse w-fit mx-auto rounded-md bg-navBg text-titleLightFontColor shadow-weightClass">
          {weightClassToggle(
            "w-fit mx-auto px-4 py-1 rounded-md text-primaryFontSize hover:bg-navBgElevated"
          )}
          {showWeightClasses && (
            <div
              id={weightClassListId}
              className="flex flex-col items-center px-4 py-1 border-b"
            >
              {weightClassItems}
            </div>
          )}
        </div>
        <div className="flex justify-between mt-2 text-titleLightFontColor">
          {fighterToggle(
            "red",
            `min-w-[30%] p-2 rounded-se-md bg-redCornerDark leading-5 text-start ${tabShadow("red")}`
          )}
          {fighterToggle(
            "blue",
            `min-w-[30%] p-2 rounded-ss-md bg-blueCornerDark leading-5 text-end ${tabShadow("blue")}`
          )}
        </div>
        {showFighters && (
          <div
            id={fighterListId}
            className={`relative max-h-[400px] z-20 overflow-y-auto ${listBg}`}
          >
            {fighterTable}
          </div>
        )}
      </section>
    );

  // Tablet and up: a row above the cards, with the lists dropping down over them
  return (
    <section className="relative hidden tablet:grid grid-cols-[1fr_auto_1fr] gap-4 mb-6 text-titleLightFontColor">
      {fighterToggle(
        "red",
        `p-2 rounded-md bg-redCornerDark leading-5 text-start ${tabShadow("red")}`
      )}
      <div className="relative self-center">
        {weightClassToggle(
          "block w-full px-4 py-1 rounded-md bg-navBg text-primaryFontSize shadow-weightClass hover:bg-navBgElevated"
        )}
        {showWeightClasses && (
          <div
            id={weightClassListId}
            className="absolute top-full left-1/2 z-20 flex flex-col items-center w-max mt-2 px-4 py-1 -translate-x-1/2 rounded-md bg-navBg shadow-weightClass"
          >
            {weightClassItems}
          </div>
        )}
      </div>
      {fighterToggle(
        "blue",
        `p-2 rounded-md bg-blueCornerDark leading-5 text-end ${tabShadow("blue")}`
      )}
      {showFighters && (
        <div
          id={fighterListId}
          className={`absolute top-full inset-x-0 z-20 max-h-[400px] mt-2 overflow-y-auto rounded-md shadow-weightClass ${listBg}`}
        >
          {fighterTable}
        </div>
      )}
    </section>
  );
};

export default Versebar;
