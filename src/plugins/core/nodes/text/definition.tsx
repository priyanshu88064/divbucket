import { createElement } from "react";
import { RiText } from "react-icons/ri";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { TEXT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderTextNode } from "../shared/renderers";

export const textNodeDefinition: NodeTypeDefinition = {
  kind: "core:text",
  label: "Text",
  icon: () => createElement(RiText, { size: 30 }),
  isContainer: false,
  sidebar: { visible: true, group: "Elements", order: 3 },
  renderer: renderTextNode,
  createRecord: () => ({
    name: "Text",
    type: "core:text",
    content: "Welcome here",
    hyperlink: "",
  }),
  createStyle: () => ({}),
  edit: defaultEdit(["name", "content", "hyperlink"]),
  styles: { sectionIds: [...TEXT_STYLE_SECTION_IDS] },
  export: { tag: "span" },
};
