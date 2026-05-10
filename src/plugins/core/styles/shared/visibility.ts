import type { StyleInspectorContext } from "@core/components/Cssbar/tabs/CssTab/styleInspector/types";

export const isNonRootNode = (ctx: StyleInspectorContext) =>
  ctx.node.type !== "core:root";

export const isMediaNode = (ctx: StyleInspectorContext) =>
  ctx.node.type === "core:image" || ctx.node.type === "core:video";

export const isTextLikeNode = (ctx: StyleInspectorContext) =>
  ["core:heading", "core:text", "core:paragraph", "core:button", "core:listItem"].includes(
    ctx.node.type,
  );
