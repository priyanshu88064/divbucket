import { useSyncExternalStore } from "react";
import type { EditorPlacement } from "@core/editor/types";
import type { NodeKind, PresetId } from "@core/types/document";

interface DragIndicatorState {
  top: number;
  left: number;
  width: number;
  height: number;
  placement: EditorPlacement;
}

interface DragGhostState {
  label: string;
  x: number;
  y: number;
}

interface CanvasDragSource {
  kind: "node" | "palette";
  nodeId?: number;
  templateType?: NodeKind | PresetId | string;
  label: string;
}

interface DragState {
  isDragging: boolean;
  source: CanvasDragSource | null;
  ghost: DragGhostState | null;
  pointer: { x: number; y: number } | null;
  target:
    | {
        targetId: number;
        placement: EditorPlacement;
      }
    | null;
  indicator: DragIndicatorState | null;
}

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
let dragState: DragState = {
  isDragging: false,
  source: null,
  ghost: null,
  pointer: null,
  target: null,
  indicator: null,
};

const subscribe = (callback: Subscriber) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

const getSnapshot = () => dragState;
export const getDragStateSnapshot = () => dragState;

const emit = () => {
  subscribers.forEach((callback) => callback());
};

const isIndicatorEqual = (
  a: DragIndicatorState | null,
  b: DragIndicatorState | null,
) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.top === b.top &&
    a.left === b.left &&
    a.width === b.width &&
    a.height === b.height &&
    a.placement === b.placement
  );
};

const isGhostEqual = (a: DragGhostState | null, b: DragGhostState | null) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.label === b.label && a.x === b.x && a.y === b.y;
};

const isSourceEqual = (a: CanvasDragSource | null, b: CanvasDragSource | null) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.kind === b.kind &&
    a.nodeId === b.nodeId &&
    a.templateType === b.templateType &&
    a.label === b.label
  );
};

const isPointerEqual = (
  a: { x: number; y: number } | null,
  b: { x: number; y: number } | null,
) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.x === b.x && a.y === b.y;
};

const isTargetEqual = (
  a: { targetId: number; placement: EditorPlacement } | null,
  b: { targetId: number; placement: EditorPlacement } | null,
) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.targetId === b.targetId && a.placement === b.placement;
};

export const setDragState = (state: Partial<DragState>) => {
  const nextState = {
    ...dragState,
    ...state,
  };

  if (
    nextState.isDragging === dragState.isDragging &&
    isIndicatorEqual(nextState.indicator, dragState.indicator) &&
    isGhostEqual(nextState.ghost, dragState.ghost) &&
    isSourceEqual(nextState.source, dragState.source) &&
    isPointerEqual(nextState.pointer, dragState.pointer) &&
    isTargetEqual(nextState.target, dragState.target)
  ) {
    return;
  }

  dragState = nextState;
  emit();
};

export const clearDragState = () => {
  if (
    !dragState.isDragging &&
    dragState.indicator === null &&
    dragState.ghost === null &&
    dragState.source === null &&
    dragState.pointer === null &&
    dragState.target === null
  )
    return;
  dragState = {
    isDragging: false,
    source: null,
    ghost: null,
    pointer: null,
    target: null,
    indicator: null,
  };
  emit();
};

export const useDragState = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
