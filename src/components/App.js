import React, { useState, useMemo } from "react";
import FileDropzone from "./FileDropzone";
import PaletteGenerate from "./PaletteGenerate";
import PaletteSelector from "./PaletteSelector";
import AlgorithmSelector from "./AlgorithmSelector";
import GlobalCounter from "./GlobalCounter";
import ImagesGrid from "./ImagesGrid";
import ImageDetail from "./ImageDetail";
import Cost from "./Cost";
import defaultPalettes from "data/palettes";
import closerColor, { algorithms } from "utils/closerColor";
import imageColors from "selectors/imageColors";

const DEFAULT_COST = 0.001;
const DEFAULT_CURRENCY = "USD";

const App = () => {
  const [cost, setCost] = useState(
    localStorage.getItem("cost") || DEFAULT_COST
  );
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || DEFAULT_CURRENCY
  );
  const [images, setImages] = useState({});
  const [palettes, setPalettes] = useState(defaultPalettes);
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    algorithms.DELTA_E00
  );

  const moveSelectedImage = (move) => {
    const imagesKeys = Object.keys(images);
    const index = imagesKeys.indexOf(selectedImage);
    const newIndex =
      index + move < 0
        ? imagesKeys.length - 1
        : index + move > imagesKeys.length - 1
        ? 0
        : index + move;

    setSelectedImage(imagesKeys[newIndex]);
  };

  const palette = palettes[selectedPalette];

  const { colorsImage, colorsGlobal, globalCount } = useMemo(() => {
    const colorsImage = {};
    const colorsGlobal = {};
    let globalCount = 0;

    if (palette) {
      closerColor.from(palette, selectedAlgorithm);

      Object.keys(images).forEach((key) => {
        const img = images[key];

        const { colorImage, colorGlobal, count } = imageColors({
          img,
          closerColor,
          palette,
          selectedAlgorithm,
        });

        colorsImage[key] = colorImage;
        globalCount += count;
        Object.keys(colorGlobal).forEach((p) => {
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
        <Cost {...{ cost, currency, setCost, setCurrency }} />
      </div>
      <PaletteSelector {...{ palettes, selectedPalette, setSelectedPalette }} />
      <AlgorithmSelector {...{ selectedAlgorithm, setSelectedAlgorithm }} />
      {selectedPalette && sprites > 0 && (
        <GlobalCounter
          pixels={globalCount}
          sprites={sprites}
          cost={(globalCount * cost).toFixed(2)}
          colorsGlobal={colorsGlobal}
        />
      )}
      {Object.keys(images).length > 0 && (
        <ImagesGrid
          {...{
            palette,
            images,
            selectedPalette,
            colorsImage,
            cost,
            currency,
            setSelectedImage,
          }}
        />
      )}
      {selectedImage && (
        <ImageDetail
          id={selectedImage}
          image={images[selectedImage]}
          colors={colorsImage[selectedImage]}
          {...{
            palette,
            selectedPalette,
            setSelectedImage,
            cost,
            moveSelectedImage,
          }}
        />
      )}
    </div>
  );
};

export default App;
