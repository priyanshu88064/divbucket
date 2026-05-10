import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@core/utils/Resizable/resizable.module.css";
import type { AppDispatch, RootState } from "@core/state/store";
import { updateStyleMap } from "@core/state/reducers/treeReducer";
import { selectNodeDefaultStyleById } from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "./useRenderCounter";

export function useResizer({ id }: { id: number }) {
  useRenderCounter("useResizer");
  const styleMap = useSelector((state: RootState) =>
    selectNodeDefaultStyleById(state, id),
  );
  const virtualPos = useRef<{
    top: number | null;
    bottom: number | null;
    left: number | null;
    right: number | null;
  }>({
    top: null,
    bottom: null,
    left: null,
    right: null,
  });
  const [dim, setDim] = useState({
    width: styleMap.width,
    height: styleMap.height,
  });
  const divRef = useRef<HTMLDivElement | null>(null);
  const dirRef = useRef<number | null>(null);
  const isResizingRef = useRef<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setDim({
      width: styleMap.width,
      height: styleMap.height,
    });
  }, [styleMap, id]);

  const calWidth = () => {
    if (virtualPos.current.right && virtualPos.current.left) {
      return (
        Math.floor(
          Math.max(0, virtualPos.current.right - virtualPos.current.left),
        ) + "px"
      );
    }

    throw new Error();
  };
  const calHeight = () => {
    if (virtualPos.current.bottom && virtualPos.current.top) {
      return (
        Math.floor(
          Math.max(0, virtualPos.current.bottom - virtualPos.current.top),
        ) + "px"
      );
    }

    throw new Error();
  };

  const initVirtualPosition = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      virtualPos.current = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      };
    }
  };
  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isResizingRef.current || !divRef.current) return;
    let newDim = { ...dim };
    switch (dirRef.current) {
      case 0:
        virtualPos.current.top = e.clientY;
        newDim.height = calHeight();
        break;
      case 1:
        virtualPos.current.right = e.clientX;
        newDim.width = calWidth();
        break;
      case 2:
        virtualPos.current.bottom = e.clientY;
        newDim.height = calHeight();
        break;
      case 3:
        virtualPos.current.left = e.clientX;
        newDim.width = calWidth();
        break;
    }
    setDim(newDim);
  };
  const handleMouseUp = () => {
    if (divRef.current) {
      divRef.current.classList.remove(styles.layer);
      divRef.current.style.userSelect = "";
    }
    isResizingRef.current = false;
    dispatch(
      updateStyleMap({
        id,
        style: {
          ...styleMap,
          width: Number(dirRef.current) % 2 ? calWidth() : styleMap.width,
          height: Number(dirRef.current) % 2 ? styleMap.height : calHeight(),
        },
        cssState: "default",
      }),
    );
    dirRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  const handleMouseDown = (
    e: MouseEvent<HTMLDivElement>,
    direction: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (divRef.current) {
      divRef.current.classList.add(styles.layer);
      divRef.current.style.userSelect = "none";
    }

    isResizingRef.current = true;
    dirRef.current = direction;
    initVirtualPosition();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return {
    divRef,
    dim,
    handleMouseDown,
  };
}
