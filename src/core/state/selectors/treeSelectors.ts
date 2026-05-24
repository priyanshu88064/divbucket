import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { CssState } from "@core/types/document";

const EMPTY_NUMBER_ARRAY: number[] = [];
const EMPTY_STYLE_OBJECT = {};

export const selectTreeState = (state: RootState) => state.treeReducer;

export const selectDocumentState = createSelector(
  selectTreeState,
  ({ pageIds, nodeChildrenMap, nodeRecordMap, nodeStyleMap }) => ({
    pageIds,
    nodeChildrenMap,
    nodeRecordMap,
    nodeStyleMap,
  }),
);

export const selectEditorSessionState = createSelector(
  selectTreeState,
  ({
    activeNodeId,
    hoverNodeId,
    activePageId,
    bgContentRect,
    clipboard,
    cssState,
    pageOpenMap,
  }) => ({
    activeNodeId,
    hoverNodeId,
    activePageId,
    bgContentRect,
    clipboard,
    cssState,
    pageOpenMap,
  }),
);

export const selectActiveNodeId = (state: RootState) =>
  state.treeReducer.activeNodeId;
export const selectHoverNodeId = (state: RootState) =>
  state.treeReducer.hoverNodeId;
export const selectActivePageId = (state: RootState) =>
  state.treeReducer.activePageId;
export const selectCssState = (state: RootState) => state.treeReducer.cssState;
export const selectPageIds = (state: RootState) => state.treeReducer.pageIds;
export const selectPageOpenMap = (state: RootState) =>
  state.treeReducer.pageOpenMap;
export const selectClipboard = (state: RootState) => state.treeReducer.clipboard;
export const selectCanUndo = (state: RootState) =>
  Boolean(state.treeReducer.history?.past.length);
export const selectCanRedo = (state: RootState) =>
  Boolean(state.treeReducer.history?.future.length);

export const selectTabs = (state: RootState) =>
  state.treeReducer.nodeChildrenMap[-1] || EMPTY_NUMBER_ARRAY;

export const selectNodeChildrenById = (state: RootState, nodeId: number) =>
  state.treeReducer.nodeChildrenMap[nodeId] || EMPTY_NUMBER_ARRAY;

export const selectNodeRecordById = (state: RootState, nodeId: number) =>
  state.treeReducer.nodeRecordMap[nodeId];

export const selectNodeStyleById = (state: RootState, nodeId: number) =>
  state.treeReducer.nodeStyleMap[nodeId];

export const selectNodeDefaultStyleById = (state: RootState, nodeId: number) =>
  state.treeReducer.nodeStyleMap[nodeId]?.default || EMPTY_STYLE_OBJECT;

export const selectNodeStyleByIdAndState = (
  state: RootState,
  nodeId: number,
  cssState: CssState,
) => state.treeReducer.nodeStyleMap[nodeId]?.[cssState] || EMPTY_STYLE_OBJECT;

export const selectRootNames = createSelector(
  (state: RootState) => state.treeReducer.nodeRecordMap,
  (nodeRecordMap) =>
    Object.fromEntries(
      Object.entries(nodeRecordMap)
        .filter(([, value]) => value.type === "core:root")
        .map(([key, value]) => [Number(key), value.name]),
    ),
);

export const selectExportDocumentState = createSelector(
  selectPageIds,
  (state: RootState) => state.treeReducer.nodeChildrenMap,
  (state: RootState) => state.treeReducer.nodeRecordMap,
  (state: RootState) => state.treeReducer.nodeStyleMap,
  (pageIds, nodeChildrenMap, nodeRecordMap, nodeStyleMap) => ({
    pageIds,
    nodeChildrenMap,
    nodeRecordMap,
    nodeStyleMap,
  }),
);
