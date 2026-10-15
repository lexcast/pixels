import nearestColor from "nearest-color";
import DeltaE from "delta-e";
import { parseColor, rgbToLab } from "./color";

export const algorithms = {
  EUCLIDEAN: "Euclidean",
  DELTA_E76: "DeltaE76",
  DELTA_E94: "DeltaE94",
  DELTA_E00: "DeltaE00",
};

const deltaE = {
  [algorithms.DELTA_E76]: DeltaE.getDeltaE76.bind(DeltaE),
  [algorithms.DELTA_E94]: DeltaE.getDeltaE94.bind(DeltaE),
  [algorithms.DELTA_E00]: DeltaE.getDeltaE00.bind(DeltaE),
};

/**
 * Builds a matcher that finds the closest palette color for a given color.
 * Results are cached per input color, since sprites reuse few colors.
 *
 * @param {Record<string, string>} palette map of color name -> color value
 * @param {string} algorithm one of `algorithms`
 * @returns {(color: string) => { name: string, value: string, distance: number }}
 */
export const createMatcher = (palette, algorithm = algorithms.EUCLIDEAN) => {
  if (!palette || Object.keys(palette).length === 0) {
    throw new Error("Palette must contain at least one color");
  }

  let find;

  if (algorithm === algorithms.EUCLIDEAN) {
    const nearest = nearestColor.from(palette);
    find = (color) => {
      const { name, value, distance } = nearest(color);
      return { name, value, distance };
    };
  } else {
    const distanceFn = deltaE[algorithm];
    if (!distanceFn) throw new Error(`Unknown algorithm: ${algorithm}`);

    const entries = Object.entries(palette).map(([name, value]) => ({
      name,
      value,
      lab: rgbToLab(parseColor(value)),
    }));

    find = (color) => {
      const lab = rgbToLab(parseColor(color));
      let best = entries[0];
      let bestDistance = Infinity;

      for (const entry of entries) {
        const distance = distanceFn(lab, entry.lab);
        if (distance < bestDistance) {
          best = entry;
          bestDistance = distance;
        }
      }

      return { name: best.name, value: best.value, distance: bestDistance };
    };
  }

  const cache = new Map();

  return (color) => {
    let result = cache.get(color);
    if (!result) {
      result = find(color);
      cache.set(color, result);
    }
    return result;
  };
};
