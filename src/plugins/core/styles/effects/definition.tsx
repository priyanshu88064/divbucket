import type { StyleSectionDefinition } from "@core/kernel/types";
import {
  BoxShadowCompositeField,
  TextShadowCompositeField,
} from "@core/components/Cssbar/tabs/CssTab/styleInspector/fields";
import { isNonRootNode } from "../shared/visibility";

export const effectsSection: StyleSectionDefinition = {
  id: "effects",
  title: "Effects",
  visible: isNonRootNode,
  fields: [
    {
      id: "box-shadow",
      type: "composite",
      render: (ctx) => <BoxShadowCompositeField ctx={ctx} />,
    },
    {
      id: "text-shadow",
      type: "composite",
      render: (ctx) => <TextShadowCompositeField ctx={ctx} />,
    },
  ],
};
