import { describe, expect, it } from "vitest";
import { generatePalette, uniqueName } from "./palette";

const solid = (width, height, colors) => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    data.set([...colors[p % colors.length], 255], p * 4);
  }
  return { data, width, height };
};

describe("generatePalette", () => {
  it("extracts the colors of the images", () => {
    const palette = generatePalette(
      [solid(4, 4, [[255, 0, 0]]), solid(4, 4, [[0, 0, 255]])],
      8,
    );

    expect(Object.keys(palette).sort()).toEqual(["#0000ff", "#ff0000"]);
    expect(palette["#ff0000"]).toBe("#ff0000");
  });

  it("respects the color limit", () => {
    const colors = Array.from({ length: 64 }, (_, i) => [
      i * 4,
      255 - i * 4,
      (i * 37) % 256,
    ]);
    const palette = generatePalette([solid(8, 8, colors)], 4);

    expect(Object.keys(palette).length).toBeLessThanOrEqual(4);
    expect(Object.keys(palette).length).toBeGreaterThan(0);
  });
});

describe("uniqueName", () => {
  it("adds a suffix when the name is taken", () => {
    expect(uniqueName("Mine", [])).toBe("Mine");
    expect(uniqueName("Mine", ["Mine"])).toBe("Mine (2)");
    expect(uniqueName("Mine", ["Mine", "Mine (2)"])).toBe("Mine (3)");
    expect(uniqueName("   ", [])).toBe("Palette");
  });
});
