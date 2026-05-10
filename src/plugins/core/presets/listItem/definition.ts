import { createSingleNodePresetDefinition } from "../shared/createSingleNodePresetDefinition";

export const listItemPresetDefinition = createSingleNodePresetDefinition({
  id: "core:listItem",
  label: "List Item",
  order: 10,
  kind: "core:listItem",
  recordOverride: {
    name: "LItem",
    content: "• List Item",
  },
});
