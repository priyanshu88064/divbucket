import { DOCUMENT_VERSION, type Document } from "@core/types/document";
import { createNodeIdAllocator } from "@core/editor/idAllocator";
import { parseDocumentInput } from "./migration";

const ROOT_PARENT_ID = -1;

export const loadDocument = (raw: unknown): Document => parseDocumentInput(raw);

export const mergeDocuments = (documents: Document[]): Document => {
  const merged: Document = {
    version: DOCUMENT_VERSION,
    pageIds: [],
    nodeChildrenMap: { [ROOT_PARENT_ID]: [] },
    nodeRecordMap: {},
    nodeStyleMap: {},
  };

  for (const doc of documents) {
    const allocId = createNodeIdAllocator(merged);
    const idMap = new Map<number, number>();
    const ids = Object.keys(doc.nodeRecordMap).map(Number);
    for (const id of ids) {
      idMap.set(id, allocId());
    }

    for (const id of ids) {
      const mappedId = idMap.get(id)!;
      merged.nodeRecordMap[mappedId] = doc.nodeRecordMap[id];
      merged.nodeStyleMap[mappedId] = doc.nodeStyleMap[id];
      merged.nodeChildrenMap[mappedId] = (doc.nodeChildrenMap[id] || []).map(
        (childId) => idMap.get(childId)!,
      );
    }

    merged.pageIds.push(...doc.pageIds.map((id) => idMap.get(id)!));
  }

  merged.nodeChildrenMap[ROOT_PARENT_ID] = [...merged.pageIds];
  return merged;
};

export { parseDocumentInput } from "./migration";
