import { useRef } from "react";
import { useDispatch } from "react-redux";
import { createTemplate } from "../template";
import { moveItem } from "../../store/reducers/treeReducer";
import styles from '../Resizable/resizable.module.css';

const getPosi = (x, y, rect, display, direction) => {
  const xoff = x - rect.x;
  const yoff = y - rect.y;
  let xpos = 0,
    ypos = 0;
  if (xoff > (rect.width * 20) / 100) xpos = 1;
  if (xoff > (rect.width * 80) / 100) xpos = 2;
  if (yoff > (rect.height * 20) / 100) ypos = 1;
  if (yoff > (rect.height * 80) / 100) ypos = 2;

  if (display === "block" || ["column", "column-reverse"].includes(direction)) {
    if (ypos === 0) return "top";
    if (ypos === 1) return "inside";
    return "bottom";
  } else {
    if (xpos === 0) return "left";
    if (xpos === 1) return "inside";
    return "right";
  }
};

export function useDrag() {
  const dispatch = useDispatch();
  const draggedNodeRef = useRef(null);
  const draggedWrapperRef = useRef(null);

  const handleDragStart = (e) => {
    e.stopPropagation();
    if (!e.target.getAttribute("data-id")) return;
    draggedNodeRef.current = e.target;
    let draggedWrapper = document.createElement("div");
    let draggedImage = document.createElement("div");
    draggedWrapper.classList.add(styles.dragwrapper);
    draggedImage.classList.add(styles.dragimage);
    draggedImage.innerText = e.target.parentNode.children[0].innerText;
    draggedWrapper.appendChild(draggedImage);
    document.body.appendChild(draggedWrapper);
    e.dataTransfer.setDragImage(draggedImage, -20, -20);
    draggedWrapperRef.current = draggedWrapper;
  };
  const handleDragEnd = () => {
    draggedNodeRef.current = null;
    if (draggedWrapperRef && draggedWrapperRef.current)
      draggedWrapperRef.current.remove();
    draggedWrapperRef.current = null;
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const targetId =
      e.target.getAttribute("data-target") ||
      e.target.getAttribute("data-root");
    const draggedId = draggedNodeRef.current?.getAttribute("data-id");

    if (!targetId || draggedId == targetId) return;

    if (targetId === "root") {
    } else {
      const aParent = e.target.parentNode?.parentNode?.parentNode;
      if (!aParent) return;
      const display = aParent.style.display;
      const direction = aParent.style.flexDirection;

      e.target.classList.add(styles.dborder);
      const rect = e.target.getBoundingClientRect();
      switch (getPosi(e.clientX, e.clientY, rect, display, direction)) {
        case "inside":
          e.target.classList.remove(
            styles.dtop,
            styles.dbottom,
            styles.dleft,
            styles.dright
          );
          e.target.classList.add(styles.dinside);
          break;
        case "top":
          e.target.classList.remove(
            styles.dinside,
            styles.dbottom,
            styles.dleft,
            styles.dright
          );
          e.target.classList.add(styles.dtop);
          break;
        case "right":
          e.target.classList.remove(
            styles.dinside,
            styles.dtop,
            styles.dbottom,
            styles.dleft
          );
          e.target.classList.add(styles.dright);
          break;
        case "bottom":
          e.target.classList.remove(
            styles.dinside,
            styles.dtop,
            styles.dleft,
            styles.dright
          );
          e.target.classList.add(styles.dbottom);
          break;
        case "left":
          e.target.classList.remove(
            styles.dinside,
            styles.dtop,
            styles.dbottom,
            styles.dright
          );
          e.target.classList.add(styles.dleft);
          break;
        default:
          break;
      }
    }
  };
  const handleDrop = (e) => {
    e.stopPropagation();
    const targetId =
      e.target.getAttribute("data-target") ||
      e.target.getAttribute("data-root");
    const draggedId =
      draggedNodeRef.current?.getAttribute("data-id") ||
      createTemplate(e.dataTransfer.getData("type"), dispatch);

    if (!targetId || !draggedId || draggedId == targetId) return;

    if (targetId === "root") {
      dispatch(moveItem({ node: draggedId, referenceNode: targetId, pos: -1 }));
    } else {
      const aParent = e.target.parentNode?.parentNode?.parentNode;
      if (!aParent) return;
      const display = aParent.style.display;
      const direction = aParent.style.flexDirection;

      const rect = e.target.getBoundingClientRect();
      switch (getPosi(e.clientX, e.clientY, rect, display, direction)) {
        case "inside":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: -1 })
          );
          break;
        case "top":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: 0 })
          );
          break;
        case "right":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: 1 })
          );
          break;
        case "bottom":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: 1 })
          );
          break;
        case "left":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: 0 })
          );
          break;
        default:
          break;
      }
    }
    e.target.classList.remove(
      styles.dborder,
      styles.dinside,
      styles.dtop,
      styles.dbottom,
      styles.dleft,
      styles.dright
    );
    draggedNodeRef.current = null;
    if (draggedWrapperRef && draggedWrapperRef.current)
      draggedWrapperRef.current.remove();
    draggedWrapperRef.current = null;
  };
  const handleDragLeave = (e) => {
    e.target.classList.remove(
      styles.dborder,
      styles.dinside,
      styles.dtop,
      styles.dbottom,
      styles.dleft,
      styles.dright
    );
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  };
}
