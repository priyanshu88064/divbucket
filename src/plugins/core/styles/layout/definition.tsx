import type { StyleSectionDefinition } from "@core/kernel/types";
import { FlexCompositeField } from "@core/components/Cssbar/tabs/CssTab/styleInspector/fields";
import { isNonRootNode } from "../shared/visibility";

export const layoutSection: StyleSectionDefinition = {
  id: "layout",
  title: "Layout",
  visible: isNonRootNode,
  fields: [
    {
      id: "width",
      type: "text",
      label: "Width",
      prop: "width",
      units: ["auto", "50px", "100px", "200px", "400px", "800px"],
    },
    {
      id: "minWidth",
      type: "text",
      label: "Min W",
      prop: "minWidth",
      units: ["auto", "50px", "100px", "200px", "400px", "800px"],
    },
    {
      id: "maxWidth",
      type: "text",
      label: "Max W",
      prop: "maxWidth",
      units: ["auto", "50px", "100px", "200px", "400px", "800px"],
    },
    {
      id: "height",
      type: "text",
      label: "Height",
      prop: "height",
      units: ["auto", "20px", "40px", "80px", "100px", "200px"],
    },
    {
      id: "minHeight",
      type: "text",
      label: "Min H",
      prop: "minHeight",
      units: ["auto", "20px", "40px", "80px", "100px", "200px"],
    },
    {
      id: "maxHeight",
      type: "text",
      label: "Max H",
      prop: "maxHeight",
      units: ["auto", "20px", "40px", "80px", "100px", "200px"],
    },
    {
      id: "display",
      type: "toggle-group",
      label: "Display",
      value: (ctx) => (ctx.style.display === "flex" ? "flex" : "auto"),
      options: [
        { label: "Block", value: "auto" },
        { label: "Flex", value: "flex" },
      ],
      onChange: (ctx, value) => ctx.patchStyle({ display: value }),
    },
    {
      id: "flex-controls",
      type: "composite",
      render: (ctx) => <FlexCompositeField ctx={ctx} />,
    },
  ],
};
