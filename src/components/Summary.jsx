import { memo } from "react";
import ColorCounts from "./ColorCounts";
import { formatMoney, formatNumber } from "../lib/format";

const Stat = ({ label, value, highlight }) => (
  <div className="rounded-xl border border-ink-700 bg-ink-800/50 px-4 py-3">
    <dt className="text-[11px] font-medium uppercase tracking-widest text-ink-400">
      {label}
    </dt>
    <dd
      className={`mt-1 text-2xl font-semibold tabular-nums ${
        highlight
          ? "bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent"
          : ""
      }`}
    >
      {value}
    </dd>
  </div>
);

const Summary = ({ sprites, total, counts, cost, currency }) => (
  <div className="flex flex-col gap-4">
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat label="Sprites" value={formatNumber(sprites)} />
      <Stat label="Pixels" value={formatNumber(total)} />
      <Stat label="Colors" value={formatNumber(Object.keys(counts).length)} />
      <Stat
        label="Cost"
        value={formatMoney(total * cost, currency)}
        highlight
      />
    </dl>
    <ColorCounts counts={counts} />
  </div>
);

export default memo(Summary);
