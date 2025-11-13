import { useEffect, useState } from "react";
import type { NodeStyle } from "../types/Tree";

export function getPositionOfNode({
  id,
  type,
  styleMap,
  ref,
}: {
  id?: number | null;
  type?: string;
  styleMap?: NodeStyle;
  ref?: HTMLDivElement | null;
}) {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  // event listeners for syncing position of infobar overlay
  useEffect(() => {
    if (!id || type === "root") {
      setPosition({ top: 0, left: 0, width: 0, height: 0 });
      return;
    }

    const nodeDim = id ? document.getElementById(`node-${id}`) : ref;
    const wrapper_1 = document.getElementById("wrapper_1");
    const nodeRoot = document.getElementById("node-root");
    const playground = document.getElementById("playground");
    if (!nodeDim || !wrapper_1 || !nodeRoot || !playground) return;

    const updateDim = () => {
      setPosition(nodeDim.getBoundingClientRect());
    };

    const observer = new ResizeObserver(updateDim);
    observer.observe(nodeDim);

    const observer2 = new ResizeObserver(updateDim);
    observer2.observe(nodeRoot);

    const observer3 = new ResizeObserver(updateDim);
    observer3.observe(playground);

    wrapper_1.addEventListener("scroll", updateDim);

    updateDim();

    return () => {
      observer.disconnect();
      observer2.disconnect();
      observer3.disconnect();
      wrapper_1.removeEventListener("scroll", updateDim);
    };
  }, [id, type, styleMap, ref]);

  return { position };
}
