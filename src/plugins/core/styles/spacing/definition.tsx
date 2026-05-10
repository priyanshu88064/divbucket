import type { StyleSectionDefinition } from "@core/kernel/types";
import { SpacingCompositeField } from "@core/components/Cssbar/tabs/CssTab/styleInspector/fields";
import { isNonRootNode } from "../shared/visibility";

export const spacingSection: StyleSectionDefinition = {
  id: "spacing",
  title: "Spacing",
  visible: isNonRootNode,
  fields: [
    {
      id: "margin-box",
      type: "composite",
      render: (ctx) => <SpacingCompositeField ctx={ctx} prefix="margin" />,
    },
    {
      id: "padding-box",
      type: "composite",
      render: (ctx) => <SpacingCompositeField ctx={ctx} prefix="padding" />,
    },
  ],
};
