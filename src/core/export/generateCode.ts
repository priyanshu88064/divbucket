import {
  DOCUMENT_VERSION,
  type CssState,
  type Document,
  type NodeChildrenMap,
  type NodeRecord,
  type NodeRecordMap,
  type NodeKind,
  type NodeStyleMap,
} from "@core/types/document";
import { editorRegistry } from "@core/kernel/bootstrap";

const STR_CSS_INIT = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

`;

export const cssMap: { [key: string]: string } = {
  width: "width",
  minWidth: "min-width",
  maxWidth: "max-width",
  height: "height",
  maxHeight: "max-height",
  minHeight: "min-height",
  display: "display",
  flexDirection: "flex-direction",
  justifyContent: "justify-content",
  alignItems: "align-items",
  gap: "gap",
  flexWrap: "flex-wrap",
  objectFit: "object-fit",
  objectPosition: "object-position",
  marginTop: "margin-top",
  marginRight: "margin-right",
  marginBottom: "margin-bottom",
  marginLeft: "margin-left",
  paddingTop: "padding-top",
  paddingRight: "padding-right",
  paddingBottom: "padding-bottom",
  paddingLeft: "padding-left",
  background: "background",
  backgroundColor: "background-color",
  backgroundImage: "background-image",
  backgroundRepeat: "background-repeat",
  backgroundPosition: "background-position",
  backgroundSize: "background-size",
  opacity: "opacity",
  color: "color",
  fontWeight: "font-weight",
  fontSize: "font-size",
  fontFamily: "font-family",
  fontStyle: "font-style",
  textDecoration: "text-decoration",
  textTransform: "text-transform",
  textAlign: "text-align",
  fontVariant: "font-variant",
  wordSpacing: "word-spacing",
  letterSpacing: "letter-spacing",
  borderWidth: "border-width",
  borderTopWidth: "border-top-width",
  borderBottomWidth: "border-bottom-width",
  borderLeftWidth: "border-left-width",
  borderRightWidth: "border-right-width",
  borderStyle: "border-style",
  borderColor: "border-color",
  borderRadius: "border-radius",
  position: "position",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  zIndex: "z-index",
  overflowX: "overflow-x",
  overflowY: "overflow-y",
  boxShadow: "box-shadow",
  textShadow: "text-shadow",
  translate: "translate",
  scale: "scale",
  rotate: "rotate",
  cursor: "cursor",
  transition: "transition",
};

const CSS_STATES: CssState[] = ["default", "hover", "active"];

type StylesheetMode = "internal" | "external";

const escapeText = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeAttribute = (value: string) => escapeText(value);

const appendAttribute = (attrs: string[], key: string, value: unknown) => {
  if (typeof value !== "string") return;
  if (!value.trim()) return;
  attrs.push(`${key}="${escapeAttribute(value)}"`);
};

const appendBooleanAttribute = (
  attrs: string[],
  key: string,
  value: unknown,
) => {
  if (value === true) attrs.push(key);
};

const classTokenForKind = (kind: NodeKind) => {
  if (kind.startsWith("core:")) return kind.replace("core:", "");
  if (kind.startsWith("custom:")) {
    return `custom-${kind.slice("custom:".length)}`;
  }
  return kind;
};

const selectorForNode = (record: NodeRecord, nodeId: number) =>
  record.type === "core:root"
    ? "body"
    : `.db-${classTokenForKind(record.type)}-${nodeId}`;

const classNameForNode = (record: NodeRecord, nodeId: number) =>
  `db-${classTokenForKind(record.type)}-${nodeId}`;

export const generateDocumentExport = ({
  document,
  pageId,
  stylesheetMode,
}: {
  document: Document;
  pageId: number;
  stylesheetMode: StylesheetMode;
}) => {
  const tree = document.nodeChildrenMap;
  const dataMap = document.nodeRecordMap;
  const styleMap = document.nodeStyleMap;

  let css = STR_CSS_INIT;

  const createDeclaration = (id: number, pseudoClass: CssState) => {
    const styles = styleMap[id]?.[pseudoClass];
    if (!styles) return "";

    let declaration = "";
    for (const [prop, value] of Object.entries(styles)) {
      const cssProp = cssMap[prop];
      if (!cssProp) continue;
      if (value === undefined || value === null || value === "") continue;
      if (
        dataMap[id].type === "core:root" &&
        (prop === "width" || prop === "minWidth")
      )
        continue;
      if (dataMap[id].type === "core:root" && prop === "height") {
        declaration += "  height: 100vh;\n";
        continue;
      }
      declaration += `  ${cssProp}: ${String(value)};\n`;
    }

    if (!declaration) return "";
    const selector = selectorForNode(dataMap[id], id);
    return `${selector}${pseudoClass !== "default" ? `:${pseudoClass}` : ""} {\n${declaration}}\n`;
  };

  const renderNode = (id: number, spacing: string): string => {
    const record = dataMap[id];
    if (!record) return "";
    const nodeDefinition = editorRegistry.getNodeType(record.type);
    const exportDefinition = nodeDefinition?.export;

    for (const state of CSS_STATES) {
      css += createDeclaration(id, state);
    }

    const tagName = exportDefinition?.tag || "div";
    const childIds = tree[id] || [];
    const attrs: string[] = [];

    if (record.type !== "core:root") {
      attrs.push(`class="${classNameForNode(record, id)}"`);
    }

    const exportedAttributes = exportDefinition?.getAttributes?.(record);
    if (exportedAttributes) {
      for (const [key, value] of Object.entries(exportedAttributes)) {
        if (typeof value === "boolean") {
          appendBooleanAttribute(attrs, key, value);
        } else {
          appendAttribute(attrs, key, value);
        }
      }
    }

    if (exportDefinition?.selfClosing) {
      const attrSegment = attrs.length ? ` ${attrs.join(" ")}` : "";
      return `${spacing}<${tagName}${attrSegment} />\n`;
    }

    const attrSegment = attrs.length ? ` ${attrs.join(" ")}` : "";
    const content =
      "content" in record && typeof record.content === "string"
        ? escapeText(record.content)
        : "";

    let html = `${spacing}<${tagName}${attrSegment}>`;
    if (childIds.length) html += "\n\n";
    if (content) html += content;
    for (const childId of childIds) {
      html += renderNode(childId, spacing + "         ");
    }
    if (childIds.length) html += `\n${spacing}`;
    html += `</${tagName}>\n`;
    return html;
  };

  const rootNode = dataMap[pageId];
  const title = rootNode ? escapeText(rootNode.name) : "Document";
  const body = renderNode(pageId, "");
  const styleTag =
    stylesheetMode === "internal"
      ? `<style>
${css}
</style>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="style.css">
        <title>${title}</title>
        ${styleTag}
</head>
${body}</html>`;

  return { html, css };
};

export const generateCode = ({
  tree,
  dataMap,
  styleMap,
  tab,
  isInternalStyleSheet,
}: {
  tree: NodeChildrenMap;
  dataMap: NodeRecordMap;
  styleMap: NodeStyleMap;
  tab: number;
  isInternalStyleSheet: boolean;
}) =>
  generateDocumentExport({
    document: {
      version: DOCUMENT_VERSION,
      pageIds: [tab],
      nodeChildrenMap: tree,
      nodeRecordMap: dataMap,
      nodeStyleMap: styleMap,
    },
    pageId: tab,
    stylesheetMode: isInternalStyleSheet ? "internal" : "external",
  });
