import React, { useState } from "react";
import FileDropzone from "./FileDropzone";
import ImagePixels from "./ImagePixels";
import defaultPalettes from "data/palettes";

const App = () => {
  const [images, setImages] = useState({});
  const [palettes, setPalettes] = useState(defaultPalettes);
  const [selectedPalette, setSelectedPalette] = useState(null);
  const generatePalette = () => {
    Object.keys(images).map(key => {});
  };

  return (
    <div className="w-screen h-screen font-sans bg-gray-100 text-gray-700">
      <div className="flex pt-6">
        <div className="p-6 w-1/2 text-center text-xl">
          <FileDropzone {...{ images, setImages }} />
        </div>
        <div className="p-6 w-1/2 text-center text-xl">
          <button onClick={generatePalette}>
            Generate palette from images
          </button>
        </div>
      </div>
      <div className="flex p-6">
        {Object.keys(palettes).map(key => {
          return (
            <div
              key={key}
              onClick={() =>
                setSelectedPalette(selectedPalette === key ? null : key)
              }
              className={
                "flex flex-wrap items-center justify-center w-24 p-3 m-2 cursor-pointer rounded border-2" +
                (selectedPalette === key
                  ? " border-indigo-400"
                  : " border-transparent")
              }
            >
              {Object.keys(palettes[key]).map(c => {
                return (
                  <div
                    key={c}
                    className="inline-block"
                    style={{
                      backgroundColor: palettes[key][c],
                      width: "9.826px",
                      height: "9.826px"
                    }}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="py-6">
        {Object.keys(images).map(key => {
          return (
            <div key={key} className="p-3 flex">
              <img
                className="mr-6"
                src={images[key].url}
                alt={key}
                style={{
                  imageRendering: "pixelated",
                  width: images[key].width * 9.826 + "px",
                  height: images[key].height * 9.826 + "px"
                }}
              />
              <ImagePixels
                pixels={images[key].pixels}
                palette={palettes[selectedPalette]}
                width={images[key].width}
                height={images[key].height}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
