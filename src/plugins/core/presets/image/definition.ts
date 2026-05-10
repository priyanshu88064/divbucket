import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const imagePresetDefinition = createSingleNodePresetDefinition({
  id: "core:image",
  label: "Image",
  order: 6,
  kind: "core:image",
});
