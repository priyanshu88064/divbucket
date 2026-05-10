import { createElement } from "react";
import { LuSquareArrowRight } from "react-icons/lu";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { BASE_NON_ROOT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderContainerNode } from "../shared/renderers";

export const rowNodeDefinition: NodeTypeDefinition = {
  kind: "core:row",
  label: "H-Flex",
  icon: () => createElement(LuSquareArrowRight, { size: 30 }),
  isContainer: true,
  sidebar: { visible: true, group: "Elements", order: 1 },
  renderer: renderContainerNode,
  createRecord: () => ({ name: "core:row", type: "core:row", hyperlink: "" }),
  createStyle: () => ({ minHeight: "20px", display: "flex" }),
  edit: defaultEdit(["name", "hyperlink"]),
  styles: { sectionIds: [...BASE_NON_ROOT_STYLE_SECTION_IDS] },
  export: { tag: "div" },
};
