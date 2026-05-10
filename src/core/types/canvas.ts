export type CanvasMode = "legacy" | "iframe";
export type EditorInteractionMode = "full-editor" | "isolated-passive";
export type MeasurementSurfaceKind = "legacy" | "iframe";
export type CanvasViewportPreset = "mobile" | "tablet" | "desktop" | "custom";

export const LEGACY_SURFACE_ID = "legacy-canvas";
export const IFRAME_SURFACE_ID = "iframe-canvas";

export type MeasurementSurface =
  | {
      id: string;
      kind: "legacy";
      viewportElement: HTMLElement | null;
      scrollElement: HTMLElement | null;
    }
  | {
      id: string;
      kind: "iframe";
      iframeElement: HTMLIFrameElement | null;
      contentWindow: Window | null;
      contentDocument: Document | null;
    };

export interface IframeCanvasState {
  iframeElement: HTMLIFrameElement | null;
  mountElement: HTMLElement | null;
  contentDocument: Document | null;
  contentWindow: Window | null;
  isReady: boolean;
}

export const DEFAULT_CANVAS_MODE: CanvasMode = "iframe";

export const parseCanvasMode = (
  search: string | null | undefined,
): CanvasMode => {
  const params = new URLSearchParams(search || "");
  const rawMode = params.get("canvas");
  if (rawMode === "legacy" || rawMode === "iframe") return rawMode;
  return DEFAULT_CANVAS_MODE;
};

export const resolveCanvasMode = (): CanvasMode => {
  if (typeof window === "undefined") return DEFAULT_CANVAS_MODE;
  return parseCanvasMode(window.location.search);
};

export const interactionModeForCanvas = (
  canvasMode: CanvasMode,
): EditorInteractionMode =>
  canvasMode === "iframe" ? "isolated-passive" : "full-editor";

export const shouldEnablePhaseThreeAffordances = (
  canvasMode: CanvasMode,
) => canvasMode === "legacy";
