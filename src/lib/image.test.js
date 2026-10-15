import { describe, expect, it } from "vitest";
import { readPixels } from "./image";

describe("readPixels", () => {
  it("reads colors and skips transparent pixels", () => {
    // 2x2: red, transparent, red, semi-transparent blue
    const data = new Uint8ClampedArray([
      255, 0, 0, 255, 9, 9, 9, 0, 255, 0, 0, 255, 0, 0, 255, 128,
    ]);

    const { colors, histogram } = readPixels(data, 2, 2);

    expect(colors).toEqual(["#ff0000", null, "#ff0000", "#0000ff"]);
    expect(Object.fromEntries(histogram)).toEqual({
      "#ff0000": 2,
      "#0000ff": 1,
    });
  });
});
