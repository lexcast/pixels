import { memo, useEffect, useRef } from "react";
import { parseColor } from "../lib/color";

/**
 * Draws an image (optionally recolored with a palette) into a canvas, one
 * canvas pixel per image pixel, and scales it up with CSS.
 */
const PixelCanvas = ({
  image,
  map,
  palette,
  scale = 1,
  className = "",
  label,
  onHover,
}) => {
  const ref = useRef(null);
  const { width, height, colors } = image;

  useEffect(() => {
    const context = ref.current?.getContext("2d");
    if (!context) return;

    const output = context.createImageData(width, height);
    const rgbCache = new Map();

    colors.forEach((hex, p) => {
      if (!hex) return;

      const target = map && palette ? palette[map[hex]] : hex;
      let rgb = rgbCache.get(target);
      if (!rgb) {
        rgb = parseColor(target);
        rgbCache.set(target, rgb);
      }

      const i = p * 4;
      output.data[i] = rgb.r;
      output.data[i + 1] = rgb.g;
      output.data[i + 2] = rgb.b;
      output.data[i + 3] = 255;
    });

    context.putImageData(output, 0, 0);
  }, [width, height, colors, map, palette]);

  const handleMove = onHover
    ? (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.floor(((e.clientX - rect.left) / rect.width) * width);
        const y = Math.floor(((e.clientY - rect.top) / rect.height) * height);

        if (x < 0 || y < 0 || x >= width || y >= height) {
          onHover(null);
          return;
        }

        const hex = colors[y * width + x];
        onHover(hex ? { x, y, hex, name: map?.[hex] } : null);
      }
    : undefined;

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      onMouseMove={handleMove}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
      className={`pixelated ${className}`}
      style={{ width: width * scale, height: height * scale }}
    />
  );
};

export default memo(PixelCanvas);
