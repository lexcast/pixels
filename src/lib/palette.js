import RgbQuant from "rgbquant";
import { rgbToHex } from "./color";

export const MIN_COLORS = 2;
export const MAX_COLORS = 256;

/**
 * Generates a palette from the given images using RgbQuant.
 *
 * @param {{ data: Uint8ClampedArray, width: number }[]} images
 * @param {number} colors max number of colors
 * @returns {Record<string, string>} map of color name -> hex value
 */
export const generatePalette = (images, colors) => {
  const limit = Math.min(MAX_COLORS, Math.max(MIN_COLORS, Math.round(colors)));
  const quant = new RgbQuant({ colors: limit, method: 1 });

  images.forEach((image) => quant.sample(image.data, image.width));

  const palette = {};
  quant.palette(true).forEach(([r, g, b]) => {
    const hex = rgbToHex(r, g, b);
    palette[hex] = hex;
  });

  return palette;
};

/** Returns `name`, or `name (2)`, `name (3)`... if it is already taken. */
export const uniqueName = (name, taken) => {
  const base = name.trim() || "Palette";
  if (!taken.includes(base)) return base;

  let i = 2;
  while (taken.includes(`${base} (${i})`)) i++;
  return `${base} (${i})`;
};
