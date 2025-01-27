import { createSlice } from "@reduxjs/toolkit";
import { DeleteNode } from "../../utils/treeFunctions";

const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: [],
    activeNodeId: null,
    hoverNodeId: null,
    styleMap: {},
    dataMap: {},
  },
  reducers: {
    updateActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.nodeId;
    },
    updateHoverNode: (state, { payload }) => {
      state.hoverNodeId = payload.nodeId;
    },
    updateTree: (state, { payload }) => {
      state.tree = payload.tree;
    },
    updateStyleMap: (state, { payload }) => {
      state.styleMap[payload.id] = payload.style;
    },
    updateDataMap: (state, { payload }) => {
      state.dataMap[payload.id] = payload.data;
    },
    deleteNode: (state, { payload }) => {
      state.activeNodeId = null;
      delete state.dataMap[payload.id];
      delete state.styleMap[payload.id];
      state.tree = DeleteNode(state.tree, payload.id);
    },
  },
});

export const {
  updateActiveNode,
  updateHoverNode,
  updateTree,
  updateStyleMap,
  updateDataMap,
  deleteNode,
} = treeSlice.actions;
export default treeSlice.reducer;
