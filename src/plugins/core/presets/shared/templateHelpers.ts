import type { CSSProperties } from "react";
import type {
  NodeRecord,
  NodeStyleMap,
  NodeKind,
} from "@core/types/document";
import type { EditorRegistry } from "@core/kernel/types";

export interface PresetTemplateHelpers {
  createRecord: <K extends NodeKind>(
    kind: K,
  ) => Extract<NodeRecord, { type: K }>;
  createStyle: (kind: NodeKind) => CSSProperties;
}

export const createPresetTemplateHelpers = (
  registry: EditorRegistry,
): PresetTemplateHelpers => {
  const createRecord = <K extends NodeKind>(
    kind: K,
  ): Extract<NodeRecord, { type: K }> => {
    const nodeDefinition = registry.getNodeType(kind);
    if (!nodeDefinition) {
      throw new Error(`Missing node definition for kind: ${kind}`);
    }
    return nodeDefinition.createRecord() as Extract<NodeRecord, { type: K }>;
  };

  const createStyle = (kind: NodeKind): NodeStyleMap[number]["default"] => {
    const nodeDefinition = registry.getNodeType(kind);
    if (!nodeDefinition) {
      throw new Error(`Missing node definition for kind: ${kind}`);
    }
    return nodeDefinition.createStyle();
  };

  return { createRecord, createStyle };
};
