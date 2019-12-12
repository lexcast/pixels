import React from "react";

const ImagePixels = ({ pixels, palette, width, height }) => {
  return (
    <div
      style={{
        width: width * 9.826 + "px",
        height: height * 9.826 + "px"
      }}
    >
      {pixels.map((r, i) => {
        return (
          <div
            className="flex"
            key={i}
            style={{
              height: "9.826px"
            }}
          >
            {r.map((p, j) => {
              if (!p) {
                return (
                  <div
                    key={j}
                    className="inline-block bg-transparent"
                    style={{
                      width: "9.826px",
                      height: "9.826px"
                    }}
                  />
                );
              } else {
                const color = palette ? palette[p.hex] : p.hex;

                return (
                  <div
                    key={j}
                    className="inline-block"
                    style={{
                      backgroundColor: color,
                      width: "9.826px",
                      height: "9.826px"
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
