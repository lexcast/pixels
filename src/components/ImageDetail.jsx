import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import PixelCanvas from "./PixelCanvas";
import ColorCounts from "./ColorCounts";
import { formatMoney, formatNumber } from "../lib/format";

const MAX_ZOOM = 24;

const fitZoom = ({ width, height }) => {
  // Leave room for the modal padding on small screens.
  const space = Math.min(420, window.innerWidth - 96);
  return Math.max(
    1,
    Math.min(MAX_ZOOM, Math.floor(space / Math.max(width, height))),
  );
};

const NavButton = ({ label, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="grid size-8 place-items-center rounded-lg text-ink-300 transition hover:bg-ink-700 hover:text-ink-100"
  >
    {children}
  </button>
);

const ImageDetail = ({
  image,
  analysis,
  palette,
  cost,
  currency,
  position,
  onMove,
  onClose,
}) => {
  const [zoom, setZoom] = useState(() => fitZoom(image));
  const [hovered, setHovered] = useState(null);
  const [shownId, setShownId] = useState(image.id);

  if (shownId !== image.id) {
    setShownId(image.id);
    setZoom(fitZoom(image));
    setHovered(null);
  }
  const onMoveRef = useRef(onMove);

  useEffect(() => {
    onMoveRef.current = onMove;
  });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") onMoveRef.current(-1);
      if (e.key === "ArrowRight") onMoveRef.current(1);
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const headerExtra = (
    <div className="flex items-center gap-1 text-xs text-ink-400">
      <NavButton label="Previous image" onClick={() => onMove(-1)}>
        ‹
      </NavButton>
      <span className="tabular-nums">{position}</span>
      <NavButton label="Next image" onClick={() => onMove(1)}>
        ›
      </NavButton>
    </div>
  );

  return (
    <Modal
      title={image.name}
      onClose={onClose}
      headerExtra={headerExtra}
      className="max-w-5xl"
    >
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-3 text-xs text-ink-400">
          <label htmlFor="zoom">Zoom</label>
          <input
            id="zoom"
            type="range"
            min="1"
            max={MAX_ZOOM}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-40 accent-accent"
          />
          <span className="tabular-nums">{zoom}×</span>
          <span className="ml-auto tabular-nums">
            {image.width}×{image.height}px
          </span>
        </div>

        <div className="scrollbar-thin flex flex-wrap items-start justify-center gap-4 overflow-auto">
          <figure className="flex flex-col items-center gap-2">
            <div className="bg-checker rounded-lg p-2 ring-1 ring-ink-700">
              <img
                src={image.url}
                alt={`${image.name} original`}
                className="pixelated block"
                style={{
                  width: image.width * zoom,
                  height: image.height * zoom,
                }}
              />
            </div>
            <figcaption className="text-xs text-ink-400">Original</figcaption>
          </figure>
          {analysis && (
            <figure className="flex flex-col items-center gap-2">
              <div className="bg-checker rounded-lg p-2 ring-1 ring-ink-700">
                <PixelCanvas
                  image={image}
                  map={analysis.map}
                  palette={palette}
                  scale={zoom}
                  className="block cursor-crosshair"
                  label={`${image.name} matched to palette`}
                  onHover={setHovered}
                />
              </div>
              <figcaption
                className="h-4 text-xs text-ink-400"
                aria-live="polite"
              >
                {hovered ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-block size-3 rounded-sm"
                      style={{ backgroundColor: palette[hovered.name] }}
                    />
                    <b className="text-ink-100">{hovered.name}</b>
                    <span className="tabular-nums">
                      ({hovered.x}, {hovered.y})
                    </span>
                  </span>
                ) : (
                  "Result — hover a pixel to see its color"
                )}
              </figcaption>
            </figure>
          )}
        </div>

        {analysis && (
          <>
            <dl className="flex justify-center gap-6 text-sm">
              <div className="flex gap-1.5">
                <dt className="text-ink-400">Pixels</dt>
                <dd className="font-semibold tabular-nums">
                  {formatNumber(analysis.total)}
                </dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-ink-400">Colors</dt>
                <dd className="font-semibold tabular-nums">
                  {Object.keys(analysis.counts).length}
                </dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-ink-400">Cost</dt>
                <dd className="font-semibold tabular-nums">
                  {formatMoney(analysis.total * cost, currency)}
                </dd>
              </div>
            </dl>
            <ColorCounts counts={analysis.counts} />
          </>
        )}
      </div>
    </Modal>
  );
};

export default ImageDetail;
