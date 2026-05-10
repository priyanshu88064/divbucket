import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const textPresetDefinition = createSingleNodePresetDefinition({
  id: "core:text",
  label: "Text",
  order: 4,
  kind: "core:text",
});
