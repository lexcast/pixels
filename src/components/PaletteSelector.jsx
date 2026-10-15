import { memo, useMemo } from "react";
import Swatches from "./Swatches";

const LABELS = { css: "CSS" };

const toSwatches = (palette) =>
  Object.entries(palette).map(([name, value]) => ({ name, value }));

const PaletteSelector = ({
  palettes,
  customNames,
  selectedPalette,
  onSelect,
  onDelete,
}) => {
  const entries = useMemo(
    () =>
      Object.entries(palettes).map(([key, palette]) => ({
        key,
        swatches: toSwatches(palette),
      })),
    [palettes],
  );

  return (
    <ul className="flex flex-col gap-2">
      {entries.map(({ key, swatches }) => {
        const selected = selectedPalette === key;
        const custom = customNames.includes(key);

        return (
          <li key={key} className="group relative">
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(selected ? null : key)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                selected
                  ? "border-accent bg-accent/10 shadow-[0_0_0_1px_var(--color-accent)]"
                  : "border-ink-700 bg-ink-800/40 hover:border-ink-600 hover:bg-ink-800"
              }`}
            >
              <span className="mb-2 flex items-baseline gap-2 pr-6">
                <span className="truncate text-sm font-medium capitalize">
                  {LABELS[key] ?? key}
                </span>
                <span className="text-xs text-ink-400">
                  {swatches.length} colors
                </span>
                {custom && (
                  <span className="rounded bg-accent-2/15 px-1.5 text-[10px] font-medium uppercase text-accent-2">
                    custom
                  </span>
                )}
              </span>
              <Swatches colors={swatches} size={8} max={96} />
            </button>
            {custom && (
              <button
                type="button"
                onClick={() => onDelete(key)}
                aria-label={`Delete palette ${key}`}
                className="absolute top-2 right-2 grid size-6 place-items-center rounded-md text-xs text-ink-400 transition sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 focus-visible:opacity-100"
              >
                ✕
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default memo(PaletteSelector);
