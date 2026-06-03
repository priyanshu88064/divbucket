import { createElement } from "react";
import type { NodeRendererProps } from "@core/kernel/types";
import { coerceInputPayload } from "../input/payload";
import { coerceIconPayload } from "../icon/payload";
import IconGlyph from "../icon/IconGlyph";
import { DEFAULT_ICON_ID } from "../icon/catalog";
import { renderPlainTextContent } from "@core/utils/inlineText";

const withCommonProps = (props: NodeRendererProps) => ({
  id: props.type === "core:root" ? "node-root" : `node-${props.id}`,
  "data-id": String(props.id),
  "data-type": props.type,
  style: { borderStyle: "none", ...props.style },
  onClick: props.onClick,
  onDoubleClick: props.onDoubleClick,
  onContextMenu: props.onContextMenu,
  onMouseOver: props.onMouseOver,
  onMouseLeave: props.onMouseLeave,
});

export const renderContainerNode = (props: NodeRendererProps) =>
  createElement(
    "div",
    {
      ...withCommonProps(props),
      ref: (element: HTMLDivElement | null) =>
        props.registerElement?.(props.id, element),
    },
    props.children,
  );

export const renderTextNode = (props: NodeRendererProps) =>
  createElement(
    "div",
    {
      key: `${props.id}-${props.isInlineEditing ? "editing" : "readonly"}`,
      ...withCommonProps(props),
      ref: (element: HTMLDivElement | null) =>
        props.registerElement?.(props.id, element),
      ...(props.isInlineEditing
        ? {
            contentEditable: true,
            suppressContentEditableWarning: true,
            ref: (element: HTMLDivElement | null) => {
              props.registerElement?.(props.id, element);
              if (props.inlineEditorRef) {
                props.inlineEditorRef.current = element;
              }
            },
            onInput: props.onInlineInput,
            onBlur: props.onInlineBlur,
            onKeyDown: props.onInlineKeyDown,
            onPaste: props.onInlinePaste,
            style: {
              borderStyle: "none",
              whiteSpace: "pre-wrap",
              outline: "none",
              ...props.style,
            },
          }
        : null),
    },
    props.isInlineEditing ? undefined : renderPlainTextContent(props.content),
  );

export const renderImageNode = (props: NodeRendererProps) =>
  createElement("img", {
    ...withCommonProps(props),
    ref: (element: HTMLImageElement | null) =>
      props.registerElement?.(props.id, element),
    src: props.media?.src,
    alt: props.media?.alt,
  });

export const renderVideoNode = (props: NodeRendererProps) =>
  createElement("video", {
    ...withCommonProps(props),
    ref: (element: HTMLVideoElement | null) =>
      props.registerElement?.(props.id, element),
    src: props.media?.src,
    autoPlay: props.media?.autoPlay,
    loop: props.media?.loop,
    muted: props.media?.muted,
    controls: props.media?.controls,
  });

export const renderInputNode = (props: NodeRendererProps) => {
  const payload = props.record ? coerceInputPayload(props.record) : null;

  return createElement("input", {
    ...withCommonProps(props),
    ref: (element: HTMLInputElement | null) =>
      props.registerElement?.(props.id, element),
    type: payload?.inputType || "text",
    placeholder: payload?.placeholder || "",
    value: payload?.value || "",
    name: payload?.name || undefined,
    required: payload?.required || false,
    disabled: payload?.disabled || false,
    onChange: () => undefined,
  });
};

export const renderDividerNode = (props: NodeRendererProps) =>
  createElement("hr", {
    ...withCommonProps(props),
    ref: (element: HTMLHRElement | null) =>
      props.registerElement?.(props.id, element),
  });

export const renderIconNode = (props: NodeRendererProps) => {
  const payload = props.record ? coerceIconPayload(props.record) : null;
  const iconId = payload?.iconId;

  return createElement(
    "div",
    {
      ...withCommonProps(props),
      ref: (element: HTMLDivElement | null) =>
        props.registerElement?.(props.id, element),
    },
    createElement(IconGlyph, {
      iconId: iconId || DEFAULT_ICON_ID,
    }),
  );
};
