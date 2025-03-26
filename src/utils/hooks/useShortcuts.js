import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { copy, cut, duplicate, paste } from "../../store/reducers/treeReducer";

export default function useShortcuts() {
  const keyPressed = useRef({});
  const dispatch = useDispatch();

  useEffect(() => {
    const handlePress = (e) => {
      if (e.target.tabIndex !== 1) return;
      if (keyPressed.current["Control"]) {
        e.preventDefault();
        keyPressed.current = {};
        if (e.key === "x") dispatch(cut());
        if (e.key === "c") dispatch(copy());
        if (e.key === "v") dispatch(paste());
        if (e.key === "d") dispatch(duplicate());
      }
      keyPressed.current[e.key] = true;
    };
    const handleUp = (e) => {
      delete keyPressed.current[e.key];
    };

    document.addEventListener("keydown", handlePress);
    document.addEventListener("keyup", handleUp);
    return () => {
      document.removeEventListener("keydown", handlePress);
      document.removeEventListener("keyup", handleUp);
    };
  }, []);
}
