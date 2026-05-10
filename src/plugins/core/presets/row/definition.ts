import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const rowPresetDefinition = createSingleNodePresetDefinition({
  id: "core:row",
  label: "Row",
  order: 2,
  kind: "core:row",
});
