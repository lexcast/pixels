import React from "react";

const ImagePixels = ({ pixels, map, palette, width, height, size, titled }) => {
  return (
    <div
      style={{
        width: width * size + "px",
        height: height * size + "px"
      }}
    >
      {pixels.map((r, i) => {
        return (
          <div className="flex" key={i} style={{ height: size + "px" }}>
            {r.map((p, j) => {
              if (!p) {
                return (
                  <div
                    key={j}
                    className="inline-block bg-transparent"
                    style={{
                      width: size + "px",
                      height: size + "px"
                    }}
                  />
                );
              } else {
                const color = palette ? palette[map[p.hex]] : p.hex;

                return (
                  <div
                    key={j}
                    className="inline-block"
                    title={titled ? map[p.hex] : null}
                    style={{
                      backgroundColor: color,
                      width: size + "px",
                      height: size + "px"
                    }}
                  />
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(ImagePixels);
