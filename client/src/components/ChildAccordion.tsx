import { ChildAccordionProps } from "@/types/component";
import { useState } from "react";

function ChildAccordion({
  children,
  title,
  noShadow = false,
  indentation = "ps-7",
  isOpen,
  onToggle,
}: ChildAccordionProps) {
  const [showContent, setShowContent] = useState(false);
  // The parent controls it when it passes isOpen and onToggle
  const isShown = isOpen ?? showContent;
  return (
    <div
      className={`text-primaryFontSize ${
        isShown ? "bg-gray-100" : "bg-mainBgElevated"
      }`}
    >
      <div
        className={`flex justify-between ${indentation} pe-4 py-2 border-b first:border-t cursor-pointer`}
        onClick={onToggle ?? (() => setShowContent((prev) => !prev))}
      >
        <span>{title}</span>
        <span>{isShown ? "-" : "+"}</span>
      </div>
      {isShown &&
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
