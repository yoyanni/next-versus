import { ReactNode } from "react";

interface LayoutType {
  children: ReactNode;
}

const Layout = ({ children }: LayoutType) => {
  return (
    <>
      <header>
        <h1>Versus 4</h1>
        <nav>
          <ul>
            <li>Fighters</li>
            <li>Combos</li>
            <li>Search</li>
          </ul>
        </nav>
      </header>
      <aside>
        <span>Flyweight, Bantamweight</span>
        <span>59:59</span>
      </aside>
      {children}
    </>
  );
};

export default Layout;
