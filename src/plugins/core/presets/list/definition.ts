import { PRESET_GROUPS } from "../shared/groups";
import { createStaticSubtreePresetDefinition } from "../shared/createStaticSubtreePresetDefinition";
import { createListPresetTemplate } from "./template";

export const listPresetDefinition = createStaticSubtreePresetDefinition({
  id: "core:list",
  label: "List",
  group: PRESET_GROUPS.elements,
  order: 9,
  requires: ["core:list", "core:listItem"],
  templateFactory: createListPresetTemplate,
});
