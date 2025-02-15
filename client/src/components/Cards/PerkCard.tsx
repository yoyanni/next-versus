import { PerkCardProps } from "@/types/component";

const PerkCard = ({ title, red, blue }: PerkCardProps) => {
  return (
    <article key={title}>
      <h2>{title}</h2>
      <div>
        {red.map(({ name }) => {
          return <div key={name}></div>;
        })}
      </div>
      <div>
        {blue.map(({ name }) => {
          return <div key={name}></div>;
        })}
      </div>
    </article>
  );
};

export default PerkCard;
