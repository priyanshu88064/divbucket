import type { StyleSectionDefinition } from "@core/kernel/types";
import { BorderWidthCompositeField } from "@core/components/Cssbar/tabs/CssTab/styleInspector/fields";
import { isNonRootNode } from "../shared/visibility";

export const borderSection: StyleSectionDefinition = {
  id: "border",
  title: "Border",
  visible: isNonRootNode,
  fields: [
    {
      id: "border-style",
      type: "text",
      label: "Border-Style",
      prop: "borderStyle",
      units: ["none", "solid", "dotted", "dashed", "double", "groove"],
      selectOnly: true,
      defaultValue: "none",
    },
    {
      id: "border-width-composite",
      type: "composite",
      render: (ctx) => <BorderWidthCompositeField ctx={ctx} />,
    },
    {
      id: "border-radius",
      type: "text",
      label: "Border-Radius",
      prop: "borderRadius",
      units: ["0", "2px", "4px", "8px", "50%", "100%"],
      defaultValue: "0",
    },
  ],
};
