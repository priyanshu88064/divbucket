import { createElement } from "react";
import { GoHorizontalRule } from "react-icons/go";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { TEXT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderTextNode } from "../shared/renderers";

export const listItemNodeDefinition: NodeTypeDefinition = {
  kind: "core:listItem",
  label: "List Item",
  icon: () => createElement(GoHorizontalRule, { size: 30 }),
  isContainer: false,
  sidebar: { visible: true, group: "Elements", order: 9 },
  renderer: renderTextNode,
  createRecord: () => ({
    name: "core:listItem",
    type: "core:listItem",
    content: "• List Item",
    hyperlink: "",
  }),
  createStyle: () => ({}),
  edit: defaultEdit(["name", "content", "hyperlink"]),
  styles: { sectionIds: [...TEXT_STYLE_SECTION_IDS] },
  export: { tag: "li" },
};
