import type { CSSProperties } from "react";
import type {
  CssState,
  NodeRecord,
  NodeStyleMap,
  TreeState,
  NodeChildrenMap,
} from "@core/types/document";
import { createNodeIdAllocator } from "./idAllocator";
import {
  canInsertChildKindAtParent,
  canPlaceChildKindAtTarget,
  resolveInsertLocation,
} from "./constraints";
import {
  getParentNodeId,
  isDescendantNode,
  ROOT_COLLECTION_ID,
} from "./treeRelations";
import type {
  EditorOperationResult,
  EditorOperationTarget,
  EditorPlacement,
} from "./types";

const cloneSerializableValue = (
  value: unknown,
  seen = new WeakMap<object, unknown>(),
): unknown => {
  if (value == null) return value;

  const valueType = typeof value;
  if (
    valueType === "string" ||
    valueType === "number" ||
    valueType === "boolean" ||
    valueType === "bigint"
  ) {
    return value;
  }

  if (valueType === "function" || valueType === "symbol") {
    return undefined;
  }

  if (value instanceof Object && seen.has(value)) {
    return seen.get(value);
  }

  if (Array.isArray(value)) {
    const next: unknown[] = [];
    seen.set(value, next);
    value.forEach((item, index) => {
      next[index] = cloneSerializableValue(item, seen);
    });
    return next;
  }

  if (!(value instanceof Object)) {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) {
    return undefined;
  }

  const next: Record<string, unknown> = {};
  seen.set(value, next);

  Object.entries(value).forEach(([key, entryValue]) => {
    const cloned = cloneSerializableValue(entryValue, seen);
    if (cloned !== undefined || entryValue === undefined) {
      next[key] = cloned;
    }
  });

  return next;
};

const isDataCloneError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "name" in error &&
  error.name === "DataCloneError";

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(value);
    } catch (error) {
      if (!isDataCloneError(error)) {
        throw error;
      }
    }
  }

  return cloneSerializableValue(value) as T;
};

const cloneState = (state: TreeState): TreeState => {
  const nodeChildrenMap: NodeChildrenMap = {};
  Object.keys(state.nodeChildrenMap).forEach((id) => {
    nodeChildrenMap[Number(id)] = [...state.nodeChildrenMap[Number(id)]];
  });

  const nodeStyleMap: NodeStyleMap = {};
  Object.keys(state.nodeStyleMap).forEach((id) => {
    const numericId = Number(id);
    nodeStyleMap[numericId] = {
      default: cloneValue(state.nodeStyleMap[numericId].default),
      hover: cloneValue(state.nodeStyleMap[numericId].hover),
      active: cloneValue(state.nodeStyleMap[numericId].active),
    };
  });

  return {
    ...state,
    pageIds: [...state.pageIds],
    nodeChildrenMap,
    nodeRecordMap: cloneValue(state.nodeRecordMap),
    nodeStyleMap,
    pageOpenMap: { ...state.pageOpenMap },
    bgContentRect: { ...state.bgContentRect },
    clipboard: { ...state.clipboard },
  };
};

const toResult = <TValue = undefined>(
  next: TreeState,
  value?: TValue,
): EditorOperationResult<TValue> => ({
  document: {
    pageIds: next.pageIds,
    nodeChildrenMap: next.nodeChildrenMap,
    nodeRecordMap: next.nodeRecordMap,
    nodeStyleMap: next.nodeStyleMap,
  },
  session: {
    activeNodeId: next.activeNodeId,
    hoverNodeId: next.hoverNodeId,
    activePageId: next.activePageId,
    bgContentRect: next.bgContentRect,
    clipboard: next.clipboard,
    cssState: next.cssState,
    pageOpenMap: next.pageOpenMap,
  },
  value,
});

const getRootPages = (state: TreeState) =>
  state.nodeChildrenMap[ROOT_COLLECTION_ID] || [];

const syncPageIds = (state: TreeState) => {
  state.pageIds = [...getRootPages(state)];
};

const removeFromParent = (state: TreeState, id: number) => {
  Object.keys(state.nodeChildrenMap).forEach((key) => {
    const parentId = Number(key);
    state.nodeChildrenMap[parentId] = state.nodeChildrenMap[parentId].filter(
      (childId) => childId !== id,
    );
  });
};

const insertNodeAtTarget = (
  state: TreeState,
  nodeId: number,
  target: EditorOperationTarget,
): boolean => {
  const location = resolveInsertLocation(state, target);
  const childKind = state.nodeRecordMap[nodeId]?.type;
  if (
    !location ||
    !childKind ||
    !canInsertChildKindAtParent({
      state,
      parentId: location.parentId,
      childKind,
    })
  ) {
    return false;
  }

  if (!state.nodeChildrenMap[location.parentId]) {
    state.nodeChildrenMap[location.parentId] = [];
  }

  state.nodeChildrenMap[location.parentId].splice(location.index, 0, nodeId);
  if (!state.nodeChildrenMap[nodeId]) {
    state.nodeChildrenMap[nodeId] = [];
  }
  syncPageIds(state);
  return true;
};

const cloneSubtree = (
  sourceId: number,
  source: TreeState,
  target: TreeState,
  allocId: () => number,
): number => {
  const newId = allocId();
  target.nodeRecordMap[newId] = cloneValue(source.nodeRecordMap[sourceId]);
  target.nodeStyleMap[newId] = cloneValue(source.nodeStyleMap[sourceId]);
  target.nodeChildrenMap[newId] = (source.nodeChildrenMap[sourceId] || []).map(
    (childId) => cloneSubtree(childId, source, target, allocId),
  );
  return newId;
};

const canPasteOrMove = (
  state: TreeState,
  nodeId: number,
  target: EditorOperationTarget,
): boolean => {
  if (nodeId === target.referenceNodeId) return false;

  if (isDescendantNode(state.nodeChildrenMap, nodeId, target.referenceNodeId)) {
    return false;
  }

  const nodeType = state.nodeRecordMap[nodeId]?.type;
  if (!nodeType) return false;

  return canPlaceChildKindAtTarget({
    state,
    childKind: nodeType,
    target,
  });
};

export const insertNode = (
  state: TreeState,
  payload: { parent: number; child: number },
): EditorOperationResult => {
  const next = cloneState(state);
  const parentNode = next.nodeRecordMap[payload.parent];
  const childKind = next.nodeRecordMap[payload.child]?.type;

  if (payload.parent === ROOT_COLLECTION_ID) {
    if (
      !childKind ||
      !canInsertChildKindAtParent({
        state: next,
        parentId: ROOT_COLLECTION_ID,
        childKind,
      })
    ) {
      return { error: "Invalid parent" };
    }
    next.nodeChildrenMap[ROOT_COLLECTION_ID] =
      next.nodeChildrenMap[ROOT_COLLECTION_ID] || [];
    next.nodeChildrenMap[ROOT_COLLECTION_ID].push(payload.child);
    next.nodeChildrenMap[payload.child] =
      next.nodeChildrenMap[payload.child] || [];
    syncPageIds(next);
    return toResult(next);
  }

  if (
    !parentNode ||
    !childKind ||
    !canInsertChildKindAtParent({
      state: next,
      parentId: payload.parent,
      childKind,
    })
  ) {
    return { error: "Invalid parent" };
  }

  next.nodeChildrenMap[payload.parent] =
    next.nodeChildrenMap[payload.parent] || [];
  next.nodeChildrenMap[payload.parent].push(payload.child);
  next.nodeChildrenMap[payload.child] =
    next.nodeChildrenMap[payload.child] || [];
  syncPageIds(next);
  return toResult(next);
};

export const insertPreset = (
  state: TreeState,
  payload: {
    nodeChildrenMap: NodeChildrenMap;
    nodeRecordMap: TreeState["nodeRecordMap"];
    nodeStyleMap: TreeState["nodeStyleMap"];
    rootId?: number;
  },
): EditorOperationResult<number> => {
  const next = cloneState(state);
  Object.keys(payload.nodeRecordMap).forEach((id) => {
    const numericId = Number(id);
    next.nodeRecordMap[numericId] = cloneValue(
      payload.nodeRecordMap[numericId],
    );
    next.nodeStyleMap[numericId] = cloneValue(payload.nodeStyleMap[numericId]);
    next.nodeChildrenMap[numericId] = cloneValue(
      payload.nodeChildrenMap[numericId] || [],
    );
  });

  syncPageIds(next);
  const sourceRootId = payload.rootId ?? 0;
  return toResult(next, sourceRootId);
};

export const deleteNode = (
  state: TreeState,
  payload: { id: number },
): EditorOperationResult => {
  const next = cloneState(state);
  const nodeId = payload.id;

  if (!next.nodeRecordMap[nodeId]) {
    return { error: "Node does not exist" };
  }

  if (next.activeNodeId === nodeId) {
    const parent = getParentNodeId(
      next.nodeChildrenMap,
      ROOT_COLLECTION_ID,
      nodeId,
    );
    if (parent === ROOT_COLLECTION_ID) {
      const nextPage =
        getRootPages(next).find((pageId) => pageId !== nodeId) || null;
      next.activeNodeId = nextPage;
      next.activePageId = nextPage;
    } else if (parent !== null) {
      next.activeNodeId = parent;
    }
  }

  const walkDelete = (id: number) => {
    (next.nodeChildrenMap[id] || []).forEach((childId) => walkDelete(childId));
    delete next.nodeRecordMap[id];
    delete next.nodeStyleMap[id];
    delete next.pageOpenMap[id];
    delete next.nodeChildrenMap[id];
  };

  walkDelete(nodeId);
  removeFromParent(next, nodeId);
  syncPageIds(next);

  if (next.activePageId !== null && !next.pageIds.includes(next.activePageId)) {
    next.activePageId = next.pageIds[0] || null;
  }

  if (next.activeNodeId !== null && !next.nodeRecordMap[next.activeNodeId]) {
    next.activeNodeId = next.activePageId;
  }

  return toResult(next);
};

export const deleteFromParent = (
  state: TreeState,
  payload: { id: number | string },
): EditorOperationResult => {
  const next = cloneState(state);
  const id = Number(payload.id);
  if (!Number.isFinite(id)) return { error: "Invalid node id" };
  removeFromParent(next, id);
  syncPageIds(next);
  return toResult(next);
};

export const moveNode = (
  state: TreeState,
  payload: { node: number; target: EditorOperationTarget },
): EditorOperationResult => {
  const next = cloneState(state);

  if (!next.nodeRecordMap[payload.node]) {
    return { error: "Node does not exist" };
  }

  if (!canPasteOrMove(next, payload.node, payload.target)) {
    return { error: "Illegal move" };
  }

  removeFromParent(next, payload.node);
  if (!insertNodeAtTarget(next, payload.node, payload.target)) {
    return { error: "Invalid target" };
  }

  next.activeNodeId = next.activePageId;
  return toResult(next);
};

export const copyNode = (state: TreeState): EditorOperationResult => {
  const next = cloneState(state);
  const nodeId = next.activeNodeId;

  if (!nodeId) return { error: "No active node" };
  if (getRootPages(next).includes(nodeId))
    return { error: "Cannot copy page node" };

  next.clipboard = { copy: nodeId, cut: null };
  return toResult(next);
};

export const cutNode = (state: TreeState): EditorOperationResult => {
  const next = cloneState(state);
  const nodeId = next.activeNodeId;

  if (!nodeId) return { error: "No active node" };
  if (getRootPages(next).includes(nodeId))
    return { error: "Cannot cut page node" };

  const parent = getParentNodeId(
    next.nodeChildrenMap,
    ROOT_COLLECTION_ID,
    nodeId,
  );
  next.clipboard = { cut: nodeId, copy: null };
  removeFromParent(next, nodeId);
  syncPageIds(next);

  next.activeNodeId = parent || next.activePageId;

  return toResult(next);
};

const buildInsideTarget = (referenceNodeId: number): EditorOperationTarget => ({
  referenceNodeId,
  placement: "inside",
});

export const pasteNode = (state: TreeState): EditorOperationResult => {
  const next = cloneState(state);
  const parent = next.activeNodeId;
  if (!parent) return { error: "No active parent" };

  const target = buildInsideTarget(parent);

  if (next.clipboard.cut) {
    const cutId = next.clipboard.cut;
    if (!canPasteOrMove(next, cutId, target)) {
      return { error: "Illegal paste target" };
    }
    if (!insertNodeAtTarget(next, cutId, target)) {
      return { error: "Invalid paste target" };
    }
    next.activeNodeId = cutId;
    next.clipboard = { cut: null, copy: cutId };
    return toResult(next);
  }

  if (next.clipboard.copy) {
    const sourceId = next.clipboard.copy;
    const source = cloneState(next);
    const allocId = createNodeIdAllocator(next);
    const newNodeId = cloneSubtree(sourceId, source, next, allocId);

    if (!insertNodeAtTarget(next, newNodeId, target)) {
      return { error: "Invalid paste target" };
    }

    next.activeNodeId = newNodeId;
    return toResult(next);
  }

  return { error: "Clipboard empty" };
};

export const duplicateNode = (state: TreeState): EditorOperationResult => {
  const next = cloneState(state);
  const nodeId = next.activeNodeId;

  if (!nodeId) return { error: "No active node" };
  if (getRootPages(next).includes(nodeId))
    return { error: "Cannot duplicate page node" };

  const source = cloneState(next);
  const allocId = createNodeIdAllocator(next);
  const duplicateId = cloneSubtree(nodeId, source, next, allocId);

  if (
    !insertNodeAtTarget(next, duplicateId, {
      referenceNodeId: nodeId,
      placement: "after",
    })
  ) {
    return { error: "Failed to duplicate" };
  }

  next.activeNodeId = duplicateId;
  return toResult(next);
};

export const revealParent = (state: TreeState): EditorOperationResult => {
  const next = cloneState(state);
  if (!next.activeNodeId || !next.activePageId) return toResult(next);

  next.activeNodeId = getParentNodeId(
    next.nodeChildrenMap,
    next.activePageId,
    next.activeNodeId,
  );
  return toResult(next);
};

export const updateNodeStyle = (
  state: TreeState,
  payload: { id: number; style: CSSProperties; cssState: CssState },
): EditorOperationResult => {
  const next = cloneState(state);
  if (!next.nodeStyleMap[payload.id]) {
    return { error: "Style bucket missing" };
  }

  next.nodeStyleMap[payload.id][payload.cssState] = cloneValue(payload.style);
  return toResult(next);
};

export const updateNodeRecord = (
  state: TreeState,
  payload: { id: number; data: NodeRecord },
): EditorOperationResult => {
  const next = cloneState(state);
  next.nodeRecordMap[payload.id] = cloneValue(payload.data);
  return toResult(next);
};

export const updateClipboardState = (
  state: TreeState,
  payload: { cut: number | null; copy: number | null },
): EditorOperationResult => {
  const next = cloneState(state);

  if (next.clipboard.cut) {
    const result = deleteNode(next, { id: next.clipboard.cut });
    if (result.document) {
      Object.assign(next, result.document);
    }
    if (result.session) {
      Object.assign(next, result.session);
    }
    next.clipboard.cut = null;
  }

  const rootPages = getRootPages(next);
  if (payload.cut && rootPages.includes(payload.cut))
    return { error: "Cannot cut page node" };
  if (payload.copy && rootPages.includes(payload.copy))
    return { error: "Cannot copy page node" };

  next.clipboard = { ...payload };
  return toResult(next);
};

export const placementFromPos = (pos: number): EditorPlacement => {
  if (pos === -1) return "inside";
  if (pos === 0) return "before";
  return "after";
};

export const toNumericId = (value: number | string): number => Number(value);
