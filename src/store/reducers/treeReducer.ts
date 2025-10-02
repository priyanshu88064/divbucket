import { createSlice } from "@reduxjs/toolkit";
import type {
  BGContentRect,
  Clipboard,
  CssState,
  NodeData,
  NodeStyle,
  Tree,
  TreeState,
} from "../../types/Tree";
import type { WritableDraft } from "immer";
import {
  AddNode,
  DeleteFromParent,
  DeleteNode,
  getParent,
  Splice,
} from "../../utils/treeFunctions";
import type { CSSProperties } from "react";

const createCopy = (id: number, state: WritableDraft<TreeState>) => {
  const uid = Math.floor(Math.random() * 1000000);
  state.styleMap[uid] = state.styleMap[id];
  state.dataMap[uid] = state.dataMap[id];
  state.tree[uid] = state.tree[id].map((_id) => createCopy(_id, state));
  return uid;
};

const isRelation = ({
  tree,
  parent,
  child,
}: {
  tree: Tree;
  parent: number;
  child: number;
}) => {
  if (!tree[parent]) return false;
  if (tree[parent].includes(child)) return true;
  for (const _child of tree[parent]) {
    if (isRelation({ tree, parent: _child, child })) return true;
  }
  return false;
};

const initialState: TreeState = {
  tree: {},
  activeNodeId: null,
  activeTab: null,
  styleMap: {},
  dataMap: {},
  bgContentRect: {
    width: 0,
    height: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
      if (state.dataMap[payload.parent].unit) return;
      state.tree[payload.parent].push(Number(payload.child));
      state.tree[payload.child] = state.tree[payload.child] || [];
    },
    addTemplate: (
      state,
      {
        payload,
      }: {
        payload: {
          tree: Tree;
          dataMap: NodeData;
          styleMap: NodeStyle;
        };
      },
    ) => {
      state.tree = { ...state.tree, ...payload.tree };
      state.dataMap = { ...state.dataMap, ...payload.dataMap };
      state.styleMap = { ...state.styleMap, ...payload.styleMap };
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
      DeleteNode(state, { payload });
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
      DeleteFromParent(state, { payload });
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
    updateActiveTab: (
      state,
      {
        payload,
      }: {
        payload: {
          tab: number;
        };
      },
    ) => {
      state.activeTab = payload.tab;
      state.activeNodeId = payload.tab;
      if (!state.dataMap[payload.tab].open)
        state.dataMap[payload.tab].open = true;
    },
    updateTabOpenStatus: (
      state,
      {
        payload,
      }: {
        payload: {
          tab: number;
          open: boolean;
        };
      },
    ) => {
      state.dataMap[payload.tab].open = payload.open;
      if (payload.tab !== state.activeTab) return;
      state.activeTab =
        state.tree[-1].filter((tab) => state.dataMap[tab].open)[0] || null;
      state.activeNodeId = state.activeTab;
    },
    updateStyleMap: (
      state,
      {
        payload,
      }: { payload: { id: number; style: CSSProperties; cssState: CssState } },
    ) => {
      state.styleMap[payload.id][payload.cssState] = payload.style;
    },
    updateDataMap: (
      state,
      { payload }: { payload: { id: number; data: NodeData[number] } },
    ) => {
      state.dataMap[payload.id] = payload.data;
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
      if (state.activeTab) {
        state.styleMap[state.activeTab].default.width = payload.width;
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
      if (state.clipboard.cut) {
        DeleteNode(state, {
          payload: {
            id: state.clipboard.cut,
          },
        });
        state.clipboard.cut = null;
      }
      if (payload.cut && state.tree[-1].includes(payload.cut)) return;
      if (payload.copy && state.tree[-1].includes(payload.copy)) return;
      state.clipboard = payload;
    },
    paste: (state) => {
      const parent = state.activeNodeId;
      if (!parent) {
        return;
      }

      if (state.dataMap[parent].unit) return;

      if (state.clipboard.cut) {
        AddNode(state, {
          payload: {
            parent,
            child: state.clipboard.cut,
          },
        });
        state.activeNodeId = state.clipboard.cut;
        state.clipboard.copy = state.clipboard.cut;
        state.clipboard.cut = null;
      } else if (state.clipboard.copy) {
        const newChild = createCopy(state.clipboard.copy, state);
        state.tree[parent].push(newChild);
        state.activeNodeId = newChild;
      }
    },
    duplicate: (state) => {
      if (!state.activeNodeId) return;

      if (state.tree[-1].includes(state.activeNodeId)) return;
      const duplicate = createCopy(state.activeNodeId, state);
      treeSlice.caseReducers.splice(state, {
        payload: { referenceNode: state.activeNodeId, pos: 1, node: duplicate },
      });
      state.activeNodeId = duplicate;
    },
    revealParent: (state) => {
      if (!state.activeNodeId || !state.activeTab) return;
      state.activeNodeId = getParent(
        state.tree,
        state.activeTab,
        state.activeNodeId,
      );
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
          parent?: number;
        };
      },
    ) => {
      Splice(state, { payload });
    },
    moveItem: (state, { payload }) => {
      const { node, referenceNode, pos } = payload;
      if (payload.pos === -1 && state.dataMap[payload.referenceNode].unit)
        return;
      if (
        !state.tree[-1].includes(referenceNode) &&
        isRelation({
          tree: state.tree,
          parent: Number(node),
          child: Number(referenceNode),
        })
      )
        return;
      treeSlice.caseReducers.deleteFromParent(state, { payload: { id: node } });
      if (pos === -1)
        treeSlice.caseReducers.addNode(state, {
          payload: { parent: referenceNode, child: node },
        });
      else
        treeSlice.caseReducers.splice(state, {
          payload: { ...payload },
        });
      state.activeNodeId = Number(node);
    },
    cut: (state) => {
      const cutNode = state.activeNodeId;
      if (!cutNode) return;
      if (state.tree[-1].includes(cutNode)) return;

      treeSlice.caseReducers.updateClipboard(state, {
        payload: { cut: cutNode, copy: null },
      });
      treeSlice.caseReducers.deleteFromParent(state, {
        payload: { id: cutNode },
      });

      const parent = getParent(state.tree, -1, cutNode);
      state.activeNodeId = parent || state.activeTab;
    },
    copy: (state) => {
      if (!state.activeNodeId) return;
      if (state.tree[-1].includes(state.activeNodeId)) return;
      treeSlice.caseReducers.updateClipboard(state, {
        payload: { copy: state.activeNodeId, cut: null },
      });
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
  addNode,
  updateStyleMap,
  updateDataMap,
  deleteNode,
  deleteFromParent,
  updateRootWidth,
  updateBgContentRect,
  updateClipboard,
  paste,
  duplicate,
  revealParent,
  splice,
  moveItem,
  addTemplate,
  updateActiveTab,
  updateTabOpenStatus,
  cut,
  copy,
  updateCssState,
} = treeSlice.actions;
export default treeSlice.reducer;
