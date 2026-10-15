import { memo, useId, useState } from "react";

const CURRENCIES = ["USD", "EUR", "MXN", "GBP", "ARS", "COP", "CLP", "BRL"];

const inputClass =
  "w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2 text-sm tabular-nums transition outline-none focus:border-accent";

const CostSettings = ({ cost, currency, onChange }) => {
  const id = useId();
  // Keep the raw text so partial values like "0." can be typed.
  const [rawCost, setRawCost] = useState(String(cost));

  return (
    <div className="grid grid-cols-[1fr_6rem] gap-2">
      <label className="text-xs text-ink-400">
        Cost per pixel
        <input
          type="number"
          min="0"
          step="0.0001"
          inputMode="decimal"
          value={rawCost}
          onChange={(e) => {
            setRawCost(e.target.value);
            const value = Number.parseFloat(e.target.value);
            if (Number.isFinite(value) && value >= 0) {
              onChange({ cost: value, currency });
            }
          }}
          className={`${inputClass} mt-1`}
        />
      </label>
      <label className="text-xs text-ink-400">
        Currency
        <input
          type="text"
          list={`${id}-currencies`}
          maxLength={8}
          value={currency}
          onChange={(e) =>
            onChange({ cost, currency: e.target.value.toUpperCase() })
          }
          className={`${inputClass} mt-1 uppercase`}
        />
        <datalist id={`${id}-currencies`}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>
    </div>
  );
};

export default memo(CostSettings);
