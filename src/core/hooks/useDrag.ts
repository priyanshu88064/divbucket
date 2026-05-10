import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@core/utils/Resizable/resizable.module.css";
import type { AppDispatch } from "@core/state/store";
import { createTemplate } from "@core/utils/template";
import { editorRegistry } from "@core/kernel/bootstrap";
import { moveNode } from "@core/state/reducers/treeReducer";
import { resolveCanvasPlacement } from "@core/editor/dragPlacement";
import { canPlaceChildKindAtTarget } from "@core/editor/constraints";
import { clearDragState, setDragState } from "./useDragState";
import type { NodeKind } from "@core/types/document";
import { selectDocumentState } from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "./useRenderCounter";

export function useDrag() {
  useRenderCounter("useDrag");
  const dispatch = useDispatch<AppDispatch>();
  const treeState = useSelector(selectDocumentState);
  const draggedNodeRef = useRef<HTMLDivElement | null>(null);
  const draggedWrapperRef = useRef<HTMLDivElement | null>(null);
  const dragTargetRef = useRef<{
    targetId: number;
    placement: "before" | "after" | "inside";
  } | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const dragSource = (e.target as HTMLElement).closest(
      "[data-id], [data-type]",
    ) as HTMLDivElement | null;
    if (!dragSource) return;
    draggedNodeRef.current = dragSource;
    setDragState({ isDragging: true });

    // dummy div for creating drag image
    const draggedWrapper = document.createElement("div");
    const draggedImage = document.createElement("div");
    draggedWrapper.classList.add(styles.dragwrapper);
    draggedImage.classList.add(styles.dragimage);
    draggedImage.innerText = dragSource.textContent || "";
    draggedWrapper.appendChild(draggedImage);
    document.body.appendChild(draggedWrapper);
    e.dataTransfer.setDragImage(draggedImage, -20, -20);

    draggedWrapperRef.current = draggedWrapper;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const targetElement = (e.target as HTMLElement).closest(
      "[data-id][data-type]",
    ) as HTMLElement | null;
    const targetId = targetElement?.getAttribute("data-id");
    const targetType = targetElement?.getAttribute(
      "data-type",
    ) as NodeKind | null;
    const draggedId = draggedNodeRef.current?.getAttribute("data-id");
    const draggedType = draggedId
      ? treeState.nodeRecordMap[Number(draggedId)]?.type
      : (draggedNodeRef.current?.getAttribute("data-type") as NodeKind | null);

    if (
      !targetElement ||
      !targetId ||
      !targetType ||
      !draggedType ||
      draggedId === targetId
    ) {
      dragTargetRef.current = null;
      setDragState({ indicator: null });
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const referenceNodeId = Number(targetId);
    const canDropInside = canPlaceChildKindAtTarget({
      state: treeState,
      childKind: draggedType,
      target: {
        referenceNodeId,
        placement: "inside",
      },
    });
    const resolved = resolveCanvasPlacement({
      x: e.clientX,
      y: e.clientY,
      rect,
      canDropInside,
      hideInsideIndicator: targetType === "core:root",
    });

    if (
      !canPlaceChildKindAtTarget({
        state: treeState,
        childKind: draggedType,
        target: {
          referenceNodeId,
          placement: resolved.placement,
        },
      })
    ) {
      dragTargetRef.current = null;
      setDragState({ indicator: null });
      return;
    }

    dragTargetRef.current = {
      targetId: referenceNodeId,
      placement: resolved.placement,
    };
    const nextIndicator = resolved.indicator
      ? { ...resolved.indicator, placement: resolved.placement }
      : null;
    setDragState({ indicator: nextIndicator });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedNodeRef.current) return;

    const dragTarget = dragTargetRef.current;
    if (!dragTarget) {
      cleanup();
      return;
    }
    const draggedId =
      draggedNodeRef.current.getAttribute("data-id") ||
      createTemplate({
        type: draggedNodeRef.current.getAttribute("data-type") as string,
        dispatch,
        treeState,
        registry: editorRegistry,
      });

    if (dragTarget.targetId === Number(draggedId)) return;

    dispatch(
      moveNode({
        node: Number(draggedId),
        target: {
          referenceNodeId: dragTarget.targetId,
          placement: dragTarget.placement,
        },
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
    dragTargetRef.current = null;
    clearDragState();
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  };
}
