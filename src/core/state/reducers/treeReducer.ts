import { createSlice } from "@reduxjs/toolkit";
import type {
  BGContentRect,
  Clipboard,
  CssState,
  NodeChildrenMap,
  NodeRecord,
  NodeRecordMap,
  NodeStyleMap,
  TreeState,
} from "@core/types/document";
import type { CSSProperties } from "react";
import { editorService } from "@core/editor/service";
import { placementFromPos, toNumericId } from "@core/editor/operations";
import type {
  EditorOperationResult,
  EditorOperationTarget,
} from "@core/editor/types";

const applyResult = <TValue>(
  state: TreeState,
  result: EditorOperationResult<TValue>,
) => {
  if (!result || result.error) return;

  if (result.document) {
    if (result.document.pageIds) state.pageIds = result.document.pageIds;
    if (result.document.nodeChildrenMap)
      state.nodeChildrenMap = result.document.nodeChildrenMap;
    if (result.document.nodeRecordMap)
      state.nodeRecordMap = result.document.nodeRecordMap;
    if (result.document.nodeStyleMap)
      state.nodeStyleMap = result.document.nodeStyleMap;
  }

  if (result.session) {
    if (result.session.activeNodeId !== undefined)
      state.activeNodeId = result.session.activeNodeId;
    if (result.session.hoverNodeId !== undefined)
      state.hoverNodeId = result.session.hoverNodeId;
    if (result.session.activePageId !== undefined)
      state.activePageId = result.session.activePageId;
    if (result.session.bgContentRect)
      state.bgContentRect = result.session.bgContentRect;
    if (result.session.clipboard) state.clipboard = result.session.clipboard;
    if (result.session.cssState) state.cssState = result.session.cssState;
    if (result.session.pageOpenMap)
      state.pageOpenMap = result.session.pageOpenMap;
  }
};

const initialState: TreeState = {
  pageIds: [],
  nodeChildrenMap: {},
  activeNodeId: null,
  hoverNodeId: null,
  activePageId: null,
  nodeStyleMap: {},
  nodeRecordMap: {},
  pageOpenMap: {},
  bgContentRect: {
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  },
  clipboard: {
    cut: null,
    copy: null,
  },
  cssState: "default",
};

const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    addNode: (
      state,
      {
        payload,
      }: {
        payload: {
          parent: number;
          child: number;
        };
      },
    ) => {
      applyResult(state, editorService.insertNode(state, payload));
    },
    addTemplate: (
      state,
      {
        payload,
      }: {
        payload: {
          nodeChildrenMap: NodeChildrenMap;
          nodeRecordMap: NodeRecordMap;
          nodeStyleMap: NodeStyleMap;
          rootId?: number;
        };
      },
    ) => {
      applyResult(state, editorService.insertPreset(state, payload));

      for (const pageId of state.pageIds) {
        if (state.pageOpenMap[pageId] === undefined) {
          state.pageOpenMap[pageId] = true;
        }
      }
    },
    addDocument: (state, { payload }: { payload: TreeState }) => {
      state.pageIds = payload.pageIds;
      state.nodeChildrenMap = payload.nodeChildrenMap;
      state.nodeRecordMap = payload.nodeRecordMap;
      state.nodeStyleMap = payload.nodeStyleMap;
      state.pageOpenMap = payload.pageOpenMap;
      state.activeNodeId = payload.activeNodeId;
      state.hoverNodeId = payload.hoverNodeId;
      state.activePageId = payload.activePageId;
      state.bgContentRect = payload.bgContentRect;
      state.clipboard = payload.clipboard;
      state.cssState = payload.cssState;
    },
    deleteNode: (
      state,
      {
        payload,
      }: {
        payload: {
          id: number;
        };
      },
    ) => {
      applyResult(state, editorService.deleteNode(state, payload));
    },
    deleteFromParent: (
      state,
      {
        payload,
      }: {
        payload: {
          id: number | string;
        };
      },
    ) => {
      applyResult(state, editorService.deleteFromParent(state, payload));
    },
    updateActiveNode: (
      state,
      {
        payload,
      }: {
        payload: {
          id: number;
        };
      },
    ) => {
      state.activeNodeId = payload.id;
    },
    updateHoverNodeId: (
      state,
      {
        payload,
      }: {
        payload: {
          id: number | null;
        };
      },
    ) => {
      state.hoverNodeId = payload.id;
    },
    updateActivePageId: (
      state,
      {
        payload,
      }: {
        payload: {
          pageId: number;
        };
      },
    ) => {
      state.activePageId = payload.pageId;
      state.activeNodeId = payload.pageId;
      state.pageOpenMap[payload.pageId] = true;
    },
    updatePageOpenStatus: (
      state,
      {
        payload,
      }: {
        payload: {
          pageId: number;
          isOpen: boolean;
        };
      },
    ) => {
      state.pageOpenMap[payload.pageId] = payload.isOpen;
      if (payload.pageId !== state.activePageId) return;
      state.activePageId =
        state.nodeChildrenMap[-1].filter((tab) => state.pageOpenMap[tab])[0] ||
        null;
      state.activeNodeId = state.activePageId;
    },
    updateStyleMap: (
      state,
      {
        payload,
      }: { payload: { id: number; style: CSSProperties; cssState: CssState } },
    ) => {
      applyResult(state, editorService.updateNodeStyle(state, payload));
    },
    updateDataMap: (
      state,
      { payload }: { payload: { id: number; data: NodeRecord } },
    ) => {
      applyResult(state, editorService.updateNodeRecord(state, payload));
    },
    updateRootWidth: (
      state,
      {
        payload,
      }: {
        payload: {
          width: string;
        };
      },
    ) => {
      if (state.activePageId) {
        state.nodeStyleMap[state.activePageId].default.width = payload.width;
      }
    },
    updateBgContentRect: (
      state,
      {
        payload,
      }: {
        payload: {
          bgContentRect: BGContentRect;
        };
      },
    ) => {
      state.bgContentRect = payload.bgContentRect;
    },
    updateClipboard: (
      state,
      {
        payload,
      }: {
        payload: Clipboard;
      },
    ) => {
      applyResult(state, editorService.updateClipboard(state, payload));
    },
    paste: (state) => {
      applyResult(state, editorService.pasteNode(state));
    },
    duplicate: (state) => {
      applyResult(state, editorService.duplicateNode(state));
    },
    revealParent: (state) => {
      applyResult(state, editorService.selectParent(state));
    },
    moveNode: (
      state,
      {
        payload,
      }: {
        payload: {
          node: number;
          target: EditorOperationTarget;
        };
      },
    ) => {
      applyResult(state, editorService.moveNode(state, payload));
    },
    splice: (
      state,
      {
        payload,
      }: {
        payload: {
          referenceNode: number;
          pos: number;
          node: number;
        };
      },
    ) => {
      const target: EditorOperationTarget = {
        referenceNodeId: payload.referenceNode,
        placement: placementFromPos(payload.pos),
      };
      applyResult(
        state,
        editorService.moveNode(state, {
          node: payload.node,
          target,
        }),
      );
    },
    moveItem: (
      state,
      {
        payload,
      }: {
        payload: {
          node: number | string;
          referenceNode: number | string;
          pos: number;
        };
      },
    ) => {
      const target: EditorOperationTarget = {
        referenceNodeId: toNumericId(payload.referenceNode),
        placement: placementFromPos(payload.pos),
      };
      applyResult(
        state,
        editorService.moveNode(state, {
          node: toNumericId(payload.node),
          target,
        }),
      );
    },
    cut: (state) => {
      applyResult(state, editorService.cutNode(state));
    },
    copy: (state) => {
      applyResult(state, editorService.copyNode(state));
    },
    updateCssState: (
      state,
      { payload }: { payload: { cssState: CssState } },
    ) => {
      state.cssState = payload.cssState;
    },
  },
});

export const {
  updateActiveNode,
  updateHoverNodeId,
  addNode,
  updateStyleMap,
  updateDataMap,
  deleteNode,
  deleteFromParent,
  updateActivePageId,
  updateRootWidth,
  updateBgContentRect,
  addTemplate,
  paste,
  updateClipboard,
  cut,
  copy,
  moveItem,
  moveNode,
  duplicate,
  revealParent,
  updateCssState,
  updatePageOpenStatus,
  addDocument,
} = treeSlice.actions;

export default treeSlice.reducer;
