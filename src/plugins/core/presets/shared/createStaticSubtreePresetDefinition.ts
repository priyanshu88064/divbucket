import type { Template } from "@core/types/Template";
import type { PresetId, NodeKind } from "@core/types/document";
import type { PresetDefinition } from "@core/kernel/types";
import { instantiateStaticTemplate } from "./instantiateStaticTemplate";
import { createPresetTemplateHelpers } from "./templateHelpers";

interface StaticSubtreePresetOptions {
  id: PresetId;
  label: string;
  group: string;
  order: number;
  requires: NodeKind[];
  templateFactory: (helpers: ReturnType<typeof createPresetTemplateHelpers>) => Template;
}

export const createStaticSubtreePresetDefinition = ({
  id,
  label,
  group,
  order,
  requires,
  templateFactory,
}: StaticSubtreePresetOptions): PresetDefinition => ({
  id,
  label,
  group,
  order,
  requires,
  instantiate: ({ treeState, name, registry }) =>
    instantiateStaticTemplate({
      template: templateFactory(createPresetTemplateHelpers(registry)),
      treeState,
      name,
    }),
});
