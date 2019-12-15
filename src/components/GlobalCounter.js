import React from "react";
import PaletteCounter from "./PaletteCounter";

const GlobalCounter = ({ colorsGlobal, pixels, cost, sprites }) => {
  return (
    <div className="p-3">
      <div className="text-center text-sm uppercase">
        <span className="mr-2">
          Sprites: <b>{sprites}</b>
        </span>
        <span className="mr-2">
          Pixels: <b>{pixels}</b>
        </span>
        <span>
          Cost: <b>${cost}</b>
        </span>
      </div>
      <PaletteCounter palette={colorsGlobal} />
    </div>
  );
};

export default React.memo(GlobalCounter);
