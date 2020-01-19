import { createSelectorCreator } from "reselect";
import memoize from "lodash.memoize";

const hashFn = (...args) =>
  args.reduce((acc, val) => acc + "-" + JSON.stringify(val), "");
const createSelector = createSelectorCreator(memoize, hashFn);

const imageColors = createSelector(
  a => a.img,
  a => a.closerColor,
  a => a.palette,
  a => a.selectedAlgorithm,
  (img, closerColor, palette) => {
    let count = 0;
    const colorImage = { total: 0, count: {}, map: {} };
    const colorGlobal = {};

    img.pixels.flat().forEach(p => {
      if (!p) {
        return;
      }

      let matched;
      let newP;
      if (!colorImage.map[p.hex]) {
        matched = closerColor.match(p.hex);
        newP = matched.value;
        colorImage.map[p.hex] = matched.name;
      } else {
        newP = palette[colorImage.map[p.hex]];
      }

      if (!colorImage.count[newP]) {
        colorImage.count[newP] = { id: matched.name, count: 1 };
      } else {
        colorImage.count[newP].count++;
      }

      if (!colorGlobal[newP]) {
        colorGlobal[newP] = { id: matched.name, count: 1 };
      } else {
        colorGlobal[newP].count++;
      }

      colorImage.total++;
      count++;
    });

    return { colorImage, colorGlobal, count };
  }
);

export default imageColors;
