import { describe, expect, it } from "vitest";
import {
  extractRgb,
  hexToRgb,
  isLight,
  parseColor,
  rgbToHex,
  rgbToLab,
  toHex,
} from "./color";

describe("color utils", () => {
  it("converts rgb to hex with padding", () => {
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
    expect(rgbToHex(255, 10, 1)).toBe("#ff0a01");
  });

  it("parses long and shorthand hex", () => {
    expect(hexToRgb("#ff8000")).toEqual({ r: 255, g: 128, b: 0 });
    expect(hexToRgb("0f0")).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb("nope")).toBeNull();
  });

  it("parses rgb() strings into numbers", () => {
    expect(extractRgb("rgb(1, 2, 3)")).toEqual({ r: 1, g: 2, b: 3 });
    expect(extractRgb("rgba(10,20,30,0.5)")).toEqual({ r: 10, g: 20, b: 30 });
    expect(extractRgb("red")).toBeNull();
  });

  it("parses any supported format", () => {
    expect(parseColor("rgb(255,255,255)")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(toHex("rgb(255, 0, 0)")).toBe("#ff0000");
    expect(toHex("#ABC")).toBe("#aabbcc");
  });

  it("converts to CIE Lab", () => {
    const white = rgbToLab({ r: 255, g: 255, b: 255 });
    expect(white.L).toBeCloseTo(100, 1);
    expect(white.A).toBeCloseTo(0, 1);
    expect(white.B).toBeCloseTo(0, 1);

    const red = rgbToLab({ r: 255, g: 0, b: 0 });
    expect(red.L).toBeCloseTo(53.24, 1);
    expect(red.A).toBeCloseTo(80.09, 0);
    expect(red.B).toBeCloseTo(67.2, 0);
  });

  it("detects light colors", () => {
    expect(isLight("#ffffff")).toBe(true);
    expect(isLight("#000")).toBe(false);
  });
});
