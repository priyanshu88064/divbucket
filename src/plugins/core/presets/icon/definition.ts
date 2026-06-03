import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const iconPresetDefinition = createSingleNodePresetDefinition({
  id: "custom:icon",
  label: "Icon",
  order: 17,
  kind: "custom:icon",
});
