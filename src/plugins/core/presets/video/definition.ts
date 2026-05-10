import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const videoPresetDefinition = createSingleNodePresetDefinition({
  id: "core:video",
  label: "Video",
  order: 7,
  kind: "core:video",
});
