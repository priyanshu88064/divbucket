import React from "react";
import { editorRegistry } from "@core/kernel/bootstrap";
import type { NodeRendererProps } from "@core/kernel/types";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

export type DocumentNodeViewProps = NodeRendererProps;

function DocumentNodeView({
  id,
  type,
  style,
  content,
  media,
  children,
  onClick,
  onContextMenu,
  onMouseOver,
  onMouseLeave,
  registerElement,
}: DocumentNodeViewProps) {
  useRenderCounter("DocumentNodeView");
  const definition = editorRegistry.getNodeType(type);
  if (!definition) {
    throw new Error(`Missing node definition for kind: ${type}`);
  }

  return definition.renderer({
    id,
    type,
    style,
    content,
    media,
    children,
    onClick,
    onContextMenu,
    onMouseOver,
    onMouseLeave,
    registerElement,
  });
}

export default React.memo(DocumentNodeView);
