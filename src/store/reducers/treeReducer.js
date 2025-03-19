import { createSlice } from "@reduxjs/toolkit";

const createCopy = (id, state) => {
  const uid = Math.floor(Math.random() * 1000000);
  state.styleMap[uid] = state.styleMap[id];
  state.dataMap[uid] = state.dataMap[id];
  state.tree[uid] = state.tree[id].map((_id) => createCopy(_id, state));
  return uid;
};

const getParent = (tree, start, id) => {
  if (tree[start].includes(id)) return start;
  for (const node of tree[start]) {
    const result = getParent(tree, node, id);
    if (result) return result;
  }
  return null;
};

const isRelation = ({ tree, parent, child }) => {
  if (!tree[parent]) return false;
  if (tree[parent].includes(child)) return true;
  for (const _child of tree[parent]) {
    if (isRelation({ tree, parent: _child, child })) return true;
  }
  return false;
};

const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: {
      tabs: ["root", "homepage"],
      root: [],
      homepage: [],
    },
    activeNodeId: "root",
    activeTab: "root",
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
      homepage: {
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
      homepage: {
        name: "HomePage",
        type: "root",
      },
    },
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
  },
  reducers: {
    addNode: (state, { payload }) => {
      if (state.dataMap[payload.parent].unit) return;
      state.tree[payload.parent].push(Number(payload.child));
      state.tree[payload.child] = state.tree[payload.child] || [];
    },
    addTemplate: (state, { payload }) => {
      state.tree = { ...state.tree, ...payload.tree };
      state.dataMap = { ...state.dataMap, ...payload.dataMap };
      state.styleMap = { ...state.styleMap, ...payload.styleMap };
    },
    deleteNode: (state, { payload }) => {
      if (state.tree.tabs.includes(payload.id)) return;
      state.activeNodeId = state.activeTab;
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
        acc[key] = state.tree[key].filter((_id) => _id !== Number(payload.id));
        return acc;
      }, {});
    },
    updateActiveNode: (state, { payload }) => {
      state.activeNodeId = payload.id;
    },
    updateActiveTab: (state, { payload }) => {
      state.activeTab = payload.tab;
      state.activeNodeId = payload.tab;
    },
    updateStyleMap: (state, { payload }) => {
      state.styleMap[payload.id] = payload.style;
    },
    updateDataMap: (state, { payload }) => {
      state.dataMap[payload.id] = payload.data;
    },
    updateRootWidth: (state, { payload }) => {
      state.styleMap[state.activeTab].width = payload.width;
    },
    updateBgContentRect: (state, { payload }) => {
      state.bgContentRect = payload.bgContentRect;
    },
    updateClipboard: (state, { payload }) => {
      if (state.clipboard.cut) {
        treeSlice.caseReducers.deleteNode(state, {
          payload: { id: state.clipboard.cut },
        });
        state.clipboard.cut = null;
      }
      if (payload.cut === state.activeTab || payload.copy === state.activeTab)
        return;
      state.clipboard = payload;
    },
    paste: (state) => {
      const parent = state.activeNodeId;
      if (state.clipboard.cut) {
        treeSlice.caseReducers.addNode(state, {
          payload: { parent, child: state.clipboard.cut },
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
      if (state.activeNodeId === state.activeTab) return;
      const duplicate = createCopy(state.activeNodeId, state);
      treeSlice.caseReducers.splice(state, {
        payload: { referenceNode: state.activeNodeId, pos: 1, node: duplicate },
      });
      state.activeNodeId = duplicate;
    },
    revealParent: (state) => {
      state.activeNodeId = getParent(
        state.tree,
        state.activeTab,
        state.activeNodeId
      );
    },
    splice: (state, { payload }) => {
      if (state.tree.tabs.includes(payload.referenceNode)) {
        state.tree[payload.referenceNode].splice(0, 0, Number(payload.node));
      } else {
        const parent =
          payload.parent ||
          getParent(state.tree, "tabs", Number(payload.referenceNode));
        const index = state.tree[parent].indexOf(Number(payload.referenceNode));
        state.tree[parent].splice(index + payload.pos, 0, Number(payload.node));
      }
    },
    moveItem: (state, { payload }) => {
      const { node, referenceNode, pos } = payload;
      if (payload.pos === -1 && state.dataMap[payload.referenceNode].unit)
        return;
      if (
        !state.tree.tabs.includes(referenceNode) &&
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
  updateBgContentRect,
  updateClipboard,
  paste,
  duplicate,
  revealParent,
  splice,
  moveItem,
  addTemplate,
  updateActiveTab,
} = treeSlice.actions;
export default treeSlice.reducer;
