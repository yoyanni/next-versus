import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:5000/api/fighters")
      .then((res) => res.json())
      .then((data) => console.log(data));
  });
  return <main>Hello world!</main>;
}
