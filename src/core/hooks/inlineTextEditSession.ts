import { useSyncExternalStore } from "react";

export type InlineTextEditState = {
  editingNodeId: number | null;
  surfaceId: string | null;
  originalContent: string;
  draftContent: string;
  isDirty: boolean;
};

type Subscriber = () => void;

const subscribers = new Set<Subscriber>();

const EMPTY_STATE: InlineTextEditState = {
  editingNodeId: null,
  surfaceId: null,
  originalContent: "",
  draftContent: "",
  isDirty: false,
};

let inlineTextEditState: InlineTextEditState = EMPTY_STATE;

const emit = () => {
  subscribers.forEach((callback) => callback());
};

const subscribe = (callback: Subscriber) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

const getSnapshot = () => inlineTextEditState;

export const getInlineTextEditStateSnapshot = () => inlineTextEditState;

export const startInlineTextEdit = (
  nodeId: number,
  surfaceId: string,
  initialContent: string,
) => {
  const nextState: InlineTextEditState = {
    editingNodeId: nodeId,
    surfaceId,
    originalContent: initialContent,
    draftContent: initialContent,
    isDirty: false,
  };

  if (JSON.stringify(nextState) === JSON.stringify(inlineTextEditState)) {
    return inlineTextEditState;
  }

  inlineTextEditState = nextState;
  emit();
  return inlineTextEditState;
};

export const updateInlineTextDraft = (nextContent: string) => {
  if (inlineTextEditState.editingNodeId === null) return inlineTextEditState;
  if (inlineTextEditState.draftContent === nextContent) return inlineTextEditState;

  inlineTextEditState = {
    ...inlineTextEditState,
    draftContent: nextContent,
    isDirty: nextContent !== inlineTextEditState.originalContent,
  };
  emit();
  return inlineTextEditState;
};

export const commitInlineTextEdit = () => {
  if (inlineTextEditState.editingNodeId === null) return null;
  const previousState = inlineTextEditState;
  inlineTextEditState = EMPTY_STATE;
  emit();
  return previousState;
};

export const cancelInlineTextEdit = () => {
  if (inlineTextEditState.editingNodeId === null) return null;
  const previousState = inlineTextEditState;
  inlineTextEditState = EMPTY_STATE;
  emit();
  return previousState;
};

export const useInlineTextEditState = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
