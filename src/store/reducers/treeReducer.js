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
    addNode: (state, { payload }) => {
      state.tree[payload.parent].push(payload.child);
      state.tree[payload.child] = [];
    },
    deleteNode: (state, { payload }) => {
      state.activeNodeId = null;
      if (!payload.dontDeleteData) {
        delete state.dataMap[payload.id];
        delete state.styleMap[payload.id];
      }
      const { [payload.id]: ___, ...newTree } = state.tree;
      state.tree = Object.keys(newTree).reduce((acc, key) => {
        acc[key] = newTree[key].filter((id) => id !== payload.id);
        return acc;
      }, {});
    },
    updateActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.nodeId;
    },
    updateHoverNode: (state, { payload }) => {
      state.hoverNodeId = payload.nodeId;
    },
    updateStyleMap: (state, { payload }) => {
      console.log(payload.style)
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
  addNode,
  updateStyleMap,
  updateDataMap,
  deleteNode,
} = treeSlice.actions;
export default treeSlice.reducer;
