import { ChildAccordionProps } from "@/types/component";
import { useId, useState } from "react";

function ChildAccordion({
  children,
  title,
  noShadow = false,
  indentation = "ps-7",
  isOpen,
  onToggle,
}: ChildAccordionProps) {
  const [showContent, setShowContent] = useState(false);
  const contentId = useId();
  // The parent controls it when it passes isOpen and onToggle
  const isShown = isOpen ?? showContent;
  return (
    <div
      className={`text-primaryFontSize ${
        isShown ? "bg-gray-100" : "bg-mainBgElevated"
      }`}
    >
      <button
        type="button"
        aria-expanded={isShown}
        aria-controls={isShown ? contentId : undefined}
        className={`flex justify-between w-full ${indentation} pe-4 py-2 border-b first:border-t text-start`}
        onClick={onToggle ?? (() => setShowContent((prev) => !prev))}
      >
        <span>{title}</span>
        <span aria-hidden>{isShown ? "-" : "+"}</span>
      </button>
      {isShown &&
        (noShadow ? (
          <div id={contentId}>{children}</div>
        ) : (
          <div id={contentId} className="relative">
            {children}
            <div className="absolute top-0 w-full h-full opacity-50 shadow-cardInset pointer-events-none" />
          </div>
        ))}
    </div>
  );
}

export default ChildAccordion;
