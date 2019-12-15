import React from "react";
import { PIXEL_SIZE } from "utils";

const PalettePixels = ({ palette, useKey }) => {
  return (
    <div className="flex flex-wrap items-center justify-center">
      {Object.keys(palette).map(c => {
        return (
          <div
            key={c}
            className="inline-block"
            style={{
              backgroundColor: useKey ? c : palette[c],
              width: `${PIXEL_SIZE}px`,
              height: `${PIXEL_SIZE}px`
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default React.memo(PalettePixels);
