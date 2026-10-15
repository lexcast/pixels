import { useCallback, useMemo, useState } from "react";
import Header from "./Header";
import Panel from "./Panel";
import FileDropzone from "./FileDropzone";
import PaletteSelector from "./PaletteSelector";
import GeneratePaletteDialog from "./GeneratePaletteDialog";
import AlgorithmSelector from "./AlgorithmSelector";
import CostSettings from "./CostSettings";
import Summary from "./Summary";
import ImageList from "./ImageList";
import ImageDetail from "./ImageDetail";
import defaultPalettes from "../data/palettes.json";
import usePersistentState from "../hooks/usePersistentState";
import { algorithms, createMatcher } from "../lib/matcher";
import { analyzeImage, mergeAnalyses } from "../lib/analyze";
import { generatePalette, uniqueName } from "../lib/palette";
import { formatMoney } from "../lib/format";

const DEFAULT_COST = { cost: 0.001, currency: "USD" };

const isObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);
const isAlgorithm = (v) => Object.values(algorithms).includes(v);
const isCost = (v) =>
  isObject(v) &&
  Number.isFinite(v.cost) &&
  v.cost >= 0 &&
  typeof v.currency === "string";

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [generating, setGenerating] = useState(false);

  const [customPalettes, setCustomPalettes] = usePersistentState(
    "pixels:palettes",
    {},
    isObject,
  );
  const [selectedPalette, setSelectedPalette] = usePersistentState(
    "pixels:palette",
    null,
  );
  const [algorithm, setAlgorithm] = usePersistentState(
    "pixels:algorithm",
    algorithms.DELTA_E00,
    isAlgorithm,
  );
  const [{ cost, currency }, setCostSettings] = usePersistentState(
    "pixels:cost",
    DEFAULT_COST,
    isCost,
  );

  const palettes = useMemo(
    () => ({ ...defaultPalettes, ...customPalettes }),
    [customPalettes],
  );
  const palette = selectedPalette ? palettes[selectedPalette] : undefined;

  const matcher = useMemo(
    () => (palette ? createMatcher(palette, algorithm) : null),
    [palette, algorithm],
  );

  const { analyses, global } = useMemo(() => {
    if (!matcher) return { analyses: null, global: null };

    const analyses = new Map(
      images.map((image) => [
        image.id,
        analyzeImage(image, palette, algorithm, matcher),
      ]),
    );

    return { analyses, global: mergeAnalyses([...analyses.values()]) };
  }, [images, palette, algorithm, matcher]);

  const addImages = useCallback((newImages) => {
    setImages((old) => [...old, ...newImages]);
  }, []);

  const removeImage = useCallback((id) => {
    setImages((old) => {
      const image = old.find((i) => i.id === id);
      if (image) URL.revokeObjectURL(image.url);
      return old.filter((i) => i.id !== id);
    });
    setSelectedImageId((selected) => (selected === id ? null : selected));
  }, []);

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.url));
    setImages([]);
    setSelectedImageId(null);
  };

  const moveSelectedImage = (step) => {
    const index = images.findIndex((i) => i.id === selectedImageId);
    const next = (index + step + images.length) % images.length;
    setSelectedImageId(images[next].id);
  };

  const handleGenerate = ({ name, colors }) => {
    const finalName = uniqueName(name, Object.keys(palettes));
    const newPalette = generatePalette(images, colors);

    setCustomPalettes((old) => ({ ...old, [finalName]: newPalette }));
    setSelectedPalette(finalName);
    setGenerating(false);
  };

  const deletePalette = useCallback(
    (name) => {
      setCustomPalettes(({ [name]: _removed, ...rest }) => rest);
      setSelectedPalette((selected) => (selected === name ? null : selected));
    },
    [setCustomPalettes, setSelectedPalette],
  );

  const selectedIndex = images.findIndex((i) => i.id === selectedImageId);
  const selectedImage = images[selectedIndex];
  const hasImages = images.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[20rem_1fr] lg:items-start">
        <aside className="order-2 flex flex-col gap-4 lg:order-none lg:sticky lg:top-4">
          <Panel
            title="Palette"
            description="Pick the colors your beads come in."
            action={
              <button
                type="button"
                disabled={!hasImages}
                onClick={() => setGenerating(true)}
                title={hasImages ? undefined : "Upload images first"}
                className="rounded-lg border border-ink-700 px-2.5 py-1 text-xs text-ink-300 transition hover:border-accent hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink-700"
              >
                + From images
              </button>
            }
          >
            <div className="scrollbar-thin -mr-2 max-h-[40vh] overflow-auto pr-2 lg:max-h-[45vh]">
              <PaletteSelector
                palettes={palettes}
                customNames={Object.keys(customPalettes)}
                selectedPalette={selectedPalette}
                onSelect={setSelectedPalette}
                onDelete={deletePalette}
              />
            </div>
          </Panel>

          <Panel title="Matching">
            <AlgorithmSelector
              selectedAlgorithm={algorithm}
              onSelect={setAlgorithm}
            />
          </Panel>

          <Panel title="Cost">
            <CostSettings
              cost={cost}
              currency={currency}
              onChange={setCostSettings}
            />
            <p className="mt-2 text-xs text-ink-400">
              {formatMoney(cost, currency, 4)} per pixel
            </p>
          </Panel>
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          {!hasImages ? (
            <Panel className="py-10">
              <FileDropzone onImages={addImages} />
            </Panel>
          ) : (
            <>
              {global ? (
                <Panel title="Totals">
                  <Summary
                    sprites={images.length}
                    total={global.total}
                    counts={global.counts}
                    cost={cost}
                    currency={currency}
                  />
                </Panel>
              ) : (
                <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
                  Select a palette to count the pixels of each color.
                </p>
              )}

              <Panel
                title={`Sprites (${images.length})`}
                action={
                  <button
                    type="button"
                    onClick={clearImages}
                    className="rounded-lg px-2.5 py-1 text-xs text-ink-400 transition hover:bg-red-500/15 hover:text-red-300"
                  >
                    Clear all
                  </button>
                }
              >
                <FileDropzone onImages={addImages} compact />
                <div className="mt-3">
                  <ImageList
                    images={images}
                    analyses={analyses}
                    palette={palette}
                    cost={cost}
                    currency={currency}
                    onOpen={setSelectedImageId}
                    onRemove={removeImage}
                  />
                </div>
              </Panel>
            </>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-ink-400">
        Everything runs in your browser — images are never uploaded.
      </footer>

      {selectedImage && (
        <ImageDetail
          image={selectedImage}
          analysis={analyses?.get(selectedImage.id)}
          palette={palette}
          cost={cost}
          currency={currency}
          position={`${selectedIndex + 1} / ${images.length}`}
          onMove={moveSelectedImage}
          onClose={() => setSelectedImageId(null)}
        />
      )}

      {generating && (
        <GeneratePaletteDialog
          defaultName={uniqueName("My palette", Object.keys(palettes))}
          onGenerate={handleGenerate}
          onClose={() => setGenerating(false)}
        />
      )}
    </div>
  );
};

export default App;
