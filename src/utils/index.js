const PIXEL_SIZE = 9.826;

const getPixels = img => {
  const w = img.width;
  const h = img.height;
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);

  const data = context.getImageData(0, 0, w, h).data;

  const colors = [];
  for (var y = 0; y < h; y++) {
    colors[y] = [];
    for (var x = 0; x < w; x++) {
      const i = (y * w + x) * 4;

      colors[y][x] =
        data[i + 3] === 0
          ? 0
          : {
              hex: rgbToHex(data[i], data[i + 1], data[i + 2]),
              r: data[i],
              g: data[i + 1],
              b: data[i + 2]
            };
    }
  }

  return colors;
};

const rgbToHex = (r, g, b) => {
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
};

const loadImage = async url => {
  const load = url => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  return await load(url);
};

export { getPixels, loadImage, rgbToHex, PIXEL_SIZE };
