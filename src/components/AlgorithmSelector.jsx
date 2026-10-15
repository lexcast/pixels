import { memo } from "react";
import { algorithms } from "../lib/matcher";

const descriptions = {
  [algorithms.EUCLIDEAN]: "Fast RGB distance. Can look off for similar hues.",
  [algorithms.DELTA_E76]: "CIE76: euclidean distance in Lab space.",
  [algorithms.DELTA_E94]: "CIE94: weights lightness, chroma and hue.",
  [algorithms.DELTA_E00]: "CIEDE2000: the most accurate perceptual match.",
};

const AlgorithmSelector = ({ selectedAlgorithm, onSelect }) => (
  <div>
    <div
      role="radiogroup"
      aria-label="Color matching algorithm"
      className="grid grid-cols-2 gap-1 rounded-xl bg-ink-900/80 p-1 sm:grid-cols-4"
    >
      {Object.values(algorithms).map((a) => {
        const selected = selectedAlgorithm === a;
        return (
          <button
            key={a}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(a)}
            className={`rounded-lg px-2 py-1.5 text-xs font-medium transition ${
              selected
                ? "bg-ink-700 text-ink-100 shadow"
                : "text-ink-400 hover:text-ink-100"
            }`}
          >
            {a.replace("DeltaE", "ΔE ")}
          </button>
        );
      })}
    </div>
    <p className="mt-2 text-xs text-ink-400">
      {descriptions[selectedAlgorithm]}
    </p>
  </div>
);

export default memo(AlgorithmSelector);
