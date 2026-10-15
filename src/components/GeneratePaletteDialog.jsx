import { useState } from "react";
import Modal from "./Modal";
import { MAX_COLORS, MIN_COLORS } from "../lib/palette";

const GeneratePaletteDialog = ({ defaultName, onGenerate, onClose }) => {
  const [name, setName] = useState(defaultName);
  const [colors, setColors] = useState(32);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ name, colors: Number(colors) });
  };

  return (
    <Modal
      title="Generate palette from images"
      onClose={onClose}
      className="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <label className="text-xs text-ink-400">
          Name
          <input
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm text-ink-100 outline-none focus:border-accent"
          />
        </label>
        <label className="text-xs text-ink-400">
          <span className="flex justify-between">
            Max colors{" "}
            <span className="tabular-nums text-ink-100">{colors}</span>
          </span>
          <input
            type="range"
            min={MIN_COLORS}
            max={MAX_COLORS}
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            className="mt-2 w-full accent-accent"
          />
        </label>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-ink-300 hover:bg-ink-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-accent-strong"
          >
            Generate
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GeneratePaletteDialog;
