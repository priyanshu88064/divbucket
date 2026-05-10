import type { NodeRecord, NodeKind } from "@core/types/document";
import { editorRegistry } from "@core/kernel/bootstrap";

type NodeRecordByKind<K extends NodeKind> = Extract<NodeRecord, { type: K }>;

export default function initData<K extends NodeKind>(
  type: K,
): NodeRecordByKind<K> {
  const definition = editorRegistry.getNodeType(type);
  if (!definition) {
    throw new Error(`Missing node definition for kind: ${type}`);
  }

  return definition.createRecord() as NodeRecordByKind<K>;
}
