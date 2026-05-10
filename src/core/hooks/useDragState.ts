import { useSyncExternalStore } from "react";
import type { EditorPlacement } from "@core/editor/types";

interface DragIndicatorState {
  top: number;
  left: number;
  width: number;
  height: number;
  placement: EditorPlacement;
}

interface DragState {
  isDragging: boolean;
  indicator: DragIndicatorState | null;
}

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
let dragState: DragState = {
  isDragging: false,
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

export const setDragState = (state: Partial<DragState>) => {
  const nextState = {
    ...dragState,
    ...state,
  };

  if (
    nextState.isDragging === dragState.isDragging &&
    isIndicatorEqual(nextState.indicator, dragState.indicator)
  ) {
    return;
  }

  dragState = nextState;
  emit();
};

export const clearDragState = () => {
  if (!dragState.isDragging && dragState.indicator === null) return;
  dragState = {
    isDragging: false,
    indicator: null,
  };
  emit();
};

export const useDragState = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
