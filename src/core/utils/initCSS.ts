import type { CSSProperties } from "react";
import type { NodeKind } from "@core/types/document";
import { editorRegistry } from "@core/kernel/bootstrap";

export default function initCSS(type: NodeKind): CSSProperties {
  const definition = editorRegistry.getNodeType(type);
  if (!definition) {
    throw new Error(`Missing node definition for kind: ${type}`);
  }

  return definition.createStyle();
}
