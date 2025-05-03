import type { PerksProps } from "@/types/component";

const Perks = ({ red, blue }: PerksProps) => {
  return (
    <div className="flex">
      <ul className="basis-full text-center border-r">
        {red.map(({ name, type }) => {
          const perkStyle =
            type === "Stand-Up"
              ? "bg-standup"
              : type === "Grappling"
              ? "bg-grappling"
              : "bg-health";
          return (
            <li key={name} className={`p-1 border-b ${perkStyle}`}>
              {name}
            </li>
          );
        })}
      </ul>
      <ul className="basis-full text-center">
        {blue.map(({ name, type }) => {
          const perkStyle =
            type === "Stand-Up"
              ? "bg-standup"
              : type === "Grappling"
              ? "bg-grappling"
              : "bg-health";
          return (
            <li key={name} className={`p-1 border-b ${perkStyle}`}>
              {name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Perks;
