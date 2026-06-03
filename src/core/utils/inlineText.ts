import { Fragment, createElement } from "react";

const BLOCK_TAGS = new Set([
  "ADDRESS",
  "ARTICLE",
  "ASIDE",
  "BLOCKQUOTE",
  "DIV",
  "FIGCAPTION",
  "FIGURE",
  "FOOTER",
  "FORM",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HEADER",
  "LI",
  "MAIN",
  "NAV",
  "OL",
  "P",
  "PRE",
  "SECTION",
  "TABLE",
  "TR",
  "TD",
  "TH",
  "UL",
]);

const normalizeNewlines = (value: string) =>
  value.replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ");

const ensureTrailingNewline = (chunks: string[]) => {
  if (!chunks.length) return;
  const lastChunk = chunks[chunks.length - 1] || "";
  if (!lastChunk.endsWith("\n")) {
    chunks.push("\n");
  }
};

const appendPlainText = (node: Node, chunks: string[]) => {
  if (node.nodeType === 3) {
    chunks.push(node.textContent || "");
    return;
  }

  if (node.nodeType !== 1) return;

  const element = node as HTMLElement;
  if (element.tagName === "BR") {
    chunks.push("\n");
    return;
  }

  const isBlock = BLOCK_TAGS.has(element.tagName);
  if (isBlock) ensureTrailingNewline(chunks);

  element.childNodes.forEach((childNode) => appendPlainText(childNode, chunks));

  if (isBlock) ensureTrailingNewline(chunks);
};

export const extractPlainTextFromEditable = (element: HTMLElement) =>
  normalizeNewlines(element.textContent || "")
    ? normalizeNewlines(
        (() => {
          const chunks: string[] = [];
          element.childNodes.forEach((childNode) => appendPlainText(childNode, chunks));
          return chunks.join("");
        })(),
      )
        .replace(/^\n+|\n+$/g, "")
        .replace(/\n{3,}/g, "\n\n")
    : "";

export const writePlainTextToEditable = (
  element: HTMLElement,
  value: string,
) => {
  element.replaceChildren(element.ownerDocument.createTextNode(value));
};

export const selectAllEditableText = (element: HTMLElement) => {
  const selection = element.ownerDocument.defaultView?.getSelection();
  if (!selection) return;
  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
};

export const placeCaretAtPoint = (
  element: HTMLElement,
  point: { x: number; y: number },
) => {
  const selection = element.ownerDocument.defaultView?.getSelection();
  if (!selection) return false;

  const doc = element.ownerDocument as Document & {
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };

  let range: Range | null = null;

  if (typeof doc.caretPositionFromPoint === "function") {
    const position = doc.caretPositionFromPoint(point.x, point.y);
    if (position) {
      range = doc.createRange();
      range.setStart(position.offsetNode, position.offset);
      range.collapse(true);
    }
  } else if (typeof doc.caretRangeFromPoint === "function") {
    range = doc.caretRangeFromPoint(point.x, point.y);
    if (range) {
      range = range.cloneRange();
      range.collapse(true);
    }
  }

  if (!range) return false;

  selection.removeAllRanges();
  selection.addRange(range);
  return true;
};

export const insertPlainTextAtSelection = (
  element: HTMLElement,
  text: string,
) => {
  const selection = element.ownerDocument.defaultView?.getSelection();
  if (!selection || selection.rangeCount === 0) {
    writePlainTextToEditable(element, `${extractPlainTextFromEditable(element)}${text}`);
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const fragment = element.ownerDocument.createDocumentFragment();
  const parts = normalizeNewlines(text).split("\n");
  let lastNode: Node | null = null;

  parts.forEach((part, index) => {
    const textNode = element.ownerDocument.createTextNode(part);
    fragment.appendChild(textNode);
    lastNode = textNode;
    if (index < parts.length - 1) {
      const breakNode = element.ownerDocument.createElement("br");
      fragment.appendChild(breakNode);
      lastNode = breakNode;
    }
  });

  range.insertNode(fragment);

  selection.removeAllRanges();
  const nextRange = element.ownerDocument.createRange();
  if (lastNode) {
    nextRange.setStartAfter(lastNode);
    nextRange.collapse(true);
    selection.addRange(nextRange);
  }
};

export const renderPlainTextContent = (value: string | undefined) => {
  if (!value) return null;
  return value.split("\n").map((line, index) =>
    createElement(
      Fragment,
      { key: `line-${index}` },
      index > 0 ? createElement("br") : null,
      line,
    ),
  );
};
