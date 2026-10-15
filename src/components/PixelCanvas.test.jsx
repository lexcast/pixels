import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PixelCanvas from "./PixelCanvas";

const image = {
  width: 2,
  height: 1,
  colors: ["#101010", null],
};

describe("PixelCanvas", () => {
  it("draws the original colors", () => {
    render(<PixelCanvas image={image} scale={3} label="sprite" />);
    const canvas = screen.getByRole("img", { name: "sprite" });

    expect(canvas).toHaveStyle({ width: "6px", height: "3px" });
    expect([...canvas.__imageData.data]).toEqual([16, 16, 16, 255, 0, 0, 0, 0]);
  });

  it("draws palette colors when a map is given", () => {
    render(
      <PixelCanvas
        image={image}
        map={{ "#101010": "black" }}
        palette={{ black: "rgb(1,2,3)" }}
        label="sprite"
      />,
    );

    const canvas = screen.getByRole("img", { name: "sprite" });
    expect([...canvas.__imageData.data.slice(0, 4)]).toEqual([1, 2, 3, 255]);
  });

  it("reports the hovered pixel", () => {
    const onHover = vi.fn();
    render(
      <PixelCanvas
        image={image}
        map={{ "#101010": "black" }}
        palette={{ black: "#000" }}
        scale={10}
        label="sprite"
        onHover={onHover}
      />,
    );
    const canvas = screen.getByRole("img", { name: "sprite" });
    canvas.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 20,
      height: 10,
    });

    fireEvent.mouseMove(canvas, { clientX: 5, clientY: 5 });
    expect(onHover).toHaveBeenLastCalledWith({
      x: 0,
      y: 0,
      hex: "#101010",
      name: "black",
    });

    fireEvent.mouseMove(canvas, { clientX: 15, clientY: 5 });
    expect(onHover).toHaveBeenLastCalledWith(null);
  });
});
