import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const headingPresetDefinition = createSingleNodePresetDefinition({
  id: "core:heading",
  label: "Heading",
  order: 3,
  kind: "core:heading",
});
