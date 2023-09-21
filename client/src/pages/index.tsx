import { useEffect } from "react";

import Cards from "@/components/Cards";
import Versebar from "@/components/Versebar";

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:5000/api/fighters")
      .then((res) => res.json())
      .then((data) => console.log(data));
  });

  return (
    <main>
      <Cards />
      <Versebar />
    </main>
  );
}
