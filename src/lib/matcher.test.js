import { describe, expect, it } from "vitest";
import { algorithms, createMatcher } from "./matcher";
import palettes from "../data/palettes.json";

const palette = { black: "#000", white: "rgb(255,255,255)", red: "#ff0000" };

describe("createMatcher", () => {
  it.each(Object.values(algorithms))("matches exact colors with %s", (alg) => {
    const match = createMatcher(palette, alg);

    expect(match("#000000").name).toBe("black");
    expect(match("#ffffff")).toMatchObject({
      name: "white",
      value: "rgb(255,255,255)",
    });
    expect(match("#ff0000").distance).toBeCloseTo(0);
  });

  it.each(Object.values(algorithms))(
    "finds the closest color with %s",
    (alg) => {
      const match = createMatcher(palette, alg);

      expect(match("#202020").name).toBe("black");
      expect(match("#f0f0f0").name).toBe("white");
      expect(match("#d01010").name).toBe("red");
    },
  );

  it("works with the bundled rgb() palettes", () => {
    const match = createMatcher(palettes.artkal, algorithms.DELTA_E00);
    expect(match("#ffffff").name).toBe("C01");
  });

  it("caches results per color", () => {
    const match = createMatcher(palette, algorithms.DELTA_E00);
    expect(match("#123456")).toBe(match("#123456"));
  });

  it("rejects empty palettes and unknown algorithms", () => {
    expect(() => createMatcher({}, algorithms.EUCLIDEAN)).toThrow();
    expect(() => createMatcher(palette, "nope")).toThrow(/Unknown algorithm/);
  });
});
