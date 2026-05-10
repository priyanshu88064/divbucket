import type { Document, NodeChildrenMap, NodeRecordMap, NodeStyleMap } from "@core/types/document";

const cloneSubtree = ({
  sourceId,
  sourceChildren,
  sourceRecords,
  sourceStyles,
  targetChildren,
  targetRecords,
  targetStyles,
  nextIdRef,
}: {
  sourceId: number;
  sourceChildren: NodeChildrenMap;
  sourceRecords: NodeRecordMap;
  sourceStyles: NodeStyleMap;
  targetChildren: NodeChildrenMap;
  targetRecords: NodeRecordMap;
  targetStyles: NodeStyleMap;
  nextIdRef: { value: number };
}) => {
  const newId = nextIdRef.value++;
  targetRecords[newId] = structuredClone(sourceRecords[sourceId]);
  targetStyles[newId] = structuredClone(sourceStyles[sourceId]);
  targetChildren[newId] = (sourceChildren[sourceId] || []).map((childId) =>
    cloneSubtree({
      sourceId: childId,
      sourceChildren,
      sourceRecords,
      sourceStyles,
      targetChildren,
      targetRecords,
      targetStyles,
      nextIdRef,
    }),
  );
  return newId;
};

export const amplifyDocument = ({
  document,
  copies,
}: {
  document: Document;
  copies: number;
}): Document => {
  if (copies <= 1) return document;

  const nextIdRef = {
    value:
      Math.max(
        ...Object.keys(document.nodeRecordMap).map((key) => Number(key)),
      ) + 1,
  };

  const nodeChildrenMap: NodeChildrenMap = structuredClone(document.nodeChildrenMap);
  const nodeRecordMap: NodeRecordMap = structuredClone(document.nodeRecordMap);
  const nodeStyleMap: NodeStyleMap = structuredClone(document.nodeStyleMap);
  const pageIds = [...document.pageIds];

  for (let i = 1; i < copies; i += 1) {
    for (const pageId of document.pageIds) {
      const copiedPageId = cloneSubtree({
        sourceId: pageId,
        sourceChildren: document.nodeChildrenMap,
        sourceRecords: document.nodeRecordMap,
        sourceStyles: document.nodeStyleMap,
        targetChildren: nodeChildrenMap,
        targetRecords: nodeRecordMap,
        targetStyles: nodeStyleMap,
        nextIdRef,
      });
      pageIds.push(copiedPageId);
    }
  }

  nodeChildrenMap[-1] = [...pageIds];

  return {
    ...document,
    pageIds,
    nodeChildrenMap,
    nodeRecordMap,
    nodeStyleMap,
  };
};
