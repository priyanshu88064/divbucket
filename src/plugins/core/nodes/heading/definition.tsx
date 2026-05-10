import { createElement } from "react";
import { LuSquareArrowRight } from "react-icons/lu";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { TEXT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderTextNode } from "../shared/renderers";

export const headingNodeDefinition: NodeTypeDefinition = {
  kind: "core:heading",
  label: "Heading",
  icon: () => createElement(LuSquareArrowRight, { size: 30 }),
  isContainer: false,
  sidebar: { visible: true, group: "Elements", order: 2 },
  renderer: renderTextNode,
  createRecord: () => ({
    name: "Heading",
    type: "core:heading",
    content: "HEADING",
    hyperlink: "",
  }),
  createStyle: () => ({ fontSize: "2em", fontWeight: "bold" }),
  edit: defaultEdit(["name", "content", "hyperlink"]),
  styles: { sectionIds: [...TEXT_STYLE_SECTION_IDS] },
  export: { tag: "h1" },
};
