import type { EditorPlugin } from "@core/kernel/types";
import { iconPaletteLauncherDefinition } from "@plugins/core/nodes/icon/paletteLauncher";

export const corePaletteLaunchersPlugin: EditorPlugin = {
  id: "core.palette-launchers",
  register: (api) => {
    api.registerPaletteLauncher(iconPaletteLauncherDefinition);
  },
};
