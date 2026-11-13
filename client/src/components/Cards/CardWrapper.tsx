import { CardWrapperProps } from "@/types/component";
import { useId, useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const CardWrapper = ({
  title,
  redLevel,
  blueLevel,
  children
}: CardWrapperProps) => {
  const [show, setShow] = useState(true);
  const contentId = useId();
  return (
    <article className="break-inside-avoid border-y bg-mainBgElevated shadow-xl tablet:mb-6 tablet:border tablet:rounded-md tablet:overflow-hidden">
      <h2 className="flex justify-between items-center py-2 font-semibold">
        <span className="w-[100px] text-center">{redLevel}</span>
        <span className="grow flex justify-center items-center text-primaryFontSize text-center">
          {title}
        </span>
        <span className="w-[100px] text-center">{blueLevel}</span>
      </h2>
      {show && (
        <div id={contentId} className="relative">
          {children}
          <div className="absolute top-0 w-full h-full opacity-50 shadow-cardInset"></div>
        </div>
      )}
      <button
        type="button"
        aria-label={title}
        aria-expanded={show}
        aria-controls={show ? contentId : undefined}
        className="flex justify-center w-full border-t"
        onClick={() => setShow((prevState) => !prevState)}
      >
        {show ? <TiArrowSortedUp size={20} /> : <TiArrowSortedDown size={20} />}
      </button>
    </article>
  );
};

export default CardWrapper;
