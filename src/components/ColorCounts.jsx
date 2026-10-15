import { memo, useState } from "react";
import { sortCounts } from "../lib/analyze";
import { formatNumber } from "../lib/format";

/** Grid of palette colors with how many pixels use each one. */
const ColorCounts = ({ counts, limit = 24 }) => {
  const [expanded, setExpanded] = useState(false);
  const sorted = sortCounts(counts);
  const shown = expanded ? sorted : sorted.slice(0, limit);

  return (
    <div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2">
        {shown.map(({ name, value, count }) => (
          <li
            key={name}
            title={`${name} · ${value}`}
            className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-800/60 p-1.5 pr-2"
          >
            <span
              className="size-8 shrink-0 rounded-md ring-1 ring-black/20 ring-inset"
              style={{ backgroundColor: value }}
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-xs text-ink-300">
                {name}
              </span>
              <span className="block text-sm font-semibold tabular-nums">
                {formatNumber(count)}
              </span>
            </span>
          </li>
        ))}
      </ul>
      {sorted.length > limit && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 w-full rounded-lg py-1.5 text-xs text-ink-400 transition hover:bg-ink-800 hover:text-ink-100"
        >
          {expanded ? "Show less" : `Show all ${sorted.length} colors`}
        </button>
      )}
    </div>
  );
};

export default memo(ColorCounts);
