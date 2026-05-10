import type { StyleSectionDefinition } from "@core/kernel/types";
import { isNonRootNode } from "../shared/visibility";

export const cursorSection: StyleSectionDefinition = {
  id: "cursor",
  title: "Cursor",
  visible: isNonRootNode,
  fields: [
    {
      id: "cursor-field",
      type: "text",
      label: "Cursor",
      prop: "cursor",
      units: [
        "auto",
        "default",
        "pointer",
        "move",
        "grab",
        "grabbing",
        "not-allowed",
        "all-scroll",
        "zoom-in",
        "zoom-out",
      ],
      selectOnly: true,
      defaultValue: "auto",
    },
  ],
};
