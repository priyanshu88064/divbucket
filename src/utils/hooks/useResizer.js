import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStyleMap } from "../../store/reducers/treeReducer";

export function useResizer({ id }) {
  const { styleMap } = useSelector((state) => state.treeReducer);
  const virtualPos = useRef({
    top: null,
    bottom: null,
    left: null,
    right: null,
  });
  const [dim, setDim] = useState({
    height: styleMap[id].height,
    width: styleMap[id].width,
  });
  const divRef = useRef();
  const dirRef = useRef();
  const isResizingRef = useRef(false);
  const dispatch = useDispatch();

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
  const handleMouseMove = (e) => {
    if (!isResizingRef.current || !divRef.current) return;
    let newDim = { ...dim };
    switch (dirRef.current) {
      case 0:
        virtualPos.current.top = e.clientY;
        newDim.height =
          Math.floor(virtualPos.current.bottom - virtualPos.current.top) + "px";
        break;
      case 1:
        virtualPos.current.right = e.clientX;
        newDim.width =
          Math.floor(virtualPos.current.right - virtualPos.current.left) + "px";
        break;
      case 2:
        virtualPos.current.bottom = e.clientY;
        newDim.height =
          Math.floor(virtualPos.current.bottom - virtualPos.current.top) + "px";
        break;
      case 3:
        virtualPos.current.left = e.clientX;
        newDim.width =
          Math.floor(virtualPos.current.right - virtualPos.current.left) + "px";
        break;
    }
    setDim(newDim);
  };
  const handleMouseDown = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    dirRef.current = direction;
    initVirtualPosition();
    divRef.current.style.userSelect = "none";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseUp = useCallback(() => {
    divRef.current.style.userSelect = "";
    isResizingRef.current = false;
    dirRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    dispatch(updateStyleMap({ id, style: { ...styleMap[id], ...dim } }));
  }, [dim, id]);

  return {
    divRef,
    dim,
    handleMouseDown,
  };
}
