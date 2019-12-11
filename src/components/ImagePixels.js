import React from "react";

const ImagePixels = ({ pixels, width, height }) => {
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
                return (
                  <div
                    key={j}
                    className="inline-block"
                    style={{
                      backgroundColor: `#${p.hex}`,
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
