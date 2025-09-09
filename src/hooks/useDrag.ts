import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import styles from "../utils/Resizable/resizable.module.css";
import type { AppDispatch } from "../store/store";
import { createTemplate } from "../utils/template";
import { moveItem } from "../store/reducers/treeReducer";

const getPosi = (
  x: number,
  y: number,
  rect: DOMRect,
  display: string,
  direction: string,
) => {
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

export function useDrag({ root }: { root: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const draggedNodeRef = useRef<HTMLDivElement | null>(null);
  const draggedWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!(e.target as HTMLDivElement).getAttribute("data-id")) return;
    draggedNodeRef.current = e.target as HTMLDivElement;
    let draggedWrapper = document.createElement("div");
    let draggedImage = document.createElement("div");
    draggedWrapper.classList.add(styles.dragwrapper);
    draggedImage.classList.add(styles.dragimage);
    draggedImage.innerText =
      (e.target as HTMLDivElement).parentNode!.children[0].textContent || "";
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
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const targetId =
      (e.target as HTMLDivElement).getAttribute("data-target") ||
      (e.target as HTMLDivElement).getAttribute("data-root");
    const draggedId = draggedNodeRef.current?.getAttribute("data-id");

    if (!targetId || draggedId == targetId) return;

    if (Number(targetId) === root) {
    } else {
      let aParent = (e.target as HTMLDivElement).parentNode
        ?.parentNode as HTMLDivElement;
      if ((e.target as HTMLDivElement).getAttribute("data-target"))
        aParent = aParent?.parentNode as HTMLDivElement;
      if (!aParent) return;
      const display = aParent.style.display || "block";
      const direction = aParent.style.flexDirection || "row";

      (e.target as HTMLDivElement).classList.add(styles.dborder);
      const rect = (e.target as HTMLDivElement).getBoundingClientRect();
      switch (getPosi(e.clientX, e.clientY, rect, display, direction)) {
        case "inside":
          (e.target as HTMLDivElement).classList.remove(
            styles.dtop,
            styles.dbottom,
            styles.dleft,
            styles.dright,
          );
          (e.target as HTMLDivElement).classList.add(styles.dinside);
          break;
        case "top":
          (e.target as HTMLDivElement).classList.remove(
            styles.dinside,
            styles.dbottom,
            styles.dleft,
            styles.dright,
          );
          (e.target as HTMLDivElement).classList.add(styles.dtop);
          break;
        case "right":
          (e.target as HTMLDivElement).classList.remove(
            styles.dinside,
            styles.dtop,
            styles.dbottom,
            styles.dleft,
          );
          (e.target as HTMLDivElement).classList.add(styles.dright);
          break;
        case "bottom":
          (e.target as HTMLDivElement).classList.remove(
            styles.dinside,
            styles.dtop,
            styles.dleft,
            styles.dright,
          );
          (e.target as HTMLDivElement).classList.add(styles.dbottom);
          break;
        case "left":
          (e.target as HTMLDivElement).classList.remove(
            styles.dinside,
            styles.dtop,
            styles.dbottom,
            styles.dright,
          );
          (e.target as HTMLDivElement).classList.add(styles.dleft);
          break;
        default:
          break;
      }
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();

    (e.target as HTMLDivElement).classList.remove(
      styles.dborder,
      styles.dinside,
      styles.dtop,
      styles.dbottom,
      styles.dleft,
      styles.dright,
    );

    const targetId =
      (e.target as HTMLDivElement).getAttribute("data-target") ||
      (e.target as HTMLDivElement).getAttribute("data-root");
    const draggedId =
      draggedNodeRef.current?.getAttribute("data-id") ||
      createTemplate({ type: e.dataTransfer.getData("type"), dispatch });

    if (!targetId || !draggedId || draggedId == targetId) return;

    if (Number(targetId) === root) {
      dispatch(moveItem({ node: draggedId, referenceNode: targetId, pos: -1 }));
    } else {
      let aParent = (e.target as HTMLDivElement).parentNode
        ?.parentNode as HTMLDivElement;
      if ((e.target as HTMLDivElement).getAttribute("data-target"))
        aParent = aParent?.parentNode as HTMLDivElement;
      if (!aParent) return;
      const display = aParent.style.display || "block";
      const direction = aParent.style.flexDirection || "row";

      const rect = (e.target as HTMLDivElement).getBoundingClientRect();
      switch (getPosi(e.clientX, e.clientY, rect, display, direction)) {
        case "inside":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: -1 }),
          );
          break;
        case "top":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: 0 }),
          );
          break;
        case "right":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: 1 }),
          );
          break;
        case "bottom":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: 1 }),
          );
          break;
        case "left":
          dispatch(
            moveItem({ node: draggedId, referenceNode: targetId, pos: 0 }),
          );
          break;
        default:
          break;
      }
    }
    draggedNodeRef.current = null;
    if (draggedWrapperRef && draggedWrapperRef.current)
      draggedWrapperRef.current.remove();
    draggedWrapperRef.current = null;
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).classList.remove(
      styles.dborder,
      styles.dinside,
      styles.dtop,
      styles.dbottom,
      styles.dleft,
      styles.dright,
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
