import React, { useState } from "react";
import FileDropzone from "./FileDropzone";
import PaletteGenerate from "./PaletteGenerate";
import PaletteSelector from "./PaletteSelector";
import GlobalCounter from "./GlobalCounter";
import ImagesGrid from "./ImagesGrid";
import defaultPalettes from "data/palettes";
import nearestColor from "nearest-color";

const PRICE = 0.01965;

const App = () => {
  const [images, setImages] = useState({});
  const [palettes, setPalettes] = useState(defaultPalettes);
  const [selectedPalette, setSelectedPalette] = useState(null);

  const colorsImage = {};
  const colorsGlobal = {};
  let globalCount = 0;
  if (selectedPalette) {
    const matchColor = nearestColor.from(palettes[selectedPalette]);

    Object.keys(images).map(key => {
      const img = images[key];
      colorsImage[key] = { total: 0, count: {}, map: {} };

      img.pixels.flat().forEach(p => {
        if (!p) {
          return;
        }

        let newP;
        if (!colorsImage[key].map[p.hex]) {
          newP = matchColor(p.hex).value;
          colorsImage[key].map[p.hex] = newP;
        } else {
          newP = colorsImage[key].map[p.hex];
        }

        if (!colorsImage[key].count[newP]) {
          colorsImage[key].count[newP] = 1;
        } else {
          colorsImage[key].count[newP]++;
        }

        if (!colorsGlobal[newP]) {
          colorsGlobal[newP] = 1;
        } else {
          colorsGlobal[newP]++;
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
        <ImagesGrid {...{ images, selectedPalette, colorsImage, PRICE }} />
      )}
    </div>
  );
};

export default App;
