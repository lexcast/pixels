import { memo } from "react";

/** Compact strip of color squares. */
const Swatches = ({ colors, size = 10, max = Infinity, className = "" }) => {
  const shown = colors.slice(0, max);
  const hidden = colors.length - shown.length;

  return (
    <div className={`flex flex-wrap items-center gap-px ${className}`}>
      {shown.map(({ name, value }) => (
        <span
          key={name}
          title={name}
          className="inline-block rounded-[2px] ring-1 ring-black/20 ring-inset"
          style={{ backgroundColor: value, width: size, height: size }}
        />
      ))}
      {hidden > 0 && (
        <span className="ml-1 text-[10px] text-ink-400">+{hidden}</span>
      )}
    </div>
  );
};

export default memo(Swatches);
