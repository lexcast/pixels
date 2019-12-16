import React from "react";

const PaletteCounter = ({ palette }) => {
  return (
    <div className="p-3 flex flex-wrap items-center justify-center">
      {Object.keys(palette).map(c => {
        return (
          <div
            key={c}
            title={palette[c].id}
            className="relative inline-flex items-center justify-center w-10 h-10"
            style={{ backgroundColor: c }}
          >
            <span className="absolute px-1 bottom-0 right-0 bg-white text-gray-700 text-xs opacity-25">
              {palette[c].count}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(PaletteCounter);
