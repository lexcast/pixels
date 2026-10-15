import { describe, expect, it, vi } from "vitest";
import {
  analyzeHistogram,
  analyzeImage,
  mergeAnalyses,
  sortCounts,
} from "./analyze";
import { createMatcher } from "./matcher";

const palette = { black: "#000000", white: "#ffffff" };
const match = createMatcher(palette);

describe("analyzeHistogram", () => {
  it("maps and counts pixels per palette color", () => {
    const histogram = new Map([
      ["#000000", 3],
      ["#111111", 2],
      ["#eeeeee", 4],
    ]);

    expect(analyzeHistogram(histogram, match)).toEqual({
      total: 9,
      map: { "#000000": "black", "#111111": "black", "#eeeeee": "white" },
      counts: {
        black: { name: "black", value: "#000000", count: 5 },
        white: { name: "white", value: "#ffffff", count: 4 },
      },
    });
  });

  it("counts palette colors that share a value separately", () => {
    const match = createMatcher({ aqua: "#00ffff", cyan: "#00ffff" });
    const result = analyzeHistogram(new Map([["#00ffff", 2]]), match);

    expect(Object.values(result.counts)).toHaveLength(1);
    expect(result.total).toBe(2);
  });
});

describe("mergeAnalyses", () => {
  it("adds counts without mutating the inputs", () => {
    const a = analyzeHistogram(new Map([["#000000", 2]]), match);
    const b = analyzeHistogram(
      new Map([
        ["#000000", 3],
        ["#ffffff", 1],
      ]),
      match,
    );
    const snapshot = structuredClone([a, b]);

    const first = mergeAnalyses([a, b]);
    const second = mergeAnalyses([a, b]);

    expect(first).toEqual({
      total: 6,
      counts: {
        black: { name: "black", value: "#000000", count: 5 },
        white: { name: "white", value: "#ffffff", count: 1 },
      },
    });
    // Regression: merging used to mutate cached per-image results, so
    // totals kept growing every time the images changed.
    expect(second).toEqual(first);
    expect([a, b]).toEqual(snapshot);
  });
});

describe("sortCounts", () => {
  it("sorts by count, then name", () => {
    const sorted = sortCounts({
      b: { name: "b", value: "#000", count: 1 },
      a: { name: "a", value: "#000", count: 1 },
      c: { name: "c", value: "#000", count: 5 },
    });
    expect(sorted.map((c) => c.name)).toEqual(["c", "a", "b"]);
  });
});

describe("analyzeImage", () => {
  it("memoizes per image, palette and algorithm", () => {
    const image = { histogram: new Map([["#000000", 1]]) };
    const spy = vi.fn(match);

    const first = analyzeImage(image, palette, "Euclidean", spy);
    expect(analyzeImage(image, palette, "Euclidean", spy)).toBe(first);
    expect(spy).toHaveBeenCalledTimes(1);

    analyzeImage(image, palette, "DeltaE00", spy);
    analyzeImage(image, { ...palette }, "Euclidean", spy);
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
