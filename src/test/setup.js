import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// jsdom has no canvas implementation: provide the tiny subset we use.
HTMLCanvasElement.prototype.getContext = function () {
  const canvas = this;
  return {
    canvas,
    createImageData: (w, h) => ({
      width: w,
      height: h,
      data: new Uint8ClampedArray(w * h * 4),
    }),
    putImageData(imageData) {
      canvas.__imageData = imageData;
    },
  };
};

if (!URL.createObjectURL) URL.createObjectURL = () => "blob:mock";
if (!URL.revokeObjectURL) URL.revokeObjectURL = () => {};
