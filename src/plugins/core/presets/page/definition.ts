import { PRESET_GROUPS } from "../shared/groups";
import { createStaticSubtreePresetDefinition } from "../shared/createStaticSubtreePresetDefinition";
import { createPagePresetTemplate } from "./template";

export const pagePresetDefinition = createStaticSubtreePresetDefinition({
  id: "core:page",
  label: "Page",
  group: PRESET_GROUPS.pages,
  order: 0,
  requires: ["core:root"],
  templateFactory: createPagePresetTemplate,
});
