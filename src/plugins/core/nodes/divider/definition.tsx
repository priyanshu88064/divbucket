import { createElement } from "react";
import { LuMinus } from "react-icons/lu";
import type { NodeTypeDefinition } from "@core/kernel/types";
import type { NodeRecord } from "@core/types/document";
import { BASE_NON_ROOT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderDividerNode } from "../shared/renderers";

export const dividerNodeDefinition: NodeTypeDefinition = {
  kind: "custom:divider",
  label: "Divider",
  icon: () => createElement(LuMinus, { size: 24 }),
  isContainer: false,
  sidebar: { visible: true, group: "Elements", order: 11 },
  renderer: renderDividerNode,
  createRecord: () =>
    ({
      name: "Divider",
      type: "custom:divider",
      payload: { role: "separator" },
    }) as NodeRecord,
  createStyle: () => ({
    width: "100%",
    minHeight: "1px",
    height: "1px",
    backgroundColor: "#e2e8f0",
    borderStyle: "none",
    borderWidth: "0",
  }),
  edit: defaultEdit(["name"]),
  styles: { sectionIds: [...BASE_NON_ROOT_STYLE_SECTION_IDS] },
  export: {
    tag: "hr",
    selfClosing: true,
  },
};
