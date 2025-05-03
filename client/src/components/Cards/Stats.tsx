import type { StatsProps } from "@/types/component";

const Stats = ({ name, redSkills, blueSkills }: StatsProps) => {
  let redStyles = "";
  let blueStyles = "";
  // let titleStyles = "";
  if (typeof redSkills === "string" || typeof blueSkills === "string") {
    // Chose to highlight differences in string skills
    if (redSkills !== blueSkills) {
      redStyles = "bg-redCorner";
      blueStyles = "bg-blueCorner";
    }
  } else {
    if (redSkills > blueSkills) {
      redStyles = "bg-redCorner";
    } else if (blueSkills > redSkills) {
      blueStyles = "bg-blueCorner";
    }
  }

  return (
    <div className="flex border-t">
      <div
        className={`w-[100px] flex flex-col justify-center items-center py-1 ${redStyles}`}
      >
        {redSkills}
      </div>
      {/* <h3 className={`grow py-1 text-center ${titleStyles}`}>{name}</h3> */}
      <h3 className="grow py-1 text-center">{name}</h3>
      <div
        className={`w-[100px] flex flex-col justify-center items-center py-1 ${blueStyles}`}
      >
        {blueSkills}
      </div>
    </div>
  );
};

export default Stats;
