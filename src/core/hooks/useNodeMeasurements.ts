import { useEffect, useSyncExternalStore } from "react";
import type { MeasurementSurface } from "@core/types/canvas";
import {
  LEGACY_SURFACE_ID,
  IFRAME_SURFACE_ID,
} from "@core/types/canvas";
import {
  pointFromParentToSurface,
  pointFromSurfaceToParent,
  rectFromViewport,
} from "./measurementGeometry";

type Subscriber = () => void;

type NodeSurfaceElement = {
  element: HTMLElement;
  surfaceId: string;
};

type TrackedElement = {
  nodeId: number;
  surfaceId: string;
};

const nodeElements = new Map<number, NodeSurfaceElement>();
const elementNodeMap = new Map<HTMLElement, TrackedElement>();
const nodeSubscribers = new Map<number, Set<Subscriber>>();
const viewportSubscribers = new Set<Subscriber>();
const nodeVersions = new Map<number, number>();
const measurementSurfaces = new Map<string, MeasurementSurface>();
const surfaceCleanups = new Map<string, () => void>();
let viewportVersion = 0;
let viewportNotifyScheduled = false;

const SafeResizeObserver: typeof ResizeObserver =
  typeof ResizeObserver !== "undefined"
    ? ResizeObserver
    : class {
        observe() {}
        unobserve() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver;

const nodeObserver = new SafeResizeObserver((entries) => {
  const touchedNodeIds = new Set<number>();
  entries.forEach((entry) => {
    const tracked = elementNodeMap.get(entry.target as HTMLElement);
    if (tracked?.nodeId !== undefined) touchedNodeIds.add(tracked.nodeId);
  });
  touchedNodeIds.forEach((nodeId) => notifyNodeMeasurements(nodeId));
});

const viewportObserver = new SafeResizeObserver(() => {
  notifyViewportMeasurements();
});

const subscribeNode = (nodeId: number, callback: Subscriber) => {
  if (!nodeSubscribers.has(nodeId)) {
    nodeSubscribers.set(nodeId, new Set<Subscriber>());
  }
  nodeSubscribers.get(nodeId)?.add(callback);
  return () => {
    const subs = nodeSubscribers.get(nodeId);
    if (!subs) return;
    subs.delete(callback);
    if (subs.size === 0) nodeSubscribers.delete(nodeId);
  };
};

const subscribeViewport = (callback: Subscriber) => {
  viewportSubscribers.add(callback);
  return () => viewportSubscribers.delete(callback);
};

const getNodeSnapshot = (nodeId: number) =>
  `${nodeVersions.get(nodeId) || 0}:${viewportVersion}`;

const getViewportSnapshot = () => viewportVersion;

export const notifyNodeMeasurements = (nodeId: number) => {
  nodeVersions.set(nodeId, (nodeVersions.get(nodeId) || 0) + 1);
  nodeSubscribers.get(nodeId)?.forEach((callback) => callback());
};

export const notifyViewportMeasurements = () => {
  if (viewportNotifyScheduled) return;
  viewportNotifyScheduled = true;
  const schedule =
    typeof requestAnimationFrame !== "undefined"
      ? requestAnimationFrame
      : (callback: FrameRequestCallback) => {
          callback(0);
          return 0;
        };
  schedule(() => {
    viewportNotifyScheduled = false;
    viewportVersion += 1;
    viewportSubscribers.forEach((callback) => callback());
  });
};

export const registerNodeElement = (
  nodeId: number,
  element: HTMLElement | null,
  surfaceId: string = LEGACY_SURFACE_ID,
) => {
  const previous = nodeElements.get(nodeId)?.element;
  if (previous) {
    nodeObserver.unobserve(previous);
    nodeElements.delete(nodeId);
    elementNodeMap.delete(previous);
  }

  if (element) {
    nodeElements.set(nodeId, { element, surfaceId });
    elementNodeMap.set(element, { nodeId, surfaceId });
    nodeObserver.observe(element);
  }

  notifyNodeMeasurements(nodeId);
};

const cleanupSurfaceListeners = (surfaceId: string) => {
  const cleanup = surfaceCleanups.get(surfaceId);
  if (cleanup) cleanup();
  surfaceCleanups.delete(surfaceId);
};

const trackViewportElement = (element: HTMLElement | null) => {
  if (!element) return () => {};
  viewportObserver.observe(element);
  return () => viewportObserver.unobserve(element);
};

const registerLegacySurfaceListeners = (
  surfaceId: string,
  surface: Extract<MeasurementSurface, { kind: "legacy" }>,
) => {
  const unobserveViewport = trackViewportElement(surface.viewportElement);
  const unobserveScroll = trackViewportElement(surface.scrollElement);
  const onScroll = () => notifyViewportMeasurements();

  if (surface.scrollElement) {
    surface.scrollElement.addEventListener("scroll", onScroll);
  }

  surfaceCleanups.set(surfaceId, () => {
    unobserveViewport();
    unobserveScroll();
    if (surface.scrollElement) {
      surface.scrollElement.removeEventListener("scroll", onScroll);
    }
  });
};

const registerIframeSurfaceListeners = (
  surfaceId: string,
  surface: Extract<MeasurementSurface, { kind: "iframe" }>,
) => {
  const unobserveIframe = trackViewportElement(surface.iframeElement);
  const onWindowResize = () => notifyViewportMeasurements();
  const onWindowScroll = () => notifyViewportMeasurements();
  const onDocumentScroll = () => notifyViewportMeasurements();

  if (surface.contentWindow) {
    surface.contentWindow.addEventListener("resize", onWindowResize);
    surface.contentWindow.addEventListener("scroll", onWindowScroll, {
      passive: true,
    });
  }
  if (surface.contentDocument) {
    surface.contentDocument.addEventListener("scroll", onDocumentScroll, {
      passive: true,
    });
  }

  surfaceCleanups.set(surfaceId, () => {
    unobserveIframe();
    if (surface.contentWindow) {
      surface.contentWindow.removeEventListener("resize", onWindowResize);
      surface.contentWindow.removeEventListener("scroll", onWindowScroll);
    }
    if (surface.contentDocument) {
      surface.contentDocument.removeEventListener("scroll", onDocumentScroll);
    }
  });
};

export const registerMeasurementSurface = (
  surfaceId: string,
  surface: MeasurementSurface | null,
) => {
  cleanupSurfaceListeners(surfaceId);
  if (!surface) {
    measurementSurfaces.delete(surfaceId);
    notifyViewportMeasurements();
    return;
  }

  measurementSurfaces.set(surfaceId, surface);
  if (surface.kind === "legacy") {
    registerLegacySurfaceListeners(surfaceId, surface);
  } else {
    registerIframeSurfaceListeners(surfaceId, surface);
  }

  notifyViewportMeasurements();
};

const getMeasurementSurface = (surfaceId: string) =>
  measurementSurfaces.get(surfaceId);

export const translateSurfaceRectToParentViewport = ({
  surfaceId,
  rect,
}: {
  surfaceId: string;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}) => {
  const surface = getMeasurementSurface(surfaceId);
  if (!surface || surface.kind === "legacy") return rect;
  const iframeElement = surface.iframeElement;
  if (!iframeElement) return rect;
  const iframeRect = iframeElement.getBoundingClientRect();
  return rectFromViewport({
    surfaceRect: iframeRect,
    localRect: rect,
  });
};

export const translateParentPointToSurfaceViewport = ({
  surfaceId,
  point,
}: {
  surfaceId: string;
  point: { x: number; y: number };
}) => {
  const surface = getMeasurementSurface(surfaceId);
  if (!surface || surface.kind === "legacy") return point;
  const iframeElement = surface.iframeElement;
  if (!iframeElement) return point;
  const iframeRect = iframeElement.getBoundingClientRect();
  return pointFromParentToSurface({
    parentPoint: point,
    surfaceRect: iframeRect,
  });
};

export const translateSurfacePointToParentViewport = ({
  surfaceId,
  point,
}: {
  surfaceId: string;
  point: { x: number; y: number };
}) => {
  const surface = getMeasurementSurface(surfaceId);
  if (!surface || surface.kind === "legacy") return point;
  const iframeElement = surface.iframeElement;
  if (!iframeElement) return point;
  const iframeRect = iframeElement.getBoundingClientRect();
  return pointFromSurfaceToParent({
    surfacePoint: point,
    surfaceRect: iframeRect,
  });
};

export const getSurfaceElementFromPoint = ({
  surfaceId,
  parentPoint,
}: {
  surfaceId: string;
  parentPoint: { x: number; y: number };
}) => {
  const surface = getMeasurementSurface(surfaceId);
  if (!surface || surface.kind === "legacy") {
    return document.elementFromPoint(parentPoint.x, parentPoint.y);
  }

  const iframeElement = surface.iframeElement;
  const contentDocument = surface.contentDocument;
  if (!iframeElement || !contentDocument) return null;
  const iframeRect = iframeElement.getBoundingClientRect();
  const localPoint = translateParentPointToSurfaceViewport({
    surfaceId,
    point: parentPoint,
  });
  const isOutsideIframe =
    localPoint.x < 0 ||
    localPoint.y < 0 ||
    localPoint.x > iframeRect.width ||
    localPoint.y > iframeRect.height;
  if (isOutsideIframe) return null;

  return contentDocument.elementFromPoint(localPoint.x, localPoint.y);
};

export const getSurfaceWindow = (surfaceId: string) => {
  const surface = getMeasurementSurface(surfaceId);
  if (!surface || surface.kind === "legacy") return window;
  return surface.contentWindow;
};

export const getSurfaceDocument = (surfaceId: string) => {
  const surface = getMeasurementSurface(surfaceId);
  if (!surface) return null;
  if (surface.kind === "legacy") {
    return typeof document !== "undefined" ? document : null;
  }
  return surface.contentDocument;
};

export const getSurfaceViewportRect = (surfaceId: string) => {
  const surface = getMeasurementSurface(surfaceId);
  if (!surface || surface.kind === "legacy") return null;
  if (!surface.iframeElement) return null;
  return surface.iframeElement.getBoundingClientRect();
};

export const getSurfaceViewportScroll = (surfaceId: string) => {
  const surface = getMeasurementSurface(surfaceId);
  if (!surface || surface.kind === "legacy") {
    return {
      x: window.scrollX || 0,
      y: window.scrollY || 0,
    };
  }
  const surfaceWindow = surface.contentWindow;
  return {
    x: surfaceWindow?.scrollX || 0,
    y: surfaceWindow?.scrollY || 0,
  };
};

const getNodeRect = (nodeId: number | null | undefined) => {
  if (!nodeId) return null;
  const entry = nodeElements.get(nodeId);
  if (!entry) return null;
  return translateSurfaceRectToParentViewport({
    surfaceId: entry.surfaceId,
    rect: entry.element.getBoundingClientRect(),
  });
};

export const useNodeRect = (nodeId: number | null | undefined) => {
  const effectiveNodeId = nodeId ?? -1;

  useSyncExternalStore(
    (callback) =>
      nodeId == null ? () => {} : subscribeNode(effectiveNodeId, callback),
    () => getNodeSnapshot(effectiveNodeId),
    () => getNodeSnapshot(effectiveNodeId),
  );

  useSyncExternalStore(subscribeViewport, getViewportSnapshot, getViewportSnapshot);
  return getNodeRect(nodeId);
};

export const useMeasurementSync = ({
  surfaceId,
  scrollElement,
  viewportElement,
}: {
  surfaceId: string;
  scrollElement: HTMLElement | null;
  viewportElement: HTMLElement | null;
}) => {
  useEffect(() => {
    registerMeasurementSurface(surfaceId, {
      id: surfaceId,
      kind: "legacy",
      scrollElement,
      viewportElement,
    });
    return () => {
      registerMeasurementSurface(surfaceId, null);
    };
  }, [scrollElement, surfaceId, viewportElement]);
};

export const useIframeMeasurementSync = ({
  surfaceId,
  iframeElement,
  contentDocument,
  contentWindow,
}: {
  surfaceId: string;
  iframeElement: HTMLIFrameElement | null;
  contentDocument: Document | null;
  contentWindow: Window | null;
}) => {
  useEffect(() => {
    registerMeasurementSurface(surfaceId, {
      id: surfaceId,
      kind: "iframe",
      iframeElement,
      contentDocument,
      contentWindow,
    });
    return () => {
      registerMeasurementSurface(surfaceId, null);
    };
  }, [contentDocument, contentWindow, iframeElement, surfaceId]);
};

const onWindowResize = () => notifyViewportMeasurements();
let isParentResizeBound = false;
if (typeof window !== "undefined" && !isParentResizeBound) {
  window.addEventListener("resize", onWindowResize);
  isParentResizeBound = true;
}

export const getNodeSurfaceId = (nodeId: number | null | undefined) => {
  if (!nodeId) return LEGACY_SURFACE_ID;
  return nodeElements.get(nodeId)?.surfaceId || LEGACY_SURFACE_ID;
};

export const isIframeSurface = (surfaceId: string) =>
  surfaceId === IFRAME_SURFACE_ID;
