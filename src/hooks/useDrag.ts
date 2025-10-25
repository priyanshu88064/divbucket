import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import styles from "../utils/Resizable/resizable.module.css";
import type { AppDispatch } from "../store/store";
import { createTemplate } from "../utils/template";
import { moveItem } from "../store/reducers/treeReducer";

const getPosi = (x: number, y: number, rect: DOMRect) => {
  const xoff = x - rect.x;
  const yoff = y - rect.y;
  let xpos = 0,
    ypos = 0;
  if (xoff > (rect.width * 20) / 100) xpos = 1;
  if (xoff > (rect.width * 80) / 100) xpos = 2;
  if (yoff > (rect.height * 20) / 100) ypos = 1;
  if (yoff > (rect.height * 80) / 100) ypos = 2;

  if (xpos === 1 && ypos === 1) return "inside";
  if (ypos === 2) return "bottom";
  if (xpos === 2) return "right";
  if (ypos === 0) return "top";
  return "left";
};

export function useDrag() {
  const dispatch = useDispatch<AppDispatch>();
  const draggedNodeRef = useRef<HTMLDivElement | null>(null);
  const draggedWrapperRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(-1); // [0] - add before, [1] - add after, [-1] - add inside

  const initOverlay = () => {
    let overlay = document.createElement("div");
    overlay.classList.add(
      "fixed",
      "bg-hoverblue/60",
      "rounded-md",
      "pointer-events-none",
      "transition-all",
      "ease-out",
    );
    document.body.appendChild(overlay);
    overlayRef.current = overlay;
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    draggedNodeRef.current = e.target as HTMLDivElement;

    // dummy div for creating drag image
    let draggedWrapper = document.createElement("div");
    let draggedImage = document.createElement("div");
    draggedWrapper.classList.add(styles.dragwrapper);
    draggedImage.classList.add(styles.dragimage);
    draggedImage.innerText =
      draggedNodeRef.current.parentNode!.children[0].textContent || "";
    draggedWrapper.appendChild(draggedImage);
    document.body.appendChild(draggedWrapper);
    e.dataTransfer.setDragImage(draggedImage, -20, -20);

    draggedWrapperRef.current = draggedWrapper;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!overlayRef.current) initOverlay();
    const targetId = (e.target as HTMLDivElement).getAttribute("data-id");
    const targetType = (e.target as HTMLDivElement).getAttribute("data-type");
    const draggedId = draggedNodeRef.current?.getAttribute("data-id");

    if (
      !targetId ||
      draggedId === targetId ||
      !overlayRef.current ||
      !targetType ||
      !["root", "Row", "Block"].includes(targetType)
    )
      return;

    const rect = (e.target as HTMLDivElement).getBoundingClientRect();

    if (targetType === "root") {
      overlayRef.current.style.width = "0";
      overlayRef.current.style.height = "0";
      posRef.current = -1;

      return;
    }

    switch (getPosi(e.clientX, e.clientY, rect)) {
      case "inside":
        overlayRef.current.style.top = rect.top + "px";
        overlayRef.current.style.left = rect.left + "px";
        overlayRef.current.style.width = rect.width + "px";
        overlayRef.current.style.height = rect.height + "px";
        posRef.current = -1;
        break;
      case "top":
        overlayRef.current.style.top = rect.top + "px";
        overlayRef.current.style.left = rect.left + "px";
        overlayRef.current.style.width = rect.width + "px";
        overlayRef.current.style.height = "4px";
        posRef.current = 0;
        break;
      case "right":
        overlayRef.current.style.top = rect.top + "px";
        overlayRef.current.style.left = rect.left + rect.width + "px";
        overlayRef.current.style.width = "4px";
        overlayRef.current.style.height = rect.height + "px";
        posRef.current = 1;
        break;
      case "bottom":
        overlayRef.current.style.top = rect.top + rect.height + "px";
        overlayRef.current.style.left = rect.left + "px";
        overlayRef.current.style.width = rect.width + "px";
        overlayRef.current.style.height = "4px";
        posRef.current = 1;
        break;
      case "left":
        overlayRef.current.style.top = rect.top + "px";
        overlayRef.current.style.left = rect.left + "px";
        overlayRef.current.style.width = "4px";
        overlayRef.current.style.height = rect.height + "px";
        posRef.current = 0;
        break;
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedNodeRef.current) return;

    const targetId = (e.target as HTMLDivElement).getAttribute("data-id");
    const draggedId =
      draggedNodeRef.current.getAttribute("data-id") ||
      createTemplate({
        type: draggedNodeRef.current.getAttribute("data-type") as string,
        dispatch,
      });

    if (targetId === draggedId) return;

    dispatch(
      moveItem({
        node: draggedId,
        referenceNode: targetId,
        pos: posRef.current,
      }),
    );

    cleanup();
  };

  const handleDragLeave = () => {};

  const handleDragEnd = () => {
    cleanup();
  };

  const cleanup = () => {
    draggedNodeRef.current = null;
    if (draggedWrapperRef && draggedWrapperRef.current)
      draggedWrapperRef.current.remove();
    draggedWrapperRef.current = null;
    if (overlayRef.current) {
      document.body.removeChild(overlayRef.current);
      overlayRef.current = null;
    }
    posRef.current = -1;
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  };
}
