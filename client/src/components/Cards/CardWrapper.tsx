import { CardWrapperProps } from "@/types/component";
import { useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const CardWrapper = ({
  title,
  redLevel,
  blueLevel,
  children
}: CardWrapperProps) => {
  const [show, setShow] = useState(true);
  return (
    <article className="border-y bg-mainBgElevated shadow-xl">
      <h2 className="flex justify-between items-center py-2 font-semibold">
        <span className="w-[100px] text-center">{redLevel}</span>
        <span className="grow flex justify-center items-center text-primaryFontSize text-center">
          {title}
        </span>
        <span className="w-[100px] text-center">{blueLevel}</span>
      </h2>
      {show && (
        <div className="relative">
          {children}
          <div className="absolute top-0 w-full h-full opacity-50 shadow-cardInset"></div>
        </div>
      )}
      <div
        className="flex justify-center border-t"
        onClick={() => setShow((prevState) => !prevState)}
      >
        {show ? <TiArrowSortedUp size={20} /> : <TiArrowSortedDown size={20} />}
      </div>
    </article>
  );
};

export default CardWrapper;
