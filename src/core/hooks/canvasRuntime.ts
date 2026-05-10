import {
  IFRAME_SURFACE_ID,
  LEGACY_SURFACE_ID,
  type CanvasMode,
} from "@core/types/canvas";
import { getSurfaceDocument, getSurfaceWindow } from "./useNodeMeasurements";

const allCanvasSurfaceIds = [LEGACY_SURFACE_ID, IFRAME_SURFACE_ID] as const;

const getSurfaceIdForMode = (canvasMode: CanvasMode) =>
  canvasMode === "iframe" ? IFRAME_SURFACE_ID : LEGACY_SURFACE_ID;

const pushUnique = <T>(list: T[], value: T | null | undefined) => {
  if (!value) return;
  if (list.includes(value)) return;
  list.push(value);
};

export const getCanvasKeyboardTargets = ({
  canvasMode,
  surfaceWindow,
  surfaceDocument,
}: {
  canvasMode: CanvasMode;
  surfaceWindow?: Window | null;
  surfaceDocument?: Document | null;
}) => {
  const targets: Array<Document | Window> = [];
  pushUnique(targets, typeof window !== "undefined" ? window : null);
  pushUnique(targets, typeof document !== "undefined" ? document : null);

  const activeSurfaceId = getSurfaceIdForMode(canvasMode);
  pushUnique(targets, surfaceWindow || getSurfaceWindow(activeSurfaceId));
  pushUnique(targets, surfaceDocument || getSurfaceDocument(activeSurfaceId));

  return targets;
};

export const isCanvasOwnedTarget = (
  target: EventTarget | null | undefined,
) => {
  if (typeof Node === "undefined") return false;
  if (!(target instanceof Node)) return false;
  const ownerDocument = target.ownerDocument;
  if (!ownerDocument) return false;

  return allCanvasSurfaceIds.some((surfaceId) => {
    const surfaceDocument = getSurfaceDocument(surfaceId);
    return Boolean(surfaceDocument && surfaceDocument === ownerDocument);
  });
};
