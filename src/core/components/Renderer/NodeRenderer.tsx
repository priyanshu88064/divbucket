import React from "react";
import EditorNodeShell from "./EditorNodeShell";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

function NodeRenderer({
  id,
  children,
}: {
  id: number;
  children?: React.ReactNode;
}) {
  useRenderCounter("NodeRenderer");
  return <EditorNodeShell id={id}>{children}</EditorNodeShell>;
}

export default React.memo(NodeRenderer);
