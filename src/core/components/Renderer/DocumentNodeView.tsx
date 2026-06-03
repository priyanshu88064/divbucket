import React from "react";
import { editorRegistry } from "@core/kernel/bootstrap";
import type { NodeRendererProps } from "@core/kernel/types";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

export type DocumentNodeViewProps = NodeRendererProps;

function DocumentNodeView({
  id,
  type,
  style,
  record,
  content,
  media,
  children,
  onClick,
  onDoubleClick,
  onContextMenu,
  onMouseOver,
  onMouseLeave,
  registerElement,
  isInlineEditing,
  inlineDraftContent,
  inlineEditorRef,
  onInlineInput,
  onInlineBlur,
  onInlineKeyDown,
  onInlinePaste,
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
    record,
    content,
    media,
    children,
    onClick,
    onDoubleClick,
    onContextMenu,
    onMouseOver,
    onMouseLeave,
    registerElement,
    isInlineEditing,
    inlineDraftContent,
    inlineEditorRef,
    onInlineInput,
    onInlineBlur,
    onInlineKeyDown,
    onInlinePaste,
  });
}

export default React.memo(DocumentNodeView);
