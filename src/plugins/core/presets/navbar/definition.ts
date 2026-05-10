import { PRESET_GROUPS } from "../shared/groups";
import { createStaticSubtreePresetDefinition } from "../shared/createStaticSubtreePresetDefinition";
import { createNavbarPresetTemplate } from "./template";

export const navbarPresetDefinition = createStaticSubtreePresetDefinition({
  id: "core:navbar",
  label: "Navbar",
  group: PRESET_GROUPS.sections,
  order: 11,
  requires: ["core:row", "core:image", "core:text"],
  templateFactory: createNavbarPresetTemplate,
});
