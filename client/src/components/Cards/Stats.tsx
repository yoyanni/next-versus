import type { StatsProps } from "@/types/component";

const Stats = ({ name, redSkills, blueSkills }: StatsProps) => {
  return (
    <div className="flex flex-col border-t">
      <h3 className="self-center py-1">
        <span>{name}</span>
      </h3>
      <div className="grow flex border-t">
        <div className="grow text-center py-1 border-r">{redSkills}</div>
        <div className="grow text-center py-1">{blueSkills}</div>
      </div>
    </div>
  );
};

export default Stats;
