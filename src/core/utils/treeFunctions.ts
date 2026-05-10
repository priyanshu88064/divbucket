import type { TreeState } from "@core/types/document";
import { isCoreContainerNodeKind } from "@core/types/document";
import type { WritableDraft } from "immer";

export const getParent = (
  nodeChildrenMap: TreeState["nodeChildrenMap"],
  start: number,
  id: number,
): number | null => {
  if (nodeChildrenMap[start].includes(id)) return start;
  for (const node of nodeChildrenMap[start]) {
    const result = getParent(nodeChildrenMap, node, id);
    if (result !== null) return result;
  }
  return null;
};

export const deleteFromParent = (
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
  state.nodeChildrenMap = Object.keys(state.nodeChildrenMap).reduce(
    (acc: TreeState["nodeChildrenMap"], key) => {
      acc[Number(key)] = state.nodeChildrenMap[Number(key)].filter(
        (_id) => _id !== Number(payload.id),
      );
      return acc;
    },
    {},
  );
};

export const deleteNode = (
  state: WritableDraft<TreeState>,
  {
    payload,
  }: {
    payload: {
      id: number;
    };
  },
) => {
  if (state.activeNodeId === payload.id) {
    const parent = getParent(state.nodeChildrenMap, -1, state.activeNodeId);
    if (parent === -1) {
      const nextTabToFocus =
        state.nodeChildrenMap[-1].find((tab) => tab !== state.activeNodeId) ||
        null;
      state.activeNodeId = nextTabToFocus;
      state.activePageId = nextTabToFocus;
    } else if (parent !== null) {
      state.activeNodeId = parent;
    } else {
      throw new Error("cannot get parent [getParent]");
    }
  }

  const deleteWork = (id: number) => {
    state.nodeChildrenMap[id].forEach((child) => deleteWork(child));
    delete state.nodeRecordMap[id];
    delete state.nodeStyleMap[id];
    delete state.pageOpenMap[id];
    const { [id]: _, ...newTree } = state.nodeChildrenMap;
    state.nodeChildrenMap = newTree;
  };
  deleteWork(payload.id);
  deleteFromParent(state, { payload });
  state.pageIds = state.nodeChildrenMap[-1] || [];
};

export const addNode = (
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
  const parentNode = state.nodeRecordMap[payload.parent];
  if (!parentNode || !isCoreContainerNodeKind(parentNode.type)) return;
  state.nodeChildrenMap[payload.parent].push(Number(payload.child));
  state.nodeChildrenMap[payload.child] =
    state.nodeChildrenMap[payload.child] || [];
  state.pageIds = state.nodeChildrenMap[-1] || [];
};

export const spliceNode = (
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
  if (state.nodeChildrenMap[-1].includes(Number(payload.referenceNode))) {
    state.nodeChildrenMap[payload.referenceNode].splice(
      0,
      0,
      Number(payload.node),
    );
  } else {
    const parent =
      payload.parent ||
      getParent(state.nodeChildrenMap, -1, Number(payload.referenceNode));

    if (parent === null) {
      throw new Error("cannot get parent [getParent]");
    }

    const index = state.nodeChildrenMap[parent].indexOf(
      Number(payload.referenceNode),
    );
    state.nodeChildrenMap[parent].splice(
      index + payload.pos,
      0,
      Number(payload.node),
    );
  }
  state.pageIds = state.nodeChildrenMap[-1] || [];
};
