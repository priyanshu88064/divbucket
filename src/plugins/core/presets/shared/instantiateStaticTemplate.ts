import { createNodeIdAllocator } from "@core/editor/idAllocator";
import type { Template } from "@core/types/Template";
import type {
  NodeChildrenMap,
  NodeRecordMap,
  NodeStyleMap,
  TreeState,
} from "@core/types/document";
import type { InstantiatedTemplate } from "@core/utils/template";

export const instantiateStaticTemplate = ({
  template,
  treeState,
  name,
}: {
  template: Template;
  treeState: Pick<
    TreeState,
    "pageIds" | "nodeChildrenMap" | "nodeRecordMap" | "nodeStyleMap"
  >;
  name?: string;
}): InstantiatedTemplate => {
  const allocator = createNodeIdAllocator(treeState);

  const nodeChildrenMap: NodeChildrenMap = {};
  const nodeRecordMap: NodeRecordMap = {};
  const nodeStyleMap: NodeStyleMap = {};

  const createCopy = (id: number): number => {
    const uid = allocator();
    nodeRecordMap[uid] = structuredClone(template.nodeRecordMap[id]);
    nodeStyleMap[uid] = structuredClone(template.nodeStyleMap[id]);
    nodeChildrenMap[uid] = (template.nodeChildrenMap[id] || []).map((childId) =>
      createCopy(childId),
    );
    return uid;
  };

  const rootId = createCopy(0);
  if (name && name.length) {
    nodeRecordMap[rootId] = { ...nodeRecordMap[rootId], name };
  }

  return { rootId, nodeChildrenMap, nodeRecordMap, nodeStyleMap };
};
