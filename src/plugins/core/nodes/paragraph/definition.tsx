import { createElement } from "react";
import { LuLetterText } from "react-icons/lu";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { TEXT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderTextNode } from "../shared/renderers";

export const paragraphNodeDefinition: NodeTypeDefinition = {
  kind: "core:paragraph",
  label: "Paragraph",
  icon: () => createElement(LuLetterText, { size: 30 }),
  isContainer: false,
  sidebar: { visible: true, group: "Elements", order: 4 },
  renderer: renderTextNode,
  createRecord: () => ({
    name: "Paragraph",
    type: "core:paragraph",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    hyperlink: "",
  }),
  createStyle: () => ({}),
  edit: defaultEdit(["name", "content", "hyperlink"]),
  styles: { sectionIds: [...TEXT_STYLE_SECTION_IDS] },
  export: { tag: "p" },
};
