import type { StyleSectionDefinition } from "@core/kernel/types";
import { TransitionCompositeField } from "@core/components/Cssbar/tabs/CssTab/styleInspector/fields";
import { isNonRootNode } from "../shared/visibility";

export const transitionSection: StyleSectionDefinition = {
  id: "transition",
  title: "Transition",
  visible: isNonRootNode,
  fields: [
    {
      id: "enable-transition",
      type: "composite",
      render: (ctx) => <TransitionCompositeField ctx={ctx} />,
    },
  ],
};
