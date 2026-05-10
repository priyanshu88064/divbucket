import type { StyleSectionDefinition } from "@core/kernel/types";
import { PositionCompositeField } from "@core/components/Cssbar/tabs/CssTab/styleInspector/fields";
import { isNonRootNode } from "../shared/visibility";

export const positionSection: StyleSectionDefinition = {
  id: "position",
  title: "Position",
  visible: isNonRootNode,
  fields: [
    {
      id: "position",
      type: "text",
      label: "Position",
      prop: "position",
      units: ["static", "relative", "absolute", "fixed"],
      selectOnly: true,
      defaultValue: "static",
    },
    {
      id: "position-controls",
      type: "composite",
      render: (ctx) => <PositionCompositeField ctx={ctx} />,
    },
  ],
};
