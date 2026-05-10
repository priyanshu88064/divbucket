import { PRESET_GROUPS } from "../shared/groups";
import { createStaticSubtreePresetDefinition } from "../shared/createStaticSubtreePresetDefinition";
import { createFeaturePresetTemplate } from "./template";

export const featurePresetDefinition = createStaticSubtreePresetDefinition({
  id: "core:feature",
  label: "Feature",
  group: PRESET_GROUPS.sections,
  order: 13,
  requires: ["core:container", "core:row", "core:text", "core:paragraph", "core:button"],
  templateFactory: createFeaturePresetTemplate,
});
