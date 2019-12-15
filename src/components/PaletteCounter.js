import React from "react";

const PaletteCounter = ({ palette, attr }) => {
  return (
    <div className="p-3 flex flex-wrap items-center justify-center">
      {Object.keys(palette).map(c => {
        return (
          <div
            key={c}
            title={c}
            className="relative inline-flex items-center justify-center w-10 h-10"
            style={{ backgroundColor: c }}
          >
            <span className="absolute px-1 bottom-0 right-0 bg-white text-gray-700 text-xs opacity-25">
              {attr ? palette[c][attr] : palette[c]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(PaletteCounter);
