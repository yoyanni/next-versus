import standard from "@/standard";
import { VersebarProps } from "@/types";

const Versebar = ({ wc, red, blue }: VersebarProps) => {
  return (
    <section>
      <div>{standard.weightClasses[wc]}</div>
      <div>
        <div>{red.firstName}</div>
        <div>{blue.firstName}</div>
      </div>
      <hr />
    </section>
  );
};

export default Versebar;
