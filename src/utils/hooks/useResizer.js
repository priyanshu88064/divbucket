import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStyleMap } from "../../store/reducers/treeReducer";

export function useResizer({ id }) {
  const styleMap = useSelector((state) => state.treeReducer.styleMap);
  const virtualPos = useRef({
    top: null,
    bottom: null,
    left: null,
    right: null,
  });
  const [dim, setDim] = useState({
    width: styleMap[id].width,
    height: styleMap[id].height,
  });
  const divRef = useRef();
  const dirRef = useRef();
  const isResizingRef = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setDim({
      width: styleMap[id].width,
      height: styleMap[id].height,
    });
  }, [styleMap, id]);

  const calWidth = () =>
    Math.floor(virtualPos.current.right - virtualPos.current.left) + "px";
  const calHeight = () =>
    Math.floor(virtualPos.current.bottom - virtualPos.current.top) + "px";

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
    divRef.current.style.userSelect = "";
    isResizingRef.current = false;
    dispatch(
      updateStyleMap({
        id,
        style: {
          ...styleMap[id],
          width: Number(dirRef.current) % 2 ? calWidth() : styleMap[id].width,
          height:
            Number(dirRef.current) % 2 ? styleMap[id].height : calHeight(),
        },
      })
    );
    dirRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
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

  return {
    divRef,
    dim,
    handleMouseDown,
  };
}
