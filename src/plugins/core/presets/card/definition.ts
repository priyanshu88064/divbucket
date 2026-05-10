import { PRESET_GROUPS } from "../shared/groups";
import { createStaticSubtreePresetDefinition } from "../shared/createStaticSubtreePresetDefinition";
import { createCardPresetTemplate } from "./template";

export const cardPresetDefinition = createStaticSubtreePresetDefinition({
  id: "core:card",
  label: "Card",
  group: PRESET_GROUPS.sections,
  order: 14,
  requires: ["core:container", "core:text", "core:paragraph", "core:button"],
  templateFactory: createCardPresetTemplate,
});
