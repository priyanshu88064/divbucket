import { createSlice } from "@reduxjs/toolkit";

const treeSlice = createSlice({
  name: "tree",
  initialState: { activeNodeId: null },
  reducers: {
    updateActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.nodeId;
    },
  },
});

export const { updateActiveNode } = treeSlice.actions;
export default treeSlice.reducer;
