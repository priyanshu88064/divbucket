import { useEffect, useSyncExternalStore } from "react";

type Subscriber = () => void;

const nodeElements = new Map<number, HTMLElement>();
const viewportElements = new Map<string, HTMLElement>();
const elementNodeMap = new Map<HTMLElement, number>();
const nodeSubscribers = new Map<number, Set<Subscriber>>();
const viewportSubscribers = new Set<Subscriber>();
const nodeVersions = new Map<number, number>();
let viewportVersion = 0;

const nodeObserver = new ResizeObserver((entries) => {
  const touchedNodeIds = new Set<number>();
  entries.forEach((entry) => {
    const nodeId = elementNodeMap.get(entry.target as HTMLElement);
    if (nodeId !== undefined) touchedNodeIds.add(nodeId);
  });
  touchedNodeIds.forEach((nodeId) => notifyNodeMeasurements(nodeId));
});

const viewportObserver = new ResizeObserver(() => {
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
  viewportVersion += 1;
  viewportSubscribers.forEach((callback) => callback());
};

export const registerNodeElement = (
  nodeId: number,
  element: HTMLElement | null,
) => {
  const previous = nodeElements.get(nodeId);
  if (previous) {
    nodeObserver.unobserve(previous);
    nodeElements.delete(nodeId);
    elementNodeMap.delete(previous);
  }

  if (element) {
    nodeElements.set(nodeId, element);
    elementNodeMap.set(element, nodeId);
    nodeObserver.observe(element);
  }

  notifyNodeMeasurements(nodeId);
};

export const registerViewportElement = (
  key: string,
  element: HTMLElement | null,
) => {
  const previous = viewportElements.get(key);
  if (previous) {
    viewportObserver.unobserve(previous);
    viewportElements.delete(key);
  }

  if (element) {
    viewportElements.set(key, element);
    viewportObserver.observe(element);
  }

  notifyViewportMeasurements();
};

const getNodeRect = (nodeId: number | null | undefined) => {
  if (!nodeId) return null;
  const element = nodeElements.get(nodeId);
  if (!element) return null;
  return element.getBoundingClientRect();
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
  scrollElement,
  viewportElement,
}: {
  scrollElement: HTMLElement | null;
  viewportElement: HTMLElement | null;
}) => {
  useEffect(() => {
    registerViewportElement("scroll-wrapper", scrollElement);
    registerViewportElement("playground", viewportElement);

    if (!scrollElement) return;
    const onScroll = () => notifyViewportMeasurements();
    scrollElement.addEventListener("scroll", onScroll);

    return () => {
      scrollElement.removeEventListener("scroll", onScroll);
    };
  }, [scrollElement, viewportElement]);

  useEffect(() => {
    const onWindowResize = () => notifyViewportMeasurements();
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);
};
