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
      state.tree[payload.child] = state.tree[payload.child] || [];
    },
    deleteNode: (state, { payload }) => {
      if (payload.id === "root") return;
      state.activeNodeId = null;
      const deleteWork = (id) => {
        state.tree[id].map((child) => deleteWork(child));
        delete state.dataMap[id];
        delete state.styleMap[id];
        const { [id]: ___, ...newTree } = state.tree;
        state.tree = newTree;
      };
      deleteWork(payload.id);
      treeSlice.caseReducers.deleteFromParent(state, { payload });
    },
    deleteFromParent: (state, { payload }) => {
      state.tree = Object.keys(state.tree).reduce((acc, key) => {
        acc[key] = state.tree[key].filter((_id) => _id !== payload.id);
        return acc;
      }, {});
    },
    updateActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.id;
    },
    updateHoverNode: (state, { payload }) => {
      state.hoverNodeId = payload.nodeId;
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
  addNode,
  updateStyleMap,
  updateDataMap,
  deleteNode,
  deleteFromParent,
} = treeSlice.actions;
export default treeSlice.reducer;
