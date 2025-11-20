import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export function syncCSSPosition() {
  const tree = useSelector((state: RootState) => state.treeReducer.tree);
  const rootNodePosition = useRef<DOMRect | null>(
    document.getElementById("node-root")
      ? (
          document.getElementById("node-root") as HTMLDivElement
        ).getBoundingClientRect()
      : null,
  );

  useEffect(() => {
    const update = () => {
      rootNodePosition.current = (
        document.getElementById("node-root") as HTMLDivElement
      ).getBoundingClientRect();

      console.log(
        document.getElementById("node-root"),
        rootNodePosition.current,
      );

      const syncEntireTree = (id: number) => {
        syncPositionById(id);
        tree[id].map((child) => syncEntireTree(child));
      };
      tree[-1].map((child) => syncEntireTree(child));
    };

    const rootNode = document.getElementById("node-root") as HTMLDivElement;
    const playground = document.getElementById("playground");
    if (!rootNode || !playground) return;

    const observer = new ResizeObserver(update);
    observer.observe(rootNode);

    const observer2 = new ResizeObserver(update);
    observer2.observe(playground);

    return () => {
      observer.disconnect();
      observer2.disconnect();
    };
  }, []);

  const syncPositionById = (id: number) => {
    let node = document.getElementById("node-" + id);
    if (!node || !rootNodePosition.current) return;

    if (node.style.position === "fixed" && rootNodePosition.current.top > 0) {
      node.style.transform = `translate(${Math.floor(rootNodePosition.current.left)}px, ${Math.floor(rootNodePosition.current.top)}px)`;
      node.style.width = `${Math.floor(rootNodePosition.current.width)}px`;
    }
  };
}
