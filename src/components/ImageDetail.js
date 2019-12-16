import React from "react";
import ImagePixels from "./ImagePixels";
import PaletteCounter from "./PaletteCounter";
import { PIXEL_SIZE } from "utils";

const ImageDetail = ({
  id,
  image,
  colors,
  palette,
  selectedPalette,
  setSelectedImage,
  PRICE
}) => {
  return (
    <>
      <div
        onClick={() => setSelectedImage(null)}
        className="bg-gray-900 opacity-50 w-full h-full fixed z-20 top-0 left-0"
      ></div>
      <div className="w-full h-full px-24 py-10 pointer-events-none fixed z-30 top-0 left-0 flex items-center justify-center">
        <div className="flex flex-col max-h-full max-w-full p-3 overflow-auto pointer-events-auto bg-gray-700 rounded shadow-lg">
          <div className="flex flex-wrap items-center justify-center p-3">
            <img
              src={image.url}
              alt={id}
              style={{
                imageRendering: "pixelated",
                width: image.width * PIXEL_SIZE + "px",
                height: image.height * PIXEL_SIZE + "px"
              }}
            />
            <ImagePixels
              pixels={image.pixels}
              map={selectedPalette ? colors.map : null}
              palette={palette}
              width={image.width}
              height={image.height}
              size={PIXEL_SIZE}
              titled
            />
          </div>
          {selectedPalette && (
            <>
              <div className="p-3">
                <div className="text-center text-sm uppercase">
                  <span className="mr-2">
                    Pixels: <b>{colors.total}</b>
                  </span>
                  <span>
                    Cost: <b>${(colors.total * PRICE).toFixed(2)}</b>
                  </span>
                </div>
              </div>
              <div className="p-3">
                <PaletteCounter palette={colors.count} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(ImageDetail);
