import type { StyleSectionDefinition } from "@core/kernel/types";
import { BackgroundCompositeField } from "@core/components/Cssbar/tabs/CssTab/styleInspector/fields";
import { isNonRootNode } from "../shared/visibility";

export const appearanceSection: StyleSectionDefinition = {
  id: "appearance",
  title: "Appearance",
  visible: isNonRootNode,
  fields: [
    {
      id: "background",
      type: "composite",
      render: (ctx) => <BackgroundCompositeField ctx={ctx} />,
    },
    {
      id: "opacity",
      type: "text",
      label: "Opacity",
      prop: "opacity",
      defaultValue: "1",
    },
  ],
};
