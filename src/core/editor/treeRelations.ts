import type { NodeChildrenMap } from "@core/types/document";

export const ROOT_COLLECTION_ID = -1;

export const getParentNodeId = (
  nodeChildrenMap: NodeChildrenMap,
  start: number,
  id: number,
): number | null => {
  if (!nodeChildrenMap[start]) return null;
  if (nodeChildrenMap[start].includes(id)) return start;
  for (const node of nodeChildrenMap[start]) {
    const result = getParentNodeId(nodeChildrenMap, node, id);
    if (result !== null) return result;
  }
  return null;
};

export const isDescendantNode = (
  nodeChildrenMap: NodeChildrenMap,
  parent: number,
  child: number,
): boolean => {
  if (!nodeChildrenMap[parent]) return false;
  if (nodeChildrenMap[parent].includes(child)) return true;
  return nodeChildrenMap[parent].some((next) =>
    isDescendantNode(nodeChildrenMap, next, child),
  );
};
