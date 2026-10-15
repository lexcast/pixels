const toHexByte = (n) => Math.round(n).toString(16).padStart(2, "0");

export const rgbToHex = (r, g, b) =>
  "#" + toHexByte(r) + toHexByte(g) + toHexByte(b);

export const hexToRgb = (hex) => {
  const expanded = hex.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (m, r, g, b) => r + r + g + g + b + b,
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const extractRgb = (rgb) => {
  const match = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(rgb.trim());

  return match
    ? { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) }
    : null;
};

/** Parses `#rgb`, `#rrggbb` or `rgb(r, g, b)` strings. */
export const parseColor = (color) =>
  color.trim().startsWith("rgb") ? extractRgb(color) : hexToRgb(color);

/** Normalizes any supported color string to lowercase `#rrggbb`. */
export const toHex = (color) => {
  const rgb = parseColor(color);
  return rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : null;
};

export const rgbToLab = ({ r, g, b }) => {
  const linear = (c) => {
    c /= 255;
    return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  };
  const lr = linear(r);
  const lg = linear(g);
  const lb = linear(b);

  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((lr * 0.4124 + lg * 0.3576 + lb * 0.1805) / 0.95047);
  const y = f(lr * 0.2126 + lg * 0.7152 + lb * 0.0722);
  const z = f((lr * 0.0193 + lg * 0.1192 + lb * 0.9505) / 1.08883);

  return { L: 116 * y - 16, A: 500 * (x - y), B: 200 * (y - z) };
};

/** Relative luminance check used to pick readable text over a swatch. */
export const isLight = (color) => {
  const rgb = parseColor(color);
  if (!rgb) return false;
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 > 150;
};
