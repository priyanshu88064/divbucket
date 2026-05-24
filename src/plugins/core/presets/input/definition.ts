import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const inputPresetDefinition = createSingleNodePresetDefinition({
  id: "custom:input",
  label: "Input",
  order: 16,
  kind: "custom:input",
});
