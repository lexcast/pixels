import nearestColor from "nearest-color";
import { rgbToLab, extractRgb, hexToRgb } from "utils";
import DeltaE from "delta-e";

export const algorithms = {
  EUCLIDEAN: "Euclidean",
  DELTA_E76: "DeltaE76",
  DELTA_E94: "DeltaE94",
  DELTA_E00: "DeltaE00"
};

let palette = {};
let algorithm;
let matchColor;

const from = (colors, alg = algorithms.EUCLIDEAN) => {
  algorithm = alg;
  if (algorithm === algorithms.EUCLIDEAN) {
    matchColor = nearestColor.from(colors);
  } else {
    palette = toLab(colors);
  }
};

const match = color => {
  if (algorithm === algorithms.EUCLIDEAN) {
    return matchColor(color);
  }

  let minDistance = Infinity;
  let minIndex;

  palette.forEach((p, i) => {
    const lab = color.includes("#")
      ? rgbToLab(hexToRgb(color))
      : rgbToLab(extractRgb(color));

    const distance = DeltaE["get" + algorithm](lab, p.lab);
    if (distance < minDistance) {
      minIndex = i;
      minDistance = distance;
    }
  });

  const minP = palette[minIndex];

  return {
    name: minP.id,
    value: minP.value,
    distance: minDistance
  };
};

const toLab = colors => {
  return Object.keys(colors).map(id => {
    const value = colors[id];
    const lab = value.includes("#")
      ? rgbToLab(hexToRgb(value))
      : rgbToLab(extractRgb(value));

    return { id, value, lab };
  });
};

export default { from, match };
