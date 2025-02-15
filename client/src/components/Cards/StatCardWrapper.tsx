import { StatCardWrapperProps } from "@/types";

const StatCardWrapper = ({
  title,
  redLevel,
  blueLevel,
  children,
}: StatCardWrapperProps) => {
  return (
    <article className="border">
      <h2 className="flex justify-evenly py-2">
        <span>{redLevel}</span>
        <span>{title}</span>
        <span>{blueLevel}</span>
      </h2>
      <div>{children}</div>
    </article>
  );
};

export default StatCardWrapper;
