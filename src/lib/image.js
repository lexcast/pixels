import { rgbToHex } from "./color";

/**
 * Converts raw RGBA data into a flat list of hex colors (`null` for fully
 * transparent pixels) plus a histogram of how often each color appears.
 *
 * @param {Uint8ClampedArray} data
 * @param {number} width
 * @param {number} height
 */
export const readPixels = (data, width, height) => {
  const size = width * height;
  const colors = new Array(size);
  const histogram = new Map();

  for (let p = 0; p < size; p++) {
    const i = p * 4;

    if (data[i + 3] === 0) {
      colors[p] = null;
      continue;
    }

    const hex = rgbToHex(data[i], data[i + 1], data[i + 2]);
    colors[p] = hex;
    histogram.set(hex, (histogram.get(hex) ?? 0) + 1);
  }

  return { colors, histogram };
};

export const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode image"));
    img.src = url;
  });

export const getImageData = (img) => {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(img, 0, 0);

  return context.getImageData(0, 0, width, height);
};

let nextId = 0;

/** Reads a File into the image model used across the app. */
export const fileToImage = async (file) => {
  const url = URL.createObjectURL(file);

  try {
    const img = await loadImage(url);
    const { data, width, height } = getImageData(img);
    const { colors, histogram } = readPixels(data, width, height);

    return {
      id: `${Date.now().toString(36)}-${nextId++}`,
      name: file.name,
      url,
      width,
      height,
      data,
      colors,
      histogram,
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
};
