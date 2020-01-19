import React, { useState, useMemo } from "react";
import FileDropzone from "./FileDropzone";
import PaletteGenerate from "./PaletteGenerate";
import PaletteSelector from "./PaletteSelector";
import AlgorithmSelector from "./AlgorithmSelector";
import GlobalCounter from "./GlobalCounter";
import ImagesGrid from "./ImagesGrid";
import ImageDetail from "./ImageDetail";
import defaultPalettes from "data/palettes";
import closerColor, { algorithms } from "utils/closerColor";
import imageColors from "selectors/imageColors";

const PRICE = 0.01965;

const App = () => {
  const [images, setImages] = useState({});
  const [palettes, setPalettes] = useState(defaultPalettes);
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    algorithms.DELTA_E00
  );

  const palette = palettes[selectedPalette];

  const { colorsImage, colorsGlobal, globalCount } = useMemo(() => {
    const colorsImage = {};
    const colorsGlobal = {};
    let globalCount = 0;

    if (palette) {
      closerColor.from(palette, selectedAlgorithm);

      Object.keys(images).forEach(key => {
        const img = images[key];

        const { colorImage, colorGlobal, count } = imageColors({
          img,
          closerColor,
          palette,
          selectedAlgorithm
        });

        colorsImage[key] = colorImage;
        globalCount += count;
        Object.keys(colorGlobal).forEach(p => {
          if (!colorsGlobal[p]) {
            colorsGlobal[p] = colorGlobal[p];
          } else {
            colorsGlobal[p].count += colorGlobal[p].count;
          }
        });
      });
    }

    return { colorsImage, colorsGlobal, globalCount };
  }, [images, palette, selectedAlgorithm]);

  const sprites = Object.keys(images).length;

  return (
    <div className="w-screen h-screen font-sans text-white p-3">
      <div className="flex p-3 text-gray-500 uppercase text-base">
        <FileDropzone {...{ setImages }} />
        <PaletteGenerate {...{ images, setPalettes }} />
      </div>
      <PaletteSelector {...{ palettes, selectedPalette, setSelectedPalette }} />
      <AlgorithmSelector {...{ selectedAlgorithm, setSelectedAlgorithm }} />
      {selectedPalette && sprites > 0 && (
        <GlobalCounter
          pixels={globalCount}
          sprites={sprites}
          cost={(globalCount * PRICE).toFixed(2)}
          colorsGlobal={colorsGlobal}
        />
      )}
      {Object.keys(images).length > 0 && (
        <ImagesGrid
          palette={palette}
          {...{ images, selectedPalette, colorsImage, PRICE, setSelectedImage }}
        />
      )}
      {selectedImage && (
        <ImageDetail
          id={selectedImage}
          image={images[selectedImage]}
          colors={colorsImage[selectedImage]}
          palette={palette}
          {...{ selectedPalette, setSelectedImage, PRICE }}
        />
      )}
    </div>
  );
};

export default App;
