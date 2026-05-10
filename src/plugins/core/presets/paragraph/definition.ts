import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const paragraphPresetDefinition = createSingleNodePresetDefinition({
  id: "core:paragraph",
  label: "Paragraph",
  order: 5,
  kind: "core:paragraph",
});
