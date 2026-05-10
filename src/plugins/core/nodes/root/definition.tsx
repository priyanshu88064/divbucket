import { createElement } from "react";
import { GiSquare } from "react-icons/gi";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { defaultEdit } from "../shared/edit";
import { renderContainerNode } from "../shared/renderers";

export const rootNodeDefinition: NodeTypeDefinition = {
  kind: "core:root",
  label: "Root",
  icon: () => createElement(GiSquare, { size: 30 }),
  isContainer: true,
  sidebar: { visible: false, group: "Elements", order: -1 },
  renderer: renderContainerNode,
  createRecord: () => ({ name: "core:root", type: "core:root" }),
  createStyle: () => ({}),
  acceptsChild: (childKind) => childKind !== "core:root",
  edit: defaultEdit(["name"]),
  styles: { sectionIds: [] },
  export: { tag: "body" },
};
