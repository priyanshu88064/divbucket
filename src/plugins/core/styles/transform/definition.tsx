import type { StyleSectionDefinition } from "@core/kernel/types";
import { TransformCompositeField } from "@core/components/Cssbar/tabs/CssTab/styleInspector/fields";
import { isNonRootNode } from "../shared/visibility";

export const transformSection: StyleSectionDefinition = {
  id: "transform",
  title: "Transform",
  visible: isNonRootNode,
  fields: [
    {
      id: "transform-values",
      type: "composite",
      render: (ctx) => <TransformCompositeField ctx={ctx} />,
    },
  ],
};
