import { createElement } from "react";
import { GiSquare } from "react-icons/gi";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { BASE_NON_ROOT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderContainerNode } from "../shared/renderers";

export const containerNodeDefinition: NodeTypeDefinition = {
  kind: "core:container",
  label: "Div",
  icon: () => createElement(GiSquare, { size: 30 }),
  isContainer: true,
  sidebar: { visible: true, group: "Elements", order: 0 },
  renderer: renderContainerNode,
  createRecord: () => ({ name: "core:container", type: "core:container", hyperlink: "" }),
  createStyle: () => ({ minHeight: "20px" }),
  edit: defaultEdit(["name", "hyperlink"]),
  styles: { sectionIds: [...BASE_NON_ROOT_STYLE_SECTION_IDS] },
  export: { tag: "div" },
};
