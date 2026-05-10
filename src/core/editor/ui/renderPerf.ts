import { useSyncExternalStore } from "react";

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();
const renderCounts = new Map<string, number>();

const emit = () => {
  subscribers.forEach((callback) => callback());
};

const subscribe = (callback: Subscriber) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

const getSnapshot = () => {
  return Array.from(renderCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .reduce<Record<string, number>>((acc, [name, count]) => {
      acc[name] = count;
      return acc;
    }, {});
};

export const trackRender = (name: string) => {
  if (!import.meta.env.DEV) return;
  renderCounts.set(name, (renderCounts.get(name) || 0) + 1);
  emit();
};

export const resetRenderPerf = () => {
  renderCounts.clear();
  emit();
};

export const useRenderPerfSnapshot = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
