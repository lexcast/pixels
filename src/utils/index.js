const PIXEL_SIZE = 9.826;

const getPixels = img => {
  const w = img.width;
  const h = img.height;
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);

  const data = context.getImageData(0, 0, w, h).data;

  const colors = [];
  for (var y = 0; y < h; y++) {
    colors[y] = [];
    for (var x = 0; x < w; x++) {
      const i = (y * w + x) * 4;

      colors[y][x] =
        data[i + 3] === 0
          ? 0
          : {
              hex: rgbToHex(data[i], data[i + 1], data[i + 2]),
              r: data[i],
              g: data[i + 1],
              b: data[i + 2]
            };
    }
  }

  return colors;
};

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
};

const loadImage = async url => {
  const load = url => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  return await load(url);
};

const rgbToLab = rgb => {
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;
  let x;
  let y;
  let z;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return { L: 116 * y - 16, A: 500 * (x - y), B: 200 * (y - z) };
};

const hexToRgb = hex => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
};

const extractRgb = rgb => {
  const d = rgb
    .substring(4, rgb.length - 1)
    .replace(/ /g, "")
    .split(",");

  return { r: d[0], g: d[1], b: d[2] };
};

export {
  getPixels,
  loadImage,
  rgbToHex,
  rgbToLab,
  hexToRgb,
  extractRgb,
  PIXEL_SIZE
};
