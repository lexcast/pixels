import React, { useState } from "react";
import FileDropzone from "./FileDropzone";
import PaletteGenerate from "./PaletteGenerate";
import PaletteSelector from "./PaletteSelector";
import GlobalCounter from "./GlobalCounter";
import ImagesGrid from "./ImagesGrid";
import ImageDetail from "./ImageDetail";
import defaultPalettes from "data/palettes";
import closerColor, { algorithms } from "utils/closerColor";

const PRICE = 0.01965;

const App = () => {
  const [images, setImages] = useState({});
  const [palettes, setPalettes] = useState(defaultPalettes);
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const colorsImage = {};
  const colorsGlobal = {};
  let globalCount = 0;
  if (selectedPalette) {
    closerColor.from(palettes[selectedPalette], algorithms.DELTA_E94);

    Object.keys(images).forEach(key => {
      const img = images[key];
      colorsImage[key] = { total: 0, count: {}, map: {} };

      img.pixels.flat().forEach(p => {
        if (!p) {
          return;
        }

        let matched;
        let newP;
        if (!colorsImage[key].map[p.hex]) {
          matched = closerColor.match(p.hex);
          newP = matched.value;
          colorsImage[key].map[p.hex] = matched.name;
        } else {
          newP = palettes[selectedPalette][colorsImage[key].map[p.hex]];
        }

        if (!colorsImage[key].count[newP]) {
          colorsImage[key].count[newP] = { id: matched.name, count: 1 };
        } else {
          colorsImage[key].count[newP].count++;
        }

        if (!colorsGlobal[newP]) {
          colorsGlobal[newP] = { id: matched.name, count: 1 };
        } else {
          colorsGlobal[newP].count++;
        }

        colorsImage[key].total++;
        globalCount++;
      });
    });
  }

  const sprites = Object.keys(images).length;

  return (
    <div className="w-screen h-screen font-sans text-white p-3">
      <div className="flex p-3 text-gray-500 uppercase text-base">
        <FileDropzone {...{ setImages }} />
        <PaletteGenerate {...{ images, setPalettes }} />
      </div>
      <PaletteSelector {...{ palettes, selectedPalette, setSelectedPalette }} />
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
          palette={palettes[selectedPalette]}
          {...{ images, selectedPalette, colorsImage, PRICE, setSelectedImage }}
        />
      )}
      {selectedImage && (
        <ImageDetail
          id={selectedImage}
          image={images[selectedImage]}
          colors={colorsImage[selectedImage]}
          palette={palettes[selectedPalette]}
          {...{ selectedPalette, setSelectedImage, PRICE }}
        />
      )}
    </div>
  );
};

export default App;
