import type { Tree, TreeState } from "../types/Tree";
import type { WritableDraft } from "immer";

export const getParent = (
  tree: Tree,
  start: number,
  id: number,
): number | null => {
  if (tree[start].includes(id)) return start;
  for (const node of tree[start]) {
    const result = getParent(tree, node, id);
    if (result) return result;
  }
  return null;
};

export const DeleteFromParent = (
  state: WritableDraft<TreeState>,
  {
    payload,
  }: {
    payload: {
      id: number | string;
    };
  },
) => {
  if (!payload.id) return;
  state.tree = Object.keys(state.tree).reduce((acc: Tree, key) => {
    acc[Number(key)] = state.tree[Number(key)].filter(
      (_id) => _id !== Number(payload.id),
    );
    return acc;
  }, {});
};

export const DeleteNode = (
  state: WritableDraft<TreeState>,
  {
    payload,
  }: {
    payload: {
      id: number;
    };
  },
) => {
  if (state.activeNodeId) {
    const parent = getParent(state.tree, -1, state.activeNodeId);
    if (parent) state.activeNodeId = parent;
    else throw new Error("cannot get parent [getParent]");
  }

  const deleteWork = (id: number) => {
    state.tree[id].map((child) => deleteWork(child));
    delete state.dataMap[id];
    delete state.styleMap[id];
    const { [id]: ___, ...newTree } = state.tree;
    state.tree = newTree;
  };
  deleteWork(payload.id);
  DeleteFromParent(state, { payload });
};

export const AddNode = (
  state: WritableDraft<TreeState>,
  {
    payload,
  }: {
    payload: {
      parent: number;
      child: number;
    };
  },
) => {
  if (state.dataMap[payload.parent].unit) return;
  state.tree[payload.parent].push(Number(payload.child));
  state.tree[payload.child] = state.tree[payload.child] || [];
};

export const Splice = (
  state: WritableDraft<TreeState>,
  {
    payload,
  }: {
    payload: {
      referenceNode: number;
      pos: number;
      node: number;
      parent?: number;
    };
  },
) => {
  if (state.tree[-1].includes(Number(payload.referenceNode))) {
    state.tree[payload.referenceNode].splice(0, 0, Number(payload.node));
  } else {
    const parent =
      payload.parent ||
      getParent(state.tree, -1, Number(payload.referenceNode));

    if (!parent) {
      throw new Error("cannot get parent [getParent]");
    }

    const index = state.tree[parent].indexOf(Number(payload.referenceNode));
    state.tree[parent].splice(index + payload.pos, 0, Number(payload.node));
  }
};
