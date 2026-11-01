import { AccordionProps } from "@/types/component";

function Accordion({
  children,
  title,
  activeAccordion,
  handleToggle,
  noShadow = false,
}: AccordionProps) {
  const isActive = activeAccordion === title.toLowerCase();
  return (
    <div className="text-primaryFontSize">
      <div
        className="flex justify-between px-4 py-2 border-b bg-mainBgElevated first:border-t cursor-pointer"
        onClick={handleToggle}
      >
        <span>{title}</span>
        <span>{isActive ? "-" : "+"}</span>
      </div>
      {isActive &&
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

export default Accordion;
