import React, { useState } from "react";
import FileDropzone from "./FileDropzone";
import ImagePixels from "./ImagePixels";

const App = () => {
  const [images, setImages] = useState({});
  const generatePalette = () => {
    Object.keys(images).map(key => {});
  };

  return (
    <div className="w-screen h-screen font-sans bg-gray-100 text-gray-700">
      <div className="flex py-10">
        <div className="p-6 w-1/2 text-center text-xl">
          <FileDropzone {...{ images, setImages }} />
        </div>
        <div className="p-6 w-1/2 text-center text-xl">
          <button onClick={generatePalette}>
            Generate palette from images
          </button>
        </div>
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
