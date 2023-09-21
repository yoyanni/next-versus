import React from "react";

const cardsArr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

const Cards = () => {
  const cardsTSX = cardsArr.map((card) => {
    return <article key={card.id}>Card {card.id}</article>;
  });
  return (
    <>
      {cardsTSX}
      <hr />
    </>
  );
};

export default Cards;
