import React from "react";
import ImagePixels from "./ImagePixels";
import PalettePixels from "./PalettePixels";
import { List, AutoSizer } from "react-virtualized";

const ImagesGrid = ({
  images,
  palette,
  selectedPalette,
  colorsImage,
  cost,
  currency,
  setSelectedImage,
}) => {
  const list = Object.keys(images);

  const imageRenderer = ({ key, index, style }) => {
    const id = list[index];
    const image = images[id];

    return (
      <div
        key={key}
        style={style}
        onClick={() => setSelectedImage(id)}
        className="flex w-1/2 p-2 cursor-pointer hover:bg-gray-800"
      >
        <div className="w-20 flex items-center justify-center">
          <img
            src={image.url}
            alt={id}
            style={{
              imageRendering: "pixelated",
              width: image.width + "px",
              height: image.height + "px",
            }}
          />
        </div>
        <div className="w-20 flex items-center justify-center">
          <ImagePixels
            pixels={image.pixels}
            palette={palette}
            map={selectedPalette ? colorsImage[id].map : null}
            width={image.width}
            height={image.height}
            size={1}
          />
        </div>
        {selectedPalette && (
          <>
            <div className="w-20 flex items-center justify-end text-sm">
              {colorsImage[id].total}
            </div>
            <div className="w-20 flex items-center justify-end text-sm">
              ${(colorsImage[id].total * cost).toFixed(2)}
            </div>
            <div className="flex-1 flex flex-wrap items-center justify-center px-2">
              <PalettePixels palette={colorsImage[id].count} useKey />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-3 flex w-3/4 m-auto flex-col items-center">
      <div className="flex w-full p-2 text-xs uppercase text-gray-500 bg-gray-800 rounded-t opacity-50">
        <div className="w-20 flex items-center justify-center">Original</div>
        <div className="w-20 flex items-center justify-center">Result</div>
        <div className="w-20 flex items-center justify-end">Pixels</div>
        <div className="w-20 flex items-center justify-end">
          Cost <sub>({currency})</sub>
        </div>
        <div className="flex-1 flex flex-wrap items-center justify-center">
          Palette
        </div>
      </div>
      <div className="w-full">
        <AutoSizer>
          {({ width }) => (
            <List
              height={300}
              width={width}
              rowCount={list.length}
              rowHeight={80}
              rowRenderer={imageRenderer}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default React.memo(ImagesGrid);
