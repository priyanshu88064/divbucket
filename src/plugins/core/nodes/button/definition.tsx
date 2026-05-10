import { createElement } from "react";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { TEXT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderTextNode } from "../shared/renderers";

export const buttonNodeDefinition: NodeTypeDefinition = {
  kind: "core:button",
  label: "Button",
  icon: () =>
    createElement(
      "div",
      { className: "border px-2 py-1 rounded-sm text-xs" },
      "Button",
    ),
  isContainer: false,
  sidebar: { visible: true, group: "Elements", order: 5 },
  renderer: renderTextNode,
  createRecord: () => ({
    name: "core:button",
    type: "core:button",
    content: "core:button",
    hyperlink: "",
  }),
  createStyle: () => ({}),
  edit: defaultEdit(["name", "content", "hyperlink"]),
  styles: { sectionIds: [...TEXT_STYLE_SECTION_IDS] },
  export: {
    tag: "button",
    getAttributes: () => ({
      type: "button",
    }),
  },
};
