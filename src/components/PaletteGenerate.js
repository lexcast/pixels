import React, { useCallback } from "react";
import RgbQuant from "rgbquant";
import { rgbToHex } from "utils";

const PaletteGenerate = ({ images, setPalettes }) => {
  const generatePalette = useCallback(() => {
    const title = prompt("Set palette title", "New Palette");
    const limit = prompt("Set palette limit", 32);

    if (limit && title) {
      const q = new RgbQuant({ colors: limit, method: 1 });

      Object.keys(images).forEach(key => {
        q.sample(images[key].image);
      });

      const newPalette = {};
      q.palette(true).forEach(c => {
        const hex = rgbToHex(c[0], c[1], c[2]);
        newPalette[hex] = hex;
      });

      setPalettes(oldPalettes => {
        return { ...oldPalettes, [title]: newPalette };
      });
    }
  }, [images, setPalettes]);

  return (
    <button
      onClick={generatePalette}
      className="uppercase flex items-center justify-center cursor-pointer mx-2 p-6 w-1/2 text-center rounded-lg border-2 hover:bg-gray-800 border-dashed border-gray-500"
    >
      Generate palette from images
    </button>
  );
};

export default React.memo(PaletteGenerate);
