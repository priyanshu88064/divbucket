import { createSlice } from "@reduxjs/toolkit";

const treeSlice = createSlice({
  name: "tree",
  initialState: { tree: [], activeNodeId: null, styleMap: {} },
  reducers: {
    updateActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.nodeId;
    },
    updateTree: (state, { payload }) => {
      state.tree = payload.tree;
    },
    updateStyleMap: (state, { payload }) => {
      state.styleMap[payload.id] = payload.style;
    },
  },
});

export const { updateActiveNode, updateTree, updateStyleMap } =
  treeSlice.actions;
export default treeSlice.reducer;
