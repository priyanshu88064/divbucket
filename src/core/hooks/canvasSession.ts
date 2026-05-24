import { useSyncExternalStore } from "react";
import type { CanvasViewportPreset } from "@core/types/canvas";
import { IFRAME_SURFACE_ID, LEGACY_SURFACE_ID } from "@core/types/canvas";

type CanvasFocusState = {
  isCanvasFocused: boolean;
  focusedSurfaceId: string | null;
};

type Subscriber = () => void;

const canvasFocusSubscribers = new Set<Subscriber>();
let canvasFocusState: CanvasFocusState = {
  isCanvasFocused: false,
  focusedSurfaceId: null,
};

const emitCanvasFocus = () => {
  canvasFocusSubscribers.forEach((callback) => callback());
};

const subscribeCanvasFocus = (callback: Subscriber) => {
  canvasFocusSubscribers.add(callback);
  return () => canvasFocusSubscribers.delete(callback);
};

const getCanvasFocusSnapshot = () => canvasFocusState;

export const setCanvasFocused = (surfaceId: string) => {
  if (
    canvasFocusState.isCanvasFocused &&
    canvasFocusState.focusedSurfaceId === surfaceId
  ) {
    return;
  }
  canvasFocusState = {
    isCanvasFocused: true,
    focusedSurfaceId: surfaceId,
  };
  emitCanvasFocus();
};

export const clearCanvasFocus = () => {
  if (!canvasFocusState.isCanvasFocused && !canvasFocusState.focusedSurfaceId) {
    return;
  }
  canvasFocusState = {
    isCanvasFocused: false,
    focusedSurfaceId: null,
  };
  emitCanvasFocus();
};

export const getCanvasFocusStateSnapshot = () => canvasFocusState;

export const useCanvasFocusState = () =>
  useSyncExternalStore(
    subscribeCanvasFocus,
    getCanvasFocusSnapshot,
    getCanvasFocusSnapshot,
  );

export const isEditableEventTarget = (
  target: EventTarget | null | undefined,
) => {
  if (typeof Element === "undefined") return false;
  if (!(target instanceof Element)) return false;
  const editableHost = target.closest(
    "input, textarea, select, [contenteditable='true']",
  );
  return Boolean(editableHost);
};

export const attachCanvasKeyboardListeners = ({
  targets,
  onKeyDown,
  onKeyUp,
}: {
  targets: Array<Document | Window | null | undefined>;
  onKeyDown: (event: KeyboardEvent) => void;
  onKeyUp: (event: KeyboardEvent) => void;
}) => {
  const attachedTargets = targets.filter(
    (target): target is Document | Window => Boolean(target),
  );
  const onKeyDownListener: EventListener = (event) =>
    onKeyDown(event as KeyboardEvent);
  const onKeyUpListener: EventListener = (event) =>
    onKeyUp(event as KeyboardEvent);

  attachedTargets.forEach((target) => {
    target.addEventListener("keydown", onKeyDownListener);
    target.addEventListener("keyup", onKeyUpListener);
  });

  return () => {
    attachedTargets.forEach((target) => {
      target.removeEventListener("keydown", onKeyDownListener);
      target.removeEventListener("keyup", onKeyUpListener);
    });
  };
};

export const shouldHandleCanvasShortcut = ({
  isCanvasFocused,
  event,
}: {
  isCanvasFocused: boolean;
  event: Pick<
    KeyboardEvent,
    "ctrlKey" | "metaKey" | "shiftKey" | "key" | "target"
  >;
}) => {
  if (!isCanvasFocused) return false;
  if (!event.ctrlKey && !event.metaKey) return false;
  if (isEditableEventTarget(event.target as EventTarget)) return false;
  const key = event.key.toLowerCase();
  return ["x", "c", "v", "d", "z", "y"].includes(key);
};

const parsePx = (width: string | undefined | null) => {
  if (!width) return null;
  const match = width.trim().match(/^([0-9]+(?:\.[0-9]+)?)px$/i);
  if (!match) return null;
  const parsed = Number(match[1]);
  if (!Number.isFinite(parsed)) return null;
  return Math.floor(parsed);
};

export const detectCanvasViewportPreset = (
  width: string | undefined | null,
): CanvasViewportPreset => {
  if (width === "100%") return "desktop";
  if (width === "425px") return "mobile";
  if (width === "768px") return "tablet";
  return "custom";
};

export const resolveEffectiveViewportWidth = ({
  requestedWidth,
  availableWidth,
}: {
  requestedWidth: string | undefined | null;
  availableWidth: number;
}) => {
  const safeAvailableWidth = Math.max(0, Math.floor(availableWidth));
  if (requestedWidth === "100%") return safeAvailableWidth;

  const px = parsePx(requestedWidth);
  if (px === null) return safeAvailableWidth;
  if (px <= safeAvailableWidth) return px;
  return safeAvailableWidth;
};

export const getDefaultCanvasSurfaceId = ({
  isIframeMode,
}: {
  isIframeMode: boolean;
}) => (isIframeMode ? IFRAME_SURFACE_ID : LEGACY_SURFACE_ID);
