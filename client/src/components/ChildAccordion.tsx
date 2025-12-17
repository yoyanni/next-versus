import { ChildAccordionProps } from "@/types/component";
import { useState } from "react";

function ChildAccordion({
  children,
  title,
  noShadow = false,
  indentation = "ps-7",
}: ChildAccordionProps) {
  const [showContent, setShowContent] = useState(false);
  return (
    <div
      className={`text-primaryFontSize ${
        showContent ? "bg-gray-100" : "bg-mainBgElevated"
      }`}
    >
      <div
        className={`flex justify-between ${indentation} pe-4 py-2 border-b first:border-t`}
        onClick={() => setShowContent((prev) => !prev)}
      >
        <span>{title}</span>
        <span>{showContent ? "-" : "+"}</span>
      </div>
      {showContent &&
        (noShadow ? (
          children
        ) : (
          <div className="relative">
            {children}
            <div className="absolute top-0 w-full h-full opacity-50 shadow-cardInset pointer-events-none" />
          </div>
        ))}
    </div>
  );
}

export default ChildAccordion;
