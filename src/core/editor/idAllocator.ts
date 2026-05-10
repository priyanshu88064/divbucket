import type {
  NodeChildrenMap,
  NodeRecordMap,
  NodeStyleMap,
  TreeState,
} from "@core/types/document";

const getHighestId = ({
  pageIds,
  nodeChildrenMap,
  nodeRecordMap,
  nodeStyleMap,
}: {
  pageIds: number[];
  nodeChildrenMap: NodeChildrenMap;
  nodeRecordMap: NodeRecordMap;
  nodeStyleMap: NodeStyleMap;
}) => {
  const candidates = [
    ...pageIds,
    ...Object.keys(nodeChildrenMap).map(Number),
    ...Object.keys(nodeRecordMap).map(Number),
    ...Object.keys(nodeStyleMap).map(Number),
  ].filter((id) => Number.isFinite(id) && id >= 0);

  if (!candidates.length) {
    return 0;
  }

  return Math.max(...candidates);
};

export const allocateNodeId = (
  state: Pick<
    TreeState,
    "pageIds" | "nodeChildrenMap" | "nodeRecordMap" | "nodeStyleMap"
  >,
) => getHighestId(state) + 1;

export const createNodeIdAllocator = (
  state: Pick<
    TreeState,
    "pageIds" | "nodeChildrenMap" | "nodeRecordMap" | "nodeStyleMap"
  >,
) => {
  let next = allocateNodeId(state);
  return () => {
    const id = next;
    next += 1;
    return id;
  };
};
