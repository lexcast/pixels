import { memo } from "react";
import PixelCanvas from "./PixelCanvas";
import Swatches from "./Swatches";
import { sortCounts } from "../lib/analyze";
import { formatMoney, formatNumber } from "../lib/format";

const THUMB = 64;

const thumbScale = ({ width, height }) =>
  Math.min(4, THUMB / Math.max(width, height));

const Thumb = ({ children }) => (
  <div className="bg-checker grid size-14 shrink-0 sm:size-18 place-items-center overflow-hidden rounded-lg ring-1 ring-ink-700">
    {children}
  </div>
);

const ImageRow = memo(function ImageRow({
  image,
  analysis,
  palette,
  cost,
  currency,
  onOpen,
  onRemove,
}) {
  const scale = thumbScale(image);

  return (
    <li className="group relative flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-ink-700 hover:bg-ink-800/60">
      <button
        type="button"
        onClick={() => onOpen(image.id)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-label={`Open ${image.name}`}
      >
        <Thumb>
          <img
            src={image.url}
            alt=""
            className="pixelated"
            style={{ width: image.width * scale, height: image.height * scale }}
          />
        </Thumb>
        {analysis && (
          <Thumb>
            <PixelCanvas
              image={image}
              map={analysis.map}
              palette={palette}
              scale={scale}
              label={`${image.name} matched to palette`}
            />
          </Thumb>
        )}
        <span className="min-w-0 flex-1 basis-0">
          <span className="block truncate text-sm font-medium">
            {image.name}
          </span>
          <span className="block text-xs text-ink-400 tabular-nums">
            {image.width}×{image.height}
            {analysis && (
              <>
                {" · "}
                {formatNumber(analysis.total)} px
                {" · "}
                {Object.keys(analysis.counts).length} colors
                <span className="font-semibold text-ink-100 sm:hidden">
                  {" · "}
                  {formatMoney(analysis.total * cost, currency)}
                </span>
              </>
            )}
          </span>
          {analysis && (
            <Swatches
              className="mt-1.5"
              colors={sortCounts(analysis.counts)}
              size={8}
              max={48}
            />
          )}
        </span>
        {analysis && (
          <span className="hidden shrink-0 text-right text-sm font-semibold tabular-nums sm:block">
            {formatMoney(analysis.total * cost, currency)}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        aria-label={`Remove ${image.name}`}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-400 transition sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 focus-visible:opacity-100"
      >
        ✕
      </button>
    </li>
  );
});

const ImageList = ({
  images,
  analyses,
  palette,
  cost,
  currency,
  onOpen,
  onRemove,
}) => (
  <ul className="flex flex-col gap-1">
    {images.map((image) => (
      <ImageRow
        key={image.id}
        image={image}
        analysis={analyses?.get(image.id)}
        palette={palette}
        cost={cost}
        currency={currency}
        onOpen={onOpen}
        onRemove={onRemove}
      />
    ))}
  </ul>
);

export default memo(ImageList);
