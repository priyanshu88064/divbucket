import { createSlice } from "@reduxjs/toolkit";

const treeSlice = createSlice({
  name: "tree",
  initialState: { tree: [], activeNodeId: null },
  reducers: {
    updateActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.nodeId;
    },
    updateTree: (state, { payload }) => {
      state.tree = payload.tree;
    },
  },
});

export const { updateActiveNode, updateTree } = treeSlice.actions;
export default treeSlice.reducer;
