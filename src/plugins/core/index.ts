import type { EditorPlugin } from "@core/kernel/types";
import { coreEditPanelsPlugin } from "./edit-panels/index";
import { coreNodesPlugin } from "./nodes/index";
import { corePaletteLaunchersPlugin } from "./palette-launchers";
import { corePresetsPlugin } from "./presets/index";
import { coreStyleSectionsPlugin } from "./styles/index";

export const CORE_PLUGINS: EditorPlugin[] = [
  coreNodesPlugin,
  corePaletteLaunchersPlugin,
  corePresetsPlugin,
  coreStyleSectionsPlugin,
  coreEditPanelsPlugin,
];
