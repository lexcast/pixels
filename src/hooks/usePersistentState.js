import { useEffect, useState } from "react";
import { storage } from "../lib/storage";

/** `useState` that is restored from and saved to localStorage. */
const usePersistentState = (key, initial, validate = () => true) => {
  const [value, setValue] = useState(() => {
    const stored = storage.get(key, undefined);
    return stored !== undefined && validate(stored) ? stored : initial;
  });

  useEffect(() => {
    storage.set(key, value);
  }, [key, value]);

  return [value, setValue];
};

export default usePersistentState;
