import { createSlice } from "@reduxjs/toolkit";

const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: { root: [] },
    activeNodeId: "root",
    styleMap: {
      root: {
        width: "100%",
        height: "100%",
        minWidth: "350px",
        background: "white",
        paddingTop: "5px",
        paddingRight: "5px",
        paddingBottom: "5px",
        paddingLeft: "5px",
        display: "block",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "stretch",
        gap: "0px",
        flexWrap: "nowrap",
      },
    },
    dataMap: {
      root: {
        name: "BODY",
        type: "root",
      },
    },
    maxRootWidth:{
      left:0,
      right:0,
      diff:0
    }
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
    updateStyleMap: (state, { payload }) => {
      state.styleMap[payload.id] = payload.style;
    },
    updateDataMap: (state, { payload }) => {
      state.dataMap[payload.id] = payload.data;
    },
    updateRootWidth:(state,{payload})=>{
      state.styleMap.root.width = payload.width;
    },
    updateMaxRootWidth:(state,{payload})=>{
      state.maxRootWidth[payload.key] = payload.value;
      state.maxRootWidth.diff = Math.floor(state.maxRootWidth.right - state.maxRootWidth.left - 10); // -10 for the resizablebar
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
  updateRootWidth,
  updateMaxRootWidth
} = treeSlice.actions;
export default treeSlice.reducer;
