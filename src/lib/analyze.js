/**
 * @typedef {{ name: string, value: string, count: number }} ColorCount
 * @typedef {{ total: number, map: Record<string, string>, counts: Record<string, ColorCount> }} Analysis
 */

/**
 * Maps every color of an image to its closest palette color and counts how
 * many pixels (beads) of each palette color are needed.
 *
 * @param {Map<string, number>} histogram source color -> pixel count
 * @param {(color: string) => { name: string, value: string }} match
 * @returns {Analysis}
 */
export const analyzeHistogram = (histogram, match) => {
  const map = {};
  const counts = {};
  let total = 0;

  for (const [hex, count] of histogram) {
    const { name, value } = match(hex);
    map[hex] = name;

    if (counts[name]) {
      counts[name].count += count;
    } else {
      counts[name] = { name, value, count };
    }

    total += count;
  }

  return { total, map, counts };
};

/**
 * Merges several analyses into one global count. Never mutates its inputs.
 *
 * @param {Analysis[]} analyses
 * @returns {{ total: number, counts: Record<string, ColorCount> }}
 */
export const mergeAnalyses = (analyses) => {
  const counts = {};
  let total = 0;

  for (const analysis of analyses) {
    total += analysis.total;

    for (const { name, value, count } of Object.values(analysis.counts)) {
      if (counts[name]) {
        counts[name] = { ...counts[name], count: counts[name].count + count };
      } else {
        counts[name] = { name, value, count };
      }
    }
  }

  return { total, counts };
};

/** Sorts color counts from the most used to the least used. */
export const sortCounts = (counts) =>
  Object.values(counts).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );

const cache = new WeakMap();

/**
 * Memoized `analyzeHistogram`: results are cached per image, palette and
 * algorithm, and released when the image or palette objects are discarded.
 */
export const analyzeImage = (image, palette, algorithm, match) => {
  let byPalette = cache.get(image);
  if (!byPalette) {
    byPalette = new WeakMap();
    cache.set(image, byPalette);
  }

  let byAlgorithm = byPalette.get(palette);
  if (!byAlgorithm) {
    byAlgorithm = new Map();
    byPalette.set(palette, byAlgorithm);
  }

  let result = byAlgorithm.get(algorithm);
  if (!result) {
    result = analyzeHistogram(image.histogram, match);
    byAlgorithm.set(algorithm, result);
  }

  return result;
};
