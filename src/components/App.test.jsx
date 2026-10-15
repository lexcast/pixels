import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { readPixels } from "../lib/image";

vi.mock("../lib/image", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, fileToImage: vi.fn() };
});

const { fileToImage } = await import("../lib/image");

let id = 0;
const fakeImage = (name, rgba, width, height) => {
  const data = new Uint8ClampedArray(rgba);
  return {
    id: `img-${id++}`,
    name,
    url: `blob:${name}`,
    width,
    height,
    data,
    ...readPixels(data, width, height),
  };
};

// 2x1: black + transparent  |  2x2: three whites + one near-black
const imageA = () => fakeImage("a.png", [0, 0, 0, 255, 0, 0, 0, 0], 2, 1);
const imageB = () =>
  fakeImage(
    "b.png",
    [
      255, 255, 255, 255, 250, 250, 250, 255, 255, 255, 255, 255, 20, 20, 20,
      255,
    ],
    2,
    2,
  );

const upload = async (user, ...files) => {
  const input = screen.getAllByLabelText("Upload images")[0];
  await user.upload(
    input,
    files.map((name) => new File(["x"], name, { type: "image/png" })),
  );
};

const stat = (label) =>
  within(screen.getByText(label, { selector: "dt" }).parentElement).getByRole(
    "definition",
  );

describe("App", () => {
  beforeEach(() => {
    id = 0;
    fileToImage.mockReset();
    fileToImage.mockImplementation(async (file) =>
      file.name === "a.png" ? imageA() : imageB(),
    );
  });

  it("shows the upload area when empty", () => {
    render(<App />);
    expect(screen.getByText(/drop sprites here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /from images/i })).toBeDisabled();
  });

  it("counts pixels per color once a palette is selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    await upload(user, "a.png", "b.png");
    expect(await screen.findByText("a.png")).toBeInTheDocument();
    expect(screen.getByText(/select a palette/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /default/i }));

    expect(stat("Sprites")).toHaveTextContent("2");
    expect(stat("Pixels")).toHaveTextContent("5");
    expect(stat("Colors")).toHaveTextContent("2");
    // 5 pixels * 0.001 per pixel
    expect(stat("Cost")).toHaveTextContent(/0[.,]01/);

    // Totals stay correct after adding more images (no mutated caches).
    await upload(user, "a.png");
    expect(await screen.findAllByText("a.png")).toHaveLength(2);
    expect(stat("Pixels")).toHaveTextContent("6");
  });

  it("reports files that cannot be read", async () => {
    fileToImage.mockRejectedValueOnce(new Error("bad"));
    const user = userEvent.setup();
    render(<App />);

    await upload(user, "broken.png");
    expect(await screen.findByRole("alert")).toHaveTextContent("broken.png");
  });

  it("removes images", async () => {
    const user = userEvent.setup();
    render(<App />);
    await upload(user, "a.png", "b.png");
    await screen.findByText("b.png");

    await user.click(screen.getByRole("button", { name: "Remove a.png" }));
    expect(screen.queryByText("a.png")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear all/i }));
    expect(screen.queryByText("b.png")).not.toBeInTheDocument();
    expect(screen.getByText(/drop sprites here/i)).toBeInTheDocument();
  });

  it("opens the detail view and navigates with the keyboard", async () => {
    const user = userEvent.setup();
    render(<App />);
    await upload(user, "a.png", "b.png");
    await user.click(screen.getByRole("button", { name: /default/i }));

    await user.click(await screen.findByRole("button", { name: "Open a.png" }));
    const dialog = screen.getByRole("dialog", { name: "a.png" });
    expect(within(dialog).getByText("1 / 2")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog", { name: "b.png" })).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog", { name: "a.png" })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("dialog", { name: "b.png" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("persists cost settings", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    const costInput = screen.getByLabelText(/cost per pixel/i);
    await user.clear(costInput);
    await user.type(costInput, "0.05");
    const currency = screen.getByLabelText(/currency/i);
    await user.clear(currency);
    await user.type(currency, "eur");

    expect(JSON.parse(localStorage.getItem("pixels:cost"))).toEqual({
      cost: 0.05,
      currency: "EUR",
    });

    unmount();
    render(<App />);
    expect(screen.getByLabelText(/cost per pixel/i)).toHaveValue(0.05);
    expect(screen.getByLabelText(/currency/i)).toHaveValue("EUR");
  });

  it("ignores invalid stored settings", () => {
    localStorage.setItem("pixels:cost", '{"cost":"x"}');
    localStorage.setItem("pixels:algorithm", '"Nope"');
    render(<App />);

    expect(screen.getByLabelText(/cost per pixel/i)).toHaveValue(0.001);
    expect(screen.getByRole("radio", { name: "ΔE 00" })).toBeChecked();
  });

  it("generates, selects and deletes a custom palette", async () => {
    const user = userEvent.setup();
    render(<App />);
    await upload(user, "b.png");
    await screen.findByText("b.png");

    await user.click(screen.getByRole("button", { name: /from images/i }));
    const dialog = screen.getByRole("dialog", { name: /generate palette/i });
    const name = within(dialog).getByLabelText("Name");
    await user.clear(name);
    await user.type(name, "Sprites");
    await user.click(within(dialog).getByRole("button", { name: "Generate" }));

    const paletteButton = screen.getByRole("button", {
      name: /sprites.*custom/i,
    });
    expect(paletteButton).toHaveAttribute("aria-pressed", "true");
    expect(stat("Colors")).toHaveTextContent("3");
    expect(JSON.parse(localStorage.getItem("pixels:palettes"))).toHaveProperty(
      "Sprites",
    );

    await user.click(
      screen.getByRole("button", { name: "Delete palette Sprites" }),
    );
    expect(
      screen.queryByRole("button", { name: /sprites.*custom/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/select a palette/i)).toBeInTheDocument();
  });
});
