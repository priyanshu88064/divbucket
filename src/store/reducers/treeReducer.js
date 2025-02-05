import { createSlice } from "@reduxjs/toolkit";

const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: { root: [] },
    activeNodeId: null,
    hoverNodeId: null,
    styleMap: {},
    dataMap: {},
  },
  reducers: {
    updateTree: (state, { payload }) => {
      state.tree = payload.tree;
    },
    updateActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.nodeId;
    },
    updateHoverNode: (state, { payload }) => {
      state.hoverNodeId = payload.nodeId;
    },
    updateStyleMap: (state, { payload }) => {
      state.styleMap = payload.styleMap;
    },
    updateDataMap: (state, { payload }) => {
      state.dataMap = payload.dataMap;
    },
    deleteNode: (state, { payload }) => {
      state.activeNodeId = null;
      if (!payload.dontDeleteData) {
        const { [payload.id]: _, ...newDataMap } = state.dataMap;
        const { [payload.id]: __, ...newStyleMap } = state.styleMap;
        state.dataMap = newDataMap;
        state.styleMap = newStyleMap;
      }
      const { [payload.id]: ___, ...newTree } = state.tree;
      state.tree = Object.keys(newTree).reduce((acc, key) => {
        acc[key] = newTree[key].filter((id) => id !== payload.id);
        return acc;
      }, {});
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
