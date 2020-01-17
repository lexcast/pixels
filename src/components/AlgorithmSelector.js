import React from "react";
import { algorithms } from "utils/closerColor";

const AlgorithmSelector = ({ selectedAlgorithm, setSelectedAlgorithm }) => {
  return (
    <div className="flex m-1 items-center justify-center text-base text-gray-400">
      {Object.keys(algorithms).map(key => {
        const a = algorithms[key];

        return (
          <div
            key={a}
            onClick={() => setSelectedAlgorithm(a)}
            className={
              "flex items-center m-2 cursor-pointer rounded border-2 py-1 px-2 border-dashed" +
              (selectedAlgorithm === a
                ? " border-gray-400"
                : " border-transparent")
            }
          >
            {a}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(AlgorithmSelector);
