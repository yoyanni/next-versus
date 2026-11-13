import { AccordionProps } from "@/types/component";
import { useId } from "react";

function Accordion({
  children,
  title,
  activeAccordion,
  handleToggle,
  noShadow = false,
}: AccordionProps) {
  const isActive = activeAccordion === title.toLowerCase();
  const contentId = useId();
  return (
    <div className="text-primaryFontSize">
      <button
        type="button"
        aria-expanded={isActive}
        aria-controls={isActive ? contentId : undefined}
        className="flex justify-between w-full px-4 py-2 border-b bg-mainBgElevated first:border-t text-start"
        onClick={handleToggle}
      >
        <span>{title}</span>
        <span aria-hidden>{isActive ? "-" : "+"}</span>
      </button>
      {isActive &&
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

export default Accordion;
