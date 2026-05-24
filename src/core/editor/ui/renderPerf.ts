import { useSyncExternalStore } from "react";

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
const renderCounts = new Map<string, number>();
let cachedSnapshot: Record<string, number> = {};
let isSnapshotDirty = true;

const markSnapshotDirty = () => {
  isSnapshotDirty = true;
};

const emit = () => {
  subscribers.forEach((callback) => callback());
};

const subscribe = (callback: Subscriber) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

const getSnapshot = () => {
  if (!isSnapshotDirty) return cachedSnapshot;
  cachedSnapshot = Array.from(renderCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .reduce<Record<string, number>>((acc, [name, count]) => {
      acc[name] = count;
      return acc;
    }, {});
  isSnapshotDirty = false;
  return cachedSnapshot;
};

export const trackRender = (name: string) => {
  if (!import.meta.env.DEV) return;
  renderCounts.set(name, (renderCounts.get(name) || 0) + 1);
  markSnapshotDirty();
  emit();
};

export const resetRenderPerf = () => {
  renderCounts.clear();
  markSnapshotDirty();
  emit();
};

export const useRenderPerfSnapshot = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
