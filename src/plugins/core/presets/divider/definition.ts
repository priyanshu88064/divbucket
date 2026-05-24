import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const dividerPresetDefinition = createSingleNodePresetDefinition({
  id: "custom:divider",
  label: "Divider",
  order: 17,
  kind: "custom:divider",
});
