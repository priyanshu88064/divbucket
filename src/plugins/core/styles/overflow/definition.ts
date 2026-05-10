import type { StyleSectionDefinition } from "@core/kernel/types";
import { isNonRootNode } from "../shared/visibility";

export const overflowSection: StyleSectionDefinition = {
  id: "overflow",
  title: "Overflow",
  visible: isNonRootNode,
  fields: [
    {
      id: "overflow-x",
      type: "text",
      label: "Overflow-X",
      prop: "overflowX",
      units: ["auto", "hidden", "scroll", "visible"],
      selectOnly: true,
      defaultValue: "auto",
    },
    {
      id: "overflow-y",
      type: "text",
      label: "Overflow-Y",
      prop: "overflowY",
      units: ["auto", "hidden", "scroll", "visible"],
      selectOnly: true,
      defaultValue: "auto",
    },
  ],
};
