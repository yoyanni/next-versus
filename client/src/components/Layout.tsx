import { ReactNode } from "react";

interface LayoutType {
  children: ReactNode;
}

const Layout = ({ children }: LayoutType) => {
  return (
    <>
      <header className="flex flex-col bg-navBg">
        <nav className="flex  items-center gap-2 px-4 py-2 text-titleLightFontColor">
          <span className="text-titleLightFontColor text-titleFontSize font-bold">
            Versus 4
          </span>
          <ul className="grow flex justify-end gap-2 text-secondaryFontSize">
            <li>Fighters</li>
            <li>Combos</li>
          </ul>
        </nav>
        <aside className="grow flex justify-between px-4 py-1 text-end bg-navBgElevated text-titleLightFontColor text-quaternaryFontSize font-semibold">
          <span>Flyweight, Bantamweight</span>
          <span>59:59</span>
        </aside>
      </header>
      {children}
    </>
  );
};

export default Layout;
