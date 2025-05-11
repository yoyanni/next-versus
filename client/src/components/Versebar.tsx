import standard from "@/standard";
import { VersebarProps } from "@/types/component";
import { useState } from "react";

const Versebar = ({ wc, red, blue, changeWeightClass }: VersebarProps) => {
  const [showWeightClasses, setShowWeightClasses] = useState(false);

  function handleChangeWeightClass(id: number) {
    changeWeightClass(id);
    setShowWeightClasses(false);
  }

  function toggleWeightClassList() {
    setShowWeightClasses((prevState) => !prevState);
  }
  return (
    <section className="fixed bottom-0 w-full">
      <div className="w-fit mx-auto rounded-md bg-navBg text-titleLightFontColor shadow-weightClass">
        {showWeightClasses && (
          <div className="flex flex-col items-center px-4 py-1 border-b">
            {standard.weightClasses.map((item, index) => {
              return (
                <p key={item} onClick={() => handleChangeWeightClass(index)}>
                  {item}
                </p>
              );
            })}
          </div>
        )}
        <div
          className="w-fit mx-auto px-4 py-1 text-primaryFontSize"
          onClick={toggleWeightClassList}
        >
          {standard.weightClasses[wc]}
        </div>
      </div>
      <div>
        <div>{red.firstName}</div>
        <div>{blue.firstName}</div>
      </div>
    </section>
  );
};

export default Versebar;
