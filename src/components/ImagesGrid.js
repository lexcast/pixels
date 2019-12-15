import React from "react";
import ImagePixels from "./ImagePixels";
import PalettePixels from "./PalettePixels";

const ImagesGrid = ({ images, selectedPalette, colorsImage, PRICE }) => {
  return (
    <div className="p-3 flex flex-col items-center">
      <div className="flex w-1/2 p-2 text-xs uppercase text-gray-500 bg-gray-800 rounded-t opacity-50">
        <div className="w-20 flex items-center justify-center">Original</div>
        <div className="w-20 flex items-center justify-center">Result</div>
        <div className="w-20 flex items-center justify-end">Pixels</div>
        <div className="w-20 flex items-center justify-end">
          Cost <sub>(MXN)</sub>
        </div>
        <div className="flex-1 flex flex-wrap items-center justify-center">
          Palette
        </div>
      </div>
      {Object.keys(images).map(key => {
        return (
          <div
            key={key}
            className="flex w-1/2 p-2 cursor-pointer hover:bg-gray-800"
          >
            <div className="w-20 flex items-center justify-center">
              <img
                src={images[key].url}
                alt={key}
                style={{
                  imageRendering: "pixelated",
                  width: images[key].width + "px",
                  height: images[key].height + "px"
                }}
              />
            </div>
            <div className="w-20 flex items-center justify-center">
              <ImagePixels
                pixels={images[key].pixels}
                palette={selectedPalette ? colorsImage[key].map : null}
                width={images[key].width}
                height={images[key].height}
                size={1}
              />
            </div>
            {selectedPalette && (
              <>
                <div className="w-20 flex items-center justify-end text-sm">
                  {colorsImage[key].total}
                </div>
                <div className="w-20 flex items-center justify-end text-sm">
                  ${(colorsImage[key].total * PRICE).toFixed(2)}
                </div>
                <div className="flex-1 flex flex-wrap items-center justify-center">
                  <PalettePixels palette={colorsImage[key].count} useKey />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(ImagesGrid);
