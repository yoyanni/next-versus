import { useState, useEffect } from "react";

// Internal Import
import type { Fighter } from "../../../types";
import Cards from "@/components/Cards";
import Versebar from "@/components/Versebar";

const defaultIds = {
  wc: 0,
  red: 1,
  blue: 2,
};

export default function Home() {
  const [fighters, setFighters] = useState<Fighter[] | null>(null);
  const [ids, setids] = useState(defaultIds);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/fighters");
        if (!response.ok)
          throw new Error("Issue with fetching fighters from backend.");
        const data = await response.json();
        setFighters(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetchData();
  }, []);

  // When fighters still has not loaded
  if (!fighters) return <main>Loading...</main>;

  const selected = {
    wc: ids.wc,
    red: fighters.find((f) => f._id === ids.red),
    blue: fighters.find((f) => f._id === ids.blue),
  };

  // Once fighters has loaded and looked for but for some reason not found
  if (selected.red == undefined || selected.blue == undefined) {
    return <main>There was an issue trying to fetch those fighters.</main>;
  }

  return (
    <main>
      <Cards red={selected.red} blue={selected.blue} />
      <Versebar wc={selected.wc} red={selected.red} blue={selected.blue} />
    </main>
  );
}
