import { createElement } from "react";
import { IoIosList } from "react-icons/io";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { BASE_NON_ROOT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderContainerNode } from "../shared/renderers";

export const listNodeDefinition: NodeTypeDefinition = {
  kind: "core:list",
  label: "List",
  icon: () => createElement(IoIosList, { size: 30 }),
  isContainer: true,
  sidebar: { visible: true, group: "Elements", order: 8 },
  renderer: renderContainerNode,
  createRecord: () => ({ name: "List", type: "core:list", hyperlink: "" }),
  createStyle: () => ({}),
  acceptsChild: (childKind) => childKind === "core:listItem",
  edit: defaultEdit(["name", "hyperlink"]),
  styles: { sectionIds: [...BASE_NON_ROOT_STYLE_SECTION_IDS] },
  export: { tag: "ul" },
};
