import React from "react";
import PalettePixels from "./PalettePixels";

const PaletteSelector = ({ palettes, selectedPalette, setSelectedPalette }) => {
  return (
    <div className="flex m-3 items-stretch">
      {Object.keys(palettes).map(key => {
        return (
          <div
            title={key}
            key={key}
            onClick={() =>
              setSelectedPalette(selectedPalette === key ? null : key)
            }
            className={
              "flex items-center m-2 cursor-pointer rounded border-2 w p-3 border-dashed" +
              (selectedPalette === key
                ? " border-gray-400"
                : " border-transparent")
            }
          >
            <PalettePixels palette={palettes[key]} />
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(PaletteSelector);
