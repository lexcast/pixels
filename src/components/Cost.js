import React from "react";

const Cost = ({ cost, currency, setCost, setCurrency }) => {
  const askCost = () => {
    const newCost = prompt("Set cost per pixel", cost);
    const newCurrency = prompt("Set currency", currency);

    if (newCost && newCurrency && !isNaN(newCost)) {
      setCost(parseFloat(newCost));
      setCurrency(newCurrency);

      localStorage.setItem('cost', newCost);
      localStorage.setItem('currency', newCurrency);
    }
  };

  return (
    <button
      onClick={askCost}
      className="uppercase flex items-center justify-center cursor-pointer mx-2 p-6 w-1/2 text-center rounded-lg border-2 hover:bg-gray-800 border-dashed border-gray-500 w-16"
    >
      Cost per pixel: ${cost}
      {currency}
    </button>
  );
};

export default React.memo(Cost);
