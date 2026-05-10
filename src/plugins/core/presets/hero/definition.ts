import { PRESET_GROUPS } from "../shared/groups";
import { createStaticSubtreePresetDefinition } from "../shared/createStaticSubtreePresetDefinition";
import { createHeroPresetTemplate } from "./template";

export const heroPresetDefinition = createStaticSubtreePresetDefinition({
  id: "core:hero",
  label: "Hero",
  group: PRESET_GROUPS.sections,
  order: 12,
  requires: ["core:container", "core:row", "core:paragraph", "core:text", "core:button"],
  templateFactory: createHeroPresetTemplate,
});
