import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const {
  updateActiveNode,
  updateHoverNode,
  updateTree,
  updateStyleMap,
  updateDataMap,
} = treeSlice.actions;
export default treeSlice.reducer;
