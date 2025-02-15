import { PerkCardProps } from "@/types/component";

const PerkCard = ({ title, red, blue }: PerkCardProps) => {
  return (
    <article className="border-y">
      <h2 className="flex justify-evenly py-2">
        <span>{red.length}</span>
        <span>{title}</span>
        <span>{blue.length}</span>
      </h2>
      <div className="flex border-t">
        <ul className="basis-full text-center border-r">
          {red.map(({ name }) => {
            return (
              <li key={name} className="p-1 border-b">
                {name}
              </li>
            );
          })}
        </ul>
        <ul className="basis-full text-center">
          {blue.map(({ name }) => {
            return (
              <li key={name} className="p-1 border-b">
                {name}
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
};

export default PerkCard;
