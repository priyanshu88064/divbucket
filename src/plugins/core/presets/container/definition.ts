import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const containerPresetDefinition = createSingleNodePresetDefinition({
  id: "core:container",
  label: "Container",
  order: 1,
  kind: "core:container",
});
